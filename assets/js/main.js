let token = '5658730618:AAGHo2wGfEJvZ5DZxw1MMpxKAw2_8PnXR_Q';
let chatId = '1221832086';

/* ================================================================
   CONFIG - operational status pill (formerly "open to work")
   Reframed from job-seeker availability to an operator status flex.
   Toggle `open` to false to hide the pills entirely.
================================================================ */
const AVAILABILITY = {
  open: true,                                // master switch
  navLabel: 'Systems online',               // navbar pill text
  contactLabel: 'Operating at scale',       // contact panel text
};
/*==================== TITLE ====================*/
// Keep the real SEO <title>, but show a friendly message when the tab loses focus.
const REAL_TITLE = document.title || "Dayanidi Vadivel | Backend Systems Engineer";
document.addEventListener('visibilitychange', () => {
  document.title = document.hidden ? "👋 Come back! - Dayanidi" : REAL_TITLE;
});

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/*==================== LOADER ====================*/
const loader = document.querySelector('#loader');

function hideLoader() {
  if (!loader) return;
  loader.style.opacity = '0';
  setTimeout(() => { loader.style.display = 'none'; }, 400);
}
// Exposed so the boot sequence (hero-effects.js) can dismiss the loader
// once its terminal animation finishes.
window.__hideLoader = hideLoader;

// When a boot terminal is present, it drives the dismissal; otherwise hide
// shortly after load. The 4s timeout is always a safety net so it never sticks.
if (!document.getElementById('boot-terminal')) {
  window.addEventListener('load', () => setTimeout(hideLoader, 600));
}
setTimeout(hideLoader, 4000);



/*==================== ABOUT TYPING STYLE ====================*/
const words = ['Backend Engineer', 'Python Developer', 'Network Automation', 'Infrastructure Engineer', 'Full-Stack Developer'];
let currentIndex = 0;

function typeNextWord() {
  const wordElement = document.getElementById('word');
  if (!wordElement) return; // section may not exist on this view

  if (currentIndex >= words.length) currentIndex = 0;

  const currentWord = words[currentIndex];
  wordElement.textContent = '';

  let charIndex = 0;
  const typingInterval = setInterval(() => {
    if (charIndex >= currentWord.length) {
      clearInterval(typingInterval);
      currentIndex++;
      setTimeout(typeNextWord, 1400);
      return;
    }
    wordElement.textContent += currentWord.charAt(charIndex);
    charIndex++;
  }, 90);
}

typeNextWord();



/*==================== Send Message ====================*/

  
function sendMessage(event) {
  event.preventDefault();
  const button = document.getElementById('sendmessage');
  const name = document.getElementById('nameInput').value;
  const email = document.getElementById('emailInput').value;
  const subject = document.getElementById('subjectInput').value;
  const description = document.getElementById('descriptionInput').value;
  const message = `✔️From Portfolio \n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nDescription: \n\t${description}`;
  const encodedMessage = encodeURIComponent(message);
  fetch(`https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&text=${encodedMessage}`)
  .then(response => response.json())
  .then(data => {
     console.log(data);
      if (data.ok === true) {
         document.getElementById('nameInput').value = "";
         document.getElementById('emailInput').value = "";
         document.getElementById('subjectInput').value = "";
         document.getElementById('descriptionInput').value = "";
         button.style.color = '#00ff37';
         button.style.border = '2px solid #00ff37';
         button.style.animation = 'glowgreen 5s infinite';

        // Add event listener to remove animation after it finishes
        button.addEventListener('animationend', () => {
          button.style.animation = '';
        });
         } else {
          button.style.color = '#ff0000';
         button.style.border = '2px solid #ff0000';
         button.style.animation = 'glowgreen 1s infinite';

        // Add event listener to remove animation after it finishes
        button.addEventListener('animationend', () => {
          button.style.animation = '';
        });
         }
        })
        .catch(error => {
          console.error(error);
          button.style.color = '#ff0000';
         button.style.border = '2px solid #ff0000';
         button.style.animation = 'glowred 1s infinite';

        // Add event listener to remove animation after it finishes
        button.addEventListener('animationend', () => {
          button.style.animation = '';
        });
        });
  }

