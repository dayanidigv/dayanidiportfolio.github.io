/**
 * notify-telegram-proxy — a small, self-documenting Telegram message API.
 *
 * Keeps the bot token server-side and turns "send a Telegram message" into a
 * template-driven API. Add a new message type by adding ONE entry to TEMPLATES
 * — no new routing code. Docs at GET /doc are generated from that same registry.
 *
 *   GET  /doc            → HTML docs (or JSON with ?format=json / Accept: json)
 *   GET  /health         → service status
 *   POST /send           → { type, data }   generic, template-driven
 *   POST /contact        → shortcut for type=contact  (body = data)
 *   POST /notify         → shortcut for type=visit
 *
 * Protections: per-IP rate limit, origin allow-list, honeypot, body cap,
 * field validation + HTML escaping. See worker/README.md.
 */

const VERSION = '2.0';

const ALLOWED_ORIGINS = [
  'https://dayanidiportfolio.github.io',
  'http://localhost:8765',
  'http://127.0.0.1:8765',
  'http://127.0.0.1:5500',
  'http://localhost:5500',
];

const MAX_BODY_BYTES = 8000;
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/* ── message template registry — the single source of truth ──────────────
   Each type declares its fields (validation) + a {{var}} template. The /send,
   /contact, /notify routes and the /doc page are all generated from this. */
const TEMPLATES = {
  contact: {
    desc: 'Contact-form submission',
    limiter: 'CONTACT_LIMITER',
    fields: {
      name:        { required: true,  max: 120 },
      email:       { required: true,  max: 160, email: true },
      subject:     { required: false, max: 160, default: '—' },
      description: { required: true,  max: 2000 },
    },
    template:
      '✔️ <b>From Portfolio</b>\n\n' +
      '<b>Name:</b> {{name}}\n' +
      '<b>Email:</b> {{email}}\n' +
      '<b>Subject:</b> {{subject}}\n\n' +
      '{{description}}',
  },
  visit: {
    desc: 'Anonymous visit ping',
    limiter: 'NOTIFY_LIMITER',
    fields: {
      page: { required: false, max: 160, default: '/' },
      ref:  { required: false, max: 200, default: 'direct' },
    },
    template: '👀 <b>Portfolio viewed</b>\n<b>Page:</b> {{page}}\n<b>Ref:</b> {{ref}}',
  },
  hire: {
    desc: 'Hire / opportunity enquiry',
    limiter: 'CONTACT_LIMITER',
    fields: {
      name:    { required: true,  max: 120 },
      email:   { required: true,  max: 160, email: true },
      company: { required: false, max: 160, default: '—' },
      message: { required: true,  max: 2000 },
    },
    template:
      '💼 <b>Opportunity</b>\n\n' +
      '<b>From:</b> {{name}} ({{company}})\n' +
      '<b>Email:</b> {{email}}\n\n' +
      '{{message}}',
  },
};

const ENDPOINTS = [
  { method: 'GET',  path: '/doc',     desc: 'This documentation (?format=json for JSON)' },
  { method: 'GET',  path: '/health',  desc: 'Service status + available types' },
  { method: 'POST', path: '/send',    desc: 'Generic send — body { type, data }' },
  { method: 'POST', path: '/contact', desc: 'Shortcut for type=contact (body = data)' },
  { method: 'POST', path: '/notify',  desc: 'Shortcut for type=visit' },
];

/* ── helpers ─────────────────────────────────────────────────────────── */
function corsHeaders(origin) {
  const allow = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin',
  };
}

const esc = (s) => String(s).replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]));
const clip = (s, n) => String(s == null ? '' : s).trim().slice(0, n);
const json = (obj, status, headers) =>
  new Response(JSON.stringify(obj, null, 2), { status, headers: { ...headers, 'Content-Type': 'application/json' } });

// {{var}} substitution with per-value HTML escaping
const render = (tpl, data) => tpl.replace(/\{\{(\w+)\}\}/g, (_, k) => esc(data[k] != null ? data[k] : ''));

