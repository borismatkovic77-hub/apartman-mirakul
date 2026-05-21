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
