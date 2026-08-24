/* ============================================================
   SHEIKH HAIDER ABBAS — PORTFOLIO SCRIPT v3
   WhatsApp Float | Tooltip | Marquee | Particles | Typing |
   Cursor | Navbar | Hamburger | Reveal | Skill Bars |
   Counters | Filter | Form | Tilt | Ripple | Progress
   ============================================================ */

'use strict';

/* ──────────────────────────────────────────────
   UTILITIES
────────────────────────────────────────────── */
const $       = (s, c = document) => c.querySelector(s);
const $$      = (s, c = document) => [...c.querySelectorAll(s)];
const lerp    = (a, b, t) => a + (b - a) * t;
const clamp   = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
const mobile  = () => window.matchMedia('(hover: none)').matches;

/* ──────────────────────────────────────────────
   1. PRELOADER
────────────────────────────────────────────── */
(function initPreloader() {
  const el    = $('#preloader');
  if (!el) return;
  const start = Date.now();

  window.addEventListener('load', () => {
    const wait = Math.max(0, 1900 - (Date.now() - start));
    setTimeout(() => {
      el.classList.add('hidden');
      setTimeout(triggerHeroEntrance, 120);
    }, wait);
  });
})();

/* ──────────────────────────────────────────────
   2. CUSTOM CURSOR
────────────────────────────────────────────── */
(function initCursor() {
  const dot  = $('#cursorDot');
  const ring = $('#cursorOutline');
  if (!dot || !ring || mobile()) return;

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  (function loop() {
    rx = lerp(rx, mx, 0.13);
    ry = lerp(ry, my, 0.13);
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(loop);
  })();

  const INTER = 'a,button,.filter-btn,.service-card,.project-card,.client-card,.social-icon,.back-to-top,.wa-float-btn,.wa-tooltip-btn,.btn-whatsapp';

  document.addEventListener('mouseover', e => {
    if (!e.target.closest(INTER)) return;
    ring.style.width       = '56px';
    ring.style.height      = '56px';
    ring.style.borderColor = 'rgba(0,229,255,0.7)';
    dot.style.transform    = 'translate(-50%,-50%) scale(0)';
  });
  document.addEventListener('mouseout', e => {
    if (!e.target.closest(INTER)) return;
    ring.style.width       = '34px';
    ring.style.height      = '34px';
    ring.style.borderColor = 'rgba(124,111,255,0.6)';
    dot.style.transform    = 'translate(-50%,-50%) scale(1)';
  });
  document.addEventListener('mousedown', () => { ring.style.transform = 'translate(-50%,-50%) scale(0.78)'; });
  document.addEventListener('mouseup',   () => { ring.style.transform = 'translate(-50%,-50%) scale(1)'; });
})();

