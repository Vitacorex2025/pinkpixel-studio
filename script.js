/* ── Cookie consent auto-hide ── */
(function() {
  if (localStorage.getItem('cookieConsent')) {
    var banner = document.getElementById('cookie-banner');
    if (banner) banner.classList.add('is-hidden');
  }
})();

const body = document.body;
const loader = document.querySelector('.page-loader');
const header = document.querySelector('.site-header');
const menuToggles = [...document.querySelectorAll('.menu-toggle')];
const menuPanel = document.getElementById('header-menu');
const menuOverlay = document.getElementById('reference-menu');
const menuBlur = document.getElementById('bg-menu-blur');
const menuLinks = document.querySelectorAll('.mobile-nav a');
const overlayMenuLinks = document.querySelectorAll('#reference-menu a[href^="#"]');
const transitionLabel = document.getElementById('page-transition-label');
const chapterLabel = document.getElementById('chapter-label');
const revealItems = document.querySelectorAll('.reveal');
const navLinks = document.querySelectorAll('.active-state[href^="#"]');
const transitionLinks = [...document.querySelectorAll('a[href^="#"]:not([href="#"])')];
const sections = [...document.querySelectorAll('main section[id]')];
const parallaxItems = document.querySelectorAll('[data-parallax]');
const magneticItems = document.querySelectorAll('.magnetic');
const statNumber = document.getElementById('key-stat-number');
const statText = document.getElementById('key-stat-text');
const statSection = document.querySelector('.key-stats-about-us');
const gravitySlides = [...document.querySelectorAll('.gravity-slide')];
const gravityPrev = document.querySelector('.gravity-prev-btn');
const gravityNext = document.querySelector('.gravity-next-btn');
const timelineCards = [...document.querySelectorAll('.horizontal-scroll-card-about-us')];
const accordions = [...document.querySelectorAll('.faq-accordion')];
const form = document.getElementById('project-form');
const formStatus = document.querySelector('.form-status');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const root = document.documentElement;
const sectionMeta = {
  hero: { label: 'Hero', chapter: 'hero' },
  services: { label: 'Offers', chapter: 'services' },
  showcase: { label: 'Showcase', chapter: 'showcase' },
  story: { label: 'Approach', chapter: 'story' },
  timeline: { label: 'Process', chapter: 'timeline' },
  experience: { label: 'Motion', chapter: 'showcase' },
  team: { label: 'Team', chapter: 'showcase' },
  clients: { label: 'Proof', chapter: 'clients' },
  awards: { label: 'Standards', chapter: 'awards' },
  'stacked-showcase': { label: 'Showcase', chapter: 'awards' },
  testimonials: { label: 'Briefs', chapter: 'testimonials' },
  faq: { label: 'FAQ', chapter: 'faq' },
  contact: { label: 'Quote', chapter: 'contact' }
};

window.addEventListener('load', () => {
  window.setTimeout(() => loader?.classList.add('is-hidden'), 850);
});

let menuOverlayTimer = 0;
let menuBlurTimer = 0;
let pageTransitionTimer = 0;

const setMenuState = (open) => {
  menuToggles.forEach((toggle) => {
    toggle.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
  });

  if (menuPanel) menuPanel.hidden = true;
  body.classList.toggle('is-lock', open);
  body.classList.toggle('is-menu-open', open);

  window.clearTimeout(menuOverlayTimer);
  window.clearTimeout(menuBlurTimer);

  if (open) {
    if (menuOverlay) {
      menuOverlay.hidden = false;
      window.requestAnimationFrame(() => menuOverlay.classList.add('is-open'));
    }
    if (menuBlur) {
      menuBlur.hidden = false;
      window.requestAnimationFrame(() => menuBlur.classList.add('is-visible'));
    }
    return;
  }

  if (menuOverlay) {
    menuOverlay.classList.remove('is-open');
    menuOverlayTimer = window.setTimeout(() => {
      menuOverlay.hidden = true;
    }, 460);
  }

  if (menuBlur) {
    menuBlur.classList.remove('is-visible');
    menuBlurTimer = window.setTimeout(() => {
      menuBlur.hidden = true;
    }, 320);
  }
};

const triggerPageTransition = (target, href) => {
  if (!target) return;
  const meta = sectionMeta[target.id] || { label: 'Section' };
  if (transitionLabel) {
    transitionLabel.textContent = meta.label;
  }
  body.classList.add('is-transitioning');
  window.clearTimeout(pageTransitionTimer);

  window.setTimeout(() => {
    target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
    if (history.replaceState) {
      history.replaceState(null, '', href);
    }
  }, reducedMotion ? 30 : 110);

  pageTransitionTimer = window.setTimeout(() => {
    body.classList.remove('is-transitioning');
  }, reducedMotion ? 220 : 760);
};

