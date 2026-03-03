/**
 * বাংলাবাজার — App Interactions
 * Production-grade vanilla JS
 * No dependencies required.
 */

'use strict';

/* ── Scroll Reveal ──────────────────────────────────────────── */
const RevealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        entry.target.style.transitionDelay = `${i * 60}ms`;
        entry.target.classList.add('visible');
        RevealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.10, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.reveal').forEach((el) => RevealObserver.observe(el));

/* ── OTP Input Auto-advance ─────────────────────────────────── */
function initOtpInputs() {
  const otpGrid = document.querySelector('.otp-grid');
  if (!otpGrid) return;

  const inputs = [...otpGrid.querySelectorAll('.otp-input')];

  inputs.forEach((input, idx) => {
    input.setAttribute('maxlength', '1');
    input.setAttribute('inputmode', 'numeric');
    input.setAttribute('autocomplete', idx === 0 ? 'one-time-code' : 'off');

    input.addEventListener('input', (e) => {
      const val = e.target.value.replace(/\D/g, '');
      e.target.value = val;
      if (val && idx < inputs.length - 1) {
        inputs[idx + 1].focus();
      }
      checkOtpComplete(inputs);
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !input.value && idx > 0) {
        inputs[idx - 1].focus();
      }
    });

    input.addEventListener('paste', (e) => {
      const pasted = (e.clipboardData || window.clipboardData)
        .getData('text')
        .replace(/\D/g, '')
        .slice(0, 6);
      if (!pasted) return;
      e.preventDefault();
      pasted.split('').forEach((char, i) => {
        if (inputs[i]) inputs[i].value = char;
      });
      inputs[Math.min(pasted.length, inputs.length - 1)].focus();
      checkOtpComplete(inputs);
    });
  });
}

function checkOtpComplete(inputs) {
  const code = inputs.map((i) => i.value).join('');
  const btn = document.querySelector('[data-otp-submit]');
  if (btn) {
    btn.disabled = code.length < 6;
    if (code.length === 6) {
      btn.classList.remove('opacity-50');
    }
  }
}

/* ── Toast Notification ─────────────────────────────────────── */
function showToast(message, type = 'success') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const icons = {
    success: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>`,
    error:   `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>`,
    info:    `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
  };

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.style.borderLeftColor = type === 'error' ? '#C0392B' : type === 'info' ? '#1A6B9A' : '#C8972B';
  toast.innerHTML = `${icons[type] || icons.info}<span>${message}</span>`;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = 'opacity 0.3s, transform 0.3s';
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(20px)';
    setTimeout(() => toast.remove(), 320);
  }, 3200);
}

/* ── Save / Bookmark Toggle ─────────────────────────────────── */
function initSaveButtons() {
  document.querySelectorAll('[data-save]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const saved = btn.dataset.saved === 'true';
      btn.dataset.saved = String(!saved);
      btn.style.color = !saved ? '#C0392B' : '';
      btn.title = !saved ? 'সেভ করা হয়েছে' : 'সেভ করুন';
      showToast(!saved ? 'পণ্যটি সেভ তালিকায় যোগ হয়েছে ✓' : 'সেভ তালিকা থেকে সরানো হয়েছে', 'info');
    });
  });
}

/* ── Tab Switcher ───────────────────────────────────────────── */
function initTabs() {
  document.querySelectorAll('[data-tabs]').forEach((tabContainer) => {
    const tabs = tabContainer.querySelectorAll('[data-tab]');
    const panels = document.querySelectorAll('[data-panel]');

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        tabs.forEach((t) => t.classList.remove('tab--active'));
        tab.classList.add('tab--active');
        const target = tab.dataset.tab;
        panels.forEach((panel) => {
          panel.style.display = panel.dataset.panel === target ? '' : 'none';
        });
      });
    });
  });
}

/* ── Mobile Menu ────────────────────────────────────────────── */
function initMobileMenu() {
  const toggle = document.querySelector('[data-menu-toggle]');
  const menu   = document.querySelector('[data-mobile-menu]');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const open = menu.dataset.open === 'true';
    menu.dataset.open = String(!open);
    menu.style.display = !open ? 'flex' : 'none';
    toggle.setAttribute('aria-expanded', String(!open));
  });
}