/*==================== MOBILE MENU (full-screen overlay) ====================*/
(function mobileMenu() {
  const burger = document.getElementById('nav-burger');
  const menu = document.getElementById('mobile-menu');
  const closeBtn = document.getElementById('mobile-menu-close');
  if (!burger || !menu) return;

  const open = () => {
    menu.classList.add('open');
    burger.classList.add('open');
    document.body.classList.add('menu-open');
  };
  const close = () => {
    menu.classList.remove('open');
    burger.classList.remove('open');
    document.body.classList.remove('menu-open');
  };

  burger.addEventListener('click', () => {
    menu.classList.contains('open') ? close() : open();
  });
  if (closeBtn) closeBtn.addEventListener('click', close);
  menu.querySelectorAll('.mobile-link').forEach((l) => l.addEventListener('click', close));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
}());

/*==================== SCROLL SECTIONS ACTIVE LINK ====================*/
const sections = document.querySelectorAll('section[id]');

function scrollActive() {
  const scrollY = window.pageYOffset;

  sections.forEach((current) => {
    const sectionHeight = current.offsetHeight;
    const sectionTop = current.offsetTop - 120;
    const sectionId = current.getAttribute('id');
    const links = document.querySelectorAll('a[href="#' + sectionId + '"].nav-item-link, a[href="#' + sectionId + '"].mobile-link');
    if (!links.length) return;

    const inView = scrollY > sectionTop && scrollY <= sectionTop + sectionHeight;
    links.forEach((link) => link.classList.toggle('active', inView));
  });
}
window.addEventListener('scroll', scrollActive, { passive: true });

/*==================== SHOW SCROLL UP ====================*/
function scrollUp() {
  const scrollUpBtn = document.getElementById('scroll-up');
  if (!scrollUpBtn) return;
  if (window.scrollY >= 480) scrollUpBtn.classList.add('show-scroll');
  else scrollUpBtn.classList.remove('show-scroll');
}
window.addEventListener('scroll', scrollUp, { passive: true });

/*===== SCROLL REVEAL ANIMATION =====*/
if (typeof ScrollReveal !== 'undefined') {
  const sr = ScrollReveal({
    origin: 'top',
    distance: '40px',
    duration: 900,
    delay: 100,
    easing: 'cubic-bezier(0.5, 0, 0, 1)',
    cleanup: true,
  });

  // Hero
  sr.reveal('.hero-greeting, .hero-name, .hero-role', { interval: 80 });
  sr.reveal('.home__data, .home__social, .hero-stage', { delay: 150 });
  sr.reveal('.code-editor, .hero-stats-bar, .hero-quote', { delay: 150, interval: 80 });
  // Section headers
  sr.reveal('.section-title, .qual-section-tag, .qual-hero-title, .qual-hero-sub, .section-tag', { origin: 'bottom' });
  // Content blocks
  sr.reveal('.qual-new-row', { interval: 120, origin: 'left' });
  sr.reveal('.exp-card', { interval: 100 });
  sr.reveal('.skill-cat-card, .skill-json-section', { interval: 90 });
  sr.reveal('.item', { interval: 80 });
  sr.reveal('.contact__information, .contact__input', { interval: 80 });
  sr.reveal('.quote, .qual-quote-pill', { delay: 120 });
}