menuToggles.forEach((toggle) => {
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    setMenuState(!open);
  });
});
menuBlur?.addEventListener('click', () => setMenuState(false));
menuLinks.forEach((link) => link.addEventListener('click', () => setMenuState(false)));
overlayMenuLinks.forEach((link) => link.addEventListener('click', () => setMenuState(false)));
transitionLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    const href = link.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    event.preventDefault();
    setMenuState(false);
    triggerPageTransition(target, href);
  });
});
window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') setMenuState(false);
});
window.addEventListener('resize', () => {
  if (window.innerWidth > 992 && menuPanel) menuPanel.hidden = true;
  applyGravityLayout();
});

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -10% 0px' });
  revealItems.forEach((item) => revealObserver.observe(item));
}

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const id = entry.target.id;
    const meta = sectionMeta[id] || { label: 'Section', chapter: id };
    navLinks.forEach((link) => {
      link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
    });
    header?.classList.toggle('is-light', entry.target.dataset.theme === 'light');
    body.dataset.chapter = meta.chapter;
    if (chapterLabel) {
      chapterLabel.textContent = meta.label;
    }
  });
}, { threshold: 0.45, rootMargin: '-18% 0px -40% 0px' });
sections.forEach((section) => sectionObserver.observe(section));

let raf = 0;
const updateOnScroll = () => {
  header?.classList.toggle('is-scrolled', window.scrollY > 18);
  const scrollable = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
  const progress = Math.min(window.scrollY / scrollable, 1);
  const patternProgress = Math.max(0, Math.min((progress - 0.02) / 0.28, 1));
  root.style.setProperty('--pattern-opacity', reducedMotion ? 0.16 : patternProgress.toFixed(3));
  root.style.setProperty('--pattern-shift', `${(window.scrollY * 0.14).toFixed(1)}px`);
  if (!reducedMotion) {
    const mid = window.innerHeight / 2;
    parallaxItems.forEach((item) => {
      const speed = Number(item.dataset.speed || 0);
      const rect = item.getBoundingClientRect();
      const delta = rect.top + rect.height / 2 - mid;
      item.style.transform = `translate3d(0, ${(-delta * speed * 0.18).toFixed(2)}px, 0)`;
    });
  }
  raf = 0;
};
window.addEventListener('scroll', () => {
  if (raf) return;
  raf = window.requestAnimationFrame(updateOnScroll);
}, { passive: true });
updateOnScroll();

magneticItems.forEach((item) => {
  if (reducedMotion) return;
  item.addEventListener('mousemove', (event) => {
    const rect = item.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    item.style.setProperty('--magnetic-x', `${x * 0.06}px`);
    item.style.setProperty('--magnetic-y', `${y * 0.06}px`);
  });
  item.addEventListener('mouseleave', () => {
    item.style.setProperty('--magnetic-x', '0px');
    item.style.setProperty('--magnetic-y', '0px');
  });
});

const statSteps = [
  { number: 'From $1,250', text: 'Starting scope for focused landing page projects. Clear price anchors make the studio feel more premium and easier to buy from.' },
  { number: '2-8 weeks', text: 'Typical delivery range depending on scope, content, and integrations. Fast enough to launch, structured enough to feel considered.' },
  { number: 'Design + build', text: 'Positioning, visual direction, responsive UI, and launch flow can sit inside one premium website sequence instead of being split across vendors.' }
];
let statIndex = 0;
let statTimer = null;
const renderStat = (index) => {
  if (!statNumber || !statText) return;
  statNumber.classList.add('is-changing');
  statText.classList.add('is-changing');
  window.setTimeout(() => {
    statNumber.textContent = statSteps[index].number;
    statText.textContent = statSteps[index].text;
    statNumber.classList.remove('is-changing');
    statText.classList.remove('is-changing');
  }, 180);
};
if (statSection && 'IntersectionObserver' in window) {
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        window.clearInterval(statTimer);
        statTimer = null;
        return;
      }
      if (statTimer) return;
      statTimer = window.setInterval(() => {
        statIndex = (statIndex + 1) % statSteps.length;
        renderStat(statIndex);
      }, 2600);
    });
  }, { threshold: 0.45 });
  statObserver.observe(statSection);
}

let gravityIndex = 0;
const applyGravityLayout = () => {
  gravitySlides.forEach((slide, index) => {
    const offset = index - gravityIndex;
    const isMobile = window.innerWidth <= 767;
    if (offset < 0) {
      slide.style.opacity = '0';
      slide.style.pointerEvents = 'none';
      slide.style.transform = `translate3d(${isMobile ? 0 : 2}rem, 120%, 0) rotate(${isMobile ? 4 : 7}deg)`;
      slide.style.zIndex = '0';
      return;
    }
    const y = offset * (isMobile ? 14 : 18);
    const x = offset * (isMobile ? 0 : 12);
    const scale = 1 - offset * 0.04;
    const opacity = Math.max(1 - offset * 0.16, 0);
    slide.style.opacity = String(opacity);
    slide.style.pointerEvents = offset === 0 ? 'auto' : 'none';
    slide.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
    slide.style.zIndex = String(50 - index);
  });
  gravityPrev?.classList.toggle('is-disabled', gravityIndex === 0);
  gravityNext?.classList.toggle('is-disabled', gravityIndex >= gravitySlides.length - 1);
};
gravityPrev?.addEventListener('click', () => {
  if (gravityIndex === 0) return;
  gravityIndex -= 1;
  applyGravityLayout();
});
gravityNext?.addEventListener('click', () => {
  if (gravityIndex >= gravitySlides.length - 1) return;
  gravityIndex += 1;
  applyGravityLayout();
});
applyGravityLayout();

