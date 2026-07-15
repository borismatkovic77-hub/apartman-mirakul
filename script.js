const lang = document.documentElement.lang;

// Nav toggle
const navToggle = document.querySelector('.nav-toggle');
const navList = document.querySelector('.nav-list');
const header = document.querySelector('.site-header');

if (navToggle && navList) {
  const updateToggleState = (open) => {
    navToggle.setAttribute('aria-expanded', open);
    navToggle.setAttribute('aria-label', open
      ? (lang === 'en' ? 'Close menu' : 'Zatvori meni')
      : (lang === 'en' ? 'Open menu' : 'Otvori meni'));
  };

  navToggle.addEventListener('click', () => {
    const open = navList.classList.toggle('open');
    updateToggleState(open);
  });
  document.addEventListener('click', (e) => {
    if (!navList.contains(e.target) && !navToggle.contains(e.target)) {
      navList.classList.remove('open');
      updateToggleState(false);
    }
  });
  navList.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navList.classList.remove('open');
      updateToggleState(false);
    });
  });
}

if (header) {
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 80);
  }, { passive: true });
}

// Gallery toggle
const galleryToggle = document.getElementById('galleryToggle');
const galleryWrapper = document.querySelector('.gallery-wrapper');

galleryToggle?.addEventListener('click', () => {
  const expanded = galleryWrapper.classList.toggle('expanded');
  if (lang === 'en') {
    galleryToggle.textContent = expanded ? 'Hide photos' : 'Show all photos';
  } else {
    galleryToggle.textContent = expanded ? 'Sakrij fotografije' : 'Prikaži sve fotografije';
  }
  if (!expanded) {
    document.getElementById('gallery').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
});

// Modal
const inquiryModal = document.getElementById('inquiry-modal');
const openModalBtn = document.getElementById('openInquiryModal');
const closeModalBtn = document.querySelector('.modal-close');

function openModal() {
  inquiryModal.removeAttribute('hidden');
  document.body.style.overflow = 'hidden';
  closeModalBtn?.focus();
}

function closeModal() {
  inquiryModal.setAttribute('hidden', '');
  document.body.style.overflow = '';
  openModalBtn?.focus();
}

openModalBtn?.addEventListener('click', openModal);
closeModalBtn?.addEventListener('click', closeModal);

inquiryModal?.addEventListener('click', (e) => {
  if (e.target === inquiryModal) closeModal();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && inquiryModal && !inquiryModal.hasAttribute('hidden')) closeModal();
});

// Contact form
const form = document.querySelector('.inquiry-form');
const odrasli = document.getElementById('odrasli');
const deca = document.getElementById('deca');
const warning = document.getElementById('guests-warning');
const checkin = document.getElementById('checkin');
const checkout = document.getElementById('checkout');

const today = new Date().toISOString().split('T')[0];
if (checkin) checkin.min = today;

const bedPomocni = document.querySelector('input[value="Pomoćni ležaj"]') || document.querySelector('input[value="Extra bed"]');
const bedDeciji = document.querySelector('input[value="Dečiji krevetić"]') || document.querySelector('input[value="Baby cot"]');

function updateGuestLimits() {
  if (!odrasli || !deca) return;
  const adults = parseInt(odrasli.value);
  const children = parseInt(deca.value);
  const total = adults + children;

  Array.from(deca.options).forEach(opt => {
    opt.disabled = adults + parseInt(opt.value) > 4;
  });

  if (total > 4) {
    deca.value = Math.max(0, 4 - adults);
  }

  warning.hidden = adults + parseInt(deca.value) <= 4;

  const currentChildren = parseInt(deca.value);
  const soloAdult = adults <= 1 && currentChildren === 0;
  const oneAndOne = adults === 1 && currentChildren === 1;

  if (bedPomocni) {
    bedPomocni.disabled = soloAdult;
    if (soloAdult) bedPomocni.checked = false;
    bedPomocni.closest('.bed-option').classList.toggle('disabled', soloAdult);
  }

  if (bedDeciji) {
    const noDeca = currentChildren === 0;
    bedDeciji.disabled = noDeca;
    if (noDeca) bedDeciji.checked = false;
    bedDeciji.closest('.bed-option').classList.toggle('disabled', noDeca);
  }

  if (oneAndOne && bedPomocni && bedDeciji) {
    if (bedPomocni.checked) {
      bedDeciji.checked = false;
      bedDeciji.disabled = true;
      bedDeciji.closest('.bed-option').classList.add('disabled');
    } else if (bedDeciji.checked) {
      bedPomocni.checked = false;
      bedPomocni.disabled = true;
      bedPomocni.closest('.bed-option').classList.add('disabled');
    }
  }
}