/* ── Modal ──────────────────────────────────────────────────── */
function openModal(modalId) {
  const overlay = document.getElementById(modalId);
  if (!overlay) return;
  overlay.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  overlay.querySelector('[data-modal-close]')?.addEventListener('click', () => closeModal(modalId));
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(modalId); });
}

function closeModal(modalId) {
  const overlay = document.getElementById(modalId);
  if (!overlay) return;
  overlay.style.display = 'none';
  document.body.style.overflow = '';
}

window.openModal = openModal;
window.closeModal = closeModal;

document.querySelectorAll('[data-open-modal]').forEach((btn) => {
  btn.addEventListener('click', () => openModal(btn.dataset.openModal));
});

/* ── Enquiry Modal ──────────────────────────────────────────── */
function initEnquiryButtons() {
  document.querySelectorAll('[data-enquire]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const modalId = 'enquiry-modal';
      const productName = btn.dataset.product || '';
      const modal = document.getElementById(modalId);
      if (modal && productName) {
        const field = modal.querySelector('[data-product-name]');
        if (field) field.textContent = productName;
      }
      openModal(modalId);
    });
  });

  const enquiryForm = document.getElementById('enquiry-form');
  if (enquiryForm) {
    enquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      closeModal('enquiry-modal');
      showToast('আপনার জিজ্ঞাসা সফলভাবে পাঠানো হয়েছে! বিক্রেতা শীঘ্রই যোগাযোগ করবেন।');
    });
  }
}

/* ── Search Suggestions ─────────────────────────────────────── */
function initSearchSuggestions() {
  const suggestions = [
    'কটন কাপড়', 'পলিয়েস্টার থান', 'সয়াবিন তেল', 'সরিষার তেল',
    'ইলেকট্রিক মিটার', 'সিমেন্ট', 'রড ও স্টিল', 'প্লাস্টিক পাইপ',
    'ডিম ও পোলট্রি', 'মাছ প্রসেসিং', 'ওষুধের কাঁচামাল',
  ];

  document.querySelectorAll('.search-with-suggest').forEach((wrapper) => {
    const input = wrapper.querySelector('input');
    const box   = wrapper.querySelector('.suggestions-box');
    if (!input || !box) return;

    input.addEventListener('input', () => {
      const q = input.value.trim();
      if (q.length < 2) { box.style.display = 'none'; return; }
      const matches = suggestions.filter((s) => s.includes(q));
      if (!matches.length) { box.style.display = 'none'; return; }
      box.innerHTML = matches
        .slice(0, 6)
        .map((s) => `<div class="suggestion-item" tabindex="0">${s.replace(q, `<mark>${q}</mark>`)}</div>`)
        .join('');
      box.style.display = 'block';
    });

    box.addEventListener('click', (e) => {
      const item = e.target.closest('.suggestion-item');
      if (item) {
        input.value = item.textContent;
        box.style.display = 'none';
        input.form?.submit?.();
      }
    });

    document.addEventListener('click', (e) => {
      if (!wrapper.contains(e.target)) box.style.display = 'none';
    });
  });
}

/* ── Image Gallery ──────────────────────────────────────────── */
function initGallery() {
  const thumbs = document.querySelectorAll('[data-gallery-thumb]');
  const main   = document.querySelector('[data-gallery-main]');
  if (!thumbs.length || !main) return;

  thumbs.forEach((thumb) => {
    thumb.addEventListener('click', () => {
      thumbs.forEach((t) => t.classList.remove('gallery-thumb--active'));
      thumb.classList.add('gallery-thumb--active');
      const src = thumb.dataset.src || thumb.src;
      main.style.opacity = '0';
      main.style.transition = 'opacity 0.25s ease';
      setTimeout(() => {
        main.src = src;
        main.style.opacity = '1';
      }, 230);
    });
  });
}

/* ── Stat Counter Animation ─────────────────────────────────── */
function animateCounters() {
  document.querySelectorAll('[data-count]').forEach((el) => {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1200;
    const step = (target / duration) * 16;
    let current = 0;

    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      obs.unobserve(el);

      const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = Math.floor(current).toLocaleString('bn-BD') + suffix;
        if (current >= target) clearInterval(timer);
      }, 16);
    }, { threshold: 0.5 });

    obs.observe(el);
  });
}