timelineCards.forEach((card) => {
  const activate = () => {
    timelineCards.forEach((item) => item.classList.toggle('is-active', item === card));
  };
  card.addEventListener('mouseenter', activate);
  card.addEventListener('focusin', activate);
  card.addEventListener('click', activate);
});

accordions.forEach((accordion) => {
  const head = accordion.querySelector('.accordion-head');
  head?.addEventListener('click', () => {
    const willOpen = !accordion.classList.contains('is-open');
    accordions.forEach((item) => item.classList.remove('is-open'));
    if (willOpen) accordion.classList.add('is-open');
  });
});

form?.addEventListener('submit', (event) => {
  if (!formStatus) return;
  formStatus.textContent = 'Sending your request...';
});


(() => {
  const root = document.documentElement;
  let patternRaf = 0;

  const clamp01 = (value) => Math.max(0, Math.min(value, 1));

  const updatePattern = () => {
    const scrollable = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    const progress = Math.min(window.scrollY / scrollable, 1);
    const smoothstep = (value) => value * value * (3 - 2 * value);
    const topVisible = smoothstep(clamp01((progress - 0.01) / 0.16));
    const bottomVisible = smoothstep(clamp01((progress - 0.05) / 0.2));

    root.style.setProperty('--pattern-top-opacity', reducedMotion ? '0.22' : (0.14 + topVisible * 0.7).toFixed(3));
    root.style.setProperty('--pattern-bottom-opacity', reducedMotion ? '0.2' : (0.14 + bottomVisible * 0.82).toFixed(3));
    root.style.setProperty('--pattern-top-scale', reducedMotion ? '1' : (1.08 - topVisible * 0.08).toFixed(3));
    root.style.setProperty('--pattern-bottom-scale', reducedMotion ? '1' : (1.12 - bottomVisible * 0.12).toFixed(3));
    root.style.setProperty('--pattern-top-blur', reducedMotion ? '0px' : `${(8 - topVisible * 8).toFixed(2)}px`);
    root.style.setProperty('--pattern-bottom-blur', reducedMotion ? '0px' : `${(14 - bottomVisible * 12).toFixed(2)}px`);
    root.style.setProperty('--pattern-shift', `${(window.scrollY * 0.22).toFixed(1)}px`);
    patternRaf = 0;
  };

  const requestPattern = () => {
    if (patternRaf) return;
    patternRaf = window.requestAnimationFrame(updatePattern);
  };

  window.addEventListener('scroll', requestPattern, { passive: true });
  window.addEventListener('resize', requestPattern);
  updatePattern();
})();


