/**
 * INNquietus - Script Principal
 * 
 * Funcionalidades:
 * - Cambio de tema (Claro/Oscuro)
 * - Navegación móvil y scroll suave
 * - Test de ADN Creativo (Interactivo)
 * - Animaciones al hacer scroll (GSAP)
 * - Preguntas Frecuentes (Acordeón)
 */

document.addEventListener('DOMContentLoaded', () => {
  // Inicializar componentes
  initThemeToggle();
  initNavigation();
  initFAQ();
  initTestADN();

  // Esperar un momento para asegurar que el DOM y estilos estén l
istos
  // antes de inicializar animaciones para evitar problemas de lay
out
  setTimeout(() => {
    initScrollAnimations();
    // Fallback if GSAP fails load
    if (typeof gsap === 'undefined') {
      initCSSFallbackAnimations();
    }
  }, 100);
});

/* ═══════════════════════════════════════════════════════════════
   THEME TOGGLE (DARK/LIGHT MODE)
   ═══════════════════════════════════════════════════════════════
 */
function initThemeToggle() {
  const themeToggle = document.getElementById('theme-toggle');    
  const sunIcon = themeToggle.querySelector('.sun-icon');
  const moonIcon = themeToggle.querySelector('.moon-icon');       
  const html = document.documentElement;

  // Revisar preferencia guardada o preferencia del sistema       
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-sche
me: dark)').matches;

  // Aplicar tema inicial
  if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark))
 {
    setTheme('dark');
  } else {
    setTheme('light');
  }

  // Manejador de evento click
  themeToggle.addEventListener('click', () => {
    const isDark = html.getAttribute('data-theme') === 'dark';    
    setTheme(isDark ? 'light' : 'dark');
  });

  function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);

    // Actualizar íconos
    if (theme === 'dark') {
      sunIcon.classList.add('hidden');
      moonIcon.classList.remove('hidden');
    } else {
      sunIcon.classList.remove('hidden');
      moonIcon.classList.add('hidden');
    }
  }
}

/* ═══════════════════════════════════════════════════════════════
   NAVIGATION & MOBILE MENU
   ═══════════════════════════════════════════════════════════════
 */
function initNavigation() {
  const navbar = document.getElementById('navbar');
  const menuToggle = document.getElementById('menu-toggle');      
  const body = document.body;

  // Crear menú móvil
  const mobileMenu = document.createElement('div');
  mobileMenu.className = 'mobile-menu';
  mobileMenu.setAttribute('role', 'dialog');
  mobileMenu.setAttribute('aria-modal', 'true');
  mobileMenu.setAttribute('aria-label', 'Menú de navegación');    

  // Clonar enlaces para versión móvil
  const navLinks = document.querySelector('.navbar-nav').cloneNode
(true);
  navLinks.className = '';
  mobileMenu.appendChild(navLinks);

  // Agregar botón CTA clonado
  const ctaBtn = document.querySelector('.navbar-actions .btn-prim
ary').cloneNode(true);
  ctaBtn.classList.remove('hide-mobile');
  mobileMenu.appendChild(ctaBtn);

  // Insertar menú en DOM
  document.body.appendChild(mobileMenu);

  let isMenuOpen = false;

  // Manejar scroll de navbar
  window.addEventListener('scroll', throttle(() => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, 100));

  // Toggle menú móvil
  menuToggle.addEventListener('click', () => {
    isMenuOpen = !isMenuOpen;

    if (isMenuOpen) {
      mobileMenu.classList.add('active');
      menuToggle.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBo
x="0 0 24 24" stroke="currentColor" width="24" height="24">       
          <path stroke-linecap="round" stroke-linejoin="round" str
oke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      `;
      menuToggle.setAttribute('aria-expanded', 'true');
      body.style.overflow = 'hidden'; // Prevenir scroll          
    } else {
      closeMenu();
    }
  });

  // Cerrar menú al hacer click en enlace
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  function closeMenu() {
    isMenuOpen = false;
    mobileMenu.classList.remove('active');
    menuToggle.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox=
"0 0 24 24" stroke="currentColor" width="24" height="24">
        <path stroke-linecap="round" stroke-linejoin="round" strok
e-width="2" d="M4 6h16M4 12h16M4 18h16"/>
      </svg>
    `;
    menuToggle.setAttribute('aria-expanded', 'false');
    body.style.overflow = '';
  }

  // Smooth scroll para todos los anclajes
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {   
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);     
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });
}

/* ═══════════════════════════════════════════════════════════════
   FAQ ACCORDION
   ═══════════════════════════════════════════════════════════════
 */
function initFAQ() {
  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const isExpanded = question.getAttribute('aria-expanded') ==
= 'true';

      // Cerrar todos los demás (opcional, para mantener uno abier
to a la vez)
      faqQuestions.forEach(q => {
        if (q !== question) {
          q.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle actual
      question.setAttribute('aria-expanded', !isExpanded);        
    });
  });
}

