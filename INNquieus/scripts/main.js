/* ═══════════════════════════════════════════════════════════════
   INNquietus Landing Page - Main JavaScript
   GSAP Animations, DNA Test, Theme Toggle, and Interactivity
   ═══════════════════════════════════════════════════════════════ */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
  // Initialize all modules
  initThemeToggle();
  initNavbar();
  initFAQ();
  initDNATest();
  initScrollAnimations();
});

/* ─────────────────────────────────────────────────────────────────
   THEME TOGGLE (Dark/Light Mode)
   ───────────────────────────────────────────────────────────────── */
function initThemeToggle() {
  const themeToggle = document.getElementById('theme-toggle');
  const html = document.documentElement;
  const sunIcon = themeToggle.querySelector('.sun-icon');
  const moonIcon = themeToggle.querySelector('.moon-icon');

  // Check for saved theme preference or system preference
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme) {
    html.setAttribute('data-theme', savedTheme);
    updateThemeIcons(savedTheme === 'dark');
  } else if (prefersDark) {
    html.setAttribute('data-theme', 'dark');
    updateThemeIcons(true);
  }

  themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcons(newTheme === 'dark');
  });

  function updateThemeIcons(isDark) {
    if (isDark) {
      sunIcon.classList.add('hidden');
      moonIcon.classList.remove('hidden');
    } else {
      sunIcon.classList.remove('hidden');
      moonIcon.classList.add('hidden');
    }
  }
}

/* ─────────────────────────────────────────────────────────────────
   NAVBAR (Scroll Effects & Mobile Menu)
   ───────────────────────────────────────────────────────────────── */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const menuToggle = document.getElementById('menu-toggle');
  let lastScroll = 0;

  // Add scrolled class when scrolling down
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  });

  // Mobile menu toggle (simplified - would expand for full mobile menu)
  menuToggle.addEventListener('click', () => {
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', !isExpanded);
    // Could toggle mobile menu visibility here
  });

  // Smooth scroll for navigation links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = navbar.offsetHeight + 20;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* ─────────────────────────────────────────────────────────────────
   FAQ ACCORDION
   ───────────────────────────────────────────────────────────────── */
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all other items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('open');
          otherItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current item
      item.classList.toggle('open');
      question.setAttribute('aria-expanded', !isOpen);
    });

    // Keyboard accessibility
    question.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        question.click();
      }
    });
  });
}

/* ─────────────────────────────────────────────────────────────────
   DNA TEST (Interactive Quiz)
   ───────────────────────────────────────────────────────────────── */
function initDNATest() {
  const testCard = document.getElementById('test-card');
  const questions = testCard.querySelectorAll('.test-question');
  const progressSteps = testCard.querySelectorAll('.test-progress-step');
  const prevBtn = document.getElementById('test-prev');
  const nextBtn = document.getElementById('test-next');
  const result = document.getElementById('test-result');

  let currentQuestion = 1;
  const totalQuestions = questions.length;
  const answers = {};

  // Personality profiles based on answers
  const profiles = {
    visionario: {
      title: '🎯 El Visionario Creativo',
      description: 'Eres un innovador nato. Tu mente siempre está buscando nuevas posibilidades y formas de hacer las cosas. Tu superpoder es ver el futuro antes que los demás. El camino ideal para ti involucra roles de liderazgo creativo, innovación o emprendimiento.'
    },
    analitico: {
      title: '🔬 El Estratega Analítico',
      description: 'Tu capacidad de análisis y pensamiento estructurado te distingue. Encuentras patrones donde otros ven caos. Tu superpoder es convertir la complejidad en claridad. Roles ideales: consultoría estratégica, dirección de proyectos o roles de análisis creativo.'
    },
    empatico: {
      title: '💫 El Conector Empático',
      description: 'Tu fortaleza está en entender a las personas profundamente. Creas conexiones genuinas y puedes comunicar ideas de manera que resuenen. Tu superpoder es inspirar y unir a otros. Roles ideales: coaching, recursos humanos creativos o dirección de equipos.'
    },
    practico: {
      title: '⚡ El Ejecutor Dinámico',
      description: 'Eres alguien que hace que las cosas sucedan. Mientras otros planean, tú ya has comenzado. Tu superpoder es transformar ideas en realidad rápidamente. Roles ideales: gestión de operaciones, producción creativa o emprendimiento de alto impacto.'
    }
  };

  // Initialize options click handlers
  questions.forEach(question => {
    const options = question.querySelectorAll('.test-option');

    options.forEach(option => {
      option.addEventListener('click', () => {
        // Remove selected from siblings
        options.forEach(opt => {
          opt.classList.remove('selected');
          opt.setAttribute('aria-checked', 'false');
        });

        // Select this option
        option.classList.add('selected');
        option.setAttribute('aria-checked', 'true');

        // Store answer
        const questionNum = question.dataset.question;
        answers[questionNum] = option.dataset.value;

        // Enable next button
        nextBtn.disabled = false;

        // Auto-advance after short delay (except last question)
        if (currentQuestion < totalQuestions) {
          setTimeout(() => {
            goToQuestion(currentQuestion + 1);
          }, 500);
        }
      });

      // Keyboard accessibility
      option.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          option.click();
        }
      });
    });
  });

  // Navigation buttons
  prevBtn.addEventListener('click', () => {
    if (currentQuestion > 1) {
      goToQuestion(currentQuestion - 1);
    }
  });

  nextBtn.addEventListener('click', () => {
    if (currentQuestion < totalQuestions) {
      goToQuestion(currentQuestion + 1);
    } else {
      // Show results
      showResults();
    }
  });

  function goToQuestion(num) {
    // Hide current question
    questions.forEach(q => q.classList.remove('active'));

    // Show target question
    const targetQuestion = testCard.querySelector(`[data-question="${num}"]`);
    targetQuestion.classList.add('active');

    // Update progress
    progressSteps.forEach((step, index) => {
      step.classList.remove('active', 'completed');
      if (index + 1 < num) {
        step.classList.add('completed');
      } else if (index + 1 === num) {
        step.classList.add('active');
      }
    });

    // Update current question
    currentQuestion = num;

    // Update button states
    prevBtn.disabled = currentQuestion === 1;

    // Check if current question has an answer
    const currentAnswer = answers[num];
    nextBtn.disabled = !currentAnswer;

    // Update next button text for last question
    if (currentQuestion === totalQuestions) {
      nextBtn.innerHTML = `
        Ver Resultados
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      `;
    } else {
      nextBtn.innerHTML = `
        Siguiente
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      `;
    }

    // Animate with GSAP if available
    if (typeof gsap !== 'undefined') {
      gsap.fromTo(targetQuestion,
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out' }
      );
    }
  }

  function showResults() {
    // Calculate dominant profile
    const answerValues = Object.values(answers);
    const counts = {};

    answerValues.forEach(value => {
      // Map answers to profiles
      let profile = 'visionario'; // default

      if (['visionario', 'innovar', 'ideas', 'experimentar', 'libre'].includes(value)) {
        profile = 'visionario';
      } else if (['analitico', 'resolver', 'estrategia', 'analizar', 'estructurado'].includes(value)) {
        profile = 'analitico';
      } else if (['empatico', 'ayudar', 'conectar', 'colaborar', 'colaborativo'].includes(value)) {
        profile = 'empatico';
      } else if (['practico', 'resultados', 'ejecutar', 'accion', 'dinamico'].includes(value)) {
        profile = 'practico';
      }

      counts[profile] = (counts[profile] || 0) + 1;
    });

    // Get profile with highest count
    const dominant = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
    const profileData = profiles[dominant];

    // Hide questions, show result
    questions.forEach(q => q.classList.remove('active'));
    testCard.querySelector('.test-progress').style.display = 'none';
    testCard.querySelector('.test-nav').style.display = 'none';

    // Update result content
    document.getElementById('result-title').textContent = profileData.title;
    document.getElementById('result-description').textContent = profileData.description;

    // Show result with animation
    result.classList.add('active');

    if (typeof gsap !== 'undefined') {
      gsap.fromTo(result,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.7)' }
      );

      // Animate the icon
      const icon = result.querySelector('.test-result-icon');
      gsap.fromTo(icon,
        { scale: 0, rotation: -180 },
        { scale: 1, rotation: 0, duration: 0.8, ease: 'elastic.out(1, 0.5)', delay: 0.2 }
      );
    }
  }
}