(() => {
  const scene = document.getElementById('immersive-scene');
  const backdrop = scene?.querySelector('.immersive-backdrop');
  const feature = scene?.querySelector('.immersive-feature');
  const copy = scene?.querySelector('.immersive-copy-block');
  const featureCopy = scene?.querySelector('.immersive-feature-copy');
  const cards = scene ? [...scene.querySelectorAll('.immersive-card')] : [];
  const progressBar = document.getElementById('immersive-progress-bar');

  if (!scene || !backdrop || !feature || !copy || !cards.length) return;

  let desktop = false;
  let ticking = 0;

  const clamp01 = (value) => Math.max(0, Math.min(value, 1));
  const smoothstep = (value) => value * value * (3 - 2 * value);

  const renderStatic = () => {
    backdrop.style.opacity = '0.82';
    backdrop.style.transform = 'scale(1)';
    copy.style.opacity = '1';
    copy.style.transform = 'translate3d(0, 0, 0)';
    feature.style.transform = 'translate3d(0, 0, 0) scale(1) rotate(0deg)';
    if (featureCopy) {
      featureCopy.style.transform = 'translate3d(0, 0, 0)';
    }
    cards.forEach((card) => {
      card.style.transform = 'translate3d(0, 0, 0) scale(1) rotate(0deg)';
      card.style.opacity = '1';
    });
    if (progressBar) {
      progressBar.style.transform = 'scaleX(1)';
    }
  };

  const renderDesktop = () => {
    const totalScrollable = Math.max(scene.offsetHeight - window.innerHeight, 1);
    const start = -scene.getBoundingClientRect().top;
    const raw = clamp01(start / totalScrollable);
    const progress = smoothstep(raw);
    const exit = smoothstep(clamp01((raw - 0.58) / 0.42));

    backdrop.style.opacity = (0.46 + progress * 0.42).toFixed(3);
    backdrop.style.transform = `scale(${(1.08 - progress * 0.08).toFixed(3)})`;

    copy.style.opacity = (1 - exit * 0.72).toFixed(3);
    copy.style.transform = `translate3d(0, ${(18 - progress * 18).toFixed(2)}px, 0)`;

    feature.style.transform = `translate3d(0, ${(42 - progress * 42).toFixed(2)}px, 0) scale(${(0.84 + progress * 0.16).toFixed(3)}) rotate(${(-6 + progress * 6).toFixed(2)}deg)`;
    if (featureCopy) {
      featureCopy.style.transform = `translate3d(0, ${(22 - progress * 22).toFixed(2)}px, 0)`;
    }
    if (progressBar) {
      progressBar.style.transform = `scaleX(${(0.08 + progress * 0.92).toFixed(3)})`;
    }

    cards.forEach((card, index) => {
      const baseX = Number(card.dataset.x || 0);
      const baseY = Number(card.dataset.y || 0);
      const baseScale = Number(card.dataset.scale || 0.86);
      const baseRotate = Number(card.dataset.rotate || 0);
      const wave = Math.sin(raw * Math.PI * 2 + index * 0.7) * 10;
      const x = baseX * (1 - progress);
      const y = baseY * (1 - progress) + wave;
      const scale = baseScale + (1 - baseScale) * progress;
      const rotate = baseRotate * (1 - progress);
      const opacity = 0.16 + progress * 0.84;

      card.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) scale(${scale.toFixed(3)}) rotate(${rotate.toFixed(2)}deg)`;
      card.style.opacity = opacity.toFixed(3);
    });
  };

  const update = () => {
    if (!desktop) {
      renderStatic();
    } else {
      renderDesktop();
    }
    ticking = 0;
  };

  const requestUpdate = () => {
    if (ticking) return;
    ticking = window.requestAnimationFrame(update);
  };

  const measure = () => {
    desktop = window.innerWidth > 991 && !reducedMotion;
    scene.style.height = desktop ? '300vh' : 'auto';
    requestUpdate();
  };

  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', measure, { passive: true });

  measure();
})();
(() => {
  const scene = document.getElementById('cinema-scene');
  const sticky = scene?.querySelector('.cinema-sticky');
  const media = scene?.querySelector('.cinema-media');
  const overlay = scene?.querySelector('.cinema-overlay');
  const mesh = scene?.querySelector('.cinema-mesh');
  const content = scene?.querySelector('.cinema-content');
  const note = scene?.querySelector('.cinema-note');
  const progressBar = document.getElementById('cinema-progress-bar');

  if (!scene || !sticky || !media || !overlay || !content) return;

  let desktop = false;
  let ticking = 0;

  const clamp01 = (value) => Math.max(0, Math.min(value, 1));
  const smoothstep = (value) => value * value * (3 - 2 * value);

  const renderStatic = () => {
    media.style.transform = 'scale(1.04)';
    overlay.style.opacity = '0.78';
    if (mesh) {
      mesh.style.opacity = '0.22';
    }
    content.style.opacity = '1';
    content.style.transform = 'translate3d(0, 0, 0)';
    if (note) {
      note.style.opacity = '1';
      note.style.transform = 'translate3d(0, 0, 0)';
    }
    if (progressBar) {
      progressBar.style.transform = 'scaleX(1)';
    }
  };

  const renderDesktop = () => {
    const totalScrollable = Math.max(scene.offsetHeight - window.innerHeight, 1);
    const start = -scene.getBoundingClientRect().top;
    const raw = clamp01(start / totalScrollable);
    const progress = smoothstep(raw);

    media.style.transform = `scale(${(1.16 - progress * 0.14).toFixed(3)}) translate3d(0, ${(20 - progress * 20).toFixed(2)}px, 0)`;
    overlay.style.opacity = (0.92 - progress * 0.34).toFixed(3);
    if (mesh) {
      mesh.style.opacity = (0.18 + progress * 0.22).toFixed(3);
    }
    content.style.opacity = (0.58 + progress * 0.42).toFixed(3);
    content.style.transform = `translate3d(0, ${(48 - progress * 48).toFixed(2)}px, 0)`;
    if (note) {
      note.style.opacity = (0.24 + progress * 0.76).toFixed(3);
      note.style.transform = `translate3d(${(48 - progress * 48).toFixed(2)}px, ${(18 - progress * 18).toFixed(2)}px, 0)`;
    }
    if (progressBar) {
      progressBar.style.transform = `scaleX(${(0.08 + progress * 0.92).toFixed(3)})`;
    }
  };

  const update = () => {
    if (!desktop) {
      renderStatic();
    } else {
      renderDesktop();
    }
    ticking = 0;
  };

  const requestUpdate = () => {
    if (ticking) return;
    ticking = window.requestAnimationFrame(update);
  };

  const measure = () => {
    desktop = window.innerWidth > 991 && !reducedMotion;
    scene.style.height = desktop ? '220vh' : 'auto';
    requestUpdate();
  };

  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', measure, { passive: true });

  measure();
})();
(() => {
  const scene = document.getElementById('timeline-scene');
  const sticky = scene?.querySelector('.timeline-sticky');
  const track = document.getElementById('timeline-track');
  const progressBar = document.getElementById('timeline-progress-bar');
  const panels = [...document.querySelectorAll('.timeline-panel[data-step]')];
  const years = [...document.querySelectorAll('#timeline-years span')];

  if (!scene || !sticky || !track || !panels.length) return;

  let desktop = false;
  let maxX = 0;
  let ticking = 0;

  const clamp01 = (value) => Math.max(0, Math.min(value, 1));

  const setActive = (index) => {
    panels.forEach((panel, panelIndex) => panel.classList.toggle('is-active', panelIndex === index));
    years.forEach((year, yearIndex) => year.classList.toggle('is-active', yearIndex === index));
  };

  const updateMobileActive = () => {
    if (desktop) return;
    const scrollLeft = track.scrollLeft;
    let activeIndex = 0;
    let minDistance = Infinity;

    panels.forEach((panel, panelIndex) => {
      const distance = Math.abs(panel.offsetLeft - scrollLeft - 24);
      if (distance < minDistance) {
        minDistance = distance;
        activeIndex = panelIndex;
      }
    });

    setActive(activeIndex);
    const progress = panels.length > 1 ? activeIndex / (panels.length - 1) : 0;
    if (progressBar) {
      progressBar.style.transform = `scaleX(${(0.08 + progress * 0.92).toFixed(3)})`;
    }
  };

  const updateDesktop = () => {
    if (!desktop) return;

    const totalScrollable = Math.max(scene.offsetHeight - window.innerHeight, 1);
    const start = -scene.getBoundingClientRect().top;
    const progress = clamp01(start / totalScrollable);
    const x = maxX * progress;

    track.style.transform = `translate3d(${-x.toFixed(2)}px, 0, 0)`;
    if (progressBar) {
      progressBar.style.transform = `scaleX(${(0.08 + progress * 0.92).toFixed(3)})`;
    }

    const activeIndex = Math.max(0, Math.min(panels.length - 1, Math.round(progress * (panels.length - 1))));
    setActive(activeIndex);
  };

  const requestUpdate = () => {
    if (ticking) return;
    ticking = window.requestAnimationFrame(() => {
      if (desktop) {
        updateDesktop();
      } else {
        updateMobileActive();
      }
      ticking = 0;
    });
  };

  const measureScene = () => {
    desktop = window.innerWidth > 991;

    if (!desktop) {
      scene.style.height = 'auto';
      track.style.transform = 'translate3d(0, 0, 0)';
      updateMobileActive();
      return;
    }

    const viewportWidth = sticky.clientWidth;
    maxX = Math.max(track.scrollWidth - viewportWidth, 0);
    scene.style.height = `${Math.ceil(maxX + window.innerHeight * 1.15)}px`;
    updateDesktop();
  };

  years.forEach((year, yearIndex) => {
    year.addEventListener('click', () => {
      if (desktop) {
        const totalScrollable = Math.max(scene.offsetHeight - window.innerHeight, 1);
        const progress = panels.length > 1 ? yearIndex / (panels.length - 1) : 0;
        const targetTop = window.scrollY + scene.getBoundingClientRect().top + totalScrollable * progress;
        window.scrollTo({ top: targetTop, behavior: reducedMotion ? 'auto' : 'smooth' });
        return;
      }

      panels[yearIndex]?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'nearest', inline: 'start' });
    });
  });

  track.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', () => {
    measureScene();
    requestUpdate();
  }, { passive: true });

  measureScene();
  requestUpdate();
})();


(() => {
  const items = [...document.querySelectorAll('.client-logo-item')];
  const direction = document.getElementById('client-stat-direction');
  const number = document.getElementById('client-stat-number');
  const label = document.getElementById('client-stat-label');
  const copy = document.getElementById('client-stat-copy');
  const section = document.getElementById('clients');

  if (!items.length || !direction || !number || !label || !copy) return;

  let activeIndex = 0;
  let timer = 0;

  const render = (item) => {
    const dir = item.dataset.direction || '↗';
    const isPositive = ['↑', '↗', '+', '•'].includes(dir);
    items.forEach((entry) => entry.classList.toggle('is-active', entry === item));
    direction.textContent = dir;
    direction.classList.toggle('is-positive', isPositive);
    direction.classList.toggle('is-negative', !isPositive);
    number.textContent = item.dataset.number || '';
    label.textContent = item.dataset.label || '';
    copy.textContent = item.dataset.copy || '';
  };

  const stop = () => {
    window.clearInterval(timer);
    timer = 0;
  };

  const start = () => {
    if (reducedMotion || timer) return;
    timer = window.setInterval(() => {
      activeIndex = (activeIndex + 1) % items.length;
      render(items[activeIndex]);
    }, 2400);
  };

  items.forEach((item, index) => {
    const activate = () => {
      activeIndex = index;
      render(item);
    };
    item.addEventListener('mouseenter', activate);
    item.addEventListener('focus', activate);
    item.addEventListener('click', activate);
  });

  section?.addEventListener('mouseenter', stop);
  section?.addEventListener('mouseleave', start);

  render(items[0]);
  start();
})();

(() => {
  const section = document.getElementById('awards');
  const frames = [...document.querySelectorAll('.award-frame')];

  if (!section || !frames.length || reducedMotion) return;

  const bases = [
    { x: -24, y: 28, r: -5 },
    { x: -10, y: 4, r: 4 },
    { x: 0, y: 18, r: -3 },
    { x: 14, y: -4, r: 5 },
    { x: 8, y: 22, r: -4 },
    { x: 22, y: 2, r: 3 }
  ];

  let ticking = 0;
  const clamp01 = (value) => Math.max(0, Math.min(value, 1));

  const update = () => {
    const rect = section.getBoundingClientRect();
    const progress = clamp01((window.innerHeight - rect.top) / (window.innerHeight + rect.height));

    frames.forEach((frame, index) => {
      const base = bases[index] || bases[bases.length - 1];
      const x = base.x * (1 - progress * 0.38);
      const y = base.y - progress * 22;
      const rotate = base.r + progress * 1.6;
      frame.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) rotate(${rotate.toFixed(2)}deg)`;
      frame.style.opacity = (0.54 + progress * 0.46).toFixed(3);
    });
    ticking = 0;
  };

  const requestUpdate = () => {
    if (ticking) return;
    ticking = window.requestAnimationFrame(update);
  };

  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate, { passive: true });
  update();
})();

