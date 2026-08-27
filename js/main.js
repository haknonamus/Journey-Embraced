/**
 * Journey Embraced Counseling — main.js
 * All interactive behaviour: modals, dropdown, chat, mobile menu, scroll reveal
 */

(function () {
  'use strict';

  /* ─────────────────────────────────────────
     NAV SCROLL EFFECT (glassmorphic on scroll)
  ───────────────────────────────────────── */

  function initNavScroll() {
    var nav = document.getElementById('mainNav');
    if (!nav) return;
    function onScroll() {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    }
    window.addEventListener('scroll', onScroll);
    onScroll();
  }

  /* ─────────────────────────────────────────
     MODALS
  ───────────────────────────────────────── */

  /**
   * Open a modal by name (e.g. 'booking', 'signin', 'signup')
   * @param {string} name
   */
  function openModal(name) {
    var overlay = document.getElementById(name + 'Modal');
    if (!overlay) return;
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  /**
   * Close a modal by name
   * @param {string} name
   */
  function closeModal(name) {
    var overlay = document.getElementById(name + 'Modal');
    if (!overlay) return;
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    var form = overlay.querySelector('form');
    var success = overlay.querySelector('.modal-success');
    if (form) { form.reset(); form.style.display = ''; }
    if (success) success.style.display = 'none';
  }

  /**
   * Switch from one modal to another
   * @param {string} from
   * @param {string} to
   */
  function switchModal(from, to) {
    closeModal(from);
    setTimeout(function () { openModal(to); }, 200);
  }

  /** Wire up all modal triggers */
  function initModals() {
    // Close buttons (✕)
    document.querySelectorAll('.modal-x').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var overlay = btn.closest('.modal-overlay');
        if (overlay) closeModal(overlay.id.replace('Modal', ''));
      });
    });

    // Click on backdrop to close
    document.querySelectorAll('.modal-overlay').forEach(function (overlay) {
      overlay.addEventListener('click', function (e) {
        if (e.target === overlay) {
          closeModal(overlay.id.replace('Modal', ''));
        }
      });
    });

    // Netlify form submission
    var bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
      bookingForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var submitBtn = bookingForm.querySelector('button[type="submit"]');
        if (submitBtn) { submitBtn.textContent = 'Sending...'; submitBtn.disabled = true; }
        fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(new FormData(bookingForm)).toString()
        }).then(function () {
          bookingForm.style.display = 'none';
          var success = document.getElementById('bookingSuccess');
          if (success) success.style.display = 'block';
          setTimeout(function () { closeModal('booking'); }, 4000);
        }).catch(function () {
          if (submitBtn) { submitBtn.textContent = 'Request Appointment'; submitBtn.disabled = false; }
          alert('There was a problem. Please call 816-974-3389 or email cstokes@jecounselingkc.com');
        });
      });
    }

    // Switch modal links (e.g. "Sign in" / "Create an account")
    document.querySelectorAll('[data-switch-to]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        var overlay = link.closest('.modal-overlay');
        var from    = overlay ? overlay.id.replace('Modal', '') : null;
        var to      = link.getAttribute('data-switch-to');
        if (from) switchModal(from, to);
        else openModal(to);
      });
    });

    // Generic open triggers via data-open-modal (e.g. workshop "Reserve" buttons)
    document.querySelectorAll('[data-open-modal]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        openModal(btn.getAttribute('data-open-modal'));
      });
    });

    // Generic booking triggers — no pre-selection
    var bookingTriggers = [
      'bookNavBtn', 'heroBookBtn'
    ];
    bookingTriggers.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) {
        el.addEventListener('click', function (e) {
          e.preventDefault();
          var select = document.getElementById('counselorSelect');
          if (select) select.value = '';
          openModal('booking');
        });
      }
    });

    var mobBook = document.getElementById('mobBook');
    if (mobBook) {
      mobBook.addEventListener('click', function (e) {
        e.preventDefault();
        closeMob();
        var select = document.getElementById('counselorSelect');
        if (select) select.value = '';
        openModal('booking');
      });
    }

    // Escape key closes any open modal
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.open').forEach(function (overlay) {
          closeModal(overlay.id.replace('Modal', ''));
        });
      }
    });
  }

  /* ─────────────────────────────────────────
     MOBILE MENU
  ───────────────────────────────────────── */

  function openMob() {
    var menu   = document.getElementById('mobMenu');
    var toggle = document.getElementById('mobToggle');
    if (menu)   menu.classList.add('open');
    if (toggle) { toggle.classList.add('open'); toggle.setAttribute('aria-expanded', 'true'); }
    document.body.classList.add('mob-open');
    document.body.style.overflow = 'hidden';
  }

  function closeMob() {
    var menu   = document.getElementById('mobMenu');
    var toggle = document.getElementById('mobToggle');
    if (menu)   menu.classList.remove('open');
    if (toggle) { toggle.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); }
    document.body.classList.remove('mob-open');
    document.body.style.overflow = '';
  }

  function initMobileMenu() {
    var toggle = document.getElementById('mobToggle');
    var close  = document.getElementById('mobClose');

    if (toggle) toggle.addEventListener('click', function () {
      var isOpen = document.getElementById('mobMenu').classList.contains('open');
      isOpen ? closeMob() : openMob();
    });

    if (close) close.addEventListener('click', closeMob);

    // Auto-close nav links (except sign-in/book which have their own handlers)
    document.querySelectorAll('.mob-menu a:not(#mobSignin):not(#mobBook)').forEach(function (link) {
      link.addEventListener('click', closeMob);
    });
  }

  /* ─────────────────────────────────────────
     CONTACT US DROPDOWN
  ───────────────────────────────────────── */

  function initContactDropdown() {
    var btn  = document.getElementById('contactDropBtn');
    var drop = document.getElementById('contactDrop');
    if (!btn || !drop) return;

    /* Move out of <nav> so its backdrop-filter isn't nested inside nav's
       own backdrop-filter — nested backdrop-filter is unreliable across
       browsers (and known-buggy in some, like Zen Browser). */
    document.body.appendChild(drop);
    drop.style.position = 'fixed';

    function positionDrop() {
      var rect = btn.getBoundingClientRect();
      drop.style.top = (rect.bottom + 10) + 'px';
      drop.style.right = (window.innerWidth - rect.right) + 'px';
      drop.style.left = 'auto';
    }

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = drop.classList.contains('contact-drop--open');
      if (!isOpen) {
        positionDrop();
        drop.classList.add('contact-drop--open');
        btn.setAttribute('aria-expanded', 'true');
      } else {
        drop.classList.remove('contact-drop--open');
        btn.setAttribute('aria-expanded', 'false');
      }
    });

    window.addEventListener('resize', function () {
      if (drop.classList.contains('contact-drop--open')) positionDrop();
    });

    document.addEventListener('click', function () {
      drop.classList.remove('contact-drop--open');
      btn.setAttribute('aria-expanded', 'false');
    });

    drop.addEventListener('click', function (e) { e.stopPropagation(); });
  }

  /* ─────────────────────────────────────────
     SCROLL REVEAL
  ───────────────────────────────────────── */

  function initScrollReveal() {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          el.classList.add('visible');
          observer.unobserve(el);
          // Once the staggered entrance transition finishes, zero out --i so
          // the delay doesn't linger and affect later hover transitions.
          el.addEventListener('transitionend', function clearStagger(e) {
            if (e.target === el) {
              el.style.setProperty('--i', 0);
              el.removeEventListener('transitionend', clearStagger);
            }
          });
        }
      });
    }, { threshold: 0.08 });

    document.querySelectorAll('.reveal').forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ─────────────────────────────────────────
     TEAM QUICK-NAV SCROLL SPY
  ───────────────────────────────────────── */

  function initTeamNavSpy() {
    var sections = document.querySelectorAll('.bio-section');
    var navLinks = document.querySelectorAll('.team-nav a');
    if (!sections.length || !navLinks.length) return;

    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.getAttribute('id');
          navLinks.forEach(function (link) {
            link.classList.toggle('active', link.getAttribute('href') === '#' + id);
          });
        }
      });
    }, { threshold: 0.3, rootMargin: '-80px 0px -60% 0px' });

    sections.forEach(function (sec) { navObserver.observe(sec); });
  }

  /* ─────────────────────────────────────────
     TESTIMONIAL CAROUSEL
  ───────────────────────────────────────── */

  function initTestimonialCarousel() {
    var quoteEl = document.getElementById('testQuote');
    var dots = document.querySelectorAll('.test-dot');
    if (!quoteEl || !dots.length) return;

    var quotes = [
      '"Thank you so much for all of your support. I am forever grateful."',
      '"You\'re awesome, and I appreciate your approach."',
      '"Thank you for not judging me."',
      '"You literally saved my life."',
      '"I thank God I found you. You helped me find the strength to heal after that toxic relationship."',
      '"You really connected with my daughter from the jump."',
      '"Our sessions have given me restored hopefulness."'
    ];
    var current = 0;
    var timer;

    function showTestimonial(i) {
      quoteEl.style.opacity = 0;
      setTimeout(function () {
        quoteEl.textContent = quotes[i];
        quoteEl.style.opacity = 1;
      }, 300);
      dots.forEach(function (d) { d.classList.remove('active'); });
      dots[i].classList.add('active');
      current = i;
    }

    function startAutoRotate() {
      timer = setInterval(function () {
        showTestimonial((current + 1) % quotes.length);
      }, 6000);
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        clearInterval(timer);
        showTestimonial(i);
        startAutoRotate();
      });
    });

    startAutoRotate();
  }



  /* ─────────────────────────────────────────
     CURSOR SPOTLIGHT
  ───────────────────────────────────────── */

  function initCursorSpotlight() {
    document.querySelectorAll('.hero, .team-hero, .blog-hero, .post-hero, .shop-hero, .workshops-hero').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var rect = el.getBoundingClientRect();
        el.style.setProperty('--mouse-x', (e.clientX - rect.left) + 'px');
        el.style.setProperty('--mouse-y', (e.clientY - rect.top) + 'px');
      });
    });
  }

  /* ─────────────────────────────────────────
     PARALLAX IMAGES
  ───────────────────────────────────────── */

  function initScrollEffects() {
    var parallaxEls = document.querySelectorAll('.bio-photo-wrap, .post-hero-img, .blog-featured-img');
    var progressBar = document.getElementById('scrollProgress');
    if (!parallaxEls.length && !progressBar) return;

    var ticking = false;

    function update() {
      if (parallaxEls.length) {
        parallaxEls.forEach(function (el) {
          var rect = el.getBoundingClientRect();
          var speed = 0.06;
          var offset = (window.innerHeight - rect.top) * speed;
          if (rect.top < window.innerHeight && rect.bottom > 0) {
            el.style.transform = 'translateY(' + offset + 'px)';
          }
        });
      }
      if (progressBar) {
        var scrolled = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
        progressBar.style.width = (scrolled * 100) + '%';
      }
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    });
  }

  /* ─────────────────────────────────────────
     HERO TEXT SCRAMBLE
  ───────────────────────────────────────── */

  /* ─────────────────────────────────────────
     MAGNETIC BUTTONS
  ───────────────────────────────────────── */

  function initMagneticButtons() {
    document.querySelectorAll('.btn-gold, .btn-nav-cta, .btn-register, .btn-modal, .product-buy-link').forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var rect = btn.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = 'translate(' + (x * 0.2) + 'px, ' + (y * 0.2) + 'px)';
      });
      btn.addEventListener('mouseleave', function () {
        btn.style.transform = '';
      });
    });
  }

  /* ─────────────────────────────────────────
     SCROLL PROGRESS BAR
  ───────────────────────────────────────── */

  /* ─────────────────────────────────────────
     INIT
  ───────────────────────────────────────── */

  document.addEventListener('DOMContentLoaded', function () {
    initNavScroll();
    initModals();
    initContactDropdown();
    initMobileMenu();
    initScrollReveal();
    initTeamNavSpy();
    initTestimonialCarousel();
    initCursorSpotlight();
    initScrollEffects();
    initMagneticButtons();
  });

})();
