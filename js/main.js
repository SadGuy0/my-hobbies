// ============================================================
// My Hobby Hub — Workfolio style
// Renders content from hobbies.json
// Hash routing:
//   #home            -> hero + hobbies + stats + quotes + about
//   #hobbies         -> hobbies section
//   #stats           -> stats section
//   #about           -> about section
//   #hobby/<id>      -> detail page for one hobby
//
// Pro-portfolio features:
//   - Preloader with % counter
//   - Interactive 3D hero scene (Three.js)
//   - Typing effect, text scramble headings
//   - Scroll reveals, animated counters, marquee
//   - 3D card tilt, magnetic buttons
//   - Hobby category filtering
//   - Quotes carousel (auto-rotating)
//   - Scrollspy nav highlighting
//   - Dark/light theme toggle (persisted)
//   - Copy-email toast, live local clock
//   - Back-to-top, custom cursor
//   - Konami code party mode easter egg
// ============================================================

const app = document.getElementById("app");
let hobbies = [];

const GRADIENTS = ["g-yellow", "g-redish", "g-blue", "g-orange"];
const CATEGORY_LABELS = {
  all: "All",
  tech: "Tech",
  creative: "Creative",
  active: "Active",
  mind: "Mind",
};

const TYPED_PHRASES = [
  "learning languages one phrase at a time.",
  "building small things that live on the internet.",
  "chasing good light with a camera.",
  "making lo-fi beats on quiet nights.",
  "reading way too much sci-fi.",
  "staring at stars and wondering."
];