(() => {
  const slider = document.getElementById('testimonial-slider');
  const progressBar = document.getElementById('testimonial-progress-bar');

  if (!slider || !progressBar) return;

  let pointerId = null;
  let startX = 0;
  let startScroll = 0;

  const updateProgress = () => {
    const maxScroll = Math.max(slider.scrollWidth - slider.clientWidth, 1);
    const progress = Math.min(slider.scrollLeft / maxScroll, 1);
    progressBar.style.transform = `scaleX(${(0.08 + progress * 0.92).toFixed(3)})`;
  };

  slider.addEventListener('pointerdown', (event) => {
    pointerId = event.pointerId;
    startX = event.clientX;
    startScroll = slider.scrollLeft;
    slider.classList.add('is-grabbing');
    slider.setPointerCapture(pointerId);
  });

  slider.addEventListener('pointermove', (event) => {
    if (pointerId !== event.pointerId) return;
    const delta = event.clientX - startX;
    slider.scrollLeft = startScroll - delta * 1.15;
  });

  const release = (event) => {
    if (pointerId !== event.pointerId) return;
    slider.classList.remove('is-grabbing');
    slider.releasePointerCapture(pointerId);
    pointerId = null;
  };

  slider.addEventListener('pointerup', release);
  slider.addEventListener('pointercancel', release);
  slider.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress, { passive: true });
  updateProgress();
})();


