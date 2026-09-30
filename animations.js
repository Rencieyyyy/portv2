(function () {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // sidebar link stagger
  document.querySelectorAll(".sidebar nav a").forEach((a, i) => a.style.setProperty("--i", i));

  // scroll progress bar
  const bar = document.createElement("div");
  bar.className = "scroll-progress";
  document.body.appendChild(bar);
  let ticking = false;
  function updateBar() {
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = "scaleX(" + (max > 0 ? scrollY / max : 0) + ")";
    ticking = false;
  }
  addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(updateBar); } }, { passive: true });
  updateBar();

  // count-up for stats ("20+", "1+ yr", "15+")
  function countUp(numEl) {
    const node = Array.from(numEl.childNodes).find(n => n.nodeType === 3 && /\d/.test(n.nodeValue));
    if (!node) return;
    const m = node.nodeValue.trim().match(/^(\d+)(.*)$/);
    if (!m) return;
    const target = parseInt(m[1], 10), suffix = m[2], t0 = performance.now(), dur = 1400;
    (function tick(now) {
      const p = Math.min((now - t0) / dur, 1), eased = 1 - Math.pow(1 - p, 3);
      node.nodeValue = Math.round(target * eased) + suffix + " ";
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
  }

  // scroll reveal
  const targets = [
    ".section-head", ".about-body p", ".stats", ".projects-carousel-container",
    ".exp-row", ".stack-marquee", ".rec-card", ".contrib-count"
  ];
  const items = [];
  targets.forEach(sel => document.querySelectorAll(sel).forEach(el => {
    el.classList.add("reveal");
    const idx = Array.from(el.parentNode.children).indexOf(el);
    el.style.setProperty("--d", Math.min(idx, 6) * 0.08 + "s");
    items.push(el);
  }));
  const grid = document.getElementById("ghGrid");
  if (grid) { grid.classList.add("reveal-wipe"); items.push(grid); }

  function show(el) {
    el.classList.add("in");
   
  }

  if (reduce || !("IntersectionObserver" in window)) {
    items.forEach(el => el.classList.add("in"));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { show(e.target); io.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  items.forEach(el => io.observe(el));
})();
const targets = [
  ".section-head", ".about-body p", ".stats", ".projects-carousel-container",
  ".exp-row", ".stack-marquee", ".rec-card", ".contrib-count",
  ".gear-card"                                   // add
];