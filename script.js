/* ============================================================
   SHEIKH HAIDER ABBAS — PORTFOLIO SCRIPT
   Preloader | Custom Cursor | Particles | Typing Effect |
   Navbar | Hamburger | Scroll Reveal | Skill Bars |
   Counter Animation | Portfolio Filter | Contact Form |
   Back-to-Top | Active Nav Link Highlight
   ============================================================ */

'use strict';

/* ──────────────────────────────────────────────
   UTILITY HELPERS
────────────────────────────────────────────── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

function lerp(a, b, t) { return a + (b - a) * t; }

function clamp(val, min, max) { return Math.min(Math.max(val, min), max); }

/* ──────────────────────────────────────────────
   1. PRELOADER
────────────────────────────────────────────── */
(function initPreloader() {
  const preloader = $('#preloader');
  if (!preloader) return;

  // Minimum display time so the animation feels intentional
  const minTime = 1900;
  const start   = Date.now();

  window.addEventListener('load', () => {
    const elapsed   = Date.now() - start;
    const remaining = Math.max(0, minTime - elapsed);

    setTimeout(() => {
      preloader.classList.add('hidden');
      // Trigger entrance animations after preloader disappears
      setTimeout(startHeroAnimations, 100);
    }, remaining);
  });
})();

/* ──────────────────────────────────────────────
   2. CUSTOM CURSOR
────────────────────────────────────────────── */
(function initCursor() {
  const dot     = $('#cursorDot');
  const outline = $('#cursorOutline');
  if (!dot || !outline) return;

  // Don't run cursor on touch devices
  if (window.matchMedia('(hover: none)').matches) return;

  let mouseX = 0, mouseY = 0;
  let outlineX = 0, outlineY = 0;
  let rafId;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  });

  // Smooth-follow for outline
  function animateCursor() {
    outlineX = lerp(outlineX, mouseX, 0.14);
    outlineY = lerp(outlineY, mouseY, 0.14);
    outline.style.left = outlineX + 'px';
    outline.style.top  = outlineY + 'px';
    rafId = requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Scale up outline on interactive elements
  const interactiveSelector = 'a, button, .filter-btn, .service-card, .project-card, .social-icon, .back-to-top';

  document.addEventListener('mouseover', e => {
    if (e.target.closest(interactiveSelector)) {
      outline.style.width        = '60px';
      outline.style.height       = '60px';
      outline.style.borderColor  = 'rgba(0,212,255,0.7)';
      dot.style.transform        = 'translate(-50%,-50%) scale(0)';
    }
  });

  document.addEventListener('mouseout', e => {
    if (e.target.closest(interactiveSelector)) {
      outline.style.width        = '36px';
      outline.style.height       = '36px';
      outline.style.borderColor  = 'rgba(108,99,255,0.65)';
      dot.style.transform        = 'translate(-50%,-50%) scale(1)';
    }
  });

  document.addEventListener('mousedown', () => {
    outline.style.transform = 'translate(-50%,-50%) scale(0.8)';
  });
  document.addEventListener('mouseup', () => {
    outline.style.transform = 'translate(-50%,-50%) scale(1)';
  });
})();