(() => {
  const scene = document.getElementById('case-stack-scene');
  const media = scene?.querySelector('.case-stack-media video');
  const overlay = scene?.querySelector('.case-stack-overlay');
  const items = scene ? [...scene.querySelectorAll('.case-stack-item')] : [];
  const progressBar = document.getElementById('case-stack-progress-bar');

  if (!scene || !items.length || !media || !overlay) return;

  let desktop = false;
  let ticking = 0;

  const clamp01 = (value) => Math.max(0, Math.min(value, 1));
  const smoothstep = (value) => value * value * (3 - 2 * value);

  const renderStatic = () => {
    media.style.transform = 'scale(1.04)';
    overlay.style.opacity = '0.78';
    items.forEach((item, index) => item.classList.toggle('is-active', index === 0));
    if (progressBar) {
      progressBar.style.transform = 'scaleX(1)';
    }
  };

  const renderDesktop = () => {
    const totalScrollable = Math.max(scene.offsetHeight - window.innerHeight, 1);
    const start = -scene.getBoundingClientRect().top;
    const raw = clamp01(start / totalScrollable);
    const progress = smoothstep(raw);
    const activeIndex = Math.max(0, Math.min(items.length - 1, Math.round(progress * (items.length - 1))));

    media.style.transform = `scale(${(1.12 - progress * 0.12).toFixed(3)}) translate3d(0, ${(18 - progress * 18).toFixed(2)}px, 0)`;
    overlay.style.opacity = (0.9 - progress * 0.26).toFixed(3);
    items.forEach((item, index) => {
      item.classList.toggle('is-active', index === activeIndex);
      const delta = Math.abs(index - activeIndex);
      item.style.opacity = (index === activeIndex ? 1 : Math.max(0.18, 0.58 - delta * 0.24)).toFixed(3);
      item.style.transform = `translate3d(0, ${(index === activeIndex ? 0 : 18 + delta * 12).toFixed(2)}px, 0) scale(${(index === activeIndex ? 1 : 0.96 - delta * 0.02).toFixed(3)})`;
    });
    if (progressBar) {
      progressBar.style.transform = `scaleX(${(0.08 + progress * 0.92).toFixed(3)})`;
    }
  };

  const update = () => {
    if (!desktop) {
      renderStatic();
    } else {
      renderDesktop();
    }
    ticking = 0;
  };

  const requestUpdate = () => {
    if (ticking) return;
    ticking = window.requestAnimationFrame(update);
  };

  const measure = () => {
    desktop = window.innerWidth > 991 && !reducedMotion;
    scene.style.height = desktop ? '260vh' : 'auto';
    requestUpdate();
  };

  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', measure, { passive: true });

  measure();
})();

