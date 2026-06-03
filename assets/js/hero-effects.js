/* ================================================================
   hero-effects.js  |  Boot Sequence + Particles + Nav FX
================================================================ */

/* ─── BOOT SEQUENCE ─────────────────────────────────────────────
   Section 1 of the experience: the infrastructure "wakes up". Boot
   logs type out line-by-line, a progress bar fills, then the loader
   hands off to the site. Drives main.js's window.__hideLoader(). */
(function bootSequence() {
  const term   = document.getElementById('boot-terminal');
  if (!term) return; // no boot terminal on this page — main.js hides loader
  const fill   = document.getElementById('boot-bar-fill');
  const status = document.getElementById('boot-status');
  const dismiss = () => (window.__hideLoader ? window.__hideLoader() : null);

  const lines = [
    '<span class="dim">$</span> boot --target infrastructure',
    '<span class="tag">[</span> <span class="ok">OK</span> <span class="tag">]</span> kernel · mounting service mesh',
    '<span class="tag">[</span> <span class="ok">OK</span> <span class="tag">]</span> establishing node topology',
    '<span class="tag">[</span> <span class="ok">OK</span> <span class="tag">]</span> packet pipelines · streaming',
    '<span class="tag">[</span> <span class="ok">OK</span> <span class="tag">]</span> observability daemon · online',
    '<span class="tag">[</span> <span class="ok">OK</span> <span class="tag">]</span> anomaly detection · armed',
    '<span class="dim">→</span> all systems nominal',
  ];

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Repeat visits in the same tab skip the full typed boot (just a quick flash),
  // so the cinematic sequence delights once without nagging on every navigation.
  let seen = false;
  try { seen = sessionStorage.getItem('booted') === '1'; } catch (e) {}

  const setFill = (pct) => { if (fill) fill.style.width = pct + '%'; };
  const online = () => {
    if (status) { status.textContent = 'SYSTEMS ONLINE'; status.classList.add('online'); }
    setFill(100);
    try { sessionStorage.setItem('booted', '1'); } catch (e) {}
    setTimeout(dismiss, reduce || seen ? 220 : 520);
  };

  if (reduce || seen) {
    term.innerHTML = lines.map((l) => '<span class="boot-line">' + l + '</span>').join('');
    online();
    return;
  }

  const cursor = '<span class="boot-cursor"></span>';
  let i = 0;
  const step = () => {
    term.innerHTML =
      lines.slice(0, i + 1).map((l) => '<span class="boot-line">' + l + '</span>').join('') +
      cursor;
    setFill(Math.round(((i + 1) / lines.length) * 92));
    i++;
    if (i < lines.length) {
      setTimeout(step, 230 + Math.random() * 90);
    } else {
      setTimeout(online, 360);
    }
  };
  setTimeout(step, 260); // let the brand fade in first
}());


/* ─── LENIS SMOOTH SCROLL ───────────────────────────────────────
   Eased momentum scrolling — this is what makes the parallax *glide*
   instead of step, and is the backbone of the Scrollytelling 2.0 feel.
   Lenis scrolls the window, so every window-scroll-based effect here
   (parallax field, hero parallax, progress bar) rides on the smoothed
   position for free. Skipped for reduced-motion (native smooth instead). */
(function smoothScroll() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (typeof Lenis === 'undefined') return;

  const lenis = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo-out
    smoothWheel: true,
    touchMultiplier: 1.6,
  });
  window.__lenis = lenis;

  function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
  requestAnimationFrame(raf);

  // anchor links glide (offset clears the fixed header)
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    const href = a.getAttribute('href');
    if (!href || href === '#') return;
    a.addEventListener('click', (e) => {
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: -72, duration: 1.3 });
    });
  });

  // scroll-up button glides to the top instead of jumping
  const up = document.getElementById('scroll-up');
  if (up) up.addEventListener('click', (e) => { e.preventDefault(); lenis.scrollTo(0, { duration: 1.3 }); });
}());


