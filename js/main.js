/* ============================================================
   HOT SHOT ENTERTAINMENT — main.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── NAV SCROLL BEHAVIOUR ──
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 80);
    updateActiveNav();
  });

  // ── HAMBURGER / DRAWER ──
  const hamburger = document.querySelector('.nav-hamburger');
  const drawer    = document.querySelector('.nav-drawer');
  const overlay   = document.querySelector('.nav-overlay');

  function closeDrawer() {
    hamburger.classList.remove('open');
    drawer.classList.remove('open');
    overlay.classList.remove('show');
    document.body.style.overflow = '';
  }
  hamburger?.addEventListener('click', () => {
    const isOpen = drawer.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    overlay.classList.toggle('show', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
  overlay?.addEventListener('click', closeDrawer);
  document.querySelectorAll('.nav-drawer a').forEach(a => a.addEventListener('click', closeDrawer));

  // ── ACTIVE NAV LINK ──
  const sections = document.querySelectorAll('section[id]');
  function updateActiveNav() {
    const scrollY = window.scrollY + 100;
    sections.forEach(section => {
      const top    = section.offsetTop;
      const height = section.offsetHeight;
      const id     = section.getAttribute('id');
      const links  = document.querySelectorAll(`.nav-links a[href="#${id}"]`);
      links.forEach(link => {
        link.classList.toggle('active', scrollY >= top && scrollY < top + height);
      });
    });
  }

  // ── SMOOTH SCROLL ──
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top    = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ── SCROLL ANIMATIONS ──
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.fade-up, .fade-left, .fade-right').forEach(el => {
    observer.observe(el);
  });

  // ── RENDER SITE FROM CONFIG ──
  if (typeof SITE_CONFIG === 'undefined') {
    console.error('SITE_CONFIG not loaded');
    return;
  }

  renderAbout();
  renderServices();
  renderGallery();
  renderTestimonials();
  renderPackages();
  renderFAQ();
  renderFooter();
  renderContact();

  // ── ABOUT ──
  function renderAbout() {
    const b = SITE_CONFIG.business;
    const el = document.getElementById('about-bio');
    if (el) el.innerHTML = `
      <p>I'm Cory Gulenchin — husband to Pamela, father to Anika and Kayden, and a DJ/MC who still can't believe this is what I get to do for a living.</p>
      <p>My path here wasn't exactly traditional. I started in heavy duty mechanics, but life had other plans. What began as a side passion for music and entertaining turned into Hot Shot Entertainment — a full-time career that's taken me behind the mic and the decks at hundreds of events across the Parkland, Interlake, and beyond.</p>
      <p>I'm a WPICC Certified Wedding Coordinator, which means I don't just show up and press play. I help plan the flow of your evening, coordinate with your vendors, introduce your wedding party, manage your timeline, and keep the energy exactly where it needs to be — all night long.</p>
      <p>Whether it's a wedding, a social, a corporate gala, or a community fundraiser, I bring the same thing every time: genuine care for your event and the experience to make it seamless.</p>
    `;
  }

  // ── SERVICES ──
  function renderServices() {
    const icons = {
      mic: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>`,
      music: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`,
      ring: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/><path d="M8 12l3 3 5-5"/></svg>`
    };
    const container = document.getElementById('core-services');
    if (!container) return;
    SITE_CONFIG.services.forEach((svc, i) => {
      const div = document.createElement('div');
      div.className = 'service-card fade-up';
      div.style.transitionDelay = `${i * 0.1}s`;
      div.innerHTML = `
        <div class="service-icon">${icons[svc.icon] || icons.mic}</div>
        <h3>${svc.title}</h3>
        <p>${svc.description}</p>
      `;
      container.appendChild(div);
      observer.observe(div);
    });

    const enhContainer = document.getElementById('enhancements-grid');
    if (!enhContainer) return;
    SITE_CONFIG.enhancements.forEach((enh, i) => {
      const div = document.createElement('div');
      div.className = 'enhancement-card fade-up';
      div.style.transitionDelay = `${i * 0.1}s`;
      div.innerHTML = `
        <img src="${enh.image}" alt="${enh.title}" loading="lazy">
        <div class="enhancement-overlay">
          <h4>${enh.title}</h4>
          <p>${enh.description}</p>
        </div>
      `;
      enhContainer.appendChild(div);
      observer.observe(div);
    });
  }

  // ── PACKAGES ──
  function renderPackages() {
    const container = document.getElementById('packages-grid');
    if (!container) return;
    SITE_CONFIG.packages.forEach((pkg, i) => {
      const div = document.createElement('div');
      div.className = `package-card fade-up${pkg.popular ? ' popular' : ''}`;
      div.style.transitionDelay = `${i * 0.1}s`;
      div.innerHTML = `
        ${pkg.popular ? '<span class="package-badge">Most Popular</span>' : ''}
        <div class="package-name">${pkg.name}</div>
        <div class="package-price">${pkg.price}</div>
        <div class="package-price-note">${pkg.priceNote}</div>
        <div class="package-desc">${pkg.description}</div>
        <ul class="package-features">
          ${pkg.features.map(f => `<li>${f}</li>`).join('')}
        </ul>
        <a href="#contact" class="btn ${pkg.popular ? 'btn-primary' : 'btn-gold-outline'}"
           data-package="${pkg.name}">Inquire Now</a>
      `;
      container.appendChild(div);
      observer.observe(div);
    });

    // Pre-fill package in contact form when clicking Inquire
    document.addEventListener('click', e => {
      const btn = e.target.closest('[data-package]');
      if (btn) {
        const pkgSelect = document.querySelector('select[name="package"]');
        if (pkgSelect) pkgSelect.value = btn.dataset.package;
      }
    });
  }

  // ── GALLERY ──
  function renderGallery() {
    const container = document.getElementById('gallery-grid');
    if (!container) return;
    SITE_CONFIG.gallery.forEach((item, i) => {
      const div = document.createElement('div');
      div.className = 'gallery-item fade-up';
      div.style.transitionDelay = `${(i % 3) * 0.1}s`;
      div.innerHTML = `
        <img src="${item.src}" alt="${item.alt}" loading="lazy">
        <div class="gallery-item-overlay">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            <line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
          </svg>
        </div>
      `;
      div.addEventListener('click', () => openLightbox(item.src, item.alt));
      container.appendChild(div);
      observer.observe(div);
    });
  }

  // ── LIGHTBOX ──
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  function openLightbox(src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }
  document.getElementById('lightbox-close')?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

  // ── TESTIMONIALS ──
  function renderTestimonials() {
    const container = document.getElementById('testimonials-list');
    const dotsContainer = document.getElementById('testimonial-dots');
    if (!container) return;

    SITE_CONFIG.testimonials.forEach((t, i) => {
      const div = document.createElement('div');
      div.className = `testimonial-item${i === 0 ? ' active' : ''}`;
      div.innerHTML = `
        <p class="testimonial-quote">"${t.shortQuote}"</p>
        <div class="testimonial-full">
          <p class="testimonial-quote">"${t.fullQuote}"</p>
        </div>
        <button class="testimonial-toggle" onclick="this.previousElementSibling.classList.toggle('shown'); this.textContent = this.previousElementSibling.classList.contains('shown') ? 'Show less' : 'Read the full message';">Read the full message</button>
        <div class="testimonial-attribution">${t.attribution}</div>
        <div class="testimonial-detail">${t.detail}</div>
      `;
      container.appendChild(div);

      if (dotsContainer) {
        const dot = document.createElement('button');
        dot.className = `testimonial-dot${i === 0 ? ' active' : ''}`;
        dot.addEventListener('click', () => goToTestimonial(i));
        dotsContainer.appendChild(dot);
      }
    });

    // Auto-advance every 8s
    if (SITE_CONFIG.testimonials.length > 1) {
      setInterval(() => {
        const current = [...document.querySelectorAll('.testimonial-item')].findIndex(el => el.classList.contains('active'));
        goToTestimonial((current + 1) % SITE_CONFIG.testimonials.length);
      }, 8000);
    }
  }

  function goToTestimonial(index) {
    document.querySelectorAll('.testimonial-item').forEach((el, i) => el.classList.toggle('active', i === index));
    document.querySelectorAll('.testimonial-dot').forEach((el, i) => el.classList.toggle('active', i === index));
  }

  // ── FAQ ──
  function renderFAQ() {
    const container = document.getElementById('faq-list');
    if (!container) return;
    SITE_CONFIG.faq.forEach((item, i) => {
      const div = document.createElement('div');
      div.className = 'faq-item fade-up';
      div.style.transitionDelay = `${i * 0.07}s`;
      div.innerHTML = `
        <button class="faq-question">
          <span>${item.q}</span>
          <svg class="faq-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </button>
        <div class="faq-answer"><p>${item.a}</p></div>
      `;
      div.querySelector('.faq-question').addEventListener('click', () => {
        const isOpen = div.classList.contains('open');
        document.querySelectorAll('.faq-item.open').forEach(el => el.classList.remove('open'));
        if (!isOpen) div.classList.add('open');
      });
      container.appendChild(div);
      observer.observe(div);
    });
  }

  // ── FOOTER ──
  function renderFooter() {
    const b = SITE_CONFIG.business;
    const year = document.getElementById('footer-year');
    if (year) year.textContent = new Date().getFullYear();
    const copy = document.getElementById('footer-copy');
    if (copy) copy.textContent = `© ${new Date().getFullYear()} ${b.name}. All rights reserved.`;
    const phone = document.getElementById('footer-phone');
    if (phone) { phone.href = b.phoneLink; phone.textContent = b.phone; }
    const email = document.getElementById('footer-email');
    if (email) { email.href = `mailto:${b.email}`; email.textContent = b.email; }
    const fb = document.getElementById('social-fb');
    if (fb && b.social.facebook) fb.href = b.social.facebook;
  }

  // ── CONTACT ──
  function renderContact() {
    const b = SITE_CONFIG.business;
    const phoneEl = document.getElementById('contact-phone');
    if (phoneEl) { phoneEl.href = b.phoneLink; phoneEl.textContent = b.phone; }
    const emailEl = document.getElementById('contact-email');
    if (emailEl) { emailEl.href = `mailto:${b.email}`; emailEl.textContent = b.email; }
  }

});