/* ── Spotlight glow on gravity cards ── */
(function() {
  const cards = document.querySelectorAll('.our-story--dark .gravity-slide-card');
  if (!cards.length) return;

  document.addEventListener('pointermove', function(e) {
    const hue = 280 + (e.clientX / window.innerWidth) * 60; // 280-340 purple-pink range
    cards.forEach(function(card) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--spot-x', x + 'px');
      card.style.setProperty('--spot-y', y + 'px');
      card.style.setProperty('--spot-hue', hue.toFixed(0));
      // Activate glow when pointer is near the card (within 100px)
      const inRange = e.clientX >= rect.left - 100 && e.clientX <= rect.right + 100 &&
                      e.clientY >= rect.top - 100 && e.clientY <= rect.bottom + 100;
      card.classList.toggle('spotlight-active', inRange);
    });
  });
})();

/* ── Entropy canvas background ── */
(function() {
  const canvas = document.getElementById('entropy-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const dpr = window.devicePixelRatio || 1;
  let W, H;

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    W = rect.width;
    H = rect.height;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const particles = [];
  const count = 120;
  const connectDist = 140;
  const aR = 185, aG = 119, aB = 144;

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * 2000,
      y: Math.random() * 1200,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      sz: 1.5 + Math.random() * 1.5
    });
  }

  function tick() {
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < count; i++) {
      const p = particles[i];
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      p.x = Math.max(0, Math.min(W, p.x));
      p.y = Math.max(0, Math.min(H, p.y));
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.sz, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + aR + ',' + aG + ',' + aB + ',0.5)';
      ctx.fill();
      for (let j = i + 1; j < count; j++) {
        const q = particles[j];
        const dx = p.x - q.x, dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < connectDist) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = 'rgba(' + aR + ',' + aG + ',' + aB + ',' + (0.18 * (1 - dist / connectDist)).toFixed(3) + ')';
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(tick);
  }
  tick();
})();

/* ── AetherFlow interactive particles (Team section) ── */
(function() {
  var canvas = document.getElementById('aether-canvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  if (!ctx) return;

  var section = canvas.parentElement;
  var dpr = window.devicePixelRatio || 1;
  var W, H;
  var mouse = { x: null, y: null, radius: 180 };
  var particles = [];
  var connectDist;

  function resize() {
    var rect = section.getBoundingClientRect();
    W = rect.width;
    H = rect.height;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    connectDist = Math.min(W, H) / 6;
    initParticles();
  }

  function initParticles() {
    particles = [];
    var count = Math.round((W * H) / 12000);
    count = Math.min(count, 200);
    for (var i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        sz: 1.2 + Math.random() * 1.4
      });
    }
  }

  resize();
  window.addEventListener('resize', resize, { passive: true });

  // Track mouse relative to section
  window.addEventListener('mousemove', function(e) {
    var rect = section.getBoundingClientRect();
    if (e.clientY >= rect.top && e.clientY <= rect.bottom &&
        e.clientX >= rect.left && e.clientX <= rect.right) {
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    } else {
      mouse.x = null;
      mouse.y = null;
    }
  }, { passive: true });

  window.addEventListener('mouseout', function() {
    mouse.x = null;
    mouse.y = null;
  }, { passive: true });

  function tick() {
    ctx.clearRect(0, 0, W, H);
    var aR = 191, aG = 128, aB = 255; // purple accent

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];

      // Mouse repulsion
      if (mouse.x !== null && mouse.y !== null) {
        var dx = mouse.x - p.x;
        var dy = mouse.y - p.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius && dist > 0) {
          var force = (mouse.radius - dist) / mouse.radius;
          p.x -= (dx / dist) * force * 4;
          p.y -= (dy / dist) * force * 4;
        }
      }

      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      p.x = Math.max(0, Math.min(W, p.x));
      p.y = Math.max(0, Math.min(H, p.y));

      // Draw particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.sz, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + aR + ',' + aG + ',' + aB + ',0.6)';
      ctx.fill();

      // Connection lines
      for (var j = i + 1; j < particles.length; j++) {
        var q = particles[j];
        var cdx = p.x - q.x, cdy = p.y - q.y;
        var cdist = Math.sqrt(cdx * cdx + cdy * cdy);
        if (cdist < connectDist) {
          var opacity = (0.2 * (1 - cdist / connectDist));
          // Brighten lines near mouse
          if (mouse.x !== null) {
            var mx = (p.x + q.x) / 2 - mouse.x;
            var my = (p.y + q.y) / 2 - mouse.y;
            var mDist = Math.sqrt(mx * mx + my * my);
            if (mDist < mouse.radius) {
              ctx.strokeStyle = 'rgba(255,255,255,' + (opacity * 2.5).toFixed(3) + ')';
            } else {
              ctx.strokeStyle = 'rgba(' + aR + ',' + aG + ',' + aB + ',' + opacity.toFixed(3) + ')';
            }
          } else {
            ctx.strokeStyle = 'rgba(' + aR + ',' + aG + ',' + aB + ',' + opacity.toFixed(3) + ')';
          }
          ctx.lineWidth = 0.7;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(tick);
  }
  tick();
})();