var modalInfo = {
  1: {
    title: "MCP Gateway",
    info: "A single Cloudflare Worker that unifies LinkedIn, Discord, Firebase, and file rendering through one API endpoint with a single auth layer - eliminating context-switching across services. One request routes to all connected platforms. Built under the theme #BuildInPublic, demonstrating API aggregation, edge computing, and unified authentication on Cloudflare's global network.",
    link: "#",
    github: "#"
  },
  2: {
    title: "FLAMES App",
    info: "A Flutter-based mobile app based on the classic FLAMES relationship game. Originally built 3 years ago as a side project and recently shipped to the Google Play Store. Takes two names, runs the FLAMES algorithm, and delivers an instant result - Friends, Love, Affection, Marriage, Enemy, or Sibling. A polished, production-grade Flutter/Dart app that went from personal experiment to live on the Play Store.",
    link: "#",
    github: "#"
  },
  3: {
    title: "GitHub Automation Script",
    info: "A Google Apps Script that automatically updated a GitHub repository every single day for an entire year - 365 consecutive days - with no servers, no cron jobs, and zero manual intervention. A pure automation exercise using Google's free infrastructure for persistent scheduled tasks. Demonstrates how to build reliable, serverless automation pipelines using tools that are already free and available.",
    link: "#",
    github: "#"
  },
  4: {
    title: "Li-Fi - Laser Light Communication",
    info: "A team project with Hari Prasath Selvan and Darunika Babu, guided by Dr. G. Singaravel. Transmitted music through a laser beam - audio travels from an audio pin, through a laser light, and into speakers on the other end. V1 successfully transmitted music. V2 was planned for file transmission; V3 aimed to share internet connectivity through light. A hardware proof-of-concept in optical wireless communication (Li-Fi).",
    link: "#",
    github: "#"
  },
  5: {
    title: "Apps Script Form Handler",
    info: "A free, serverless form submission handler built on Google Apps Script. When an HTML form is submitted, it automatically sends a formatted email response to the submitter - with no third-party service, no monthly fees, and no backend server required. Eliminates paid platforms like Formspree or Netlify Forms by using Google's own free infrastructure. Simple to integrate into any static site.",
    link: "#",
    github: "#"
  },
  6: {
    title: "Telegram Form Bot",
    info: "A lightweight tool that routes HTML form submission data directly into a Telegram chat in real time. Built on the Telegram Bot API, it delivers form entries as formatted messages with zero infrastructure cost - a free, instant alternative to paid form-handling services. Drop in one JavaScript snippet and all form submissions land straight in Telegram. Used in this portfolio's own contact form.",
    link: "#",
    github: "#"
  },
  7: {
    title: "Nile AI-thon 2025",
    info: "Participated in the Nile AI-thon 2025 - an internal hackathon at Nile Global focused on autonomous network operations. Worked on building AI-driven solutions for network management, anomaly detection, and operational automation at scale. Directly aligned with his core work at Nile on large-scale infrastructure and fleet-wide automation. Shared updates and learnings from the event publicly on LinkedIn.",
    link: "#",
    github: "#"
  }
};

// Get the modal
var modal = document.getElementById('myModal');

// Only portfolio-item buttons open the modal (not Contact/Send buttons)
document.querySelectorAll('.work__container .item .button').forEach((b) => {
  b.addEventListener('click', () => openModal(b.closest('.item')));
});

function openModal(project) {
  if (!project || !modal) return;
  const id = project.id;
  if (!modalInfo[id]) return;
  const imgEl = project.querySelector('img');
  fillOut(id, imgEl ? imgEl.src : '');
  modal.style.display = 'block';
}

function fillOut(id, img) {
  setText('title', modalInfo[id].title);
  setText('info', modalInfo[id].info);
  const imgTarget = document.getElementById('img');
  if (imgTarget) imgTarget.src = img;
  const site = document.getElementById('site');
  if (site) {
    const link = modalInfo[id].link;
    if (link && link !== '#') {
      site.style.display = '';
      site.onclick = () => window.open(link, '_blank');
    } else {
      site.style.display = 'none'; // hide "Visit" when there's no live link
    }
  }
}

// Close modal: × button, Close button, click-outside, and Esc
if (modal) {
  modal.querySelectorAll('.close, [data-dismiss="modal"]').forEach((el) => {
    el.addEventListener('click', () => { modal.style.display = 'none'; });
  });
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none'; });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') modal.style.display = 'none'; });
}


  /*==================== spark trail on mouse move (desktop only, throttled) ====================*/
const isTouchDevice = window.matchMedia('(hover: none)').matches || 'ontouchstart' in window;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!isTouchDevice && !prefersReducedMotion) {
  let lastSpark = 0;
  // resolve spark path for both root + sub-directory pages
  const sparkSrc = (location.pathname.includes('view') ? '../' : './') + 'assets/images/spark.png';

  document.addEventListener('mousemove', function (event) {
    const now = Date.now();
    if (now - lastSpark < 45) return; // throttle ~22 sparks/sec max
    lastSpark = now;

    const spark = document.createElement('img');
    spark.className = 'spark';
    spark.src = sparkSrc;
    spark.style.left = event.clientX + 'px';
    spark.style.top = event.clientY + window.scrollY + 'px';
    spark.style.transform = 'rotate(' + Math.floor(Math.random() * 360) + 'deg)';
    spark.style.width = (Math.floor(Math.random() * 28) + 10) + 'px';
    spark.style.height = 'auto';
    document.body.appendChild(spark);
    setTimeout(() => spark.remove(), 150);
  }, { passive: true });
}