/* ── Range Slider (price filter) ───────────────────────────── */
function initRangeSlider() {
  const slider = document.querySelector('[data-range-slider]');
  if (!slider) return;

  const min    = slider.querySelector('[data-range-min]');
  const max    = slider.querySelector('[data-range-max]');
  const track  = slider.querySelector('[data-range-track]');
  const minVal = slider.querySelector('[data-min-val]');
  const maxVal = slider.querySelector('[data-max-val]');

  function updateTrack() {
    if (!min || !max || !track) return;
    const minPct = ((min.value - min.min) / (min.max - min.min)) * 100;
    const maxPct = ((max.value - max.min) / (max.max - max.min)) * 100;
    track.style.left  = minPct + '%';
    track.style.width = (maxPct - minPct) + '%';
    if (minVal) minVal.textContent = '৳' + parseInt(min.value).toLocaleString('bn-BD');
    if (maxVal) maxVal.textContent = '৳' + parseInt(max.value).toLocaleString('bn-BD');
  }

  min?.addEventListener('input', updateTrack);
  max?.addEventListener('input', updateTrack);
  updateTrack();
}

/* ── Admin Chart (pure CSS bar chart fallback) ──────────────── */
function initSimpleCharts() {
  document.querySelectorAll('[data-bar-chart]').forEach((chart) => {
    const bars = chart.querySelectorAll('[data-bar]');
    const values = [...bars].map((b) => parseFloat(b.dataset.value) || 0);
    const max = Math.max(...values, 1);

    bars.forEach((bar) => {
      const pct = ((parseFloat(bar.dataset.value) || 0) / max) * 100;
      const fill = bar.querySelector('.bar-fill');
      if (fill) {
        fill.style.height = '0%';
        setTimeout(() => {
          fill.style.transition = 'height 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
          fill.style.height = pct + '%';
        }, 300);
      }
    });
  });
}

/* ── Active Nav Link ────────────────────────────────────────── */
function highlightActiveNav() {
  const path = window.location.pathname;
  document.querySelectorAll('.navbar__link, .sidebar__item').forEach((link) => {
    const href = link.getAttribute('href') || '';
    if (href && path.endsWith(href)) {
      link.classList.add('navbar__link--active', 'sidebar__item--active');
    }
  });
}

/* ── Hamburger / Mobile Nav Drawer ──────────────────────────── */
function initHamburgerNav() {
  const toggle   = document.getElementById('navToggle');
  const menu     = document.getElementById('mobileMenu');
  const closeBtn = document.getElementById('mobileMenuClose');

  if (!toggle || !menu) return;

  function openMenu() {
    menu.classList.add('is-open');
    toggle.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'মেনু বন্ধ করুন');
  }

  function closeMenu() {
    menu.classList.remove('is-open');
    toggle.classList.remove('is-open');
    document.body.style.overflow = '';
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'মেনু খুলুন');
  }

  toggle.addEventListener('click', () =>
    menu.classList.contains('is-open') ? closeMenu() : openMenu()
  );

  if (closeBtn) closeBtn.addEventListener('click', closeMenu);

  // Close when clicking the backdrop (outside the panel)
  menu.addEventListener('click', (e) => {
    const panel = menu.querySelector('.navbar__mobile-menu__panel');
    if (panel && !panel.contains(e.target)) closeMenu();
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  // Close when resizing back to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) closeMenu();
  });
}

/* ── Init All ───────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initOtpInputs();
  initSaveButtons();
  initTabs();
  initMobileMenu();
  initHamburgerNav();
  initEnquiryButtons();
  initSearchSuggestions();
  initGallery();
  animateCounters();
  initRangeSlider();
  initSimpleCharts();
  highlightActiveNav();

  /* Re-run reveal for dynamically loaded content */
  document.querySelectorAll('.reveal').forEach((el) => RevealObserver.observe(el));
});

/* ── Expose globals ─────────────────────────────────────────── */
window.BB = { showToast, openModal, closeModal };
