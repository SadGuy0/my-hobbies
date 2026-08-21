// ============================================================
// My Hobbies — renders content from hobbies.json
// Hash routing:
//   #home            -> home page (list of hobbies)
//   #about           -> about section
//   #hobby/<id>      -> detail page for one hobby
// ============================================================

const app = document.getElementById("app");
let hobbies = [];

// ---------- Data loading ----------
async function loadHobbies() {
  try {
    const res = await fetch("hobbies.json");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    hobbies = await res.json();
  } catch (err) {
    console.error("Failed to load hobbies.json:", err);
    app.innerHTML = `
      <div class="empty-note" style="margin-top:60px;">
        ⚠️ Could not load <code>hobbies.json</code>.<br>
        If you opened this file directly (file://), please serve it with a local server,
        e.g. <code>python -m http.server</code>.
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
      (h) => `
      <article class="hobby-card" onclick="location.hash='hobby/${escapeHtml(h.id)}'">
        <span class="icon">${escapeHtml(h.icon || "✨")}</span>
        <h3>${escapeHtml(h.name)}</h3>
        <p>${escapeHtml(h.description || "")}</p>
        <span class="count">${(h.items || []).length} item${
          (h.items || []).length === 1 ? "" : "s"
        }</span>
      </article>`
    )
    .join("");

  app.innerHTML = `
    <section class="hero">
      <h1>Welcome to My Hobby Hub 🎉</h1>
      <p>A collection of things I love doing — explore each hobby below to see what I'm working on.</p>
    </section>

    <section class="hobby-grid">
      ${cards || `<div class="empty-note">No hobbies yet — add some in <code>hobbies.json</code>.</div>`}
    </section>

    <section class="about-section" id="about">
      <h2>About This Site</h2>
      <p>
        This is my personal hobby hub hosted on GitHub Pages. Each hobby has its own page
        with sub-topics and progress notes. New hobbies can be added anytime by editing
        <code>hobbies.json</code>.
      </p>
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
      <div class="item">
        <h4>${escapeHtml(it.title)}</h4>
        ${it.notes ? `<p>${escapeHtml(it.notes)}</p>` : ""}
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

    <h2 class="subsection-title">What's inside</h2>
    <div class="item-list">
      ${items || `<div class="empty-note">Nothing added here yet — sub-items go in this hobby's "items" array in <code>hobbies.json</code>.</div>`}
    </div>`;
}

// ---------- Router ----------
function route() {
  const hash = location.hash.replace(/^#/, "");

  if (hash.startsWith("hobby/")) {
    renderHobbyDetail(decodeURIComponent(hash.slice("hobby/".length)));
  } else if (hash === "about") {
    renderHome();
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  } else {
    renderHome();
    window.scrollTo({ top: 0 });
  }
}

window.addEventListener("hashchange", route);

// ---------- Init ----------
(async function init() {
  await loadHobbies();
  route();
})();