odrasli?.addEventListener('change', updateGuestLimits);
deca?.addEventListener('change', updateGuestLimits);

bedPomocni?.addEventListener('change', () => {
  if (parseInt(odrasli?.value) === 1 && parseInt(deca?.value) === 1) {
    if (bedPomocni.checked) {
      bedDeciji.checked = false;
      bedDeciji.disabled = true;
      bedDeciji.closest('.bed-option').classList.add('disabled');
    } else {
      bedDeciji.disabled = false;
      bedDeciji.closest('.bed-option').classList.remove('disabled');
    }
  }
});

bedDeciji?.addEventListener('change', () => {
  if (parseInt(odrasli?.value) === 1 && parseInt(deca?.value) === 1) {
    if (bedDeciji.checked) {
      bedPomocni.checked = false;
      bedPomocni.disabled = true;
      bedPomocni.closest('.bed-option').classList.add('disabled');
    } else {
      bedPomocni.disabled = false;
      bedPomocni.closest('.bed-option').classList.remove('disabled');
    }
  }
});

function updateNights() {
  const nightsDisplay = document.getElementById('nights-display');
  const nightsText = document.getElementById('nights-text');
  const nocenjaInput = document.getElementById('nocenja');
  if (!checkin?.value || !checkout?.value) {
    if (nightsDisplay) nightsDisplay.hidden = true;
    return;
  }
  const diff = (new Date(checkout.value) - new Date(checkin.value)) / 86400000;
  if (diff > 0) {
    if (lang === 'en') {
      const label = diff === 1 ? 'night' : 'nights';
      nightsText.textContent = `${diff} ${label} (${checkin.value} → ${checkout.value})`;
      if (nocenjaInput) nocenjaInput.value = `${diff} ${label}`;
    } else {
      const label = diff === 1 ? 'noćenje' : 'noćenja';
      nightsText.textContent = `${diff} ${label} (${checkin.value} → ${checkout.value})`;
      if (nocenjaInput) nocenjaInput.value = `${diff} noćenja`;
    }
    nightsDisplay.hidden = false;
  } else {
    nightsDisplay.hidden = true;
  }
}

checkin?.addEventListener('change', () => {
  if (checkout) {
    checkout.min = checkin.value;
    if (checkout.value && checkout.value <= checkin.value) checkout.value = '';
  }
  updateNights();
});

checkout?.addEventListener('change', updateNights);

// Formspree handles submission

// Share button
const shareBtn = document.getElementById('shareBtn');
if (shareBtn && navigator.share) {
  shareBtn.hidden = false;
  shareBtn.addEventListener('click', () => {
    navigator.share({
      title: 'Apartman Mirakul — Subotica',
      text: lang === 'en'
        ? 'Elegantly furnished apartment in the center of Subotica, Booking score 10.'
        : 'Elegantno uređen apartman u centru Subotice, Booking ocena 10.',
      url: window.location.href,
    });
  });
}

// Lightbox
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const galleryLinks = Array.from(document.querySelectorAll('.gallery-masonry a'));
let currentIndex = 0;

function openLightbox(index) {
  currentIndex = index;
  lightboxImg.src = galleryLinks[index].href;
  lightboxImg.alt = galleryLinks[index].querySelector('img').alt;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
  lightboxImg.src = '';
}

function navigate(dir) {
  currentIndex = (currentIndex + dir + galleryLinks.length) % galleryLinks.length;
  lightboxImg.src = galleryLinks[currentIndex].href;
  lightboxImg.alt = galleryLinks[currentIndex].querySelector('img').alt;
}

