// ---------- shared theme toggle: desktop / light / dark ----------
(function () {
  var STORAGE_KEY = 'devcieyyy-theme';
  var DARK_BG = '#101012';
  var DARK_INK = '#F2F1EC';

  var root = document.documentElement;
  var body = document.body;

  function applyTheme(mode) {
    var dark = mode === 'dark';
    root.classList.toggle('dark-theme', dark);
    if (body) body.classList.toggle('dark-theme', dark);

    root.style.backgroundColor = dark ? DARK_BG : '';
    if (body) {
      body.style.backgroundColor = dark ? DARK_BG : '';
      body.style.color = dark ? DARK_INK : '';
    }
  }

  function updateButtons(container, mode) {
    if (!container) return;
    container.querySelectorAll('button').forEach(function (btn) {
      btn.classList.toggle('active', btn.dataset.mode === mode);
    });
  }

  function resolve(mode) {
    if (mode === 'system') {
      return (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
    }
    return mode;
  }

  function init() {
    var oldButton = document.getElementById('themeToggle');
    if (!oldButton) return;

    // build the segmented control and swap it in place of the old single button
    var group = document.createElement('div');
    group.className = 'theme-toggle-group';
    group.id = 'themeToggleGroup';
    group.innerHTML =
      '<button type="button" data-mode="system" aria-label="Match system theme">\uD83D\uDDA5</button>' +
      '<button type="button" data-mode="light" aria-label="Light mode">\u2600</button>' +
      '<button type="button" data-mode="dark" aria-label="Dark mode">\u263E</button>';
    oldButton.replaceWith(group);

    // default to LIGHT on first visit (no system-preference fallback)
    var saved = null;
    try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) {}
    if (!saved) {
      saved = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    function setMode(mode) {
      updateButtons(group, mode);
      applyTheme(resolve(mode));
      try { localStorage.setItem(STORAGE_KEY, mode); } catch (e) {}
    }

    setMode(saved);

    group.querySelectorAll('button').forEach(function (btn) {
      btn.addEventListener('click', function () {
        setMode(btn.dataset.mode);
      });
    });

    // keep in sync if OS theme changes while "system" is selected
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () {
        var current = null;
        try { current = localStorage.getItem(STORAGE_KEY); } catch (e) {}
        if (current === 'system') applyTheme(resolve('system'));
      });
    }
  }

  init();
})();