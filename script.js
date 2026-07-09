// Alt+K focuses the "ask anything" button (like reference site shortcut)
const askBtn = document.querySelector('.ask-btn');
document.addEventListener('keydown', (e)=>{
  if(e.altKey && e.key.toLowerCase()==='k'){
    e.preventDefault();
    askBtn.focus();
    askBtn.style.borderColor = '#111';
    setTimeout(()=> askBtn.style.borderColor = '', 600);
  }
});

// gentle live "people viewing now" fluctuation
const viewerEl = document.getElementById('viewerCount');
setInterval(()=>{
  let n = parseInt(viewerEl.textContent,10);
  n += (Math.random() > 0.5 ? 1 : -1);
  n = Math.max(40, Math.min(99, n));
  viewerEl.textContent = n;
}, 4000);

// generate a simple decorative contribution-style grid
const grid = document.getElementById('ghGrid');
const levels = ['l1','l2','l3','l4'];
for(let i=0;i<52*7;i++){
  const s = document.createElement('span');
  if(Math.random() > 0.45){
    s.className = levels[Math.floor(Math.random()*levels.length)];
  }
  grid.appendChild(s);
}

// halftone-dot placeholder rendering inside the avatar box,
// mimicking the dithered photo treatment from the reference design.
// Once a real photo is dropped in (data-src on .avatar), this renders it as dots.
function renderHalftone(container){
  const src = container.getAttribute('data-src');
  if(!src) return; // no photo yet, leave the placeholder text
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = ()=>{
    const canvas = document.createElement('canvas');
    const size = 280;
    canvas.width = size; canvas.height = size;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img,0,0,size,size);
    const data = ctx.getImageData(0,0,size,size).data;
    ctx.fillStyle = '#fff'; ctx.fillRect(0,0,size,size);
    ctx.fillStyle = '#111';
    const step = 4;
    for(let y=0;y<size;y+=step){
      for(let x=0;x<size;x+=step){
        const i = (y*size+x)*4;
        const lum = (data[i]+data[i+1]+data[i+2])/3;
        const r = (1 - lum/255) * (step/2);
        if(r > 0.3){
          ctx.beginPath();
          ctx.arc(x+step/2, y+step/2, r, 0, Math.PI*2);
          ctx.fill();
        }
      }
    }
    container.innerHTML = '';
    container.appendChild(canvas);
    canvas.style.width = '100%';
    canvas.style.height = '100%';
  };
  img.src = src;
}
document.querySelectorAll('.avatar[data-src]').forEach(renderHalftone);

document.addEventListener("DOMContentLoaded", function() {
  const cards = document.querySelectorAll(".project-3d-card");

  cards.forEach(card => {
    card.addEventListener("click", function() {
      const currentIndex = parseInt(this.getAttribute("data-index"));
      if (currentIndex === 1) return; // front card, nothing to do

      // right background card clicked -> bring it to front
      if (currentIndex === 2) shiftCarousel(-1);
      // left background card clicked -> bring it to front
      else if (currentIndex === 0) shiftCarousel(1);
    });
  });

  function shiftCarousel(direction) {
    cards.forEach(card => {
      let activeIndex = parseInt(card.getAttribute("data-index"));
      let newIndex = activeIndex + direction;
      if (newIndex > 2) newIndex = 0;
      if (newIndex < 0) newIndex = 2;
      card.setAttribute("data-index", newIndex);
    });
  }
});
// github-contrib.js
// Fills #ghGrid with a GitHub-style contribution dot matrix
// (52 weeks x 7 days). Dot SIZE + shade both scale with activity level.
// Safe to include alongside your existing script.js — it only runs
// if #ghGrid is empty, so it won't double up if you already populate it.

(function () {
  var grid = document.getElementById('ghGrid');
  if (!grid || grid.children.length > 0) return;

  var WEEKS = 52;
  var DAYS = 7;
  var total = 0;

  // weighted distribution: mostly quiet days, occasional big days —
  // tweak these weights (or swap in real GitHub API data) any time.
  var LEVELS = [
    { level: 0, weight: 45, min: 0,  max: 0  },
    { level: 1, weight: 25, min: 1,  max: 2  },
    { level: 2, weight: 15, min: 3,  max: 5  },
    { level: 3, weight: 10, min: 6,  max: 9  },
    { level: 4, weight: 5,  min: 10, max: 15 }
  ];
  var weightSum = LEVELS.reduce(function (s, l) { return s + l.weight; }, 0);

  function pickLevel() {
    var r = Math.random() * weightSum;
    for (var i = 0; i < LEVELS.length; i++) {
      if (r < LEVELS[i].weight) return LEVELS[i];
      r -= LEVELS[i].weight;
    }
    return LEVELS[0];
  }

  var frag = document.createDocumentFragment();

  for (var i = 0; i < WEEKS * DAYS; i++) {
    var picked = pickLevel();
    var count = picked.level === 0
      ? 0
      : Math.floor(picked.min + Math.random() * (picked.max - picked.min + 1));
    total += count;

    var dot = document.createElement('span');
    if (picked.level > 0) dot.classList.add('l' + picked.level);
    dot.title = count + (count === 1 ? ' contribution' : ' contributions');
    frag.appendChild(dot);
  }

  grid.appendChild(frag);

  var countEl = document.querySelector('.contrib-count');
  if (countEl) {
    countEl.textContent = total.toLocaleString() + ' contributions in the last year';
  }
})();