const QUOTES = [
  { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { text: "Creativity is intelligence having fun.", author: "Albert Einstein" },
  { text: "We are what we repeatedly do. Excellence, then, is not an act but a habit.", author: "Aristotle" },
  { text: "The best way to predict the future is to create it.", author: "Peter Drucker" },
  { text: "Stay curious. The world rewards those who wonder.", author: "Unknown" },
];

let activeFilter = "all";

// ---------- Data loading ----------
async function loadHobbies() {
  try {
    const res = await fetch("hobbies.json");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    hobbies = await res.json();
  } catch (err) {
    console.error("Failed to load hobbies.json:", err);
    app.innerHTML = `
      <div class="empty-note" style="margin-top:120px;">
        ⚠️ Could not load <code>hobbies.json</code>.
      </div>`;
  }
}

// ---------- Helpers ----------
function getHobby(id) {
  return hobbies.find((h) => h.id === id);
}

const ESCAPE_MAP = {
  "&": "\u0026#38;",
  "<": "\u0026#60;",
  ">": "\u0026#62;",
  '"': "\u0026#34;",
  "'": "\u0026#39;",
};

function escapeHtml(str = "") {
  return String(str).replace(/[&<>"']/g, (c) => ESCAPE_MAP[c]);
}

function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove("show"), 2400);
}

// ---------- Views ----------
function renderHome() {
  const totalItems = hobbies.reduce((n, h) => n + (h.items || []).length, 0);

  const cards = hobbies
    .map(
      (h, i) => `
      <article class="first-childern ${GRADIENTS[i % GRADIENTS.length]} reveal"
               style="--reveal-delay:${(i % 4) * 0.12}s"
               data-tilt data-category="${escapeHtml(h.category || "all")}"
               onclick="location.hash='hobby/${escapeHtml(h.id)}'">
        <div class="card-body">
          <span class="card-icon">${escapeHtml(h.icon || "✨")}</span>
          <h3 class="card-title">${escapeHtml(h.name)}</h3>
          <p class="card-text">${escapeHtml(h.description || "")}</p>
          <span class="card-count">${escapeHtml(CATEGORY_LABELS[h.category] || "Fun")} &middot; ${(h.items || []).length} item${
            (h.items || []).length === 1 ? "" : "s"
          }</span>
        </div>
      </article>`
    )
    .join("");

  const filterChips = Object.entries(CATEGORY_LABELS)
    .map(
      ([key, label]) =>
        `<button class="filter-chip ${key === activeFilter ? "active" : ""}" data-filter="${key}">${label}</button>`
    )
    .join("");

  const marqueeItems = hobbies
    .map((h) => `<span>${escapeHtml(h.icon || "✨")} <b>${escapeHtml(h.name)}</b></span>`)
    .join("");

  const quoteDots = QUOTES.map(
    (_, i) => `<button class="quote-dot ${i === 0 ? "active" : ""}" data-quote="${i}" aria-label="Quote ${i + 1}"></button>`
  ).join("");

  app.innerHTML = `
    <!-- ===== Hero with 3D scene ===== -->
    <section class="hero" id="home">
      <canvas id="heroCanvas"></canvas>
      <div class="hero-container">
        <div class="availability-badge"><span class="pulse-dot"></span> Available for new hobbies</div>
        <p class="hero-text">Introducing My</p>
        <h1 class="hero-heading" id="heroHeading">HOBBY <span class="gradient-title1">FOLIO</span></h1>
        <p class="hero-sub"><span id="typedText"></span><span class="type-caret"></span></p>
        <button class="transparent-btn magnetic" onclick="document.getElementById('hobbies').scrollIntoView({behavior:'smooth'})">
          Explore Hobbies ↓
        </button>
      </div>
    </section>

    <!-- ===== Marquee strip ===== -->
    <div class="marquee" aria-hidden="true">
      <div class="marquee-track">
        ${marqueeItems}
        ${marqueeItems}
      </div>
    </div>

    <!-- ===== Hobbies ===== -->
    <section id="hobbies">
      <div class="section-head reveal">
        <p class="section-kicker"><span class="sec-num">01.</span>Recent Works</p>
        <h2 class="section-title" data-scramble>Things I Love Doing</h2>
        <p class="section-sub">Highlights the hobbies I'm currently pursuing — filter them by vibe, or open one for sub-topics and progress notes.</p>
      </div>
      <div class="filter-bar reveal">${filterChips}</div>
      <div class="hobby-grid" id="hobbyGrid">
        ${cards || `<div class="empty-note">No hobbies yet — add some in <code>hobbies.json</code>.</div>`}
      </div>
    </section>

    <!-- ===== Stats ===== -->
    <section class="stats-section" id="stats">
      <div class="section-head reveal" style="padding-top:0;">
        <p class="section-kicker"><span class="sec-num">02.</span>By The Numbers</p>
        <h2 class="section-title" data-scramble>A Quick Snapshot</h2>
      </div>
      <div class="stats-grid">
        <div class="stat-box reveal" style="--reveal-delay:0s">
          <div class="stat-number" data-count="${hobbies.length}">0</div>
          <div class="stat-label">Hobbies</div>
        </div>
        <div class="stat-box reveal" style="--reveal-delay:0.1s">
          <div class="stat-number" data-count="${totalItems}">0</div>
          <div class="stat-label">Sub-topics</div>
        </div>
        <div class="stat-box reveal" style="--reveal-delay:0.2s">
          <div class="stat-number" data-count="365">0</div>
          <div class="stat-label">Days a year</div>
        </div>
        <div class="stat-box reveal" style="--reveal-delay:0.3s">
          <div class="stat-number" data-count="100">0</div>
          <div class="stat-label">% Curious</div>
        </div>
        <div class="stat-box reveal" style="--reveal-delay:0.4s">
          <div class="stat-number" id="ghRepos" data-count="0">0</div>
          <div class="stat-label">GitHub Repos</div>
        </div>
      </div>
    </section>

    <!-- ===== Quotes ===== -->
    <section class="quotes-section" id="quotes">
      <div class="quote-box reveal">
        <p class="quote-text" id="quoteText">"${QUOTES[0].text}"</p>
        <p class="quote-author" id="quoteAuthor">— ${QUOTES[0].author}</p>
        <div class="quote-dots">${quoteDots}</div>
      </div>
    </section>

    <!-- ===== About ===== -->
    <section class="about-section" id="about">
      <div class="section-head reveal" style="padding-top:0;">
        <p class="section-kicker"><span class="sec-num">03.</span>Introducing Me</p>
        <h2 class="section-title" data-scramble>About This Site</h2>
      </div>
      <div class="boxs reveal">
        <ul>
          <li class="aboutli">This is my personal hobby hub, styled as a dark workfolio with an interactive 3D hero — hosted on GitHub Pages.</li>
          <li class="aboutli">Each hobby has its own page with sub-topics and progress notes.</li>
          <li class="aboutli edu-li">New hobbies can be added anytime by editing hobbies.json — the site updates automatically.</li>
        </ul>
      </div>
      <div class="tech-tags reveal">
        <span class="tech-tag">HTML5</span>
        <span class="tech-tag">CSS3</span>
        <span class="tech-tag">JavaScript</span>
        <span class="tech-tag">Three.js</span>
        <span class="tech-tag">WebGL</span>
        <span class="tech-tag">JSON</span>
        <span class="tech-tag">Git</span>
        <span class="tech-tag">GitHub Pages</span>
        <span class="tech-tag">Intersection Observer</span>
        <span class="tech-tag">Canvas API</span>
      </div>
      <div class="journey reveal">
        <div class="journey-item">
          <p class="journey-year">Phase 01</p>
          <p class="journey-title">Curiosity sparked</p>
          <p class="journey-desc">Started tinkering with HTML pages and wondered how the web worked.</p>
        </div>
        <div class="journey-item">
          <p class="journey-year">Phase 02</p>
          <p class="journey-title">First real projects</p>
          <p class="journey-desc">Built small tools and sites, learned CSS deeply, fell for JavaScript.</p>
        </div>
        <div class="journey-item">
          <p class="journey-year">Phase 03</p>
          <p class="journey-title">3D & motion</p>
          <p class="journey-desc">Discovered Three.js and animation — this workfolio is the result.</p>
        </div>
        <div class="journey-item">
          <p class="journey-year">Now</p>
          <p class="journey-title">Always learning</p>
          <p class="journey-desc">12 hobbies and counting — the collection keeps growing.</p>
        </div>
      </div>
    </section>`;
}

function renderHobbyDetail(id) {
  const hobby = getHobby(id);

  if (!hobby) {
    app.innerHTML = `
      <a href="#home" class="back-link">&larr; Back to all hobbies</a>
      <div class="empty-note">Hobby not found.</div>`;
    return;
  }

  const items = (hobby.items || [])
    .map(
      (it, i) => `
      <div class="accordion-items exp-links reveal" style="--reveal-delay:${i * 0.08}s">
        <h3>${escapeHtml(it.title)}</h3>
        <p>${escapeHtml(it.notes || "")}</p>
      </div>`
    )
    .join("");

  app.innerHTML = `
    <a href="#home" class="back-link">&larr; Back to all hobbies</a>

    <div class="detail-header">
      <span class="icon">${escapeHtml(hobby.icon || "✨")}</span>
      <h1>${escapeHtml(hobby.name)}</h1>
    </div>
    <p class="detail-desc">${escapeHtml(hobby.description || "")}</p>

    <h2 class="subsection-title">What's Inside</h2>
    <div class="item-list">
      ${items || `<div class="empty-note">Nothing added here yet — sub-items go in this hobby's "items" array in <code>hobbies.json</code>.</div>`}
    </div>`;
}

// ---------- Page transition overlay ----------
function playPageTransition() {
  const overlay = document.getElementById("pageTransition");
  if (!overlay) return;
  overlay.classList.add("covering");
  setTimeout(() => overlay.classList.remove("covering"), 550);
}

// ---------- Router ----------
function route(withTransition = false) {
  const hash = location.hash.replace(/^#/, "");
  if (withTransition) playPageTransition();

  if (hash.startsWith("hobby/")) {
    renderHobbyDetail(decodeURIComponent(hash.slice("hobby/".length)));
    setActiveNav("");
  } else if (hash === "about") {
    renderHome();
    requestAnimationFrame(() =>
      document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })
    );
    setActiveNav("about");
  } else if (hash === "hobbies") {
    renderHome();
    requestAnimationFrame(() =>
      document.getElementById("hobbies")?.scrollIntoView({ behavior: "smooth" })
    );
    setActiveNav("hobbies");
  } else if (hash === "stats") {
    renderHome();
    requestAnimationFrame(() =>
      document.getElementById("stats")?.scrollIntoView({ behavior: "smooth" })
    );
    setActiveNav("stats");
  } else {
    renderHome();
    window.scrollTo({ top: 0 });
    setActiveNav("home");
  }

  initReveals();
  initCounters();
  initTilt();
  initFilters();
  initScramble();
  initMagnetic();
  startQuotes();
  initLetterWave();
}

function setActiveNav(id) {
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.toggle("active", link.dataset.nav === id);
  });
  document.querySelectorAll(".side-dot").forEach((dot) => {
    dot.classList.toggle("active", dot.dataset.section === id);
  });
}

// ---------- Side dot section indicator ----------
function initSideDots() {
  const container = document.getElementById("sideDots");
  if (!container) return;
  const sections = ["home", "hobbies", "stats", "about"];
  container.innerHTML = sections
    .map((id) => `<button class="side-dot" data-section="${id}" aria-label="Go to ${id}"></button>`)
    .join("");
  container.querySelectorAll(".side-dot").forEach((dot) => {
    dot.addEventListener("click", () => {
      document.getElementById(dot.dataset.section)?.scrollIntoView({ behavior: "smooth" });
    });
  });
}

// ---------- Keyboard shortcuts ----------
function initKeyboardShortcuts() {
  document.addEventListener("keydown", (e) => {
    if (e.target.matches("input, textarea")) return;
    const key = e.key.toLowerCase();
    if (key === "t") {
      document.getElementById("themeToggle")?.click();
    } else if (key === "h") {
      location.hash = "#home";
    } else if (e.key === "Escape" && location.hash.startsWith("#hobby/")) {
      location.hash = "#home";
    }
  });
}

// ---------- Letter wave on hero heading ----------
function initLetterWave() {
  const heading = document.getElementById("heroHeading");
  if (!heading || heading.dataset.waveBound) return;
  heading.dataset.waveBound = "1";

  function splitLetters(node) {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === 3 && child.textContent.trim()) {
        const frag = document.createDocumentFragment();
        [...child.textContent].forEach((ch, i) => {
          const span = document.createElement("span");
          span.className = "wave-letter";
          span.style.setProperty("--i", i);
          span.textContent = ch;
          frag.appendChild(span);
        });
        node.replaceChild(frag, child);
      } else if (child.nodeType === 1) {
        splitLetters(child);
      }
    });
  }
  splitLetters(heading);
}

// ---------- Live GitHub stats (public API) ----------
async function fetchGitHubStats() {
  try {
    const res = await fetch("https://api.github.com/users/SadGuy0");
    if (!res.ok) return;
    const data = await res.json();
    const el = document.getElementById("ghRepos");
    if (el && data.public_repos != null) {
      el.dataset.count = data.public_repos;
      animateCounter(el);
    }
  } catch {
    /* offline — keep the placeholder */
  }
}

// ---------- Scrollspy (nav follows scroll position) ----------
function initScrollSpy() {
  const sections = ["home", "hobbies", "stats", "about"];
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.25) {
          setActiveNav(entry.target.id);
        }
      });
    },
    { threshold: [0.25, 0.5] }
  );
  sections.forEach((id) => {
    const el = document.getElementById(id);
    if (el) spy.observe(el);
  });
}

// ---------- Scroll reveals ----------
let revealObserver;
function initReveals() {
  if (revealObserver) revealObserver.disconnect();
  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));
}

// ---------- Animated counters ----------
function animateCounter(el) {
  const target = parseInt(el.dataset.count, 10) || 0;
  const duration = 1600;
  const start = performance.now();

  function tick(now) {
    const p = Math.min((now - start) / duration, 1);
    const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
    el.textContent = Math.round(target * eased);
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

function initCounters() {
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );
  document.querySelectorAll(".stat-number").forEach((el) => counterObserver.observe(el));
}

// ---------- Text scramble effect ----------
function scrambleText(el) {
  if (el.dataset.scrambled) return;
  el.dataset.scrambled = "1";
  const original = el.textContent;
  const chars = "!<>-_\\/[]{}—=+*^?#________";
  let frame = 0;
  const queue = original.split("").map((ch, i) => ({
    from: ch,
    to: ch,
    start: Math.floor(Math.random() * 20),
    end: Math.floor(Math.random() * 20) + 20,
  }));

  function update() {
    let output = "";
    let done = 0;
    queue.forEach((q) => {
      if (frame >= q.end) {
        output += q.to;
        done++;
      } else if (frame >= q.start) {
        output += chars[Math.floor(Math.random() * chars.length)];
      } else {
        output += q.from;
      }
    });
    el.textContent = output;
    if (done < queue.length) {
      frame++;
      requestAnimationFrame(update);
    } else {
      el.textContent = original;
    }
  }
  update();
}

function initScramble() {
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          scrambleText(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );
  document.querySelectorAll("[data-scramble]").forEach((el) => obs.observe(el));
}

// ---------- Category filtering ----------
function applyFilter(filter) {
  activeFilter = filter;
  document.querySelectorAll(".filter-chip").forEach((chip) => {
    chip.classList.toggle("active", chip.dataset.filter === filter);
  });
  document.querySelectorAll("#hobbyGrid .first-childern").forEach((card) => {
    const match = filter === "all" || card.dataset.category === filter;
    card.classList.toggle("filter-hide", !match);
    card.classList.remove("filter-pop");
    if (match) {
      void card.offsetWidth; // restart animation
      card.classList.add("filter-pop");
    }
  });
}

function initFilters() {
  document.querySelectorAll(".filter-chip").forEach((chip) => {
    chip.addEventListener("click", () => applyFilter(chip.dataset.filter));
  });
}

// ---------- Quotes carousel ----------
let quoteIndex = 0;
let quoteTimer;

function showQuote(i) {
  const textEl = document.getElementById("quoteText");
  const authorEl = document.getElementById("quoteAuthor");
  if (!textEl || !authorEl) return;
  quoteIndex = i % QUOTES.length;

  textEl.classList.add("fading");
  authorEl.classList.add("fading");

  setTimeout(() => {
    textEl.textContent = `"${QUOTES[quoteIndex].text}"`;
    authorEl.textContent = `— ${QUOTES[quoteIndex].author}`;
    textEl.classList.remove("fading");
    authorEl.classList.remove("fading");
  }, 500);

  document.querySelectorAll(".quote-dot").forEach((d, di) => {
    d.classList.toggle("active", di === quoteIndex);
  });
}

function startQuotes() {
  clearInterval(quoteTimer);
  quoteTimer = setInterval(() => showQuote(quoteIndex + 1), 6000);
  document.querySelectorAll(".quote-dot").forEach((dot) => {
    dot.addEventListener("click", () => {
      clearInterval(quoteTimer);
      showQuote(parseInt(dot.dataset.quote, 10));
      startQuotes();
    });
  });
}

// ---------- Magnetic buttons ----------
function initMagnetic() {
  document.querySelectorAll(".magnetic").forEach((el) => {
    if (el.dataset.magneticBound) return;
    el.dataset.magneticBound = "1";

    el.addEventListener("mousemove", (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
    });

    el.addEventListener("mouseleave", () => {
      el.style.transform = "";
    });
  });
}

// ---------- 3D card tilt ----------
function initTilt() {
  document.querySelectorAll("[data-tilt]").forEach((card) => {
    if (card.dataset.tiltBound) return;
    card.dataset.tiltBound = "1";

    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform =
        `perspective(900px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-6px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
}

// ---------- Typing effect ----------
function startTyping() {
  const el = document.getElementById("typedText");
  if (!el) return;

  let phraseIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function tick() {
    const phrase = TYPED_PHRASES[phraseIndex];

    if (!deleting) {
      charIndex++;
      el.textContent = phrase.slice(0, charIndex);
      if (charIndex === phrase.length) {
        deleting = true;
        setTimeout(tick, 2200);
        return;
      }
      setTimeout(tick, 45 + Math.random() * 55);
    } else {
      charIndex--;
      el.textContent = phrase.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % TYPED_PHRASES.length;
        setTimeout(tick, 400);
        return;
      }
      setTimeout(tick, 24);
    }
  }
  tick();
}

// ---------- Theme toggle (persisted) ----------
function initTheme() {
  const saved = localStorage.getItem("theme");
  if (saved) setTheme(saved);

  document.getElementById("themeToggle")?.addEventListener("click", () => {
    const current = document.documentElement.dataset.theme || "dark";
    const next = current === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
    showToast(next === "light" ? "☀️ Light mode on" : "🌙 Dark mode on");
  });
}

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const toggle = document.getElementById("themeToggle");
  if (toggle) toggle.textContent = theme === "light" ? "☀️" : "🌙";
}

