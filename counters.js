(function () {
  const stats = document.querySelector(".stats");
  if (!stats) return;

  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // find the number text in each stat: "20+", "1+ yr", "15+"
  const items = [...stats.querySelectorAll(".num")].map(el => {
    const node = [...el.childNodes].find(n => n.nodeType === 3 && /\d/.test(n.nodeValue));
    if (!node) return null;
    const m = node.nodeValue.trim().match(/^(\d+)(.*)$/);
    return m ? { node, target: parseInt(m[1], 10), suffix: m[2] } : null;
  }).filter(Boolean);

  const render = (it, v) => { it.node.nodeValue = v + it.suffix + " "; };

  // start at 0 right away so the final number never flashes
  if (!reduce) items.forEach(it => render(it, 0));

  function run() {
    items.forEach((it, i) => {
      const delay = i * 180, dur = 1600;
      setTimeout(() => {
        const t0 = performance.now();
        (function tick(now) {
          const p = Math.min((now - t0) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);      // ease-out
          render(it, Math.round(it.target * eased));
          if (p < 1) requestAnimationFrame(tick);
        })(t0);
      }, delay);
    });
  }

  if (reduce || !("IntersectionObserver" in window)) {
    items.forEach(it => render(it, it.target));
    return;
  }

  const io = new IntersectionObserver(([e]) => {
    if (e.isIntersecting) { run(); io.disconnect(); }
  }, { threshold: 0.4 });
  io.observe(stats);
})();