/* ─────────────────────────────────────────────────────────────────
   SCROLL ANIMATIONS (GSAP)
   ───────────────────────────────────────────────────────────────── */
function initScrollAnimations() {
  // Check if GSAP is available
  if (typeof gsap === 'undefined') {
    console.warn('GSAP not loaded');
    return;
  }

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    return;
  }

  // Register ScrollTrigger plugin if available
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // Hero animations - simple fade in (elements already visible, this is enhancement)
  const heroTimeline = gsap.timeline({ defaults: { ease: 'power3.out' } });

  heroTimeline
    .to('.hero-badge', { opacity: 1, y: 0, duration: 0.6 })
    .to('.hero-title', { opacity: 1, y: 0, duration: 0.8 }, '-=0.3')
    .to('.hero-subtitle', { opacity: 1, y: 0, duration: 0.6 }, '-=0.4')
    .to('.hero-cta', { opacity: 1, y: 0, duration: 0.6 }, '-=0.3')
    .to('.hero-cube', { opacity: 1, scale: 1, rotation: 0, duration: 1 }, '-=0.8');

  // Hero cube subtle floating animation
  gsap.to('.hero-cube', {
    y: -20,
    rotation: 5,
    duration: 3,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1
  });

  // Hero dots floating
  gsap.to('.hero-dot-1', { y: -15, x: 10, duration: 4, ease: 'sine.inOut', yoyo: true, repeat: -1 });
  gsap.to('.hero-dot-2', { y: 10, x: -8, duration: 3.5, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 0.5 });
  gsap.to('.hero-dot-3', { y: -12, x: 5, duration: 4.5, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1 });

  // Cards hover enhancement
  document.querySelectorAll('.card, .bento-item').forEach(card => {
    card.addEventListener('mouseenter', () => {
      gsap.to(card, { scale: 1.02, duration: 0.3, ease: 'power2.out' });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, { scale: 1, duration: 0.3, ease: 'power2.out' });
    });
  });

  // Step numbers hover
  document.querySelectorAll('.step-number').forEach(step => {
    step.addEventListener('mouseenter', () => {
      gsap.to(step, { scale: 1.1, duration: 0.3, ease: 'back.out(1.7)' });
    });

    step.addEventListener('mouseleave', () => {
      gsap.to(step, { scale: 1, duration: 0.3, ease: 'power2.out' });
    });
  });
}

/* ─────────────────────────────────────────────────────────────────
   CSS FALLBACK ANIMATIONS (No GSAP)
   ───────────────────────────────────────────────────────────────── */
function initCSSFallbackAnimations() {
  // Simple intersection observer for reveal animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal, .stagger-children').forEach(el => {
    observer.observe(el);
  });
}

/* ─────────────────────────────────────────────────────────────────
   UTILITY FUNCTIONS
   ───────────────────────────────────────────────────────────────── */

// Debounce function for performance
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle function for scroll events
function throttle(func, limit) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}