// ---------- Copy email ----------
function initCopyEmail() {
  document.getElementById("copyEmail")?.addEventListener("click", async () => {
    const email = "sadguy0@github.io";
    try {
      await navigator.clipboard.writeText(email);
      showToast("📧 Email copied to clipboard!");
    } catch {
      showToast(`📧 ${email}`);
    }
  });
}

// ---------- Live local clock ----------
function startClock() {
  const el = document.getElementById("localTime");
  if (!el) return;
  function tick() {
    const now = new Date();
    el.textContent =
      "LOCAL TIME · " +
      now.toLocaleTimeString("en-IN", { hour12: false }) +
      " IST";
  }
  tick();
  setInterval(tick, 1000);
}

// ---------- Konami code party mode ----------
function initKonami() {
  const sequence = [
    "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
    "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
    "b", "a",
  ];
  let pos = 0;

  document.addEventListener("keydown", (e) => {
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    if (key === sequence[pos]) {
      pos++;
      if (pos === sequence.length) {
        pos = 0;
        startParty();
      }
    } else {
      pos = key === sequence[0] ? 1 : 0;
    }
  });
}

function startParty() {
  showToast("🎉 PARTY MODE! 🎉");
  document.body.classList.add("party");
  const emojis = ["🎉", "🎊", "✨", "🥳", "⭐", "💫", "🎈", "🔥"];
  let bursts = 0;
  const interval = setInterval(() => {
    for (let i = 0; i < 8; i++) {
      const emoji = document.createElement("span");
      emoji.className = "party-emoji";
      emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      emoji.style.left = `${Math.random() * 100}vw`;
      emoji.style.animationDuration = `${2 + Math.random() * 2}s`;
      document.body.appendChild(emoji);
      setTimeout(() => emoji.remove(), 4200);
    }
    if (++bursts >= 6) {
      clearInterval(interval);
      setTimeout(() => document.body.classList.remove("party"), 2000);
    }
  }, 350);
}

