// ============================================================
// My Hobby Hub — Workfolio style
// Renders content from hobbies.json
// Hash routing:
//   #home            -> hero + hobbies + stats + about
//   #hobbies         -> hobbies section
//   #stats           -> stats section
//   #about           -> about section
//   #hobby/<id>      -> detail page for one hobby
// Extras: 3D hero scene (Three.js), typing effect,
//         scroll reveals, counters, marquee, card tilt,
//         back-to-top, preloader
// ============================================================

const app = document.getElementById("app");
let hobbies = [];

// Gradient border variants cycled across cards (like the reference folio)
const GRADIENTS = ["g-yellow", "g-redish", "g-blue", "g-orange"];

const TYPED_PHRASES = [
  "learning languages one phrase at a time.",
  "building small things that live on the internet.",
  "chasing good light with a camera.",
  "making lo-fi beats on quiet nights.",
  "reading way too much sci-fi.",
  "staring at stars and wondering."
];

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
  const totalItems = hobbies.reduce((n, h) => n + (h.items || []).length, 0);

  const cards = hobbies
    .map(
      (h, i) => `
      <article class="first-childern ${GRADIENTS[i % GRADIENTS.length]} reveal"
               style="--reveal-delay:${(i % 4) * 0.12}s"
               data-tilt
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

  const marqueeItems = hobbies
    .map((h) => `<span>${escapeHtml(h.icon || "✨")} <b>${escapeHtml(h.name)}</b></span>`)
    .join("");

  app.innerHTML = `
    <!-- ===== Hero with 3D scene ===== -->
    <section class="hero" id="home">
      <canvas id="heroCanvas"></canvas>
      <div class="hero-container">
        <p class="hero-text">Introducing My</p>
        <h1 class="hero-heading">HOBBY <span class="gradient-title1">FOLIO</span></h1>
        <p class="hero-sub"><span id="typedText"></span><span class="type-caret"></span></p>
        <button class="transparent-btn" onclick="document.getElementById('hobbies').scrollIntoView({behavior:'smooth'})">
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
        <p class="section-kicker">Recent Works</p>
        <h2 class="section-title">Things I Love Doing</h2>
        <p class="section-sub">Highlights the hobbies I'm currently pursuing — each one has its own page with sub-topics and progress notes.</p>
      </div>
      <div class="hobby-grid">
        ${cards || `<div class="empty-note">No hobbies yet — add some in <code>hobbies.json</code>.</div>`}
      </div>
    </section>

    <!-- ===== Stats ===== -->
    <section class="stats-section" id="stats">
      <div class="section-head reveal" style="padding-top:0;">
        <p class="section-kicker">By The Numbers</p>
        <h2 class="section-title">A Quick Snapshot</h2>
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
      </div>
    </section>

    <!-- ===== About ===== -->
    <section class="about-section" id="about">
      <div class="section-head reveal" style="padding-top:0;">
        <p class="section-kicker">Introducing Me</p>
        <h2 class="section-title">About This Site</h2>
      </div>
      <div class="boxs reveal">
        <ul>
          <li class="aboutli">This is my personal hobby hub, styled as a dark workfolio with an interactive 3D hero — hosted on GitHub Pages.</li>
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
}

function setActiveNav(id) {
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.toggle("active", link.dataset.nav === id);
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
    // easeOutExpo for a smooth landing
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
        setTimeout(tick, 2200); // pause at full phrase
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
      drag.velX += (0.004 - drag.velX) * 0.02; // ease back to base speed
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

// ---------- Preloader ----------
function hidePreloader() {
  const preloader = document.getElementById("preloader");
  if (!preloader) return;
  setTimeout(() => preloader.classList.add("hidden"), 600);
}

// ---------- Init ----------
(async function init() {
  await loadHobbies();
  route();
  updateProgress();
  startTyping();
  initHeroScene();
  hidePreloader();
})();

window.addEventListener("hashchange", route);