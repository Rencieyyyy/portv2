// cert-modal.js
// Powers the "View" button on the certifications page:
// clicking it opens the full certificate image in a centered modal.

(function () {
  var modal = document.getElementById('certModal');
  if (!modal) return;

  var modalImg = document.getElementById('certModalImg');
  var modalTitle = document.getElementById('certModalTitle');
  var closeBtn = document.getElementById('certModalClose');

  function openModal(src, title) {
    modalImg.src = src;
    modalImg.alt = title || 'Certificate';
    modalTitle.textContent = title || '';
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    // clear the src after the fade-out so it doesn't flash the old image next open
    setTimeout(function () { modalImg.src = ''; }, 200);
  }

  // delegate: any button with data-cert-img opens the modal
  document.querySelectorAll('[data-cert-img]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      openModal(btn.getAttribute('data-cert-img'), btn.getAttribute('data-cert-title'));
    });
  });

  closeBtn.addEventListener('click', closeModal);

  // click on the dark overlay (outside the card) closes it
  modal.addEventListener('click', function (e) {
    if (e.target === modal) closeModal();
  });

  // Esc key closes it
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });
})();