// ---------- Preloader with % counter ----------
function runPreloader() {
  const preloader = document.getElementById("preloader");
  const percentEl = document.getElementById("preloaderPercent");
  if (!preloader || !percentEl) return;

  let progress = 0;
  const interval = setInterval(() => {
    // ease toward 100 with random increments for a natural feel
    progress = Math.min(100, progress + Math.random() * 14 + 4);
    percentEl.textContent = `${Math.floor(progress)}%`;
    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(() => preloader.classList.add("hidden"), 350);
    }
  }, 90);
}

// ---------- Scroll progress bar + back to top ----------
function updateProgress() {
  const bar = document.getElementById("progressBar");
  const btn = document.getElementById("backToTop");
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;

  if (bar) {
    bar.style.width = docHeight > 0 ? `${(scrollTop / docHeight) * 100}%` : "0%";
  }
  if (btn) {
    btn.classList.toggle("show", scrollTop > 500);
  }
}

window.addEventListener("scroll", updateProgress, { passive: true });

document.getElementById("backToTop")?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// ---------- Custom cursor circle ----------
(function initCursor() {
  const circle = document.getElementById("cursorCircle");
  if (!circle) return;
  document.addEventListener("mousemove", (e) => {
    circle.style.left = `${e.clientX}px`;
    circle.style.top = `${e.clientY}px`;
  });
  document.addEventListener("mouseover", (e) => {
    circle.classList.toggle(
      "hovering",
      !!e.target.closest("a, button, .first-childern")
    );
  });
})();