/*==================== Personal details ====================*/

var personalDetails = {
name: "Dayanidi Vadivel",
initial: "GV",
age: 22,
occupation: "Backend Engineer",
college: "K.S.R. College of Engineering, Tiruchengode",
pursuing: "Graduated",
cgpa: 7.5,
about: "",
email: "dayanidigv954@gmail.com",
facebook: "https://www.facebook.com/dayanidi.vadivel/",
instagram: "https://www.instagram.com/dayanidi.vadivel/",
twitter: "https://twitter.com/DayanidiCoder",
linkedin: "https://in.linkedin.com/in/dayanidi-coder",
github: "https://github.com/dayanidigv",
sendMail: ""
};
personalDetails.about = `Backend Systems Engineer focused on automation, large-scale infrastructure, and system reliability. Currently building at Nile - working on network automation, anomaly detection, and production systems at scale. B.Tech in Information Technology, ${personalDetails.college} (2025 · CGPA ${personalDetails.cgpa}).`;
personalDetails.sendMail = `mailto:${personalDetails.email}`;

/* ---- small safe helpers (never throw if an element is missing) ---- */
const setText = (id, val) => { const el = document.getElementById(id); if (el) el.innerHTML = val; };
const setHref = (id, val) => { const el = document.getElementById(id); if (el) el.setAttribute('href', val); };
const setAllText = (cls, val) => { document.querySelectorAll('.' + cls).forEach(el => { el.innerHTML = val; }); };

const isNormalView = window.location.pathname.includes('normalview');

/* Brand + name tags (may appear 0..n times per view) */
setAllText('brand-name', personalDetails.name);
setAllText('nametag', personalDetails.name);

/* View-specific bindings */
if (isNormalView) {
  setText('normalviewAbout', personalDetails.about);
} else {
  setText('name', personalDetails.name);
  setText('age', personalDetails.age);
  setText('occupation', personalDetails.occupation);
  setText('year', personalDetails.pursuing);
}

/* Shared bindings (present in both views) */
setText('cgpatag', personalDetails.cgpa);
setText('email', personalDetails.email);
setHref('send_mail', personalDetails.sendMail);

/* All social links by data attribute (hero, contact, mobile menu, footer) */
['linkedin', 'github', 'twitter', 'instagram', 'facebook'].forEach((net) => {
  document.querySelectorAll('[data-social="' + net + '"]').forEach((a) => {
    a.href = personalDetails[net];
    a.target = '_blank';
    a.rel = 'noopener';
  });
});

/* Availability badges - controlled by the AVAILABILITY config at top */
(function applyAvailability() {
  const navPills = document.querySelectorAll('.nav-status');
  const contactPills = document.querySelectorAll('.contact-availability');

  if (!AVAILABILITY.open) {
    navPills.forEach((el) => { el.style.display = 'none'; });
    contactPills.forEach((el) => { el.style.display = 'none'; });
    return;
  }
  navPills.forEach((el) => {
    el.innerHTML = '<span class="status-dot"></span> ' + AVAILABILITY.navLabel;
  });
  contactPills.forEach((el) => {
    el.innerHTML = '<span class="dot"></span> ' + AVAILABILITY.contactLabel;
  });
}());


/*==================== HERO UPTIME COUNTER ====================*/
// Live "uptime" = days since Dayanidi started this journey (1 Jan 2022).
// Grows on its own — no hardcoded number to go stale.
(function uptimeCounter() {
  const el = document.getElementById('uptime-days');
  if (!el) return;
  const start = new Date('2022-01-01T00:00:00');
  const days = Math.max(0, Math.floor((Date.now() - start.getTime()) / 86400000));
  el.textContent = days.toLocaleString() + 'd';
}());