/* ═══════════════════════════════════════════════════════════════
   ADN CREATIVO TEST
   ═══════════════════════════════════════════════════════════════
 */
function initTestADN() {
  const testCard = document.getElementById('test-card');
  if (!testCard) return;

  const btnPrev = document.getElementById('test-prev');
  const btnNext = document.getElementById('test-next');
  const questions = document.querySelectorAll('.test-question');  
  const progressSteps = document.querySelectorAll('.test-progress-
step');
  const result = document.getElementById('test-result');

  let currentStep = 1;
  const totalSteps = 5;
  const answers = {};

  // Initialize selected answers to unblock next button if going b
ack
  let currentSelection = null;

  // Profiles content based on methodology
  const profiles = {
    visionario: {
      title: 'Visionario Creativo',
      description: 'Eres un pionero. Tienes la rara habilidad de v
er oportunidades donde otros ven vacío. Tu reto no es generar idea
s, sino enfocar tu energía y concretar una dirección clara antes d
e saltar a la siguiente.'
    },
    analitico: {
      title: 'Estratega Analítico',
      description: 'Tu mente es un sistema brillante. Desglosas pr
oblemas complejos de manera magistral. Sin embargo, a veces el par
álisis por análisis te impide lanzar tus proyectos al mundo por no
 sentirse "perfectos".'
    },
    empatico: {
      title: 'Conector Empático',
      description: 'Tu mayor don es tu intuición y habilidad para 
entender a las personas. Creas comunidades y experiencias resonant
es, pero con frecuencia descuidas tus propios límites y necesidade
s operativas del negocio.'
    },
    practico: {
      title: 'Hacedor Pragmático',
      description: 'Eres pura ejecución. Tienes un motor internami
ento inagotable. Tu mayor desafío es asegurarte de que la escalera
 que escalas con tanto esfuerzo esté apoyada en la pared correcta.
 Necesitas más estrategia previa.'
    }
  };

  // Option selection logic
  document.querySelectorAll('.test-option').forEach(option => {   
    option.addEventListener('click', function () {
      // Remover clase selected de todos en esta pregunta
      const parentQuestion = this.closest('.test-question');      
      parentQuestion.querySelectorAll('.test-option').forEach(opt 
=> {
        opt.classList.remove('selected');
        opt.setAttribute('aria-checked', 'false');
      });

      // Seleccionar el nuevo
      this.classList.add('selected');
      this.setAttribute('aria-checked', 'true');

      // Guardar respuesta y habilitar botón siguiente
      currentSelection = this.dataset.value;
      answers[currentStep] = currentSelection;
      btnNext.disabled = false;

      // Actualizar visual de progreso
      progressSteps[currentStep - 1].classList.add('completed');  
    });
  });

  // Navigation Logic
  btnNext.addEventListener('click', () => {
    if (currentStep < totalSteps) {
      goToStep(currentStep + 1);
    } else {
      showResults();
    }
  });

  btnPrev.addEventListener('click', () => {
    if (currentStep > 1) {
      goToStep(currentStep - 1);
    }
  });

  function goToStep(step) {
    // Hide current
    questions[currentStep - 1].classList.remove('active');        

    // Update current step number
    currentStep = step;

    // Show new
    questions[currentStep - 1].classList.add('active');

    // Update progress bar
    progressSteps.forEach((progress, index) => {
      progress.classList.remove('active');
      if (index === currentStep - 1) {
        progress.classList.add('active');
      }
    });

    // Update buttons
    btnPrev.disabled = currentStep === 1;

    // Change Next to Finish on last step
    if (currentStep === totalSteps) {
      btnNext.innerHTML = 'Ver Resultados <svg xmlns="http://www.w
3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentCol
or" width="20" height="20"><path stroke-linecap="round" stroke-lin
ejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 
9 9 0 0118 0z" /></svg>';
    } else {
      btnNext.innerHTML = 'Siguiente <svg xmlns="http://www.w3.org
/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" w
idth="20" height="20"><path stroke-linecap="round" stroke-linejoin
="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>';
    }

    // Disable next if question hasn't been answered yet
    btnNext.disabled = !answers[currentStep];

    // GSAP Animation between steps if available
    if (typeof gsap !== 'undefined') {
      gsap.fromTo(questions[currentStep - 1],
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

      if (['visionario', 'innovar', 'ideas', 'experimentar', 'libr
e'].includes(value)) {
        profile = 'visionario';
      } else if (['analitico', 'resolver', 'estrategia', 'analizar
', 'estructurado'].includes(value)) {
        profile = 'analitico';
      } else if (['empatico', 'ayudar', 'conectar', 'colaborar', '
colaborativo'].includes(value)) {
        profile = 'empatico';
      } else if (['practico', 'resultados', 'ejecutar', 'accion', 
'dinamico'].includes(value)) {
        profile = 'practico';
      }

      counts[profile] = (counts[profile] || 0) + 1;
    });

    // Get profile with highest count
    const dominant = Object.entries(counts).sort((a, b) => b[1] - 
a[1])[0][0];
    const profileData = profiles[dominant];

    // Hide questions, show result
    questions.forEach(q => q.classList.remove('active'));
    testCard.querySelector('.test-progress').style.display = 'none
';
    testCard.querySelector('.test-nav').style.display = 'none';   

    // Update result content
    document.getElementById('result-title').textContent = profileD
ata.title;
    document.getElementById('result-description').textContent = pr
ofileData.description;

    // Show result with animation
    result.classList.add('active');

    if (typeof gsap !== 'undefined') {
      gsap.fromTo(result,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.7
)' }
      );

      // Animate the icon
      const icon = result.querySelector('.test-result-icon');     
      gsap.fromTo(icon,
        { scale: 0, rotation: -180 },
        { scale: 1, rotation: 0, duration: 0.8, ease: 'elastic.out
(1, 0.5)', delay: 0.2 }
      );
    }
  }
}

/* ═══════════════════════════════════════════════════════════════
   SCROLL ANIMATIONS (GSAP)
   ═══════════════════════════════════════════════════════════════
 */
function initScrollAnimations() {
  // Check if GSAP is available
  if (typeof gsap === 'undefined') {
    console.warn('GSAP not loaded');
    return;
  }

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced
-motion: reduce)').matches;
  if (prefersReducedMotion) {
    return;
  }

  // Register ScrollTrigger plugin if available
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // Hero animations - simple fade in (elements already visible, t
his is enhancement)
  const heroTimeline = gsap.timeline({ defaults: { ease: 'power3.o
ut' } });

  heroTimeline
    .to('.hero-badge', { opacity: 1, y: 0, duration: 0.6 })       
    .to('.hero-title', { opacity: 1, y: 0, duration: 0.8 }, '-=0.3
')
    .to('.hero-subtitle', { opacity: 1, y: 0, duration: 0.6 }, '-=
0.4')
    .to('.hero-cta', { opacity: 1, y: 0, duration: 0.6 }, '-=0.3')
    .to('.hero-cube', { opacity: 1, scale: 1, rotation: 0, duratio
n: 1 }, '-=0.8');

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
  gsap.to('.hero-dot-1', { y: -15, x: 10, duration: 4, ease: 'sine
.inOut', yoyo: true, repeat: -1 });
  gsap.to('.hero-dot-2', { y: 10, x: -8, duration: 3.5, ease: 'sin
e.inOut', yoyo: true, repeat: -1, delay: 0.5 });
  gsap.to('.hero-dot-3', { y: -12, x: 5, duration: 4.5, ease: 'sin
e.inOut', yoyo: true, repeat: -1, delay: 1 });

  // Cards hover enhancement
  document.querySelectorAll('.card, .bento-item').forEach(card => 
{
    card.addEventListener('mouseenter', () => {
      gsap.to(card, { scale: 1.02, duration: 0.3, ease: 'power2.ou
t' });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, { scale: 1, duration: 0.3, ease: 'power2.out' 
});
    });
  });

  // Step numbers hover
  document.querySelectorAll('.step-number').forEach(step => {     
    step.addEventListener('mouseenter', () => {
      gsap.to(step, { scale: 1.1, duration: 0.3, ease: 'back.out(1
.7)' });
    });

    step.addEventListener('mouseleave', () => {
      gsap.to(step, { scale: 1, duration: 0.3, ease: 'power2.out' 
});
    });
  });
}

/* ═══════════════════════════════════════════════════════════════
   CSS FALLBACK ANIMATIONS (No GSAP)
   ═══════════════════════════════════════════════════════════════
 */
function initCSSFallbackAnimations() {
  // Simple intersection observer for reveal animations
  const observer = new IntersectionObserver((entries) => {        
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal, .stagger-children').forEach(
el => {
    observer.observe(el);
  });
}

/* ═══════════════════════════════════════════════════════════════
   UTILITY FUNCTIONS
   ═══════════════════════════════════════════════════════════════
 */

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