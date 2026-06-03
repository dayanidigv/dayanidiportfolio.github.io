# Telegram proxy (Cloudflare Worker)

Keeps the Telegram bot token **off the client**. The site calls this Worker;
the Worker talks to Telegram using a secret token.

## ⚠️ Step 0 — rotate the leaked token first

The old token (`5658730618:…`) was hardcoded in the site and is in git history,
so it must be treated as compromised. In Telegram, message **@BotFather**:

- `/revoke` (or `/token`) → select the bot → copy the **new** token.

Use the **new** token in the steps below. The old one stops working once revoked.

## Step 1 — deploy

```bash
cd worker
npm install -g wrangler        # or use: npx wrangler ...
wrangler login

wrangler secret put TELEGRAM_TOKEN   # paste the NEW token
wrangler secret put CHAT_ID          # 1221832086

wrangler deploy
```

`wrangler deploy` prints a URL like
`https://portfolio-telegram-proxy.<your-subdomain>.workers.dev`.

## Step 2 — point the site at it

In [`../assets/js/main.js`](../assets/js/main.js) set:

```js
const API_BASE = 'https://portfolio-telegram-proxy.<your-subdomain>.workers.dev';
```

(Replace the placeholder that ships in the file.) The contact form and the
visit ping start working again immediately — now without exposing the token.

## Endpoints

| Method | Path       | Body                            | Purpose                                |
|--------|------------|---------------------------------|----------------------------------------|
| GET    | `/doc`     | —                               | Live HTML docs (`?format=json` for JSON) |
| GET    | `/health`  | —                               | Status + available message types        |
| POST   | `/send`    | `{ type, data }`                | Generic, template-driven send           |
| POST   | `/contact` | `{name,email,subject,description}` | Shortcut for `type=contact`          |
| POST   | `/notify`  | `{page,ref}` (optional)         | Shortcut for `type=visit`               |

Once deployed, browse **`<WORKER_URL>/doc`** for live, always-in-sync docs.

## Adding a new message type (no new code)

Add one entry to `TEMPLATES` in `telegram-proxy.js` — the `/send` route, validation,
and `/doc` page pick it up automatically:

```js
newsletter: {
  desc: 'Newsletter signup',
  limiter: 'CONTACT_LIMITER',
  fields: { email: { required: true, max: 160, email: true } },
  template: '📰 <b>New subscriber:</b> {{email}}',
},
```

Then `POST /send { "type": "newsletter", "data": { "email": "a@b.co" } }`.
(Ships with `contact`, `visit`, and `hire` types.)

## Security / abuse protection

- **Per-IP rate limiting** via Cloudflare's native rate-limit bindings
  (`CONTACT_LIMITER` 3/min, `NOTIFY_LIMITER` 12/min) — configured in
  `wrangler.toml`, no extra setup, just `wrangler deploy`. Over-limit → `429`.
- **Server-side Origin allow-list** — CORS only protects browsers; this rejects
  non-browser callers (curl/scripts) with `403`.
- **Honeypot** — the form has a hidden `website` field; bots that fill it are
  silently dropped (the Worker returns `ok:true` but sends nothing).
- **POST-only**, request **body size cap** (8 KB), per-field **length caps**,
  **email format** validation, and **HTML escaping** before sending to Telegram.

> Want a CAPTCHA-grade layer too? Cloudflare **Turnstile** drops in cleanly
> (add the widget + verify the token in `/contact`). Ask and I'll wire it.

CORS is locked to the portfolio origin (+ localhost for testing).
