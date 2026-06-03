/* ================================================================
   PROJECTS, single source of truth for the Work section.
   Edit / add / reorder here; the cards AND the detail modal render
   themselves from this list (see renderProjects() in main.js).

   Each entry:
     id          unique slug (also shown as svc://<id> and the URL-ish key)
     title       display name
     icon        any icon class, unicons "uil uil-…" or boxicons "bx bxl-…"
     tagline     short line shown on the card
     description longer text shown in the detail modal
     tags        array of short tech/labels (pills)
     links       { live, github, demo, ... }, any non-empty link becomes a
                 button in the modal. Leave "" to hide. Add as many as you want.
     year        year of release (used for timeline badge & sorting)
     group       work category ('Innak', 'The Half Brick', 'Personal')
   To add a project: copy a block, change the fields. That's it.
================================================================ */
const PROJECTS = [
  {
    id: 'mcp-gateway',
    title: 'MCP Gateway',
    icon: 'uil uil-server-network',
    tagline: 'One Cloudflare Worker unifying LinkedIn, Discord, Firebase & file rendering through a single auth layer.',
    description: "A single Cloudflare Worker that unifies LinkedIn, Discord, Firebase, and file rendering through one API endpoint with a single auth layer — eliminating context-switching across services. One request routes to all connected platforms. Built under #BuildInPublic, demonstrating API aggregation, edge computing, and unified authentication on Cloudflare's global network.",
    tags: ['Cloudflare', 'API', 'Edge', '#BuildInPublic'],
    links: { live: '', github: '' },
    year: 2026,
    group: 'Personal',
  },
  {
    id: 'flames-app',
    title: 'FLAMES App',
    icon: 'uil uil-mobile-android',
    tagline: 'Flutter mobile app · the classic FLAMES game, shipped live to the Google Play Store (V2 in 2026).',
    description: 'A Flutter-based mobile app based on the classic FLAMES relationship game. Originally built 3 years ago as a side project and recently shipped to the Google Play Store with a brand new V2 update in 2026. Takes two names, runs the FLAMES algorithm, and delivers an instant result: Friends, Love, Affection, Marriage, Enemy, or Sibling. A polished, production-grade Flutter/Dart app that went from personal experiment to live on the Play Store.',
    tags: ['Flutter', 'Dart', 'Play Store'],
    links: { play: 'https://play.google.com/store/apps/details?id=com.daya.flames', github: '' },
    year: 2026,
    group: 'Personal',
  },
  {
    id: 'vadivelu-cars-landing',
    title: 'Vadivelu Cars Landing Page',
    icon: 'uil uil-rocket',
    tagline: 'A modern marketing site with 3D visuals, motion, and performance-focused UX.',
    description: 'Designed and built an interactive landing page featuring 3D car visuals, smooth animations, responsive layouts, SEO-ready structure, and Core Web Vitals-focused optimization.',
    tags: ['React', 'Three.js', 'Framer Motion', 'SEO'],
    links: { live: 'https://vadivelucars.in/', github: '' },
    year: 2026,
    group: 'Personal',
  },
  {
    id: 'vadivelu-cars-workers',
    title: 'API Backend on Cloudflare Workers',
    icon: 'uil uil-server',
    tagline: 'A serverless backend powering authentication, invoices, and customer services.',
    description: 'Built a Cloudflare Workers API backend with Hono, JWT auth, Supabase integration, and route-based services for customers, invoices, and business operations.',
    tags: ['Cloudflare Workers', 'Hono', 'Supabase', 'JWT'],
    links: { live: 'https://vadivelucars.in/', github: '' },
    year: 2026,
    group: 'Personal',
  },
  {
    id: 'nile-ai-thon',
    title: 'Nile AI-thon 2025',
    icon: 'uil uil-processor',
    tagline: 'Internal Nile hackathon, autonomous network ops, AI anomaly detection, infrastructure automation.',
    description: 'Participated in the Nile AI-thon 2025, an internal hackathon at Nile Global focused on autonomous network operations. Built AI-driven solutions for network management, anomaly detection, and operational automation at scale, directly aligned with core work at Nile on large-scale infrastructure and fleet-wide automation.',
    tags: ['AI', 'Network', 'Automation', 'Nile'],
    links: { live: '', github: '', linkedin: 'https://www.linkedin.com/posts/dayanidi-vadivel_innovationwithpurpose-nilesecure-nilehackathon2025-activity-7403088208982343682-Fo8o?utm_source=share&utm_medium=member_desktop&rcm=ACoAAD2CqksBa8xX7B3v55oFuljA4G3Kaq_r1RQ' },
    year: 2025,
    group: 'Personal',
  },
  {
    id: 'vadivelu-cars-admin',
    title: 'Vadivelu Cars Admin Portal',
    icon: 'uil uil-dashboard',
    tagline: 'A full operations dashboard for managing customers, invoices, vehicles, and reports.',
    description: 'Built a comprehensive admin portal for an automotive service center with authentication, customer management, invoice workflows, vehicle tracking, analytics, and system administration tools.',
    tags: ['React', 'TypeScript', 'Firebase', 'Cloudflare Pages'],
    links: { live: 'https://vadivelucars.in/', github: '' },
    year: 2025,
    group: 'Personal',
  },
  {
    id: 'vadivelu-cars-customer',
    title: 'Vadivelu Cars Customer Portal',
    icon: 'uil uil-user',
    tagline: 'A customer-facing portal for login, invoice tracking, vehicle management, and feedback.',
    description: 'Created a secure customer portal with phone-based authentication, vehicle verification, invoice viewing and printing, profile management, and a feedback system.',
    tags: ['React', 'JWT', 'PDF', 'Customer Portal'],
    links: { live: 'https://vadivelucars.in/', github: '' },
    year: 2025,
    group: 'Personal',
  },
  {
    id: 'vadivelu-cars-frontend',
    title: 'Unified Frontend Platform',
    icon: 'uil uil-apps',
    tagline: 'A combined frontend experience for landing, admin, and customer workflows.',
    description: 'Developed a unified React frontend that brings multiple customer and admin experiences into one codebase, streamlining navigation, shared UI, and backend integration.',
    tags: ['React', 'Vite', 'Tailwind CSS', 'Zustand'],
    links: { live: 'https://vadivelucars.in/', github: '' },
    year: 2025,
    group: 'Personal',
  },
  {
    id: 'thb-website',
    title: 'The Half Brick Website',
    icon: 'uil uil-globe',
    tagline: 'A modern public-facing website built with Next.js, Tailwind CSS, and a custom design system.',
    description: 'A modern public-facing website for The Half Brick built with Next.js, Tailwind CSS, and a custom design system. Focused on responsive layouts, brand consistency, SEO, and content-driven pages.',
    tags: ['Next.js', 'React', 'Tailwind CSS', 'SEO', 'Brand Design'],
    links: { live: 'http://thehalfbrick.com/', github: '' },
    year: 2025,
    group: 'The Half Brick',
  },
  {
    id: 'thb-backend',
    title: 'The Half Brick CMS Back-End',
    icon: 'uil uil-database',
    tagline: 'Payload CMS back-end powering APIs, media storage, and admin workflows.',
    description: 'A Payload CMS back-end that powers the platform’s content, APIs, media storage, and admin workflows. Built with Next.js, PostgreSQL, and S3-backed media handling.',
    tags: ['Payload CMS', 'Next.js', 'PostgreSQL', 'S3', 'TypeScript'],
    links: { live: 'http://thehalfbrick.com/', github: '' },
    year: 2025,
    group: 'The Half Brick',
  },
  {
    id: 'thb-classroom-monitor',
    title: 'Classroom Analytics Dashboard',
    icon: 'uil uil-chart-bar',
    tagline: 'Internal dashboard for tracking student performance, attendance, and analytics.',
    description: 'An internal dashboard for tracking student performance, attendance, and engagement. Includes Google Classroom integration, reporting tools, authentication, and data visualization.',
    tags: ['Next.js', 'Google Classroom API', 'Analytics', 'Dashboard', 'PDF Reports'],
    links: { live: 'http://thehalfbrick.com/', github: '' },
    year: 2025,
    group: 'The Half Brick',
  },
  {
    id: 'thb-mcp-gateway',
    title: 'The Half Brick MCP Gateway',
    icon: 'uil uil-key-skeleton',
    tagline: 'Workers-based MCP gateway unifying multiple THB services behind a single authenticated layer.',
    description: 'A Cloudflare Workers-based MCP gateway that unifies multiple THB services behind a single authenticated API layer. Designed for edge deployment, tool routing, and platform integration.',
    tags: ['Cloudflare Workers', 'MCP', 'Edge', 'API Gateway', 'Authentication'],
    links: { live: 'http://thehalfbrick.com/', github: '' },
    year: 2025,
    group: 'The Half Brick',
  },
  {
    id: 'thb-backup',
    title: 'Backup & Restore Service',
    icon: 'uil uil-history',
    tagline: 'Zero-data-loss backup and restore service for PostgreSQL, S3, and Supabase.',
    description: 'A zero-data-loss backup and restore service for the THB infrastructure. Automatically discovers PostgreSQL tables, S3 buckets, and Supabase storage for safe archiving and recovery.',
    tags: ['Node.js', 'PostgreSQL', 'S3', 'Supabase', 'DevOps'],
    links: { live: 'http://thehalfbrick.com/', github: '' },
    year: 2025,
    group: 'The Half Brick',
  },
  {
    id: 'thb-gallery',
    title: 'Media Gallery',
    icon: 'uil uil-images',
    tagline: 'A photo and media gallery app built with Next.js and a lightweight image browsing experience.',
    description: 'A photo and media gallery app built with Next.js and a lightweight image browsing experience. Useful for showcasing visual content with responsive viewing and smooth navigation.',
    tags: ['Next.js', 'React', 'Gallery UI', 'Media', 'Responsive Design'],
    links: { live: 'http://thehalfbrick.com/', github: '' },
    year: 2025,
    group: 'The Half Brick',
  },
  {
    id: 'for-you-and-me',
    title: 'For You & Me',
    icon: 'uil uil-comments-alt',
    tagline: 'Secure, private, two-person real-time messaging system built with Next.js, React, and Firebase.',
    description: `A private messaging app built exclusively for two people. Powered by Firebase Authentication and Firebase Realtime Database, it features password-protected login, user status tracking, real-time message syncing, and message replies with auto-scroll and highlight animations.
<div class="code-editor" style="margin-top: 1.25rem;">
  <div class="code-editor-bar">
    <div class="code-dots">
      <span class="code-dot red"></span>
      <span class="code-dot yellow"></span>
      <span class="code-dot green"></span>
    </div>
    <span class="code-lang">presence.ts</span>
  </div>
  <div class="code-editor-body" style="white-space: pre-wrap; line-height: 1.5; padding: 0.85rem 1.1rem; font-size: 0.72rem;">
<span style="color: var(--code-kw);">const</span> user1Ref = ref(database, \`details/\${userIDs[0]}\`);
<span style="color: var(--code-kw);">const</span> user2Ref = ref(database, \`details/\${userIDs[1]}\`);

onValue(user1Ref, (snapshot1) => {
  onValue(user2Ref, (snapshot2) => {
    Promise.all([
      checkLoginStatus(snapshot1),
      checkLoginStatus(snapshot2)
    ]).then(([login1, login2]) => {
      setStatus(login1 && login2 ? <span style="color: var(--code-str);">"Online"</span> : <span style="color: var(--code-str);">"Offline"</span>);
    });
  });
});
  </div>
</div>`,
    tags: ['Next.js', 'React', 'Firebase', 'Real-Time Chat', 'TailwindCSS'],
    links: { live: '', github: 'https://github.com/dayanidigv/for_you_and_me' },
    year: 2024,
    group: 'Personal',
  },
  {
    id: 'smart-construction-interior',
    title: 'Smart Construction Interior',
    icon: 'uil uil-building',
    tagline: 'Construction & Interior Design Project Management System built with Laravel 11 & Bootstrap.',
    description: `A comprehensive multi-role Construction & Interior Design Project Management System built with Laravel 11.9. Features include role-based access control (Admin, Manager, Developer), multi-stage order approval pipelines, automated invoicing with partial payments history, inventory/materials tracking, calendar-based scheduling, and PDF/Excel export modules.
<div class="code-editor" style="margin-top: 1.25rem;">
  <div class="code-editor-bar">
    <div class="code-dots">
      <span class="code-dot red"></span>
      <span class="code-dot yellow"></span>
      <span class="code-dot green"></span>
    </div>
    <span class="code-lang">web.php</span>
  </div>
  <div class="code-editor-body" style="white-space: pre-wrap; line-height: 1.5; padding: 0.85rem 1.1rem; font-size: 0.72rem;">
<span style="color: var(--code-kw);">Route</span>::middleware([<span style="color: var(--code-str);">'auth'</span>, <span style="color: var(--code-str);">'role:admin'</span>])->prefix(<span style="color: var(--code-str);">'admin'</span>)->group(<span style="color: var(--code-kw);">function</span> () {
    <span style="color: var(--code-kw);">Route</span>::resource(<span style="color: var(--code-str);">'orders'</span>, OrdersController::<span style="color: var(--code-kw);">class</span>);
    <span style="color: var(--code-kw);">Route</span>::resource(<span style="color: var(--code-str);">'invoices'</span>, InvoiceController::<span style="color: var(--code-kw);">class</span>);
    <span style="color: var(--code-kw);">Route</span>::get(<span style="color: var(--code-str);">'reports'</span>, [ReportController::<span style="color: var(--code-kw);">class</span>, <span style="color: var(--code-str);">'index'</span>]);
});
  </div>
</div>`,
    tags: ['Laravel', 'PHP', 'SQLite', 'Bootstrap', 'Vite', 'INNAK'],
    links: { live: '', github: 'https://github.com/dayanidigv/smart-construction-interior' },
    year: 2024,
    group: 'Innak',
  },
  {
    id: 'webathon-showcase',
    title: 'Webathon - Web Developer Showcase',
    icon: 'uil uil-award',
    tagline: 'Event registration and lead capture system for the GFGsc KSRIET Webathon.',
    description: 'Created form and showcase pages for the GFGsc KSRIET Webathon. Integrates real-time database inputs, Google Sheets synchronization, and automated email trigger pipelines via Google Apps Script.',
    tags: ['HTML', 'CSS', 'JavaScript', 'Google Apps Script', 'Innak'],
    links: { live: 'https://innak-crew.github.io/GFGscKSRIET-Webathon/', github: 'https://github.com/Innak-crew/GFGscKSRIET-Webathon' },
    year: 2024,
    group: 'Innak',
  },
  {
    id: 'asthra-symposium',
    title: 'Asthra\'24 Symposium',
    icon: 'uil uil-envelope-upload',
    tagline: 'An automatic registration, verification, and invitation email system built with Google Apps Script.',
    description: `Designed and developed an automatic registration, database routing, and notification dispatch system for the ASTHRA 2K24 tech symposium. The system processes registration entries, auto-provisions customized event sheets, updates the dashboard telemetry, and dispatches rich HTML emails with embedded imagery to participants.
<div class="code-editor" style="margin-top: 1.25rem;">
  <div class="code-editor-bar">
    <div class="code-dots">
      <span class="code-dot red"></span>
      <span class="code-dot yellow"></span>
      <span class="code-dot green"></span>
    </div>
    <span class="code-lang">code.gs</span>
  </div>
  <div class="code-editor-body" style="white-space: pre-wrap; line-height: 1.5; padding: 0.85rem 1.1rem; font-size: 0.72rem;">
<span style="color: var(--code-kw);">function</span> reloadAllData() {
  <span style="color: var(--code-kw);">var</span> sheets = SpreadsheetApp.getActiveSpreadsheet();
  <span style="color: var(--code-kw);">var</span> data = sheets.getDataRange().getValues();
  <span style="color: var(--code-kw);">var</span> sheetNames = getAllSheetNames();

  sheetNames.forEach(<span style="color: var(--code-kw);">function</span> (name) {
    <span style="color: var(--code-kw);">if</span> (name != <span style="color: var(--code-str);">"Sheet1"</span> && name != <span style="color: var(--code-str);">"Dashboard"</span>) {
      sheets.deleteSheet(sheets.getSheetByName(name));
    }
  });

  data.forEach(<span style="color: var(--code-kw);">function</span> (entry) {
    <span style="color: var(--code-kw);">var</span> firstEvent = entry[10];
    <span style="color: var(--code-kw);">if</span> (firstEvent) {
      <span style="color: var(--code-kw);">var</span> sheet = getOrCreateSheet(sheets, firstEvent);
      appendDataToSheet(sheet, entry);
    }
  });
}
  </div>
</div>`,
    tags: ['Google Apps Script', 'Automation', 'Email API', 'Sheets'],
    links: { live: 'https://github.com/dayanidigv/Asthra-page', github: 'https://github.com/dayanidigv/Asthra24K24-Apps-script' },
    year: 2024,
    group: 'Innak',
  },
  {
    id: 'pychatverse',
    title: 'PyChatVerse',
    icon: 'bx bxl-python',
    tagline: 'Real-time Python chat application package supporting global and private rooms, available on PyPI.',
    description: `PyChatVerse is a versatile Python chat application package designed for seamless real-time communication. It allows users to initialize chat clients, spin up chat servers, and join global and private chat rooms with ease. Shipped on PyPI under PyChatVerse.
<div class="code-editor" style="margin-top: 1.25rem;">
  <div class="code-editor-bar">
    <div class="code-dots">
      <span class="code-dot red"></span>
      <span class="code-dot yellow"></span>
      <span class="code-dot green"></span>
    </div>
    <span class="code-lang">Terminal</span>
  </div>
  <div class="code-editor-body" style="white-space: pre-wrap; line-height: 1.5; padding: 0.85rem 1.1rem; font-size: 0.72rem;">
<span style="color: var(--code-kw);">pip</span> install PyChatVerse
  </div>
</div>`,
    tags: ['Python', 'Socket', 'Chat', 'PyPI', 'Open Source'],
    links: { live: 'https://pypi.org/project/PyChatVerse/', github: '', linkedin: 'https://www.linkedin.com/posts/dayanidi-vadivel_pychatverse-realtimechat-pythonpackage-activity-7099782814383960064-TZh_?utm_source=share&utm_medium=member_desktop&rcm=ACoAAD2CqksBa8xX7B3v55oFuljA4G3Kaq_r1RQ' },
    year: 2023,
    group: 'Personal',
  },
  {
    id: 'echo-globe',
    title: 'Echo-Globe',
    icon: 'uil uil-globe',
    tagline: 'Anonymous real-time web chat over WebRTC P2P, ephemeral rooms, no signup, messages vanish after.',
    description: `Echo-Globe is a web-based, anonymous chat platform built on WebRTC peer-to-peer connections. Create a room (name it, get a unique room ID) or join one with an ID, no email or phone number, ever. Share text, photos, videos, and files in real time, then it all disappears when the chat ends. Privacy-first and ephemeral by design: close the tab to leave, and the room vanishes when its creator does.`,
    tags: ['WebRTC', 'P2P', 'Real-Time', 'Privacy', 'Web App'],
    links: { live: 'https://echoglobe.github.io', linkedin: 'https://www.linkedin.com/posts/dayanidi-vadivel_echoglobe-webchat-privacymatters-activity-7099779612393570304-BPH_?utm_source=share&utm_medium=member_desktop&rcm=ACoAAD2CqksBa8xX7B3v55oFuljA4G3Kaq_r1RQ' },
    year: 2023,
    group: 'Innak',
  },
  {
    id: 'ksrce-scraping',
    title: 'KSRCE Results Automation',
    icon: 'bx bxl-python',
    tagline: 'Automated college semester result web scraper compiling structured pass/fail analytics to Excel.',
    description: `A Python scraper designed to automate semester result collection for classes at K.S.R. College of Engineering. It performs secure HTTP POST requests to the results portal, parses response trees with BeautifulSoup, extracts student grades, and tallies subject-wise pass/fail counts into a highlighted Excel sheet.
<div class="code-editor" style="margin-top: 1.25rem;">
  <div class="code-editor-bar">
    <div class="code-dots">
      <span class="code-dot red"></span>
      <span class="code-dot yellow"></span>
      <span class="code-dot green"></span>
    </div>
    <span class="code-lang">main.py</span>
  </div>
  <div class="code-editor-body" style="white-space: pre-wrap; line-height: 1.5; padding: 0.85rem 1.1rem; font-size: 0.72rem;">
<span style="color: var(--code-kw);">import</span> requests
<span style="color: var(--code-kw);">from</span> bs4 <span style="color: var(--code-kw);">import</span> BeautifulSoup

<span style="color: var(--code-kw);">for</span> regno <span style="color: var(--code-kw);">in</span> range(<span style="color: var(--code-num);">73152121001</span>, <span style="color: var(--code-num);">73152121064</span>):
    payload = {<span style="color: var(--code-str);">'regno'</span>: str(regno), <span style="color: var(--code-str);">'resulttype'</span>: <span style="color: var(--code-str);">'universityresult'</span>}
    res = requests.post(<span style="color: var(--code-str);">'https://ksrceresults.com/'</span>, data=payload)
    soup = BeautifulSoup(res.text, <span style="color: var(--code-str);">'html.parser'</span>)
    <span style="color: var(--text-muted);"># Parse table, extract subject grades and write to openpyxl...</span>
  </div>
</div>`,
    tags: ['Python', 'Web Scraping', 'BeautifulSoup', 'Pandas', 'Automation'],
    links: { live: '', github: 'https://github.com/dayanidigv/ksrce-sem-result-web-scraping/blob/main/main.py' },
    year: 2023,
    group: 'Personal',
  },
  {
    id: 'sara-assistant',
    title: 'Sara Voice Assistant',
    icon: 'bx bxl-python',
    tagline: 'Windows personal voice assistant supporting speech execution, Wikipedia lookup, and system commands.',
    description: `Sara is a Python-based personal voice assistant that offers a range of hands-free command functionalities. Operating on Windows, it supports voice recognition, Wikipedia queries, Google searches, screenshot captures, system shutdown schedules, and casual conversational interactions.`,
    tags: ['Python', 'Speech Recognition', 'Automation', 'Windows'],
    links: { live: '', github: '', linkedin: 'https://www.linkedin.com/posts/dayanidi-vadivel_voiceassistant-artificialintelligence-python-activity-7080131059207569408-0SbQ?utm_source=share&utm_medium=member_desktop&rcm=ACoAAD2CqksBa8xX7B3v55oFuljA4G3Kaq_r1RQ' },
    year: 2023,
    group: 'Personal',
  },
  {
    id: 'emergency-sign-comm',
    title: 'Emergency Comm for Sign Language',
    icon: 'uil uil-camera',
    tagline: 'IoT camera gesture recognition system translating sign language to text with Telegram alerts.',
    description: 'Developed an emergency communication system combining IoT camera technology and Python gesture recognition. The system captures sign language in real-time, runs recognition algorithms to translate gestures into text, displays them on a visual interface, and integrates with the Telegram API to alert emergency responders, friends, and family with instant text and photos.',
    tags: ['IoT Camera', 'Python', 'Computer Vision', 'Telegram API', 'Accessibility'],
    links: { live: '', github: '', linkedin: 'https://www.linkedin.com/posts/dayanidi-vadivel_iot-python-emergencycommunication-activity-7076244514444611584-47fX?utm_source=share&utm_medium=member_desktop&rcm=ACoAAD2CqksBa8xX7B3v55oFuljA4G3Kaq_r1RQ' },
    year: 2023,
    group: 'Personal',
  },
  {
    id: 'telechat-bot',
    title: 'TeleChatBot',
    icon: 'uil uil-cloud-upload',
    tagline: 'Teleport messages & files to yourself on Telegram, key-based, no email or extra apps. Live in beta.',
    description: `TeleChatBot is a data-teleport tool that sends messages and files to yourself through Telegram, perfect for grabbing important info fast when your phone isn't around. Sign up via @Send_data_to_yourselfbot, set a secure key, log in, and hit Send to teleport data straight to your Telegram. Privacy-first: it stores only your chat ID and key, no email, no linking other apps. One-way self-messaging, files up to 50 MB, works on any device, secured by Telegram. Shipped under INNAK (v1.0.2-beta) with real early users.`,
    tags: ['Telegram API', 'File Teleport', 'Privacy', 'Web App', 'INNAK'],
    links: { live: 'https://telechatbot.innak.in/', linkedin: 'https://www.linkedin.com/posts/dayanidi-vadivel_filesharing-telegrambot-crossplatform-activity-7076246948822859777-ZfyI?utm_source=share&utm_medium=member_desktop&rcm=ACoAAD2CqksBa8xX7B3v55oFuljA4G3Kaq_r1RQ' },
    year: 2023,
    group: 'Personal',
  },
  {
    id: 'automated-lighting',
    title: 'Automated Lighting Control',
    icon: 'bx bxl-python',
    tagline: 'Smart lighting control system using body and face recognition in Python.',
    description: 'A Python-powered smart lighting automation system designed for energy efficiency. The system utilizes face and body detection through computer vision to track human presence within a room and automatically adjusts the lighting levels accordingly.',
    tags: ['Python', 'Computer Vision', 'Face Recognition', 'Automation'],
    links: { live: '', github: '' },
    year: 2023,
    group: 'Personal',
  },
  {
    id: 'placement-question-box',
    title: 'Placement Question Box',
    icon: 'uil uil-shield-check',
    tagline: 'Secure staff-student question-sharing web app using HTML, CSS, JavaScript, and Firebase.',
    description: 'Designed and developed a secure web application for sharing placement preparation questions between staff and students. Built with HTML, CSS, JavaScript, and Firebase for authentication and database management, the portal ensures secure data transmission and role-based access control.',
    tags: ['HTML', 'CSS', 'JavaScript', 'Firebase', 'Security'],
    links: { live: '', github: '' },
    year: 2023,
    group: 'college',
  },
  {
    id: 'telegram-form-bot',
    title: 'Telegram Form Bot',
    icon: 'bx bxl-telegram',
    tagline: 'Routes HTML form submissions straight to Telegram, an instant, free alternative to paid form services.',
    description: 'A lightweight tool that routes HTML form submission data directly into a Telegram chat in real time. Built on the Telegram Bot API, it delivers form entries as formatted messages with zero infrastructure cost, a free, instant alternative to paid form-handling services. The evolution of this powers this portfolio’s own (now Worker-proxied) contact form.',
    tags: ['Telegram API', 'JavaScript', 'Free Tool'],
    links: { live: '', github: '' },
    year: 2023,
    group: 'Personal',
  },
  {
    id: 'apps-script-form',
    title: 'Apps Script Form Handler',
    icon: 'uil uil-envelope-check',
    tagline: 'Free automated email-on-submit for HTML forms via Google Apps Script, no paid services, no backend.',
    description: 'A free, serverless form-submission handler built on Google Apps Script. When an HTML form is submitted, it automatically sends a formatted email response, with no third-party service, no monthly fees, and no backend server. Eliminates paid platforms like Formspree or Netlify Forms using free infrastructure. Simple to drop into any static site.',
    tags: ['Apps Script', 'Automation', 'Free'],
    links: { live: '', github: '' },
    year: 2023,
    group: 'Personal',
  },
  {
    id: 'github-automation',
    title: 'GitHub Automation Script',
    icon: 'bx bxl-github',
    tagline: 'Apps Script that auto-committed to GitHub every day for 365 days, no servers, no cron, zero manual effort.',
    description: 'A Google Apps Script that automatically updated a GitHub repository every single day for an entire year, 365 consecutive days, with no servers, no cron jobs, and zero manual intervention. A pure automation exercise using free infrastructure for persistent scheduled tasks. Demonstrates reliable, serverless automation pipelines built with tools that are already free.',
    tags: ['Apps Script', 'GitHub API', 'Automation'],
    links: { live: '', github: '' },
    year: 2022,
    group: 'Personal',
  },
  {
    id: 'py-thanglish',
    title: 'Py-Thanglish',
    icon: 'bx bxl-python',
    tagline: 'Python package enabling seamless phonetic conversion of Tamil text into Thanglish (Tamil written in English script).',
    description: `Py-Thanglish is a Python package designed to simplify the process of converting Tamil text to Thanglish. In addition to text conversion, it includes pyttsx3 integration, which facilitates reading Tamil text aloud phonetically (bridging the gap since pyttsx3 does not natively support Tamil script).
<div class="code-editor" style="margin-top: 1.25rem;">
  <div class="code-editor-bar">
    <div class="code-dots">
      <span class="code-dot red"></span>
      <span class="code-dot yellow"></span>
      <span class="code-dot green"></span>
    </div>
    <span class="code-lang">Terminal</span>
  </div>
  <div class="code-editor-body" style="white-space: pre-wrap; line-height: 1.5; padding: 0.85rem 1.1rem; font-size: 0.72rem;">
<span style="color: var(--code-kw);">pip</span> install Py_Thanglish
  </div>
</div>`,
    tags: ['Python', 'NLP', 'Tamil NLP', 'Text-to-Speech', 'Open Source'],
    links: { live: 'https://pypi.org/project/Py-Thanglish/', github: '', linkedin: 'https://www.linkedin.com/posts/dayanidi-vadivel_pythanglish-tamiltothanglish-pythonpackage-activity-7076248425138159616-V7yL?utm_source=share&utm_medium=member_desktop&rcm=ACoAAD2CqksBa8xX7B3v55oFuljA4G3Kaq_r1RQ' },
    year: 2022,
    group: 'Personal',
  },
  {
    id: 'li-fi',
    title: 'Li-Fi · Laser Light Comm',
    icon: 'uil uil-lightbulb-alt',
    tagline: 'Transmitted music through a laser beam. V1 music · V2 files · V3 internet over light. Hardware team project.',
    description: 'A team project with Hari Prasath Selvan and Darunika Babu, guided by Dr. G. Singaravel. Transmitted music through a laser beam, audio travels from an audio pin, through a laser, and into speakers on the other end. V1 transmitted music; V2 was planned for file transmission; V3 aimed to share internet connectivity through light. A hardware proof-of-concept in optical wireless communication (Li-Fi).',
    tags: ['IoT', 'Hardware', 'Li-Fi', 'Optics'],
    links: { live: '', github: '', linkedin: 'https://www.linkedin.com/posts/dayanidi-vadivel_lifi-laserproject-curiousminds-activity-7325481981088014337-EIUC?utm_source=share&utm_medium=member_desktop&rcm=ACoAAD2CqksBa8xX7B3v55oFuljA4G3Kaq_r1RQ' },
    year: 2022,
    group: 'College',
  },
  {
    id: 'lat-portal',
    title: 'LAT Portal',
    icon: 'uil uil-book-reader',
    tagline: 'Interactive assessment and training platform for academic evaluation.',
    description: 'Developed an interactive training and assessment platform designed to streamline student evaluation. The system allows educators to securely manage tests, assignments, and curriculum materials, while tracking students\' learning progress over time.',
    tags: ['React', 'Node.js', 'MySQL', 'Web App'],
    links: { live: '', github: 'https://github.com/dayanidigv/LAT' },
    year: 2022,
    group: 'Personal',
  },
  {
    id: 'arduino-safety-room',
    title: 'Arduino Room Safety & Automation',
    icon: 'uil uil-circuit',
    tagline: 'Developed an integrated room safety system with visitor counter, light control, and security features.',
    description: 'Designed and built an Arduino-based room automation and safety system. The project features an automated visitor counter, infrared motion-activated lighting controls, and safety sensors for security monitoring.',
    tags: ['IoT', 'Arduino', 'Sensors', 'Automation', 'Security'],
    links: { live: '', github: '' },
    year: 2022,
    group: 'Personal',
  },
  {
    id: 'indian-biomedical-forum',
    title: 'Indian Biomedical Forum',
    icon: 'uil uil-heart-medical',
    tagline: 'Developed a professional community and knowledge-sharing web portal for biomedical engineers.',
    description: 'Designed and developed a community website for the Indian Biomedical Forum, providing a repository of resource materials, training modules, and networking tools for students and professionals in the biomedical sector.',
    tags: ['HTML', 'CSS', 'JavaScript', 'Community'],
    links: { live: '', github: '' },
    year: 2022,
    group: 'Innak',
  },
];