async function sendTelegram(env, text) {
  const res = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: env.CHAT_ID, text, parse_mode: 'HTML', disable_web_page_preview: true }),
  });
  return res.ok;
}

// limiter binding may be absent locally → fail open in dev, enforce in prod
async function underLimit(limiter, key) {
  if (!limiter || typeof limiter.limit !== 'function') return true;
  try { const { success } = await limiter.limit({ key }); return success; }
  catch { return true; }
}

/* ── core: validate against a template, render, send ─────────────────── */
async function handleSend(type, raw, env, ip, headers) {
  const tpl = TEMPLATES[type];
  if (!tpl) return json({ ok: false, error: 'unknown_type', types: Object.keys(TEMPLATES) }, 400, headers);

  if (!(await underLimit(env[tpl.limiter], ip))) return json({ ok: false, error: 'rate_limited' }, 429, headers);

  // global honeypot — bots fill `website`; pretend success and drop
  if (clip(raw.website, 1)) return json({ ok: true, dropped: true }, 200, headers);

  const data = {};
  for (const [field, spec] of Object.entries(tpl.fields)) {
    let v = clip(raw[field], spec.max || 500);
    if (!v && spec.default != null) v = spec.default;
    if (spec.required && !v) return json({ ok: false, error: `missing_${field}` }, 400, headers);
    if (spec.email && v && !EMAIL_RE.test(v)) return json({ ok: false, error: 'bad_email' }, 400, headers);
    data[field] = v;
  }

  const ok = await sendTelegram(env, render(tpl.template, data));
  return json({ ok, type }, ok ? 200 : 502, headers);
}

/* ── /doc + /health (generated from the registry) ────────────────────── */
function apiSpec() {
  return {
    service: 'notify-telegram-proxy',
    version: VERSION,
    endpoints: ENDPOINTS,
    types: Object.fromEntries(
      Object.entries(TEMPLATES).map(([k, t]) => [k, {
        desc: t.desc,
        fields: Object.fromEntries(Object.entries(t.fields).map(([f, s]) => [f, {
          required: !!s.required, max: s.max || null,
          ...(s.email ? { format: 'email' } : {}),
        }])),
      }]),
    ),
    notes: ['Per-IP rate limited', 'Origin allow-listed', 'Honeypot field: website', `Body cap: ${MAX_BODY_BYTES} bytes`],
  };
}