galleryLinks.forEach((link, i) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    openLightbox(i);
  });
});

document.querySelector('.lightbox-close')?.addEventListener('click', closeLightbox);
document.querySelector('.lightbox-prev')?.addEventListener('click', () => navigate(-1));
document.querySelector('.lightbox-next')?.addEventListener('click', () => navigate(1));

lightbox?.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', (e) => {
  if (!lightbox?.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') navigate(-1);
  if (e.key === 'ArrowRight') navigate(1);
});

// Reviews carousel
const reviewsCarousel = document.querySelector('.reviews-carousel');
const reviewPrev = document.querySelector('.carousel-prev');
const reviewNext = document.querySelector('.carousel-next');
const dotsWrap = document.querySelector('.carousel-dots');

if (reviewsCarousel && dotsWrap) {
  const cards = Array.from(reviewsCarousel.querySelectorAll('.review-card'));

  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', lang === 'en' ? `Review ${i + 1}` : `Recenzija ${i + 1}`);
    dot.addEventListener('click', () => scrollToCard(i));
    dotsWrap.appendChild(dot);
  });

  function scrollToCard(index) {
    reviewsCarousel.scrollTo({ left: cards[index].offsetLeft, behavior: 'smooth' });
  }

  function getVisibleCount() {
    return window.innerWidth > 640 ? 2 : 1;
  }

  function getCurrentIndex() {
    const sl = reviewsCarousel.scrollLeft;
    let closest = 0, minDist = Infinity;
    cards.forEach((card, i) => {
      const dist = Math.abs(card.offsetLeft - sl);
      if (dist < minDist) { minDist = dist; closest = i; }
    });
    return closest;
  }

  function updateCarousel() {
    const i = getCurrentIndex();
    const visible = getVisibleCount();
    dotsWrap.querySelectorAll('.carousel-dot').forEach((dot, j) => {
      dot.classList.toggle('active', j === i);
    });
    if (reviewPrev) reviewPrev.disabled = i === 0;
    if (reviewNext) reviewNext.disabled = i >= cards.length - visible;
  }

  reviewPrev?.addEventListener('click', () => {
    scrollToCard(Math.max(0, getCurrentIndex() - getVisibleCount()));
  });

  reviewNext?.addEventListener('click', () => {
    scrollToCard(Math.min(cards.length - 1, getCurrentIndex() + getVisibleCount()));
  });

  reviewsCarousel.addEventListener('scroll', updateCarousel, { passive: true });
  window.addEventListener('resize', updateCarousel);
  updateCarousel();
}

// Analytics event tracking
function track(event_name, params) {
  if (typeof gtag === 'function') gtag('event', event_name, params);
}

// Phone clicks
document.getElementById('track-phone-contact')?.addEventListener('click', () =>
  track('phone_click', { location: 'contact' }));
document.getElementById('track-phone-footer')?.addEventListener('click', () =>
  track('phone_click', { location: 'footer' }));

// Email clicks
document.getElementById('track-email-contact')?.addEventListener('click', () =>
  track('email_click', { location: 'contact' }));
document.getElementById('track-email-footer')?.addEventListener('click', () =>
  track('email_click', { location: 'footer' }));

// About section tabs
function switchAboutTab(id, btn) {
  document.querySelectorAll('.about-panel').forEach(p => { p.hidden = true; });
  document.querySelectorAll('.about-tab').forEach(b => b.classList.remove('active'));
  document.getElementById('about-' + id).hidden = false;
  btn.classList.add('active');
}

// WhatsApp & Viber
document.getElementById('track-wa-contact')?.addEventListener('click', () =>
  track('whatsapp_click', { location: 'contact' }));
document.getElementById('track-viber-contact')?.addEventListener('click', () =>
  track('viber_click', { location: 'contact' }));

// Social media
document.getElementById('track-fb')?.addEventListener('click', () =>
  track('social_click', { platform: 'facebook' }));
document.getElementById('track-insta')?.addEventListener('click', () =>
  track('social_click', { platform: 'instagram' }));