/* ──────────────────────────────────────────────
   3. PARTICLE CANVAS
────────────────────────────────────────────── */
(function initParticles() {
  const canvas = $('#particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, pts = [];

  const COLS = ['rgba(124,111,255,A)','rgba(0,229,255,A)','rgba(191,95,255,A)'];

  function resize() { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight; }

  class P {
    constructor() { this.reset(true); }
    reset(init = false) {
      this.x  = Math.random() * W;
      this.y  = init ? Math.random() * H : H + 8;
      this.r  = Math.random() * 1.5 + 0.4;
      this.vy = -(Math.random() * 0.35 + 0.1);
      this.vx = (Math.random() - 0.5) * 0.22;
      this.a  = Math.random() * 0.45 + 0.1;
      this.da = 1;
      this.ds = Math.random() * 0.018 + 0.005;
      this.ci = Math.floor(Math.random() * COLS.length);
    }
    update() {
      this.y += this.vy; this.x += this.vx;
      this.a += this.ds * this.da;
      if (this.a > 0.6)  { this.a = 0.6; this.da = -1; }
      if (this.a < 0.05) { this.a = 0.05; this.da = 1; }
      if (this.y + this.r < 0) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = COLS[this.ci].replace('A', this.a.toFixed(3));
      ctx.fill();
    }
  }

  function build() {
    pts = Array.from({ length: clamp(Math.floor((W * H) / 7800), 40, 160) }, () => new P());
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    pts.forEach(p => { p.update(); p.draw(); });
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
        const d  = Math.sqrt(dx*dx + dy*dy);
        if (d < 85) {
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = `rgba(124,111,255,${((1 - d/85) * 0.07).toFixed(3)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); build(); });
  resize(); build(); draw();
})();

/* ──────────────────────────────────────────────
   4. TYPING EFFECT
────────────────────────────────────────────── */
(function initTyping() {
  const el = $('#typedText');
  if (!el) return;

  const roles = [
    'Stunning Websites',
    'WordPress Solutions',
    'AI-Powered Web Apps',
    'Responsive Designs',
    'Digital Experiences',
  ];

  let ri = 0, ci = 0, del = false, paused = false;

  function tick() {
    if (paused) return;
    const r = roles[ri];
    if (!del) {
      el.textContent = r.slice(0, ci + 1);
      ci++;
      if (ci === r.length) {
        paused = true;
        setTimeout(() => { paused = false; del = true; setTimeout(tick, 50); }, 1900);
        return;
      }
    } else {
      el.textContent = r.slice(0, ci - 1);
      ci--;
      if (ci === 0) {
        del = false; ri = (ri + 1) % roles.length;
        paused = true;
        setTimeout(() => { paused = false; setTimeout(tick, 90); }, 280);
        return;
      }
    }
    setTimeout(tick, del ? 50 : 88);
  }
  setTimeout(tick, 2500);
})();

/* ──────────────────────────────────────────────
   5. HERO ENTRANCE
────────────────────────────────────────────── */
function triggerHeroEntrance() {
  $$('.hero .reveal-left, .hero .reveal-right').forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), i * 180);
  });
}

/* ──────────────────────────────────────────────
   6. NAVBAR — glass + active link
────────────────────────────────────────────── */
(function initNavbar() {
  const nav      = $('#navbar');
  const links    = $$('.nav-link');
  const sections = $$('section[id]');
  if (!nav) return;

  function onScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 50);
    let cur = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 130 && window.scrollY < s.offsetTop - 130 + s.offsetHeight) cur = s.id;
    });
    links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + cur));
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ──────────────────────────────────────────────
   7. HAMBURGER MENU
────────────────────────────────────────────── */
(function initHamburger() {
  const btn  = $('#hamburger');
  const menu = $('#navLinks');
  const body = document.body;
  if (!btn || !menu) return;

  const open  = () => { btn.classList.add('open');    menu.classList.add('open');    body.classList.add('menu-open');    btn.setAttribute('aria-expanded','true'); };
  const close = () => { btn.classList.remove('open'); menu.classList.remove('open'); body.classList.remove('menu-open'); btn.setAttribute('aria-expanded','false'); };

  btn.addEventListener('click', () => menu.classList.contains('open') ? close() : open());
  $$('.nav-link').forEach(l => l.addEventListener('click', close));
  document.addEventListener('click',   e => { if (!e.target.closest('.nav-container')) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
})();

/* ──────────────────────────────────────────────
   8. FLOATING WHATSAPP BUTTON
   - Appears after user scrolls 300px
   - Click the green button toggles tooltip
   - X inside tooltip closes it
   - Auto-open tooltip after 4 seconds (first visit only)
   - Badge disappears when tooltip opened
────────────────────────────────────────────── */
(function initWhatsAppFloat() {
  const wrapper   = $('#waFloat');
  const mainBtn   = $('#waFloatBtn');
  const closeBtn  = $('#waTooltipClose');
  const badge     = wrapper && wrapper.querySelector('.wa-badge');
  if (!wrapper || !mainBtn) return;

  let tooltipOpen     = false;
  let autoShown       = false;

  /* Show / hide wrapper on scroll */
  function onScroll() {
    if (window.scrollY > 300) {
      wrapper.style.opacity   = '1';
      wrapper.style.transform = 'translateY(0)';
      wrapper.style.pointerEvents = 'all';
    } else {
      wrapper.style.opacity   = '0';
      wrapper.style.transform = 'translateY(20px)';
      wrapper.style.pointerEvents = 'none';
      if (tooltipOpen) closeTooltip();
    }
  }

  /* Initial hidden state */
  Object.assign(wrapper.style, {
    opacity: '0',
    transform: 'translateY(20px)',
    transition: 'opacity 0.4s ease, transform 0.4s ease',
    pointerEvents: 'none',
  });

  window.addEventListener('scroll', onScroll, { passive: true });

  function openTooltip() {
    tooltipOpen = true;
    wrapper.classList.add('tooltip-open');
    if (badge) badge.style.display = 'none';
  }

  function closeTooltip() {
    tooltipOpen = false;
    wrapper.classList.remove('tooltip-open');
  }

  /* Toggle on main button click — but main button is also an <a> link.
     We intercept click, toggle tooltip, and only follow the href if tooltip is ALREADY open */
  mainBtn.addEventListener('click', e => {
    if (!tooltipOpen) {
      e.preventDefault();   // first click → show tooltip
      openTooltip();
    }
    // second click → href fires naturally (goes to WhatsApp)
    // after navigation tooltip closes via blur/scroll
  });

  if (closeBtn) closeBtn.addEventListener('click', e => { e.stopPropagation(); closeTooltip(); });

  /* Close tooltip when clicking outside */
  document.addEventListener('click', e => {
    if (tooltipOpen && !wrapper.contains(e.target)) closeTooltip();
  });

  /* Auto-show tooltip once after 4 s (only on first visit to this session) */
  if (!sessionStorage.getItem('wa_auto_shown')) {
    setTimeout(() => {
      if (window.scrollY > 300 && !autoShown) {
        autoShown = true;
        sessionStorage.setItem('wa_auto_shown', '1');
        openTooltip();
        /* Auto-close after 8 s if user doesn't interact */
        setTimeout(() => { if (tooltipOpen) closeTooltip(); }, 8000);
      }
    }, 4000);
  } else {
    if (badge) badge.style.display = 'none'; // already seen — hide badge
  }
})();

/* ──────────────────────────────────────────────
   9. SCROLL REVEAL (IntersectionObserver)
────────────────────────────────────────────── */
(function initScrollReveal() {
  const all     = $$('.reveal-up, .reveal-left, .reveal-right');
  const nonHero = all.filter(el => !el.closest('.hero'));

  if (!('IntersectionObserver' in window)) { all.forEach(el => el.classList.add('visible')); return; }

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -55px 0px' });

  nonHero.forEach(el => obs.observe(el));
})();

/* ──────────────────────────────────────────────
   10. SKILL BAR ANIMATION
────────────────────────────────────────────── */
(function initSkillBars() {
  const fills = $$('.skill-fill');
  if (!fills.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      setTimeout(() => { e.target.style.width = (e.target.dataset.width || 0) + '%'; }, 180);
      obs.unobserve(e.target);
    });
  }, { threshold: 0.4 });

  fills.forEach(f => obs.observe(f));
})();

/* ──────────────────────────────────────────────
   11. COUNTER ANIMATION — all [data-count] elements
────────────────────────────────────────────── */
(function initCounters() {
  const els = $$('[data-count]');
  if (!els.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el     = e.target;
      const target = parseInt(el.dataset.count, 10);
      const isStat = el.classList.contains('stat-number');
      const STEP   = 16;
      const steps  = (isStat ? 1600 : 2000) / STEP;
      const inc    = target / steps;
      let cur      = 0;

      const timer = setInterval(() => {
        cur += inc;
        if (cur >= target) {
          el.textContent = target + (isStat ? '+' : '');
          clearInterval(timer);
        } else {
          el.textContent = Math.floor(cur);
        }
      }, STEP);

      obs.unobserve(el);
    });
  }, { threshold: 0.5 });

  els.forEach(el => obs.observe(el));
})();

/* ──────────────────────────────────────────────
   12. PORTFOLIO FILTER
────────────────────────────────────────────── */
(function initPortfolioFilter() {
  const btns  = $$('.filter-btn');
  const cards = $$('.project-card');
  if (!btns.length) return;

  cards.forEach((c, i) => setTimeout(() => c.classList.add('visible'), 300 + i * 90));

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;

      cards.forEach((card, i) => {
        const match = f === 'all' || card.dataset.category === f;
        if (match) {
          card.classList.remove('hidden');
          card.style.transitionDelay = (i * 0.06) + 's';
          card.classList.remove('visible');
          requestAnimationFrame(() => requestAnimationFrame(() => card.classList.add('visible')));
        } else {
          card.style.transitionDelay = '0s';
          card.classList.add('hidden');
        }
      });
    });
  });
})();

/* ──────────────────────────────────────────────
   13. CONTACT FORM
────────────────────────────────────────────── */
(function initContactForm() {
  const form    = $('#contactForm');
  const success = $('#formSuccess');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn  = form.querySelector('button[type="submit"]');
    const orig = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Sending...</span>';
    btn.disabled  = true;

    /* ── Replace with fetch() to Formspree / EmailJS / your backend ── */
    setTimeout(() => {
      btn.innerHTML = orig;
      btn.disabled  = false;
      form.reset();
      $$('.form-input', form).forEach(i => i.blur());
      if (success) {
        success.classList.add('show');
        setTimeout(() => success.classList.remove('show'), 5500);
      }
    }, 1700);
  });
})();

/* ──────────────────────────────────────────────
   14. BACK TO TOP
────────────────────────────────────────────── */
(function initBackToTop() {
  const btn = $('#backToTop');
  if (!btn) return;
  window.addEventListener('scroll', () => btn.classList.toggle('visible', window.scrollY > 500), { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

/* ──────────────────────────────────────────────
   15. SMOOTH SCROLL
────────────────────────────────────────────── */
(function initSmoothScroll() {
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id === '#') return;
      const t = $(id);
      if (!t) return;
      e.preventDefault();
      t.scrollIntoView({ behavior: 'smooth' });
    });
  });
})();

/* ──────────────────────────────────────────────
   16. 3D TILT — service, project, client cards
────────────────────────────────────────────── */
(function initTilt() {
  if (mobile()) return;

  function tilt(selector, maxDeg) {
    $$(selector).forEach(card => {
      card.addEventListener('mousemove', e => {
        const r  = card.getBoundingClientRect();
        const dx = (e.clientX - r.left - r.width  / 2) / (r.width  / 2);
        const dy = (e.clientY - r.top  - r.height / 2) / (r.height / 2);
        const tx = clamp(dy * -maxDeg, -maxDeg, maxDeg);
        const ty = clamp(dx *  maxDeg, -maxDeg, maxDeg);
        card.style.transform = `translateY(-8px) perspective(650px) rotateX(${tx}deg) rotateY(${ty}deg)`;
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
  }

  tilt('.service-card',  8);
  tilt('.project-card',  5);
  tilt('.client-card',   4);
  tilt('.tmarquee-card', 3);
})();

/* ──────────────────────────────────────────────
   17. SCROLL PROGRESS BAR
────────────────────────────────────────────── */
(function initScrollProgress() {
  const bar = document.createElement('div');
  bar.id = 'spBar';
  Object.assign(bar.style, {
    position: 'fixed', top: '0', left: '0', height: '2px',
    width: '0%', background: 'linear-gradient(90deg,#7c6fff,#00e5ff)',
    zIndex: '2000', transition: 'width 0.08s linear', pointerEvents: 'none',
  });
  document.body.appendChild(bar);

  window.addEventListener('scroll', () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0).toFixed(2) + '%';
  }, { passive: true });
})();

/* ──────────────────────────────────────────────
   18. RIPPLE on buttons, filter btns, social icons
────────────────────────────────────────────── */
(function initRipple() {
  const s = document.createElement('style');
  s.textContent = '@keyframes rpl { to { transform:scale(2.6);opacity:0 } }';
  document.head.appendChild(s);

  $$('.btn, .filter-btn, .social-icon, .wa-float-btn, .wa-tooltip-btn').forEach(el => {
    el.addEventListener('click', function(e) {
      const r = el.getBoundingClientRect();
      const sz = Math.max(r.width, r.height);
      const sp = document.createElement('span');
      Object.assign(sp.style, {
        position:'absolute', borderRadius:'50%',
        width: sz+'px', height: sz+'px',
        left: (e.clientX-r.left-sz/2)+'px',
        top:  (e.clientY-r.top -sz/2)+'px',
        background:'rgba(255,255,255,0.22)',
        transform:'scale(0)', animation:'rpl 0.5s ease forwards',
        pointerEvents:'none',
      });
      if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
      el.style.overflow = 'hidden';
      el.appendChild(sp);
      sp.addEventListener('animationend', () => sp.remove());
    });
  });
})();

/* ──────────────────────────────────────────────
   19. MARQUEE — pause on hover (CSS handles it,
   this adds touch support)
────────────────────────────────────────────── */
(function initMarqueePause() {
  ['.marquee-track', '.tmarquee-track'].forEach(sel => {
    const track = $(sel);
    if (!track) return;
    track.addEventListener('touchstart', () => { track.style.animationPlayState = 'paused'; }, { passive: true });
    track.addEventListener('touchend',   () => { track.style.animationPlayState = 'running'; });
  });
})();

/* ──────────────────────────────────────────────
   20. FOOTER & SOCIAL GLOW
────────────────────────────────────────────── */
(function initFooterGlow() {
  $$('.footer-social a').forEach(a => {
    const isWA = a.getAttribute('aria-label') === 'WhatsApp';
    a.addEventListener('mouseenter', () => {
      a.style.boxShadow = isWA ? '0 0 18px rgba(37,211,102,0.5)' : '0 0 18px rgba(124,111,255,0.45)';
    });
    a.addEventListener('mouseleave', () => { a.style.boxShadow = ''; });
  });
})();

/* ──────────────────────────────────────────────
   21. NAV LOGO → scroll to top
────────────────────────────────────────────── */
(function initLogoScroll() {
  const logo = $('.nav-logo');
  if (logo) logo.addEventListener('click', e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
})();

/* ──────────────────────────────────────────────
   22. NAV GLIDER underline (desktop)
────────────────────────────────────────────── */
(function initNavGlider() {
  const nav   = $('.nav-links');
  const links = $$('.nav-link');
  if (!nav || !links.length || mobile()) return;

  const g = document.createElement('span');
  Object.assign(g.style, {
    position:'absolute', bottom:'-3px', height:'2px',
    background:'linear-gradient(90deg,#7c6fff,#00e5ff)',
    borderRadius:'1px', transition:'left 0.3s,width 0.3s,opacity 0.2s',
    opacity:'0', pointerEvents:'none',
  });
  nav.style.position = 'relative';
  nav.appendChild(g);

  const move = l => {
    const nr = nav.getBoundingClientRect(), lr = l.getBoundingClientRect();
    g.style.opacity = '1';
    g.style.left    = (lr.left - nr.left) + 'px';
    g.style.width   = lr.width + 'px';
  };

  links.forEach(l => {
    l.addEventListener('mouseenter', () => move(l));
    l.addEventListener('focus',      () => move(l));
  });
  nav.addEventListener('mouseleave', () => { g.style.opacity = '0'; });
})();

/* ──────────────────────────────────────────────
   23. STAGGER HELPERS
────────────────────────────────────────────── */
(function initStaggerDelays() {
  /* Timeline items */
  $$('.timeline-item').forEach((el, i) => { el.style.transitionDelay = ((i % 5) * 0.1) + 's'; });
  /* Client cards */
  $$('.client-card').forEach((el, i)    => { el.style.transitionDelay = (i * 0.08) + 's'; });
  /* Activity cards */
  $$('.activity-card').forEach((el, i)  => { el.style.transitionDelay = (i * 0.1)  + 's'; });
  /* Counter items */
  $$('.clients-counter-item').forEach((el, i) => { el.style.transitionDelay = (i * 0.07) + 's'; });
})();

/* ──────────────────────────────────────────────
   24. COUNTER ROW hover glow
────────────────────────────────────────────── */
(function initCounterGlow() {
  $$('.clients-counter-item').forEach(el => {
    el.addEventListener('mouseenter', () => { el.style.boxShadow = '0 0 30px rgba(124,111,255,0.18) inset'; });
    el.addEventListener('mouseleave', () => { el.style.boxShadow = ''; });
  });
})();

/* ──────────────────────────────────────────────
   25. WA CTA BANNER — pulse glow on hover
────────────────────────────────────────────── */
(function initWaCtaBanner() {
  const banner = $('.wa-cta-banner');
  if (!banner) return;
  banner.addEventListener('mouseenter', () => {
    banner.style.boxShadow = '0 0 50px rgba(37,211,102,0.18), 0 0 100px rgba(37,211,102,0.08)';
  });
  banner.addEventListener('mouseleave', () => { banner.style.boxShadow = ''; });
})();

/* ──────────────────────────────────────────────
   26. LAZY IMAGE LOADING (real screenshots)
   Use <img data-src="path.jpg"> inside
   .project-thumbnail to lazy load screenshots
────────────────────────────────────────────── */
(function initLazyImages() {
  $$('.project-thumbnail img[data-src]').forEach(img => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        img.src = img.dataset.src;
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.5s ease';
        img.addEventListener('load', () => { img.style.opacity = '1'; }, { once: true });
        obs.unobserve(img);
      });
    }, { rootMargin: '200px' });
    obs.observe(img);
  });
})();

/* ──────────────────────────────────────────────
   27. HERO STATS fade-in on visibility
────────────────────────────────────────────── */
(function initHeroStats() {
  const box = $('.hero-stats');
  if (!box) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      $$('.hstat-num', box).forEach((el, i) => {
        el.style.opacity   = '0';
        el.style.transform = 'translateY(10px)';
        el.style.transition = `opacity 0.5s ${i * 0.1}s ease, transform 0.5s ${i * 0.1}s ease`;
        requestAnimationFrame(() => {
          el.style.opacity   = '1';
          el.style.transform = 'translateY(0)';
        });
      });
      obs.unobserve(box);
    });
  }, { threshold: 0.5 });
  obs.observe(box);
})();

/* ──────────────────────────────────────────────
   28. SECTION ENTRANCE — add visible class to
   about-cta-row, wa-cta-banner if they miss
   the reveal observer (they're not reveal-* classes)
────────────────────────────────────────────── */
(function initExtraReveal() {
  const extras = $$('.wa-cta-banner, .testimonial-marquee, .marquee-strip');
  if (!extras.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity   = '1';
        e.target.style.transform = 'translateY(0)';
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.05 });

  extras.forEach(el => {
    Object.assign(el.style, {
      opacity:    '0',
      transform:  'translateY(28px)',
      transition: 'opacity 0.7s ease, transform 0.7s ease',
    });
    obs.observe(el);
  });
})();

/* ──────────────────────────────────────────────
   DONE
────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  console.log(
    '%c SHA Portfolio v3 ✓ ',
    'background:linear-gradient(90deg,#25d366,#7c6fff);color:#fff;padding:5px 16px;border-radius:20px;font-weight:700;font-size:13px;'
  );
});