// ============================================================
// 3D HERO SCENE — floating geometric shapes (Three.js)
// Auto-rotates, reacts to mouse movement, drag to spin.
// ============================================================
function initHeroScene() {
  const canvas = document.getElementById("heroCanvas");
  if (!canvas || typeof THREE === "undefined") return;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
  camera.position.set(0, 0, 14);

  // Lights
  scene.add(new THREE.AmbientLight(0xffffff, 0.35));
  const keyLight = new THREE.DirectionalLight(0x82a1fc, 1.2);
  keyLight.position.set(6, 8, 10);
  scene.add(keyLight);
  const rimLight = new THREE.DirectionalLight(0xffb6b6, 0.9);
  rimLight.position.set(-8, -4, -6);
  scene.add(rimLight);

  // Central hero object — wireframe torus knot
  const knotGeometry = new THREE.TorusKnotGeometry(3, 0.85, 220, 28);
  const knotMaterial = new THREE.MeshStandardMaterial({
    color: 0x101528,
    metalness: 0.85,
    roughness: 0.25,
    emissive: 0x0a1030,
  });
  const knot = new THREE.Mesh(knotGeometry, knotMaterial);
  knot.position.x = -2.5;
  scene.add(knot);

  const knotWire = new THREE.Mesh(
    new THREE.TorusKnotGeometry(3.02, 0.86, 110, 14),
    new THREE.MeshBasicMaterial({ color: 0x82a1fc, wireframe: true, transparent: true, opacity: 0.16 })
  );
  knotWire.position.copy(knot.position);
  scene.add(knotWire);

  // Floating satellite shapes
  const satellites = [];
  const shapes = [
    new THREE.IcosahedronGeometry(0.7, 0),
    new THREE.OctahedronGeometry(0.55, 0),
    new THREE.TetrahedronGeometry(0.65, 0),
    new THREE.TorusGeometry(0.5, 0.18, 16, 40),
    new THREE.DodecahedronGeometry(0.5, 0),
    new THREE.ConeGeometry(0.45, 0.9, 4),
    new THREE.SphereGeometry(0.42, 20, 20),
    new THREE.BoxGeometry(0.7, 0.7, 0.7),
  ];
  const palette = [0x82a1fc, 0xffb6b6, 0xbaa539, 0x0071e3, 0x9d6cff];

  shapes.forEach((geo, i) => {
    const mat = new THREE.MeshStandardMaterial({
      color: palette[i % palette.length],
      metalness: 0.7,
      roughness: 0.35,
      wireframe: i % 2 === 1,
      transparent: true,
      opacity: 0.9,
    });
    const mesh = new THREE.Mesh(geo, mat);

    const angle = (i / shapes.length) * Math.PI * 2;
    const radius = 6.5 + Math.random() * 2.5;
    mesh.position.set(
      Math.cos(angle) * radius,
      (Math.random() - 0.5) * 7,
      (Math.random() - 0.5) * 4 - 2
    );

    mesh.userData = {
      baseY: mesh.position.y,
      floatSpeed: 0.4 + Math.random() * 0.6,
      floatPhase: Math.random() * Math.PI * 2,
      rotSpeed: { x: (Math.random() - 0.5) * 0.02, y: (Math.random() - 0.5) * 0.02 },
    };

    scene.add(mesh);
    satellites.push(mesh);
  });

  // Starfield backdrop
  const starGeo = new THREE.BufferGeometry();
  const starCount = 700;
  const starPositions = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i++) {
    starPositions[i * 3] = (Math.random() - 0.5) * 60;
    starPositions[i * 3 + 1] = (Math.random() - 0.5) * 40;
    starPositions[i * 3 + 2] = (Math.random() - 0.5) * 30 - 10;
  }
  starGeo.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
  const stars = new THREE.Points(
    starGeo,
    new THREE.PointsMaterial({ color: 0xffffff, size: 0.06, transparent: true, opacity: 0.7 })
  );
  scene.add(stars);

  // Interaction state
  const mouse = { x: 0, y: 0 };
  const drag = { active: false, lastX: 0, lastY: 0, velX: 0.004, velY: 0 };

  window.addEventListener("mousemove", (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  canvas.addEventListener("pointerdown", (e) => {
    drag.active = true;
    drag.lastX = e.clientX;
    drag.lastY = e.clientY;
    canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener("pointermove", (e) => {
    if (!drag.active) return;
    const dx = e.clientX - drag.lastX;
    const dy = e.clientY - drag.lastY;
    drag.lastX = e.clientX;
    drag.lastY = e.clientY;
    drag.velX = dx * 0.004;
    drag.velY = dy * 0.004;
    knot.rotation.y += drag.velX;
    knot.rotation.x += drag.velY;
    knotWire.rotation.copy(knot.rotation);
  });
  const endDrag = () => { drag.active = false; };
  canvas.addEventListener("pointerup", endDrag);
  canvas.addEventListener("pointercancel", endDrag);

  function resize() {
    const parent = canvas.parentElement;
    const w = parent.clientWidth;
    const h = parent.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener("resize", resize);

  // Pause rendering when hero is off-screen (performance)
  let heroVisible = true;
  const heroEl = canvas.parentElement;
  new IntersectionObserver(
    (entries) => { heroVisible = entries[0].isIntersecting; },
    { threshold: 0 }
  ).observe(heroEl);

  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    if (!heroVisible) return;

    const t = clock.getElapsedTime();

    // Gentle auto-rotation + inertia after dragging
    if (!drag.active) {
      drag.velX += (0.004 - drag.velX) * 0.02;
      knot.rotation.y += drag.velX;
      knot.rotation.x += drag.velY * 0.98;
      drag.velY *= 0.95;
      knotWire.rotation.copy(knot.rotation);
    }

    // Mouse parallax
    camera.position.x += (mouse.x * 1.2 - camera.position.x) * 0.04;
    camera.position.y += (mouse.y * 0.8 - camera.position.y) * 0.04;
    camera.lookAt(-1, 0, 0);

    // Float satellites
    satellites.forEach((m) => {
      m.position.y = m.userData.baseY + Math.sin(t * m.userData.floatSpeed + m.userData.floatPhase) * 0.6;
      m.rotation.x += m.userData.rotSpeed.x;
      m.rotation.y += m.userData.rotSpeed.y;
    });

    stars.rotation.y = t * 0.01;

    renderer.render(scene, camera);
  }
  animate();
}

// ---------- Init ----------
(async function init() {
  await loadHobbies();
  route();
  updateProgress();
  startTyping();
  initHeroScene();
  initTheme();
  initCopyEmail();
  startClock();
  initKonami();
  initScrollSpy();
  initSideDots();
  initKeyboardShortcuts();
  runPreloader();
  fetchGitHubStats();
})();

window.addEventListener("hashchange", () => route(true));