// Booking.com clicks
document.querySelectorAll('a[href*="booking.com"]').forEach(el => {
  el.addEventListener('click', () =>
    track('booking_click', { location: el.closest('footer') ? 'footer' : el.classList.contains('review-btn') ? 'reviews' : el.classList.contains('footer-platform-link') ? 'footer' : 'booking_section' }));
});

// Gallery - prikaži sve fotografije
document.getElementById('galleryToggle')?.addEventListener('click', () => {
  const expanded = document.querySelector('.gallery-wrapper')?.classList.contains('expanded');
  track('gallery_toggle', { action: expanded ? 'expand' : 'collapse' });
});

// Lightbox otvoren
galleryLinks.forEach((link, i) => {
  link.addEventListener('click', () =>
    track('lightbox_open', { image_index: i }));
});

// Forma - slanje upita
document.querySelector('.inquiry-form')?.addEventListener('submit', (e) => {
  // Validacija: mora biti izabran bar jedan glavni ležaj (ne samo dečiji krevetić)
  const mainBeds = Array.from(document.querySelectorAll('input[name="lezajevi[]"]:checked'))
    .filter(cb => cb.value !== 'Dečiji krevetić' && cb.value !== 'Baby cot');
  const bedWarning = document.getElementById('bed-warning');
  if (mainBeds.length === 0) {
    e.preventDefault();
    if (bedWarning) bedWarning.hidden = false;
    return;
  }
  if (bedWarning) bedWarning.hidden = true;

  track('form_submit', { form: 'inquiry' });
  const successMsg = document.getElementById('form-success');
  if (successMsg) {
    e.preventDefault();
    fetch(e.target.action, { method: 'POST', body: new FormData(e.target), headers: { Accept: 'application/json' } })
      .then(r => {
        if (r.ok) {
          successMsg.hidden = false;
          e.target.reset();
          setTimeout(() => { closeModal(); successMsg.hidden = true; }, 2500);
        }
      });
  }
});

// Dinamika: scroll-reveal, animirani brojevi, paralaks
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion && 'IntersectionObserver' in window) {
  // Scroll-reveal (fade + slide-in) za kartice i redove
  const revealEls = document.querySelectorAll(
    '.feature-cards .card, .location-list li, .reviews-score-card, .review-card'
  );
  revealEls.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${(i % 4) * 80}ms`;
  });
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  revealEls.forEach(el => revealObserver.observe(el));

  // Animirano punjenje ocena (Booking recenzije)
  const scoreCard = document.querySelector('.reviews-score-card');
  if (scoreCard) {
    const bars = scoreCard.querySelectorAll('.bar-fill');
    const targetWidths = Array.from(bars).map(b => b.style.width);
    bars.forEach(b => { b.style.width = '0%'; });

    const scoreBig = scoreCard.querySelector('.score-big');
    const scoreTarget = scoreBig ? parseFloat(scoreBig.textContent) : null;
    if (scoreBig) scoreBig.textContent = '0.0';

    const scoreObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        bars.forEach((b, i) => { b.style.width = targetWidths[i]; });
        if (scoreBig && scoreTarget !== null) {
          const start = performance.now();
          const duration = 1200;
          const tick = (now) => {
            const p = Math.min((now - start) / duration, 1);
            scoreBig.textContent = (scoreTarget * p).toFixed(1);
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
        scoreObserver.unobserve(entry.target);
      });
    }, { threshold: 0.3 });
    scoreObserver.observe(scoreCard);
  }
}

// Suptilan paralaks na hero pozadini
const heroBackdrop = document.querySelector('.hero-backdrop');
if (heroBackdrop && !prefersReducedMotion) {
  let parallaxTicking = false;
  window.addEventListener('scroll', () => {
    if (window.scrollY > window.innerHeight) return;
    if (!parallaxTicking) {
      requestAnimationFrame(() => {
        heroBackdrop.style.transform = `translateY(${window.scrollY * 0.25}px)`;
        parallaxTicking = false;
      });
      parallaxTicking = true;
    }
  }, { passive: true });
}