function docHTML() {
  const spec = apiSpec();
  const rows = spec.endpoints.map((e) =>
    `<tr><td><span class="m m-${e.method}">${e.method}</span></td><td><code>${e.path}</code></td><td>${esc(e.desc)}</td></tr>`).join('');
  const types = Object.entries(spec.types).map(([name, t]) => {
    const fields = Object.entries(t.fields).map(([f, s]) =>
      `<li><code>${f}</code> <span class="dim">${s.format || 'string'}${s.max ? ` · max ${s.max}` : ''}</span> ${s.required ? '<span class="req">required</span>' : '<span class="opt">optional</span>'}</li>`).join('');
    return `<div class="type"><h3>${name}</h3><p class="dim">${esc(t.desc)}</p><ul>${fields}</ul></div>`;
  }).join('');
  return `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>notify-telegram-proxy · API</title>
<style>
:root{--bg:#070d1f;--pl:#a78bfa;--cy:#00c8ff;--tx:#e2e8f0;--dim:#64748b;--bd:rgba(139,92,246,.18)}
*{box-sizing:border-box}body{margin:0;background:linear-gradient(135deg,#070d1f,#0d1535 60%,#0f0a2e);color:var(--tx);font:14px/1.6 'JetBrains Mono',ui-monospace,monospace;padding:2.5rem 1.25rem}
.wrap{max-width:760px;margin:0 auto}h1{font-size:1.4rem;margin:0 0 .2rem}h1 .v{color:var(--pl);font-size:.8rem}
.sub{color:var(--dim);margin:0 0 2rem}h2{color:var(--cy);font-size:.78rem;letter-spacing:2px;text-transform:uppercase;margin:2rem 0 .8rem}
table{width:100%;border-collapse:collapse;font-size:.82rem}td{padding:.5rem .6rem;border-bottom:1px solid var(--bd);vertical-align:top}
code{color:var(--pl)}.dim{color:var(--dim)}.req{color:#fb923c;font-size:.7rem}.opt{color:var(--dim);font-size:.7rem}
.m{font-weight:700;font-size:.7rem;padding:.1rem .4rem;border-radius:4px}.m-GET{color:#34d399;background:rgba(52,211,153,.12)}.m-POST{color:var(--cy);background:rgba(0,200,255,.12)}
.type{border:1px solid var(--bd);border-radius:10px;padding:.9rem 1.1rem;margin-bottom:.8rem;background:rgba(139,92,246,.04)}.type h3{margin:0;color:var(--pl);font-size:.95rem}.type ul{margin:.6rem 0 0;padding-left:1.1rem}.type li{margin:.2rem 0}
pre{background:rgba(7,13,31,.6);border:1px solid var(--bd);border-radius:10px;padding:1rem;overflow:auto;font-size:.78rem}
a{color:var(--cy)}
</style></head><body><div class="wrap">
<h1>notify-telegram-proxy <span class="v">v${spec.version}</span></h1>
<p class="sub">Template-driven Telegram message API · token stays server-side</p>
<h2>Endpoints</h2><table>${rows}</table>
<h2>Message types</h2>${types}
<h2>Example</h2>
<pre>curl -X POST $WORKER_URL/send \\
  -H 'Content-Type: application/json' \\
  -H 'Origin: https://dayanidiportfolio.github.io' \\
  -d '{"type":"contact","data":{"name":"Ada","email":"ada@x.dev","description":"hi"}}'</pre>
<p class="dim">Protections: ${spec.notes.map(esc).join(' · ')}.</p>
</div></body></html>`;
}

/* ── router ──────────────────────────────────────────────────────────── */
export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const headers = corsHeaders(origin);
    const { pathname, searchParams } = new URL(request.url);
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';

    if (request.method === 'OPTIONS') return new Response(null, { headers });

    // public, read-only (no origin lock)
    if (request.method === 'GET' && (pathname === '/doc' || pathname === '/docs')) {
      const wantsJson = searchParams.get('format') === 'json' || (request.headers.get('Accept') || '').includes('application/json');
      if (wantsJson) return json(apiSpec(), 200, headers);
      return new Response(docHTML(), { status: 200, headers: { ...headers, 'Content-Type': 'text/html; charset=utf-8' } });
    }
    if (request.method === 'GET' && (pathname === '/' || pathname === '/health')) {
      return json({ ok: true, service: 'notify-telegram-proxy', version: VERSION, types: Object.keys(TEMPLATES) }, 200, headers);
    }

    // write endpoints — origin-locked + POST-only + body cap
    if (!ALLOWED_ORIGINS.includes(origin)) return json({ ok: false, error: 'forbidden' }, 403, headers);
    if (request.method !== 'POST') return json({ ok: false, error: 'method_not_allowed' }, 405, headers);
    if (Number(request.headers.get('Content-Length') || 0) > MAX_BODY_BYTES)
      return json({ ok: false, error: 'payload_too_large' }, 413, headers);

    let body = {};
    try { body = (await request.json()) || {}; } catch { body = {}; }

    if (pathname === '/send')    return handleSend(body.type, body.data || {}, env, ip, headers);
    if (pathname === '/contact') return handleSend('contact', body, env, ip, headers);
    if (pathname === '/notify')  return handleSend('visit', body, env, ip, headers);

    return json({ ok: false, error: 'not_found', see: '/doc' }, 404, headers);
  },
};
