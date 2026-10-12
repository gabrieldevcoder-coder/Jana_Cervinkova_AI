/**
 * Zdravotní masáže Chodov – Jana Červinková
 * Vanilla JavaScript – navigace, scroll efekty, reveal animace
 */

(function () {
  'use strict';

  // ============================================================
  // DOM ELEMENTS
  // ============================================================
  const header = document.getElementById('site-header');
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navOverlay = document.getElementById('nav-overlay');
  const navLinks = document.querySelectorAll('.nav-link');
  const backToTop = document.getElementById('back-to-top');
  const sections = document.querySelectorAll('section[id]');
  const revealElements = document.querySelectorAll('[data-reveal]');

  // ============================================================
  // MOBILE MENU
  // ============================================================
  function openMenu() {
    navMenu.classList.add('open');
    navOverlay.classList.add('active');
    navToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    navMenu.classList.remove('open');
    navOverlay.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  function toggleMenu() {
    const isOpen = navMenu.classList.contains('open');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  navToggle.addEventListener('click', toggleMenu);
  navOverlay.addEventListener('click', closeMenu);

  // Zavření menu po kliknutí na odkaz
  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      closeMenu();
    });
  });

  // Escape zavře menu
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navMenu.classList.contains('open')) {
      closeMenu();
      navToggle.focus();
    }
  });

  // ============================================================
  // HEADER – změna pozadí při scrollu
  // ============================================================
  function handleHeaderScroll() {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  // ============================================================
  // BACK TO TOP
  // ============================================================
  function handleBackToTopVisibility() {
    if (window.scrollY > 600) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }

  backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ============================================================
  // AKTIVNÍ NAVIGACE – IntersectionObserver
  // ============================================================
  function setActiveNav(sectionId) {
    navLinks.forEach(function (link) {
      link.classList.remove('active');
      var href = link.getAttribute('href');
      if (href === '#' + sectionId) {
        link.classList.add('active');
      }
    });
  }

  var navObserverOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  var navObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        setActiveNav(entry.target.id);
      }
    });
  }, navObserverOptions);

  sections.forEach(function (section) {
    navObserver.observe(section);
  });

  // ============================================================
  // SCROLL REVEAL – IntersectionObserver
  // ============================================================
  var revealObserverOptions = {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.1
  };

  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, revealObserverOptions);

  revealElements.forEach(function (el) {
    revealObserver.observe(el);
  });

  // ============================================================
  // SCROLL HANDLER – throttled
  // ============================================================
  var scrollTicking = false;

  function onScroll() {
    if (!scrollTicking) {
      requestAnimationFrame(function () {
        handleHeaderScroll();
        handleBackToTopVisibility();
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // Initial state
  handleHeaderScroll();
  handleBackToTopVisibility();

  // ============================================================
  // SMOOTH SCROLL – polyfill-free (nativní CSS scroll-behavior)
  // Pro prohlížeče, které nepodporují scroll-behavior, zajistíme JS fallback
  // ============================================================
  var supportsNativeSmoothScroll = 'scrollBehavior' in document.documentElement.style;

  if (!supportsNativeSmoothScroll) {
    navLinks.forEach(function (link) {
      link.addEventListener('click', function (e) {
        var href = this.getAttribute('href');
        if (href && href.startsWith('#')) {
          var target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            var headerHeight = header.offsetHeight;
            var targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
            });
          }
        }
      });
    });
  }

  // ============================================================
  // MODALS & LIGHTBOX
  // ============================================================
  window.closeModal = function (id) {
    var modal = document.getElementById(id);
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  window.openLightbox = function (src) {
    var lightbox = document.getElementById('lightbox');
    var lightboxImg = document.getElementById('lightbox-img');
    if (lightbox && lightboxImg) {
      lightboxImg.src = src;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };

  
})();

