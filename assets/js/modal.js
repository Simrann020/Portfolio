(function() {
  'use strict';

  let activeModal = null;

  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    activeModal = modal;
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';

    // Focus trap
    const focusable = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusable.length > 0) focusable[0].focus();
  }

  function closeModal(modalId) {
    const modal = modalId ? document.getElementById(modalId) : activeModal;
    if (!modal) return;

    modal.classList.remove('is-open');
    document.body.style.overflow = '';
    activeModal = null;
  }

  function closeActiveModal() {
    if (activeModal) {
      closeModal(activeModal.id);
    }
  }

  // Close on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && activeModal) {
      closeActiveModal();
    }
  });

  // Close on backdrop click
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-backdrop')) {
      closeActiveModal();
    }
  });

  // Expose to global
  window.openModal = openModal;
  window.closeModal = closeModal;

  // Auto-wire buttons with data-modal attribute
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-modal]');
    if (trigger) {
      e.preventDefault();
      const modalId = trigger.getAttribute('data-modal');
      openModal(modalId);
    }

    const closeBtn = e.target.closest('[data-modal-close]');
    if (closeBtn) {
      closeActiveModal();
    }
  });
})();
