// sidebar burger menu is now handled by mobile-menu.js (shared across pages)

// ---------- collab form: real submission to Formspree ----------
(function () {
  var form = document.getElementById('collabForm');
  if (!form) return;

  var button = form.querySelector('button[type="submit"]');
  var note = document.getElementById('formNote');
  var defaultNote = note ? note.textContent : '';
  var defaultButtonHTML = button ? button.innerHTML : '';

  function setNote(text, state) {
    if (!note) return;
    note.textContent = text;
    note.classList.remove('is-success', 'is-error');
    if (state) note.classList.add(state);
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    if (button) {
      button.classList.add('is-sending');
      button.textContent = 'Sending…';
    }
    setNote('Sending your message…');

    fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    })
      .then(function (response) {
        if (response.ok) {
          form.reset();
          setNote("Sent — I'll get back to you soon.", 'is-success');
        } else {
          return response.json().then(function (data) {
            var msg = (data && data.errors && data.errors.length)
              ? data.errors.map(function (e) { return e.message; }).join(', ')
              : 'Something went wrong sending that. Try emailing me directly.';
            throw new Error(msg);
          });
        }
      })
      .catch(function (err) {
        setNote(err.message || 'Something went wrong sending that. Try emailing me directly.', 'is-error');
      })
      .finally(function () {
        if (button) {
          button.classList.remove('is-sending');
          button.innerHTML = defaultButtonHTML;
        }
        setTimeout(function () {
          setNote(defaultNote);
        }, 4500);
      });
  });
})();

// ---------- world panel: subtle pointer-follow tilt ----------
(function () {
  var panel = document.querySelector('.world-panel');
  if (!panel || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var bounds;

  panel.addEventListener('mouseenter', function () {
    bounds = panel.getBoundingClientRect();
  });

  panel.addEventListener('mousemove', function (e) {
    if (!bounds) bounds = panel.getBoundingClientRect();
    var x = (e.clientX - bounds.left) / bounds.width - 0.5;
    var y = (e.clientY - bounds.top) / bounds.height - 0.5;
    panel.style.transform =
      'translateY(-2px) rotateX(' + (y * -3) + 'deg) rotateY(' + (x * 3) + 'deg)';
  });

  panel.addEventListener('mouseleave', function () {
    panel.style.transform = '';
  });
})();