/* ── FAQ flowing network canvas ── */
(function() {
  var canvas = document.getElementById('faq-canvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  if (!ctx) return;

  var section = canvas.parentElement;
  var dpr = window.devicePixelRatio || 1;
  var W, H;
  var mouse = { x: null, y: null, radius: 200 };
  var particles = [];
  var connectDist;
  var time = 0;

  function resize() {
    var rect = section.getBoundingClientRect();
    W = rect.width;
    H = rect.height;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    connectDist = Math.min(W, H) / 5;
    initParticles();
  }

  function initParticles() {
    particles = [];
    var count = Math.round((W * H) / 14000);
    count = Math.min(count, 160);
    for (var i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        sz: 1 + Math.random() * 1.6,
        phase: Math.random() * Math.PI * 2
      });
    }
  }

  resize();
  window.addEventListener('resize', resize, { passive: true });

  window.addEventListener('mousemove', function(e) {
    var rect = section.getBoundingClientRect();
    if (e.clientY >= rect.top && e.clientY <= rect.bottom &&
        e.clientX >= rect.left && e.clientX <= rect.right) {
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    } else {
      mouse.x = null;
      mouse.y = null;
    }
  }, { passive: true });

  window.addEventListener('mouseout', function() {
    mouse.x = null; mouse.y = null;
  }, { passive: true });

  function tick() {
    time += 0.003;
    ctx.clearRect(0, 0, W, H);

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];

      // Gentle wave drift
      p.x += p.vx + Math.sin(time + p.phase) * 0.15;
      p.y += p.vy + Math.cos(time * 0.7 + p.phase) * 0.1;

      // Mouse repulsion
      if (mouse.x !== null && mouse.y !== null) {
        var dx = mouse.x - p.x;
        var dy = mouse.y - p.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius && dist > 0) {
          var force = (mouse.radius - dist) / mouse.radius;
          p.x -= (dx / dist) * force * 3.5;
          p.y -= (dy / dist) * force * 3.5;
        }
      }

      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      p.x = Math.max(0, Math.min(W, p.x));
      p.y = Math.max(0, Math.min(H, p.y));

      // Pulsing glow particle
      var glow = 0.4 + Math.sin(time * 2 + p.phase) * 0.2;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.sz, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(185,119,144,' + glow.toFixed(2) + ')';
      ctx.fill();

      // Connections
      for (var j = i + 1; j < particles.length; j++) {
        var q = particles[j];
        var cdx = p.x - q.x, cdy = p.y - q.y;
        var cdist = Math.sqrt(cdx * cdx + cdy * cdy);
        if (cdist < connectDist) {
          var alpha = 0.14 * (1 - cdist / connectDist);
          // Brighten near mouse
          if (mouse.x !== null) {
            var mx = (p.x + q.x) / 2 - mouse.x;
            var my = (p.y + q.y) / 2 - mouse.y;
            var mDist = Math.sqrt(mx * mx + my * my);
            if (mDist < mouse.radius) {
              ctx.strokeStyle = 'rgba(240,214,220,' + (alpha * 3).toFixed(3) + ')';
            } else {
              ctx.strokeStyle = 'rgba(185,119,144,' + alpha.toFixed(3) + ')';
            }
          } else {
            ctx.strokeStyle = 'rgba(185,119,144,' + alpha.toFixed(3) + ')';
          }
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(tick);
  }
  tick();
})();

/* ── Spotlight glow on team card ── */
(function() {
  var cards = document.querySelectorAll('.our-team .team-card');
  if (!cards.length) return;

  document.addEventListener('pointermove', function(e) {
    var hue = 270 + (e.clientX / window.innerWidth) * 50;
    cards.forEach(function(card) {
      var rect = card.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      card.style.setProperty('--spot-x', x + 'px');
      card.style.setProperty('--spot-y', y + 'px');
      card.style.setProperty('--spot-hue', hue.toFixed(0));
      var inRange = e.clientX >= rect.left - 120 && e.clientX <= rect.right + 120 &&
                    e.clientY >= rect.top - 120 && e.clientY <= rect.bottom + 120;
      card.classList.toggle('spotlight-active', inRange);
    });
  });
})();
