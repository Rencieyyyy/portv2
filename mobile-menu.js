// ---------- shared mobile burger menu: drawer + blurred backdrop ----------
(function () {
  var burger = document.getElementById('burgerBtn');
  var menu = document.getElementById('sidebarMenu');
  if (!burger || !menu) return;

  var backdrop = document.createElement('div');
  backdrop.className = 'menu-backdrop';
  backdrop.id = 'menuBackdrop';
  document.body.appendChild(backdrop);

  // Keep the menu inside the sidebar on desktop and mobile.
  // The fixed-position drawer styles in mobile-menu.css work without
  // moving the element in the DOM.

  function openMenu() {
    menu.classList.add('open');
    burger.classList.add('open');
    backdrop.classList.add('open');
    burger.setAttribute('aria-expanded', 'true');
    document.body.classList.add('menu-open');
  }

  function closeMenu() {
    menu.classList.remove('open');
    burger.classList.remove('open');
    backdrop.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  }

  burger.addEventListener('click', function () {
    if (menu.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  backdrop.addEventListener('click', closeMenu);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });

  function syncActiveNavLink() {
    var current = window.location.pathname.replace(/\/$/, '') + (window.location.hash || '');
    menu.querySelectorAll('nav a').forEach(function (link) {
      var linkUrl = link.pathname.replace(/\/$/, '') + (link.hash || '');
      link.classList.toggle('active', linkUrl === current);
    });
  }

  menu.querySelectorAll('nav a').forEach(function (link) {
    link.addEventListener('click', function () {
      syncActiveNavLink();
      closeMenu();
    });
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 820) closeMenu();
  });

  window.addEventListener('hashchange', syncActiveNavLink);
  syncActiveNavLink();
})();