/* ─── SCROLL PROGRESS BAR ───────────────────────────────────── */
(function navFX() {
  const bar  = document.getElementById('nav-progress');
  const nav  = document.getElementById('site-header') || document.querySelector('.site-header');

  window.addEventListener('scroll', function () {
    const docHeight = document.body.scrollHeight - window.innerHeight;
    if (bar) bar.style.width = (docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0).toFixed(2) + '%';

    if (nav) {
      if (window.scrollY > 20) nav.classList.add('scrolled');
      else                      nav.classList.remove('scrolled');
    }
  }, { passive: true });
}());


/* ─── PARTICLE NETWORK ──────────────────────────────────────── */
(function particles() {
  const home = document.getElementById('home');
  if (!home) return;

  const cv = document.createElement('canvas');
  Object.assign(cv.style, {
    position: 'absolute', inset: '0',
    width: '100%', height: '100%',
    pointerEvents: 'none', zIndex: '0',
  });
  home.style.position = 'relative';
  home.style.overflow = 'hidden';
  home.insertBefore(cv, home.firstChild);

  Array.from(home.children).forEach(c => {
    if (c !== cv) c.style.position = 'relative', c.style.zIndex = '1';
  });

  const ctx = cv.getContext('2d');
  let W = 0, H = 0, pts = [];

  const resize = () => {
    W = cv.width  = home.offsetWidth;
    H = cv.height = home.offsetHeight;
  };

  const mkPt = () => ({
    x  : Math.random() * W,
    y  : Math.random() * H,
    vx : (Math.random() - .5) * .42,
    vy : (Math.random() - .5) * .42,
    r  : Math.random() * 1.5 + .4,
    a  : Math.random() * .38 + .1,
    rgb: Math.random() < .3 ? '0,200,255' : '139,92,246',
  });

  const LINK = 130;

  const tick = () => {
    ctx.clearRect(0, 0, W, H);

    for (let i = 0; i < pts.length; i++) {
      const p = pts[i];
      for (let j = i + 1; j < pts.length; j++) {
        const q = pts[j];
        const dx = p.x - q.x, dy = p.y - q.y;
        const d  = Math.hypot(dx, dy);
        if (d < LINK) {
          ctx.strokeStyle = `rgba(139,92,246,${(1 - d / LINK) * .15})`;
          ctx.lineWidth   = .7;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.rgb},${p.a})`;
      ctx.fill();

      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
    }
    requestAnimationFrame(tick);
  };

  resize();
  const n = Math.max(55, Math.min(110, Math.floor(W * H / 11000)));
  pts = Array.from({ length: n }, mkPt);
  window.addEventListener('resize', resize);
  tick();
}());


/* ─── HERO PARALLAX (depth-layered: mouse + scroll) ──────────
   "Camera moving through infrastructure layers" — each [data-depth]
   asset drifts both with the pointer and as the hero scrolls past,
   deeper layers (higher depth) moving more. Mouse + scroll are
   combined into a single `translate` so they never fight, and the
   independent `translate` property leaves CSS `transform` floats intact. */
(function parallax() {
  const home = document.getElementById('home');
  if (!home) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const layers = home.querySelectorAll('[data-depth]');
  if (!layers.length) return;

  const isTouch = window.matchMedia('(hover: none)').matches;
  // soften scroll drift on small screens, disable pointer drift on touch
  const mouseGain  = isTouch ? 0 : 1;
  const scrollGain = isTouch ? 0.35 : 0.7;

  let raf = null, mx = 0, my = 0, sy = 0;

  const apply = () => {
    layers.forEach((el) => {
      const d = parseFloat(el.dataset.depth) || 0;
      const x = mx * d * mouseGain;
      // scroll drift scales with real pixels (sy capped at hero height)
      const y = my * d * mouseGain + sy * (d / 100) * scrollGain;
      el.style.translate = x.toFixed(2) + 'px ' + y.toFixed(2) + 'px';
    });
    raf = null;
  };
  const schedule = () => { if (!raf) raf = requestAnimationFrame(apply); };

  if (!isTouch) {
    window.addEventListener('mousemove', (e) => {
      mx = (e.clientX / window.innerWidth - 0.5);
      my = (e.clientY / window.innerHeight - 0.5);
      schedule();
    }, { passive: true });
  }

  // scroll drift in real pixels, capped at the hero's height so layers
  // keep drifting as the hero leaves frame, then idle once it's gone
  const onScroll = () => {
    const h = home.offsetHeight || window.innerHeight;
    sy = Math.min(window.scrollY, h);
    schedule();
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}());


/* ─── DISTRIBUTED SYSTEMS TOPOLOGY ──────────────────────────────
   Section 3: a live architecture. A request flows as packets through
   tiers (Edge → Gateway → Services → Data); tiers power up in sequence
   when the band scrolls into view. Injected after #experience so both
   views share one source of truth. Canvas pauses when off-screen. */
(function distributedSystems() {
  const anchor = document.getElementById('experience')
              || document.getElementById('about')
              || document.getElementById('skills');
  if (!anchor || !anchor.parentNode || document.getElementById('systems')) return;

  const sec = document.createElement('section');
  sec.className = 'topo-band section';
  sec.id = 'systems';
  sec.innerHTML =
    '<div class="container">' +
      '<div class="sec-head">' +
        '<p class="sec-tag">Live Topology</p>' +
        '<h2 class="sec-title">Distributed by <span class="hl">Design</span></h2>' +
        '<p class="sec-sub">Every request flows through <span>layered, observable systems</span> — edge to data, at scale.</p>' +
        '<div class="sec-divider"></div>' +
      '</div>' +
      '<div class="topo-stage">' +
        '<canvas class="topo-canvas"></canvas>' +
        '<div class="topo-legend">' +
          '<span><i class="dot edge"></i>Edge</span>' +
          '<span><i class="dot gw"></i>Gateway</span>' +
          '<span><i class="dot svc"></i>Services</span>' +
          '<span><i class="dot data"></i>Data</span>' +
        '</div>' +
      '</div>' +
    '</div>';
  anchor.parentNode.insertBefore(sec, anchor.nextSibling);

  const canvas = sec.querySelector('.topo-canvas');
  const ctx = canvas.getContext('2d');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const tiers = [
    { label: 'EDGE',     n: 3, color: '#a78bfa' },
    { label: 'GATEWAY',  n: 1, color: '#c4b5fd' },
    { label: 'SERVICES', n: 4, color: '#8b5cf6' },
    { label: 'DATA',     n: 2, color: '#00c8ff' },
  ];

  let W = 0, H = 0, DPR = 1;
  let nodes = [], links = [], packets = [];
  let running = false, raf = null, activation = 0, lastSpawn = 0;

  const hexA = (hex, a) => {
    const v = parseInt(hex.slice(1), 16);
    return 'rgba(' + (v >> 16 & 255) + ',' + (v >> 8 & 255) + ',' + (v & 255) + ',' + a + ')';
  };

  function layout() {
    const rect = canvas.getBoundingClientRect();
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = rect.width; H = rect.height;
    canvas.width = Math.round(W * DPR);
    canvas.height = Math.round(H * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

    nodes = []; links = [];
    const padX = Math.min(110, W * 0.12);
    const padY = 52;
    const usableH = Math.max(40, H - padY * 2);
    tiers.forEach((t, ti) => {
      const x = padX + (W - padX * 2) * (ti / (tiers.length - 1));
      for (let i = 0; i < t.n; i++) {
        const y = t.n === 1 ? H / 2 : padY + usableH * (i / (t.n - 1));
        nodes.push({ x, y, tier: ti, color: t.color, r: 5, phase: Math.random() * 6.28, tx: x });
      }
    });
    for (let ti = 0; ti < tiers.length - 1; ti++) {
      const a = nodes.filter((n) => n.tier === ti);
      const b = nodes.filter((n) => n.tier === ti + 1);
      a.forEach((na) => b.forEach((nb) => links.push({ a: na, b: nb })));
    }
  }

  function spawnPacket() {
    const path = tiers.map((t, ti) => {
      const tn = nodes.filter((n) => n.tier === ti);
      return tn[Math.floor(Math.random() * tn.length)];
    });
    packets.push({ path, t: 0, speed: 0.011 + Math.random() * 0.009,
                   color: Math.random() < 0.5 ? '#00c8ff' : '#a78bfa' });
  }

  function frame(ts) {
    ctx.clearRect(0, 0, W, H);

    // tier labels
    ctx.font = '600 9px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(148,163,184,0.45)';
    tiers.forEach((t, ti) => {
      const x = nodes.find((n) => n.tier === ti).x;
      ctx.globalAlpha = activation * tiers.length > ti ? 1 : 0.3;
      ctx.fillText(t.label, x, 22);
    });
    ctx.globalAlpha = 1;

    // links (fade in tier by tier)
    links.forEach((l) => {
      const vis = Math.max(0, Math.min(1, activation * tiers.length - l.a.tier));
      if (vis <= 0) return;
      ctx.globalAlpha = 0.15 * vis;
      ctx.strokeStyle = '#8b5cf6';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(l.a.x, l.a.y); ctx.lineTo(l.b.x, l.b.y); ctx.stroke();
    });
    ctx.globalAlpha = 1;

    // packets
    if (!reduce) {
      if (ts - lastSpawn > 380 && activation > 0.5 && packets.length < 28) {
        spawnPacket(); lastSpawn = ts;
      }
      for (const p of packets) {
        p.t += p.speed;
        const seg = Math.floor(p.t);
        if (seg >= p.path.length - 1) { p.dead = true; continue; }
        const f = p.t - seg;
        const a = p.path[seg], b = p.path[seg + 1];
        const x = a.x + (b.x - a.x) * f, y = a.y + (b.y - a.y) * f;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 10;
        ctx.beginPath(); ctx.arc(x, y, 2.4, 0, 6.28); ctx.fill();
      }
      ctx.shadowBlur = 0;
      packets = packets.filter((p) => !p.dead);
    }

    // nodes
    const tnow = ts * 0.002;
    nodes.forEach((n) => {
      const online = activation * tiers.length > n.tier;
      const r = n.r * (1 + Math.sin(tnow + n.phase) * 0.12);
      ctx.globalAlpha = online ? 1 : 0.25;
      ctx.beginPath(); ctx.arc(n.x, n.y, r + 6, 0, 6.28);
      ctx.fillStyle = hexA(n.color, 0.10); ctx.fill();
      ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, 6.28);
      ctx.fillStyle = n.color;
      ctx.shadowColor = n.color;
      ctx.shadowBlur = online ? 12 : 0;
      ctx.fill();
    });
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;

    if (activation < 1) activation = Math.min(1, activation + 0.012);
    if (running) raf = requestAnimationFrame(frame);
  }

  function start() { if (!running) { running = true; raf = requestAnimationFrame(frame); } }
  function stop()  { running = false; if (raf) cancelAnimationFrame(raf); raf = null; }

  let rt = null;
  window.addEventListener('resize', () => {
    clearTimeout(rt);
    rt = setTimeout(() => { layout(); if (!running) frame(performance.now()); }, 150);
  }, { passive: true });

  layout();

  if (reduce) {
    activation = 1;
    frame(performance.now()); // single static render, fully online
    return;
  }

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { sec.classList.add('in-view'); start(); }
        else stop();
      });
    }, { threshold: 0.12 });
    io.observe(sec);
  } else {
    sec.classList.add('in-view');
    start();
  }
}());


/* ─── OBSERVABILITY LAYER ───────────────────────────────────────
   Section 5: "complete infrastructure awareness". A radar scanner
   (reusing scanner-rings.webp) with a rotating sweep + blips, live
   metric counters that count up on reveal, and a streaming diagnostics
   log. Injected after #skills. Self-manages activation + pause. */
(function observability() {
  const anchor = document.getElementById('skills')
              || document.getElementById('portfolio')
              || document.getElementById('systems');
  if (!anchor || !anchor.parentNode || document.getElementById('observability')) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const blips = [
    { x: 64, y: 30 }, { x: 78, y: 58 }, { x: 38, y: 44 },
    { x: 56, y: 72 }, { x: 30, y: 66 }, { x: 70, y: 40 },
  ];
  const metrics = [
    { label: 'Uptime',      count: '99.98', suffix: '%',      bar: 99 },
    { label: 'p99 Latency', count: '42',    suffix: ' ms',    bar: 28 },
    { label: 'Throughput',  count: '12.4',  suffix: 'k req/s', bar: 78 },
    { label: 'Anomalies Caught', count: '1273', suffix: '',   bar: 64 },
  ];

  const sec = document.createElement('section');
  sec.className = 'obsv-band section';
  sec.id = 'observability';
  sec.innerHTML =
    '<div class="container">' +
      '<div class="sec-head">' +
        '<p class="sec-tag">Observability</p>' +
        '<h2 class="sec-title">Complete System <span class="hl">Awareness</span></h2>' +
        '<p class="sec-sub">Every node, request, and anomaly — <span>monitored in real time</span> across production.</p>' +
        '<div class="sec-divider"></div>' +
      '</div>' +
      '<div class="obsv-grid">' +
        '<div class="obsv-radar">' +
          '<img class="obsv-rings" src="/assets/images/assets/scanner-rings.webp" alt="" aria-hidden="true" loading="lazy" decoding="async">' +
          '<span class="obsv-cross"></span>' +
          '<span class="obsv-sweep"></span>' +
          blips.map((b, i) => '<span class="obsv-blip" style="left:' + b.x + '%;top:' + b.y + '%;animation-delay:' + (i * 0.5) + 's"></span>').join('') +
          '<span class="obsv-core"></span>' +
        '</div>' +
        '<div class="obsv-side">' +
          '<div class="obsv-metrics">' +
            metrics.map((m) =>
              '<div class="obsv-metric">' +
                '<div class="om-label">' + m.label + '</div>' +
                '<div class="om-value" data-count="' + m.count + '" data-suffix="' + m.suffix + '">0' + m.suffix + '</div>' +
                '<div class="om-bar"><i style="--w:' + m.bar + '%"></i></div>' +
              '</div>').join('') +
          '</div>' +
          '<div class="obsv-stream" aria-hidden="true"></div>' +
        '</div>' +
      '</div>' +
    '</div>';
  anchor.parentNode.insertBefore(sec, anchor.nextSibling);

  const values = sec.querySelectorAll('.om-value');
  const stream = sec.querySelector('.obsv-stream');

  const animateCount = (el) => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const dec = (el.dataset.count.split('.')[1] || '').length;
    const t0 = performance.now(), dur = 1500;
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / dur);
      const e = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * e).toFixed(dec) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const logs = [
    '<span class="lg-ok">OK</span> svc-api · p99 41ms',
    '<span class="lg-scan">SCAN</span> node-07 healthy',
    '<span class="lg-ok">OK</span> mesh sync · 0 drops',
    '<span class="lg-alert">ALERT</span> anomaly · auto-resolved',
    '<span class="lg-ok">OK</span> db-replica lag 3ms',
    '<span class="lg-scan">SCAN</span> fleet sweep complete',
    '<span class="lg-ok">OK</span> telemetry ingest nominal',
  ];
  let li = 0, logTimer = null;
  const pushLog = () => {
    const line = document.createElement('div');
    line.className = 'obsv-log-line';
    line.innerHTML = logs[li % logs.length];
    stream.insertBefore(line, stream.firstChild);
    while (stream.children.length > 5) stream.removeChild(stream.lastChild);
    li++;
  };

  let started = false;
  const start = () => {
    if (started) return;
    started = true;
    values.forEach(animateCount);
    if (!reduce) { pushLog(); logTimer = setInterval(pushLog, 1600); }
    else { for (let k = 0; k < 4; k++) pushLog(); }
  };

  if (reduce) {
    sec.classList.add('in-view');
    values.forEach((el) => { el.textContent = el.dataset.count + (el.dataset.suffix || ''); });
    for (let k = 0; k < 4; k++) pushLog();
    return;
  }

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { sec.classList.add('in-view'); start(); }
        else { sec.classList.remove('running'); if (logTimer) { clearInterval(logTimer); logTimer = null; started = false; } }
      });
    }, { threshold: 0.2 });
    io.observe(sec);
  } else {
    sec.classList.add('in-view');
    start();
  }
}());


/* ─── AUTOMATION LAYER ──────────────────────────────────────────
   Section 4: "systems operating autonomously". A CI/CD-style pipeline
   (Trigger → Build → Test → Deploy → Verify) runs on loop — stages
   light up in a chain reaction, flow links fill, an execution terminal
   streams in sync. Injected after #skills (lands before #observability
   since this runs after it). Loops only while in view. */
(function automation() {
  const anchor = document.getElementById('skills')
              || document.getElementById('systems')
              || document.getElementById('portfolio');
  if (!anchor || !anchor.parentNode || document.getElementById('automation')) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const stages = [
    { name: 'Trigger', icon: 'uil-bolt-alt',       log: 'trigger: webhook received',   t: '0.1s' },
    { name: 'Build',   icon: 'uil-package',         log: 'build: image packed',         t: '4.2s' },
    { name: 'Test',    icon: 'uil-flask',           log: 'test: 218 passed',            t: '6.0s' },
    { name: 'Deploy',  icon: 'uil-cloud-upload',    log: 'deploy: rollout complete',    t: '11s'  },
    { name: 'Verify',  icon: 'uil-shield-check',    log: 'verify: health 200 OK',       t: '0.3s' },
  ];

  const sec = document.createElement('section');
  sec.className = 'auto-band section';
  sec.id = 'automation';
  let pipe = '';
  stages.forEach((s, i) => {
    pipe +=
      '<div class="auto-stage" data-i="' + i + '">' +
        '<span class="as-icon"><i class="uil ' + s.icon + '"></i></span>' +
        '<span class="as-name">' + s.name + '</span>' +
        '<span class="as-status">queued</span>' +
      '</div>';
    if (i < stages.length - 1) pipe += '<span class="auto-link"></span>';
  });
  sec.innerHTML =
    '<div class="container">' +
      '<div class="sec-head">' +
        '<p class="sec-tag">Automation</p>' +
        '<h2 class="sec-title">Systems That Run <span class="hl">Themselves</span></h2>' +
        '<p class="sec-sub">Orchestrated pipelines — <span>trigger to deploy</span>, no hands on the wheel.</p>' +
        '<div class="sec-divider"></div>' +
      '</div>' +
      '<div class="auto-pipeline">' + pipe + '</div>' +
      '<div class="auto-terminal" aria-hidden="true"></div>' +
    '</div>';
  anchor.parentNode.insertBefore(sec, anchor.nextSibling);

  const stageEls = [].slice.call(sec.querySelectorAll('.auto-stage'));
  const linkEls  = [].slice.call(sec.querySelectorAll('.auto-link'));
  const term     = sec.querySelector('.auto-terminal');

  const header = '<div class="auto-term-line"><span class="dim">$</span> <span class="cmd">pipeline run --auto</span></div>';
  const addLine = (html) => {
    const d = document.createElement('div');
    d.className = 'auto-term-line';
    d.innerHTML = html;
    term.appendChild(d);
  };

  const setStatus = (el, txt) => { el.querySelector('.as-status').textContent = txt; };

  const reset = () => {
    stageEls.forEach((el) => { el.classList.remove('is-running', 'is-done'); setStatus(el, 'queued'); });
    linkEls.forEach((l) => l.classList.remove('filled'));
    term.innerHTML = header;
  };

  if (reduce) {
    sec.classList.add('in-view');
    stageEls.forEach((el) => { el.classList.add('is-done'); setStatus(el, 'done'); });
    linkEls.forEach((l) => l.classList.add('filled'));
    term.innerHTML = header;
    stages.forEach((s) => addLine('<span class="ok">&#10003;</span> ' + s.log + ' <span class="dim">· ' + s.t + '</span>'));
    return;
  }

  let i = 0, active = false, timer = null;
  const clear = () => { if (timer) { clearTimeout(timer); timer = null; } };

  const step = () => {
    if (!active) return;
    const el = stageEls[i];
    el.classList.add('is-running');
    setStatus(el, 'running');
    timer = setTimeout(() => {
      el.classList.remove('is-running');
      el.classList.add('is-done');
      setStatus(el, 'done');
      if (linkEls[i]) linkEls[i].classList.add('filled');
      addLine('<span class="ok">&#10003;</span> ' + stages[i].log + ' <span class="dim">· ' + stages[i].t + '</span>');
      i++;
      if (i < stages.length) {
        timer = setTimeout(step, 480);
      } else {
        addLine('<span class="arrow">&rarr;</span> <span class="dim">pipeline green · re-arming</span>');
        timer = setTimeout(() => { i = 0; reset(); step(); }, 2200);
      }
    }, 720);
  };

  const startRun = () => { if (active) return; active = true; i = 0; reset(); step(); };
  const stopRun  = () => { active = false; clear(); };

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { sec.classList.add('in-view'); startRun(); }
        else stopRun();
      });
    }, { threshold: 0.25 });
    io.observe(sec);
  } else {
    sec.classList.add('in-view');
    startRun();
  }
}());


/* ─── SECTION ACTIVATION (scroll-driven "system online") ─────
   As each section enters the viewport it gets `.in-view`, letting the
   environment evolve section-by-section like infrastructure powering
   up. Purely additive: ScrollReveal still handles per-element reveals. */
(function sectionActivation() {
  if (!('IntersectionObserver' in window)) return;
  const sections = document.querySelectorAll('main section[id]');
  if (!sections.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        io.unobserve(entry.target); // activate once, then stop watching
      }
    });
  }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });

  sections.forEach((s) => io.observe(s));
}());



/* ─── CONTACT ENDPOINT ──────────────────────────────────────────
   Section 7: end the journey on "connection established". A comms
   beacon between client and operator locks on when the contact
   section scrolls into view (converging pulses + communication
   waves), and flares a transmission when the form is sent. */
(function contactEndpoint() {
  const contact = document.getElementById('contact');
  if (!contact || contact.querySelector('.ep-link')) return;
  const wrap = contact.querySelector('.contact-wrap');
  if (!wrap) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const link = document.createElement('div');
  link.className = 'ep-link';
  link.setAttribute('aria-hidden', 'true');
  link.innerHTML =
    '<span class="ep-end">me</span>' +
    '<span class="ep-wire left"><i class="ep-pulse"></i></span>' +
    '<span class="ep-beacon"><span class="ep-ring"></span><span class="ep-ring"></span><span class="ep-dot"></span></span>' +
    '<span class="ep-wire right"><i class="ep-pulse"></i></span>' +
    '<span class="ep-end">you</span>';

  const status = document.createElement('div');
  status.className = 'ep-status';
  status.innerHTML = '<span class="ep-status-dot"></span><span class="ep-status-text">Establishing link&hellip;</span>';

  wrap.parentNode.insertBefore(status, wrap);
  wrap.parentNode.insertBefore(link, status);

  const setEstablished = () => {
    status.classList.add('established');
    status.querySelector('.ep-status-text').textContent = 'Connection established';
  };

  if (reduce) {
    link.classList.add('linked');
    setEstablished();
  } else if ('IntersectionObserver' in window) {
    let done = false;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && !done) {
          done = true;
          link.classList.add('linked');
          setTimeout(setEstablished, 1300);
          io.unobserve(contact);
        }
      });
    }, { threshold: 0.3 });
    io.observe(contact);
  } else {
    link.classList.add('linked');
    setEstablished();
  }

  // transmit flare when the message form is submitted
  const form = contact.querySelector('form');
  if (form && !reduce) {
    form.addEventListener('submit', () => {
      link.classList.add('transmitting');
      const txt = status.querySelector('.ep-status-text');
      const prev = txt.textContent;
      txt.textContent = 'Transmitting…';
      setTimeout(() => {
        link.classList.remove('transmitting');
        txt.textContent = status.classList.contains('established') ? 'Connection established' : prev;
      }, 1400);
    });
  }
}());


/* ─── PAGE-WIDE PARALLAX FIELD ──────────────────────────────────
   Scrollytelling 2.0: faint infrastructure layers live behind ALL
   content at different depths and drift at different speeds as you
   scroll — so the environment moves like a camera travelling through
   it, not a page that just reveals. Each layer's base position is
   measured once (transform cleared) to avoid feedback; transforms are
   applied in a rAF-throttled scroll loop. Disabled for reduced-motion. */
(function parallaxField() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const main = document.querySelector('main.l-main');
  if (!main || document.querySelector('.parallax-field')) return;

  const A = '/assets/images/assets/';
  // top is % down the full page; speed = parallax strength (±). Alternating
  // sides + signs gives criss-cross depth as the journey unfolds.
  const layers = [
    { src: 'quantum-particle-swirl.webp',         top: '9%',  side: 'left:-8%',   w: 460, op: 0.20, speed:  0.42 },
    { src: 'packet-flow-trails.webp',             top: '24%', side: 'right:-10%', w: 500, op: 0.17, speed: -0.34 },
    { src: 'packet-flow-trails.webp',             top: '24%', side: 'left:-10%', w: 500, op: 0.17, speed: -0.34 },
    { src: 'service-mesh-visuals.webp',        top: '40%', side: 'left:-6%',   w: 420, op: 0.20, speed:  0.48 },
    { src: 'ai-crystal-objects.webp',             top: '50%', side: 'left:20%',   w: 420, op: 0.20, speed:  0.48 },
    { src: 'backend-pipeline-visualization.webp', top: '57%', side: 'right:-8%',  w: 480, op: 0.16, speed: -0.40 },
    { src: 'neural-node-clusters.webp',     top: '72%', side: 'left:-4%',   w: 360, op: 0.18, speed:  0.30 },
    { src: 'glowing-mechanical-device.webp',      top: '87%', side: 'right:-7%',  w: 420, op: 0.18, speed: -0.44 },
  ];

  const field = document.createElement('div');
  field.className = 'parallax-field';
  field.setAttribute('aria-hidden', 'true');
  field.innerHTML = layers.map((l) =>
    '<img class="parallax-layer" loading="lazy" decoding="async" src="' + A + l.src + '" alt="" ' +
    'style="top:' + l.top + ';' + l.side + ';width:' + l.w + 'px;opacity:' + l.op + '" data-speed="' + l.speed + '">'
  ).join('');
  main.insertBefore(field, main.firstChild);

  const items = [].slice.call(field.querySelectorAll('.parallax-layer')).map((el) => ({
    el, speed: parseFloat(el.dataset.speed) || 0, base: 0,
  }));

  // measure each layer's document-space centre with transforms cleared
  const measure = () => {
    items.forEach((it) => { it.el.style.transform = 'none'; });
    const sy = window.scrollY;
    items.forEach((it) => {
      const r = it.el.getBoundingClientRect();
      it.base = r.top + sy + r.height / 2;
    });
  };

  let ticking = false;
  const apply = () => {
    const viewportCenter = window.scrollY + window.innerHeight / 2;
    items.forEach((it) => {
      const offset = viewportCenter - it.base;
      it.el.style.transform = 'translate3d(0,' + (offset * it.speed).toFixed(1) + 'px,0)';
    });
    ticking = false;
  };
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(apply); } };

  let rt = null;
  const onResize = () => { clearTimeout(rt); rt = setTimeout(() => { measure(); apply(); }, 150); };

  // measure after layout settles (images may still be loading → re-measure on load)
  const init = () => { measure(); apply(); };
  init();
  window.addEventListener('load', () => setTimeout(init, 200));
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize, { passive: true });
}());
