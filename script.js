/* ============================================================
   ALAZAL PLATFORM — Landing Page Behavior
   Cinematic platform site: phone-mockup hero with screen-cycle,
   plus standard nav, CTA tracking, and footer socials.
   ============================================================ */
(() => {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ============================================================
     Top bar — scroll tint + mobile menu
     ============================================================ */
  const topbar = document.getElementById('topbar');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  const onScroll = () => {
    if (window.scrollY > 40) topbar.classList.add('is-scrolled');
    else topbar.classList.remove('is-scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const closeMenu = () => {
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'فتح القائمة');
    navMenu.hidden = true;
  };
  const openMenu = () => {
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.setAttribute('aria-label', 'إغلاق القائمة');
    navMenu.hidden = false;
  };
  navToggle.addEventListener('click', () => {
    navToggle.getAttribute('aria-expanded') === 'true' ? closeMenu() : openMenu();
  });
  navMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && navToggle.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      navToggle.focus();
    }
  });

  /* ============================================================
     Active nav-link highlighting
     ============================================================ */
  const sections = ['home', 'legacy', 'download', 'teach', 'contact']
    .map(id => document.getElementById(id))
    .filter(Boolean);

  const navLinks = topbar.querySelectorAll('.topbar__nav a');
  const linkFor = hash => Array.from(navLinks).find(a => a.getAttribute('href') === `#${hash}`);

  if ('IntersectionObserver' in window) {
    const navObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          navLinks.forEach(a => a.classList.remove('is-active'));
          const link = linkFor(e.target.id);
          if (link) link.classList.add('is-active');
        }
      });
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
    sections.forEach(s => navObs.observe(s));
  }

  /* ============================================================
     Hero phone — cycle the front screen between two images.
     ============================================================ */
  const heroScreens = document.querySelectorAll('.phone--hero .phone__screen');
  if (heroScreens.length > 1 && !prefersReducedMotion) {
    let i = 0;
    setInterval(() => {
      heroScreens[i].classList.remove('is-on');
      i = (i + 1) % heroScreens.length;
      heroScreens[i].classList.add('is-on');
    }, 4200);
  }

  /* ============================================================
     Legacy cards reveal-on-scroll.
     ============================================================ */
  const legacyCards = document.querySelectorAll('.legacy-card');
  legacyCards.forEach((el, i) => el.style.setProperty('--i', i % 3));
  if ('IntersectionObserver' in window) {
    const lcObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          lcObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -10% 0px' });
    legacyCards.forEach(el => lcObs.observe(el));
  } else {
    legacyCards.forEach(el => el.classList.add('is-visible'));
  }

  /* ============================================================
     CTA tracking — fire GA4/Clarity events on data-cta clicks.
     `generate_lead` fires for the high-intent set: store downloads,
     phone calls, WhatsApp, and the teacher interest form. Other CTAs
     (nav, social follow, plain navigation) fire only `cta_click`.
     ============================================================ */
  const LEAD_CTAS = new Set([
    'topbar_download',
    'hero_google_play',
    'hero_app_store',
    'download_google_play',
    'download_app_store',
    'footer_phone_call',
    'social_whatsapp',
    'teacher_interest',
  ]);

  document.addEventListener('click', (e) => {
    const cta = e.target.closest('[data-cta]');
    if (!cta) return;
    const name = cta.getAttribute('data-cta');
    if (typeof gtag === 'function') {
      gtag('event', 'cta_click', { cta_name: name });
      if (LEAD_CTAS.has(name)) {
        gtag('event', 'generate_lead', { method: name });
      }
    }
    if (typeof clarity === 'function') {
      clarity('event', 'cta_' + name);
    }
  });

  /* ============================================================
     Footer socials — Alazal Platform's public channels.
     ============================================================ */
  const SOCIAL_ICONS = {
    whatsapp: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.47 14.38c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.1 4.49.71.31 1.27.49 1.7.63.71.23 1.36.2 1.87.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35M12.04 21.5h-.01a9.45 9.45 0 0 1-4.82-1.32l-.34-.2-3.58.94.95-3.5-.22-.35a9.44 9.44 0 0 1-1.44-5.03c0-5.22 4.25-9.48 9.48-9.48 2.53 0 4.91.99 6.7 2.78a9.45 9.45 0 0 1 2.78 6.7 9.48 9.48 0 0 1-9.5 9.46m8.08-17.52A11.41 11.41 0 0 0 12.05.5C5.76.5.66 5.6.66 11.88c0 2.01.52 3.96 1.52 5.69L.55 23.5l6.06-1.59a11.39 11.39 0 0 0 5.45 1.39h.01c6.28 0 11.38-5.1 11.38-11.39 0-3.04-1.18-5.9-3.33-8.05"/></svg>',
    instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>',
    telegram: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z"/></svg>',
    facebook: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22 12a10 10 0 1 0-11.56 9.88v-7H7.9V12h2.54V9.8c0-2.5 1.5-3.89 3.77-3.89 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.77l-.44 2.88h-2.33v7A10 10 0 0 0 22 12"/></svg>',
    tiktok: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19.6 6.4a4.6 4.6 0 0 1-3.4-1.5 4.6 4.6 0 0 1-1.2-3H11v12.7a2.4 2.4 0 1 1-2.4-2.4c.25 0 .49.04.71.11V8.97a5.78 5.78 0 0 0-.71-.04 5.7 5.7 0 1 0 5.7 5.7V8.93a7.7 7.7 0 0 0 5.3 1.97V7.6c-.5.05-.84.05-1 .05V6.4z"/></svg>',
  };

  // Confirmed handles from the group site's contacts data. Add TikTok or
  // YouTube here once their handles are confirmed.
  const SOCIALS = [
    { type: 'whatsapp',  href: 'https://wa.me/9647818041198',           label: 'واتساب منصة الأزل', cta: 'social_whatsapp', cls: 'is-whatsapp' },
    { type: 'instagram', href: 'https://instagram.com/alazalplatform',  label: 'إنستغرام منصة الأزل', cta: 'social_instagram' },
    { type: 'telegram',  href: 'https://t.me/alazalplatform',           label: 'تلغرام منصة الأزل', cta: 'social_telegram' },
    { type: 'facebook',  href: 'https://facebook.com/alazalplatform',   label: 'فيسبوك منصة الأزل', cta: 'social_facebook' },
  ];

  const socialsEl = document.getElementById('footerSocials');
  if (socialsEl) {
    const frag = document.createDocumentFragment();
    SOCIALS.forEach(s => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = s.href;
      a.target = '_blank';
      a.rel = 'noopener';
      if (s.cls) a.className = s.cls;
      if (s.cta) a.setAttribute('data-cta', s.cta);
      a.setAttribute('aria-label', s.label);
      a.innerHTML = SOCIAL_ICONS[s.type] || '';
      li.appendChild(a);
      frag.appendChild(li);
    });
    socialsEl.appendChild(frag);
  }

})();
