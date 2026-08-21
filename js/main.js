// ============================================================
// My Hobby Hub — Workfolio style
// Renders content from hobbies.json
// Hash routing:
//   #home            -> hero + hobbies + about
//   #hobbies         -> hobbies section
//   #about           -> about section
//   #hobby/<id>      -> detail page for one hobby
// ============================================================

const app = document.getElementById("app");
let hobbies = [];

// Gradient border variants cycled across cards (like the reference folio)
const GRADIENTS = ["g-yellow", "g-redish", "g-blue", "g-orange"];

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

// ---------- Views ----------
function renderHome() {
  const cards = hobbies
    .map(
      (h, i) => `
      <article class="first-childern ${GRADIENTS[i % GRADIENTS.length]}"
               onclick="location.hash='hobby/${escapeHtml(h.id)}'">
        <div class="card-body">
          <span class="card-icon">${escapeHtml(h.icon || "✨")}</span>
          <h3 class="card-title">${escapeHtml(h.name)}</h3>
          <p class="card-text">${escapeHtml(h.description || "")}</p>
          <span class="card-count">${(h.items || []).length} item${
            (h.items || []).length === 1 ? "" : "s"
          }</span>
        </div>
      </article>`
    )
    .join("");

  app.innerHTML = `
    <!-- ===== Hero ===== -->
    <section class="hero" id="home">
      <div class="hero-container">
        <p class="hero-text">Introducing My</p>
        <h1 class="hero-heading">HOBBY <span class="gradient-title1">FOLIO</span></h1>
        <p class="hero-sub">
          A dark, curated collection of things I love doing —
          explore each hobby to see what I'm working on.
        </p>
        <button class="transparent-btn" onclick="document.getElementById('hobbies').scrollIntoView({behavior:'smooth'})">
          Explore Hobbies ↓
        </button>
      </div>
    </section>

    <!-- ===== Hobbies ===== -->
    <section id="hobbies">
      <div class="section-head">
        <p class="section-kicker">Recent Works</p>
        <h2 class="section-title">Things I Love Doing</h2>
        <p class="section-sub">Highlights the hobbies I'm currently pursuing — each one has its own page with sub-topics and progress notes.</p>
      </div>
      <div class="hobby-grid">
        ${cards || `<div class="empty-note">No hobbies yet — add some in <code>hobbies.json</code>.</div>`}
      </div>
    </section>

    <!-- ===== About ===== -->
    <section class="about-section" id="about">
      <div class="section-head" style="padding-top:0;">
        <p class="section-kicker">Introducing Me</p>
        <h2 class="section-title">About This Site</h2>
      </div>
      <div class="boxs">
        <ul>
          <li class="aboutli">This is my personal hobby hub, styled as a dark workfolio and hosted on GitHub Pages.</li>
          <li class="aboutli">Each hobby has its own page with sub-topics and progress notes.</li>
          <li class="aboutli edu-li">New hobbies can be added anytime by editing hobbies.json — the site updates automatically.</li>
        </ul>
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
      (it) => `
      <div class="accordion-items exp-links">
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

// ---------- Router ----------
function route() {
  const hash = location.hash.replace(/^#/, "");

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
  } else {
    renderHome();
    window.scrollTo({ top: 0 });
    setActiveNav("home");
  }
}

function setActiveNav(id) {
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.toggle("active", link.dataset.nav === id);
  });
}

// ---------- Scroll progress bar ----------
function updateProgress() {
  const bar = document.getElementById("progressBar");
  if (!bar) return;
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  bar.style.width = docHeight > 0 ? `${(scrollTop / docHeight) * 100}%` : "0%";
}

window.addEventListener("scroll", updateProgress, { passive: true });

// ---------- Custom cursor circle ----------
(function initCursor() {
  const circle = document.getElementById("cursorCircle");
  if (!circle) return;
  document.addEventListener("mousemove", (e) => {
    circle.style.left = `${e.clientX}px`;
    circle.style.top = `${e.clientY}px`;
  });
  document.addEventListener("mouseover", (e) => {
    circle.classList.toggle("hovering", !!e.target.closest("a, button, .first-childern"));
  });
})();

// ---------- Init ----------
(async function init() {
  await loadHobbies();
  route();
  updateProgress();
})();

window.addEventListener("hashchange", route);