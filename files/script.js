/* =============================================
   PORTFOLIO SCRIPT
   ============================================= */

(function () {
  'use strict';

  /* ---- Custom Cursor ---- */
  const cursor    = document.getElementById('cursor');
  const cursorDot = document.getElementById('cursorDot');

  let mouseX = 0, mouseY = 0;
  let curX = 0, curY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top  = mouseY + 'px';
  });

  // Smooth cursor trail
  function animateCursor() {
    curX += (mouseX - curX) * 0.15;
    curY += (mouseY - curY) * 0.15;
    cursor.style.left = curX + 'px';
    cursor.style.top  = curY + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Cursor hover effect
  const hoverTargets = 'a, button, .stat-card, .skill-card, .cert-card, .project-card, .tag';
  document.querySelectorAll(hoverTargets).forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
  });

  /* ---- Scroll Reveal ---- */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
  );
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* ---- Skill Bars ---- */
  const barObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
            const w = bar.dataset.width;
            setTimeout(() => { bar.style.width = w + '%'; }, 200);
          });
          barObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );
  document.querySelectorAll('.skill-card').forEach(card => barObserver.observe(card));

  /* ---- Counter Animation ---- */
  function animateCounter(el, target, duration) {
    let start = 0;
    const step = Math.ceil(target / (duration / 30));
    const timer = setInterval(() => {
      start = Math.min(start + step, target);
      el.textContent = start;
      if (start >= target) clearInterval(timer);
    }, 30);
  }

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.stat-number').forEach(el => {
            animateCounter(el, parseInt(el.dataset.target), 1200);
          });
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  const statsGrid = document.querySelector('.stats-grid');
  if (statsGrid) counterObserver.observe(statsGrid);

  /* ---- Active Nav Link on Scroll ---- */
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');

  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + id);
          });
        }
      });
    },
    { threshold: 0.4 }
  );
  sections.forEach(s => navObserver.observe(s));

  /* ---- Hamburger Mobile Menu ---- */
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  let menuOpen = false;

  function toggleMenu() {
    menuOpen = !menuOpen;
    mobileMenu.classList.toggle('open', menuOpen);
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    const bars = hamburger.querySelectorAll('span');
    if (menuOpen) {
      bars[0].style.transform = 'translateY(6.5px) rotate(45deg)';
      bars[1].style.opacity   = '0';
      bars[2].style.transform = 'translateY(-6.5px) rotate(-45deg)';
    } else {
      bars[0].style.transform = '';
      bars[1].style.opacity   = '1';
      bars[2].style.transform = '';
    }
  }

  hamburger.addEventListener('click', toggleMenu);
  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => { if (menuOpen) toggleMenu(); });
  });

  /* ---- Smooth Section Scroll ---- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ---- Parallax Hero Glow ---- */
  const heroGlow = document.querySelector('.hero-bg-glow');
  if (heroGlow) {
    window.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth  - 0.5) * 30;
      const y = (e.clientY / window.innerHeight - 0.5) * 30;
      heroGlow.style.transform = `translate(${x}px, ${y}px)`;
    });
  }

  /* ---- Navbar Scroll Effect ---- */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.style.background = 'rgba(8,15,17,0.92)';
    } else {
      navbar.style.background = 'rgba(8,15,17,0.75)';
    }
  });

  /* ---- Contact Form ---- */
  const contactForm = document.getElementById('contactForm');
  const submitBtn   = document.getElementById('submitBtn');
  const formSuccess = document.getElementById('formSuccess');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name    = contactForm.name.value.trim();
      const email   = contactForm.email.value.trim();
      const message = contactForm.message.value.trim();

      if (!name || !email || !message) {
        shakeForm();
        return;
      }
      if (!isValidEmail(email)) {
        contactForm.email.style.borderColor = '#ff6b6b';
        setTimeout(() => { contactForm.email.style.borderColor = ''; }, 2000);
        return;
      }

      // Simulate send
      submitBtn.classList.add('loading');
      submitBtn.disabled = true;
      setTimeout(() => {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        contactForm.reset();
        formSuccess.classList.add('visible');
        setTimeout(() => formSuccess.classList.remove('visible'), 4000);
      }, 1800);
    });
  }

  function shakeForm() {
    contactForm.style.animation = 'none';
    contactForm.style.transform = 'translateX(-6px)';
    setTimeout(() => {
      contactForm.style.transform = 'translateX(6px)';
      setTimeout(() => { contactForm.style.transform = ''; }, 100);
    }, 100);
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /* ---- Typed Title Effect ---- */
  const headline = document.querySelector('.hero-headline');
  if (headline) {
    // Subtle entrance
    headline.style.opacity = '0';
    headline.style.transform = 'translateY(20px)';
    headline.style.transition = 'opacity 1s ease 0.4s, transform 1s ease 0.4s';
    setTimeout(() => {
      headline.style.opacity = '1';
      headline.style.transform = 'translateY(0)';
    }, 100);
  }

  /* ---- Page load fade in ---- */
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  window.addEventListener('load', () => {
    document.body.style.opacity = '1';
  });

})();