/* ──────────────────────────────────────────────
   3. PARTICLE CANVAS
────────────────────────────────────────────── */
(function initParticles() {
  const canvas = $('#particleCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, particles = [], animFrame;

  // Colours matching CSS accent variables
  const COLOURS = [
    'rgba(108,99,255,ALPHA)',
    'rgba(0,212,255,ALPHA)',
    'rgba(168,85,247,ALPHA)',
  ];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  class Particle {
    constructor() { this.reset(true); }

    reset(initial = false) {
      this.x    = Math.random() * W;
      this.y    = initial ? Math.random() * H : H + 10;
      this.r    = Math.random() * 1.8 + 0.5;
      this.speed= Math.random() * 0.4 + 0.1;
      this.drift= (Math.random() - 0.5) * 0.3;
      this.alpha= Math.random() * 0.5 + 0.1;
      this.col  = COLOURS[Math.floor(Math.random() * COLOURS.length)]
                    .replace('ALPHA', this.alpha.toFixed(2));
      this.twinkleSpeed = Math.random() * 0.02 + 0.005;
      this.twinkleDir   = 1;
    }

    update() {
      this.y -= this.speed;
      this.x += this.drift;

      // Twinkle
      this.alpha += this.twinkleSpeed * this.twinkleDir;
      if (this.alpha > 0.65) { this.alpha = 0.65; this.twinkleDir = -1; }
      if (this.alpha < 0.05) { this.alpha = 0.05; this.twinkleDir =  1; }
      this.col = COLOURS[COLOURS.indexOf(this.col.replace(/[\d.]+\)$/, 'ALPHA)')) < 0
        ? 0
        : COLOURS.indexOf(this.col.replace(/[\d.]+\)$/, 'ALPHA)'))
      ].replace('ALPHA', this.alpha.toFixed(2));

      if (this.y + this.r < 0) this.reset();
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.col;
      ctx.fill();
    }
  }

  function buildParticles() {
    // Density: roughly 1 particle per 8000px²
    const count = clamp(Math.floor((W * H) / 8000), 40, 160);
    particles = Array.from({ length: count }, () => new Particle());
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (const p of particles) {
      p.update();
      p.draw();
    }

    // Connect nearby particles with faint lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 90) {
          const opacity = (1 - dist / 90) * 0.08;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(108,99,255,${opacity.toFixed(3)})`;
          ctx.lineWidth   = 0.6;
          ctx.stroke();
        }
      }
    }

    animFrame = requestAnimationFrame(draw);
  }

  // Mouse repulsion
  let mouse = { x: -9999, y: -9999 };
  const hero = $('#home');
  if (hero) {
    hero.addEventListener('mousemove', e => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });
    hero.addEventListener('mouseleave', () => {
      mouse.x = -9999;
      mouse.y = -9999;
    });
  }

  window.addEventListener('resize', () => {
    resize();
    buildParticles();
  });

  resize();
  buildParticles();
  draw();
})();

/* ──────────────────────────────────────────────
   4. TYPING EFFECT
────────────────────────────────────────────── */
(function initTyping() {
  const el = $('#typedText');
  if (!el) return;

  const roles = [
    'Web Developer',
    'WordPress Expert',
    'Front-End Developer',
    'ICT Educator',
    'Digital Solutions Expert',
  ];

  let roleIndex  = 0;
  let charIndex  = 0;
  let isDeleting = false;
  let isPaused   = false;

  const TYPING_SPEED   = 90;
  const DELETING_SPEED = 50;
  const PAUSE_AFTER    = 1800;
  const PAUSE_BEFORE   = 300;

  function type() {
    const currentRole = roles[roleIndex];

    if (isPaused) return;

    if (!isDeleting) {
      // Typing forward
      el.textContent = currentRole.slice(0, charIndex + 1);
      charIndex++;

      if (charIndex === currentRole.length) {
        // Finished typing — pause then start deleting
        isPaused = true;
        setTimeout(() => {
          isPaused   = false;
          isDeleting = true;
          requestAnimationFrame(() => setTimeout(type, DELETING_SPEED));
        }, PAUSE_AFTER);
        return;
      }
    } else {
      // Deleting
      el.textContent = currentRole.slice(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        isDeleting = false;
        roleIndex  = (roleIndex + 1) % roles.length;
        // Brief pause before typing next role
        isPaused = true;
        setTimeout(() => {
          isPaused = false;
          setTimeout(type, TYPING_SPEED);
        }, PAUSE_BEFORE);
        return;
      }
    }

    setTimeout(type, isDeleting ? DELETING_SPEED : TYPING_SPEED);
  }

  // Start after a short delay (let preloader run first)
  setTimeout(type, 2400);
})();

/* ──────────────────────────────────────────────
   5. HERO ENTRANCE ANIMATIONS
────────────────────────────────────────────── */
function startHeroAnimations() {
  $$('.hero .reveal-left, .hero .reveal-right').forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), i * 200);
  });
}

/* ──────────────────────────────────────────────
   6. NAVBAR — SCROLL GLASS + ACTIVE LINK
────────────────────────────────────────────── */
(function initNavbar() {
  const navbar  = $('#navbar');
  const links   = $$('.nav-link');
  const sections= $$('section[id]');

  function onScroll() {
    // Glassmorphism on scroll
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active link highlight based on scroll position
    let current = '';
    sections.forEach(section => {
      const top    = section.offsetTop - 120;
      const bottom = top + section.offsetHeight;
      if (window.scrollY >= top && window.scrollY < bottom) {
        current = section.getAttribute('id');
      }
    });

    links.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on init
})();

/* ──────────────────────────────────────────────
   7. HAMBURGER MENU
────────────────────────────────────────────── */
(function initHamburger() {
  const hamburger = $('#hamburger');
  const navLinks  = $('#navLinks');
  const body      = document.body;
  if (!hamburger || !navLinks) return;

  function openMenu() {
    hamburger.classList.add('open');
    navLinks.classList.add('open');
    body.classList.add('menu-open');
    hamburger.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    body.classList.remove('menu-open');
    hamburger.setAttribute('aria-expanded', 'false');
  }

  hamburger.addEventListener('click', () => {
    navLinks.classList.contains('open') ? closeMenu() : openMenu();
  });

  // Close on nav link click
  $$('.nav-link').forEach(link => link.addEventListener('click', closeMenu));

  // Close on outside click
  document.addEventListener('click', e => {
    if (!e.target.closest('.nav-container')) closeMenu();
  });

  // Close on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });
})();

/* ──────────────────────────────────────────────
   8. SCROLL REVEAL (Intersection Observer)
────────────────────────────────────────────── */
(function initScrollReveal() {
  const revealEls = $$('.reveal-up, .reveal-left, .reveal-right');

  // Hero section reveals are handled by startHeroAnimations()
  const nonHeroReveals = revealEls.filter(el => !el.closest('.hero'));

  if (!('IntersectionObserver' in window)) {
    // Fallback: show everything
    revealEls.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px',
  });

  nonHeroReveals.forEach(el => observer.observe(el));
})();

/* ──────────────────────────────────────────────
   9. SKILL BAR ANIMATION
────────────────────────────────────────────── */
(function initSkillBars() {
  const fills = $$('.skill-fill');
  if (!fills.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill  = entry.target;
        const width = fill.dataset.width || '0';
        // Small delay so the bar appears before animating
        setTimeout(() => {
          fill.style.width = width + '%';
        }, 200);
        observer.unobserve(fill);
      }
    });
  }, { threshold: 0.4 });

  fills.forEach(fill => observer.observe(fill));
})();

/* ──────────────────────────────────────────────
   10. COUNTER ANIMATION (About stats)
────────────────────────────────────────────── */
(function initCounters() {
  const counters = $$('.stat-number[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el      = entry.target;
      const target  = parseInt(el.dataset.count, 10);
      const duration= 1600;
      const step    = 16;
      const steps   = duration / step;
      let current   = 0;

      const inc = target / steps;

      const timer = setInterval(() => {
        current += inc;
        if (current >= target) {
          el.textContent = target + '+';
          clearInterval(timer);
        } else {
          el.textContent = Math.floor(current);
        }
      }, step);

      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
})();

/* ──────────────────────────────────────────────
   11. PORTFOLIO FILTER
────────────────────────────────────────────── */
(function initPortfolioFilter() {
  const filterBtns  = $$('.filter-btn');
  const projectCards= $$('.project-card');
  if (!filterBtns.length || !projectCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      projectCards.forEach((card, i) => {
        const match = filter === 'all' || card.dataset.category === filter;

        if (match) {
          card.classList.remove('hidden');
          // Stagger re-appearance
          card.style.transitionDelay = (i * 0.07) + 's';
          // Re-trigger reveal animation
          card.classList.remove('visible');
          requestAnimationFrame(() => {
            requestAnimationFrame(() => card.classList.add('visible'));
          });
        } else {
          card.classList.add('hidden');
          card.style.transitionDelay = '0s';
        }
      });
    });
  });

  // Show all cards on initial load
  projectCards.forEach((card, i) => {
    setTimeout(() => card.classList.add('visible'), 300 + i * 100);
  });
})();

/* ──────────────────────────────────────────────
   12. CONTACT FORM
────────────────────────────────────────────── */
(function initContactForm() {
  const form    = $('#contactForm');
  const success = $('#formSuccess');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    const btn = form.querySelector('button[type="submit"]');
    const originalHTML = btn.innerHTML;

    // Loading state
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Sending...</span>';
    btn.disabled  = true;

    // Simulate send (replace this with a real fetch() call to your backend / Formspree)
    setTimeout(() => {
      btn.innerHTML = originalHTML;
      btn.disabled  = false;
      form.reset();

      // Reset floating labels (they stay raised on autofill otherwise)
      $$('.form-input', form).forEach(input => {
        input.blur();
      });

      if (success) {
        success.classList.add('show');
        setTimeout(() => success.classList.remove('show'), 5000);
      }
    }, 1600);
  });
})();

/* ──────────────────────────────────────────────
   13. BACK TO TOP BUTTON
────────────────────────────────────────────── */
(function initBackToTop() {
  const btn = $('#backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ──────────────────────────────────────────────
   14. SMOOTH SCROLL for anchor links
────────────────────────────────────────────── */
(function initSmoothScroll() {
  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const id = anchor.getAttribute('href');
      if (id === '#') return;
      const target = $(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    });
  });
})();

/* ──────────────────────────────────────────────
   15. SERVICE CARD TILT EFFECT (subtle 3D)
────────────────────────────────────────────── */
(function initCardTilt() {
  // Skip on touch devices
  if (window.matchMedia('(hover: none)').matches) return;

  $$('.service-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect   = card.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) / (rect.width  / 2);
      const dy     = (e.clientY - cy) / (rect.height / 2);
      const tiltX  = clamp(dy * -8, -8, 8);
      const tiltY  = clamp(dx *  8, -8, 8);

      card.style.transform = `translateY(-10px) perspective(600px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

/* ──────────────────────────────────────────────
   16. PROJECT CARD TILT EFFECT
────────────────────────────────────────────── */
(function initProjectTilt() {
  if (window.matchMedia('(hover: none)').matches) return;

  $$('.project-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect  = card.getBoundingClientRect();
      const cx    = rect.left + rect.width  / 2;
      const cy    = rect.top  + rect.height / 2;
      const dx    = (e.clientX - cx) / (rect.width  / 2);
      const dy    = (e.clientY - cy) / (rect.height / 2);
      const tiltX = clamp(dy * -5, -5, 5);
      const tiltY = clamp(dx *  5, -5, 5);

      card.style.transform = `translateY(-8px) perspective(700px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

/* ──────────────────────────────────────────────
   17. NAVBAR LOGO CLICK — SCROLL TO TOP
────────────────────────────────────────────── */
(function initLogoClick() {
  const logo = $('.nav-logo');
  if (!logo) return;
  logo.addEventListener('click', e => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ──────────────────────────────────────────────
   18. SECTION PROGRESS INDICATOR
   (thin gradient line at top of viewport that
    shows how far down the page the user has scrolled)
────────────────────────────────────────────── */
(function initScrollProgress() {
  const bar = document.createElement('div');
  bar.id = 'scrollProgressBar';
  Object.assign(bar.style, {
    position:   'fixed',
    top:        '0',
    left:       '0',
    height:     '3px',
    width:      '0%',
    background: 'linear-gradient(90deg, #6c63ff, #00d4ff)',
    zIndex:     '2000',
    transition: 'width 0.1s linear',
    pointerEvents: 'none',
  });
  document.body.appendChild(bar);

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress  = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = progress.toFixed(2) + '%';
  }, { passive: true });
})();

/* ──────────────────────────────────────────────
   19. TIMELINE ITEM ENTRANCE (triggered by scroll)
────────────────────────────────────────────── */
(function initTimeline() {
  const items = $$('.timeline-item');
  if (!items.length) return;

  // They already use .reveal-left / .reveal-right handled by
  // initScrollReveal — this adds an extra stagger within each column
  items.forEach((item, i) => {
    const delay = (i % 5) * 0.12;  // stagger within same column
    item.style.transitionDelay = delay + 's';
  });
})();

/* ──────────────────────────────────────────────
   20. CONTACT ITEM STAGGER on scroll
────────────────────────────────────────────── */
(function initContactItems() {
  const items = $$('.contact-item');
  items.forEach((item, i) => {
    item.style.transitionDelay = (i * 0.08) + 's';
  });
})();

/* ──────────────────────────────────────────────
   21. SERVICE CARD STAGGER
────────────────────────────────────────────── */
(function initServiceStagger() {
  $$('.service-card').forEach((card, i) => {
    card.style.transitionDelay = (i * 0.1) + 's';
  });
})();

/* ──────────────────────────────────────────────
   22. ACTIVE NAV UNDERLINE SMOOTH INDICATOR
────────────────────────────────────────────── */
(function initNavUnderline() {
  // Visual glide bar under the active nav item
  const nav     = $('.nav-links');
  const links   = $$('.nav-link');
  if (!nav || !links.length) return;

  const glider = document.createElement('span');
  glider.classList.add('nav-glider');
  Object.assign(glider.style, {
    position:        'absolute',
    bottom:          '-4px',
    height:          '2px',
    background:      'linear-gradient(90deg, #6c63ff, #00d4ff)',
    borderRadius:    '1px',
    transition:      'left 0.35s ease, width 0.35s ease, opacity 0.25s ease',
    opacity:         '0',
    pointerEvents:   'none',
  });

  nav.style.position = 'relative';
  nav.appendChild(glider);

  function moveGlider(link) {
    const navRect  = nav.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();
    glider.style.opacity = '1';
    glider.style.left    = (linkRect.left - navRect.left) + 'px';
    glider.style.width   = linkRect.width + 'px';
  }

  links.forEach(link => {
    link.addEventListener('mouseenter', () => moveGlider(link));
    link.addEventListener('focus',      () => moveGlider(link));
  });

  nav.addEventListener('mouseleave', () => {
    glider.style.opacity = '0';
  });
})();

/* ──────────────────────────────────────────────
   23. LAZY-LOAD REAL PROJECT SCREENSHOTS
   (If you add real <img> tags inside .project-thumbnail,
    this will fade them in when they enter the viewport)
────────────────────────────────────────────── */
(function initLazyImages() {
  const imgs = $$('.project-thumbnail img[data-src]');
  if (!imgs.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src   = img.dataset.src;
        img.style.opacity    = '0';
        img.style.transition = 'opacity 0.5s ease';
        img.addEventListener('load', () => { img.style.opacity = '1'; }, { once: true });
        observer.unobserve(img);
      }
    });
  }, { rootMargin: '200px' });

  imgs.forEach(img => observer.observe(img));
})();

/* ──────────────────────────────────────────────
   24. SOCIAL ICON RIPPLE on click
────────────────────────────────────────────── */
(function initRipple() {
  $$('.social-icon, .btn').forEach(el => {
    el.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      const rect   = el.getBoundingClientRect();
      const size   = Math.max(rect.width, rect.height);
      const x      = e.clientX - rect.left - size / 2;
      const y      = e.clientY - rect.top  - size / 2;

      Object.assign(ripple.style, {
        position:     'absolute',
        borderRadius: '50%',
        width:        size + 'px',
        height:       size + 'px',
        left:         x + 'px',
        top:          y + 'px',
        background:   'rgba(255,255,255,0.25)',
        transform:    'scale(0)',
        animation:    'rippleAnim 0.55s ease forwards',
        pointerEvents:'none',
      });

      // Ensure relative positioning for overflow:hidden
      const currentPos = getComputedStyle(el).position;
      if (currentPos === 'static') el.style.position = 'relative';
      el.style.overflow = 'hidden';

      el.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });

  // Inject keyframes once
  if (!$('#rippleStyle')) {
    const style = document.createElement('style');
    style.id    = 'rippleStyle';
    style.textContent = `
      @keyframes rippleAnim {
        to { transform: scale(2.5); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
})();

/* ──────────────────────────────────────────────
   25. FOOTER LINK HOVER GLOW
────────────────────────────────────────────── */
(function initFooterGlow() {
  $$('.footer-social a').forEach(link => {
    link.addEventListener('mouseenter', () => {
      link.style.boxShadow = '0 0 18px rgba(108,99,255,0.55)';
    });
    link.addEventListener('mouseleave', () => {
      link.style.boxShadow = '';
    });
  });
})();

/* ──────────────────────────────────────────────
   INIT COMPLETE — log for development
────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  console.log('%c SHA Portfolio Loaded ✓', [
    'background: linear-gradient(90deg, #6c63ff, #00d4ff)',
    'color: #fff',
    'padding: 6px 16px',
    'border-radius: 4px',
    'font-weight: bold',
    'font-size: 13px',
  ].join(';'));
});
