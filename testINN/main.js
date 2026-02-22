/* ===================================================
   INNquietus — Main JavaScript
   Interactions, animations, dark/light mode, carousel
   =================================================== */

// ---- DOM Ready ----
document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initScrollProgress();
    initNavbar();
    initRevealAnimations();
    initCarousel();
    initBuilderKits();
    initParticles();
    initSmoothScroll();
    initContactForm();
});

/* ===== THEME TOGGLE (Dark/Light) ===== */
function initThemeToggle() {
    const toggle = document.getElementById('themeToggle');
    const html = document.documentElement;

    // Load saved theme or default to dark
    const savedTheme = localStorage.getItem('innquietus-theme') || 'dark';
    html.setAttribute('data-theme', savedTheme);

    toggle.addEventListener('click', () => {
        const current = html.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', next);
        localStorage.setItem('innquietus-theme', next);

        // Add a fun ripple effect on toggle
        toggle.style.transform = 'scale(0.8) rotate(180deg)';
        setTimeout(() => {
            toggle.style.transform = '';
        }, 300);
    });
}

/* ===== SCROLL PROGRESS BAR (XP Bar) ===== */
function initScrollProgress() {
    const fill = document.getElementById('xpBarFill');

    function updateProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        fill.style.width = `${Math.min(progress, 100)}%`;
    }

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
}

/* ===== NAVBAR ===== */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const links = navLinks.querySelectorAll('.navbar__link');

    // Scroll effect
    function handleScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        updateActiveLink();
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // Hamburger menu
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        navLinks.classList.toggle('open');
    });

    // Close menu on link click
    links.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('open');
            navLinks.classList.remove('open');
        });
    });

    // Active link based on scroll
    function updateActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 150;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                links.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('data-section') === id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
}

/* ===== REVEAL ANIMATIONS (IntersectionObserver) ===== */
function initRevealAnimations() {
    const reveals = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

    if (!reveals.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger the animations
                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    reveals.forEach(el => observer.observe(el));

    // Also observe service blocks and brujula cards for entrance animation
    const animBlocks = document.querySelectorAll('.servicio-block, .brujula__card');
    const blockObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, i * 120);
                blockObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    animBlocks.forEach(block => {
        block.style.opacity = '0';
        block.style.transform = 'translateY(40px)';
        block.style.transition = 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
        blockObserver.observe(block);
    });

    // Staggered entrance for builder kits
    const kits = document.querySelectorAll('.builder__kit');
    const kitObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const kit = entry.target;
                const idx = Array.from(kits).indexOf(kit);
                setTimeout(() => {
                    kit.style.opacity = '1';
                    kit.style.transform = 'translateX(0)';
                }, idx * 150);
                kitObserver.unobserve(kit);
            }
        });
    }, { threshold: 0.1 });

    kits.forEach(kit => {
        kit.style.opacity = '0';
        kit.style.transform = 'translateX(-30px)';
        kit.style.transition = 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
        kitObserver.observe(kit);
    });
}

/* ===== TESTIMONIAL CAROUSEL ===== */
function initCarousel() {
    const track = document.getElementById('carouselTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dotsContainer = document.getElementById('carouselDots');

    if (!track) return;

    const cards = track.querySelectorAll('.testimonio-card');
    const total = cards.length;
    let current = 0;
    let autoPlayInterval;

    // Create dots
    cards.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.classList.add('carousel__dot');
        if (i === 0) dot.classList.add('active');
        dot.setAttribute('aria-label', `Testimonio ${i + 1}`);
        dot.addEventListener('click', () => goTo(i));
        dotsContainer.appendChild(dot);
    });

    function goTo(index) {
        current = ((index % total) + total) % total;
        track.style.transform = `translateX(-${current * 100}%)`;
        updateDots();
        resetAutoPlay();
    }

    function updateDots() {
        const dots = dotsContainer.querySelectorAll('.carousel__dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === current);
        });
    }

    prevBtn.addEventListener('click', () => goTo(current - 1));
    nextBtn.addEventListener('click', () => goTo(current + 1));

    // Auto-play
    function startAutoPlay() {
        autoPlayInterval = setInterval(() => goTo(current + 1), 5000);
    }
    function resetAutoPlay() {
        clearInterval(autoPlayInterval);
        startAutoPlay();
    }
    startAutoPlay();

    // Swipe support for mobile
    let startX = 0;
    let isDragging = false;

    track.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        isDragging = false;
        const endX = e.changedTouches[0].clientX;
        const diff = startX - endX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) goTo(current + 1);
            else goTo(current - 1);
        }
    }, { passive: true });

    // Pause autoplay on hover
    track.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
    track.addEventListener('mouseleave', startAutoPlay);
}

/* ===== BUILDER KIT INTERACTION ===== */
function initBuilderKits() {
    const kits = document.querySelectorAll('.builder__kit');
    const constructionImg = document.querySelector('.builder__construction');
    const sidebarTitle = document.querySelector('.builder__sidebar-title');
    const sidebarDesc = document.querySelector('.builder__sidebar-desc');

    if (!kits.length) return;

    kits.forEach(kit => {
        kit.addEventListener('click', () => {
            const wasSelected = kit.classList.contains('selected');

            // Remove selected from all
            kits.forEach(k => k.classList.remove('selected'));

            // Toggle current
            if (!wasSelected) {
                kit.classList.add('selected');

                // Pulse animation feedback
                kit.style.transform = 'translateX(8px) scale(1.02)';
                setTimeout(() => {
                    kit.style.transform = 'translateX(6px)';
                }, 200);

                // Update Content
                const title = kit.getAttribute('data-title');
                const desc = kit.getAttribute('data-desc');
                const img = kit.getAttribute('data-image');

                if (title && sidebarTitle) sidebarTitle.innerText = title;
                if (desc && sidebarDesc) sidebarDesc.innerText = desc;

                if (img && constructionImg) {
                    constructionImg.style.opacity = '0';
                    constructionImg.style.transform = 'scale(0.95)';

                    setTimeout(() => {
                        constructionImg.src = img;
                        constructionImg.onload = () => {
                            constructionImg.style.opacity = '1';
                            constructionImg.style.transform = 'scale(1)';
                        };
                    }, 300);
                }
            }
        });
    });
}

/* ===== FLOATING PARTICLES ===== */
function initParticles() {
    const container = document.getElementById('heroParticles');
    if (!container) return;

    const colors = ['#FF5A00', '#C724F1', '#F8D849', '#FFFFFF'];
    const particleCount = 20;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');

        const size = Math.random() * 6 + 2;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const left = Math.random() * 100;
        const duration = Math.random() * 15 + 10;
        const delay = Math.random() * 10;

        particle.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      left: ${left}%;
      bottom: -10px;
      animation-duration: ${duration}s;
      animation-delay: ${delay}s;
      opacity: ${Math.random() * 0.5 + 0.1};
      box-shadow: 0 0 ${size * 2}px ${color};
    `;

        container.appendChild(particle);
    }
}

/* ===== SMOOTH SCROLL ===== */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

/* ===== CONTACT FORM LOGIC (Google Forms Integration) ===== */
function initContactForm() {
    const form = document.getElementById('contactForm');
    const feedback = document.getElementById('formFeedback');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Basic Client-Side Validation
        const emailInput = form.querySelector('input[type="email"]');
        const emailValue = emailInput.value;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(emailValue)) {
            feedback.textContent = 'Por favor, ingresa un email válido.';
            feedback.className = 'form-feedback error';
            return;
        }

        // Visual feedback: Loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="btn__studs"></span>Enviando...';

        const formData = new FormData(form);
        const data = new URLSearchParams();
        for (const pair of formData) {
            data.append(pair[0], pair[1]);
        }
        // Agregamos también 'emailAddress' porque el formulario tiene activada la recolección automática
        data.append('emailAddress', form.querySelector('#email').value);

        // ID de Google Form real configurado
        const GOOGLE_FORM_ACTION_URL = 'https://docs.google.com/forms/d/e/1FAIpQLScRXAmTZT36MZKUjegon5jzCbYTzFVKy-HRM6YDGffMasCZsA/formResponse';

        try {
            // Google Forms espera application/x-www-form-urlencoded
            await fetch(GOOGLE_FORM_ACTION_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: data
            });

            // Feedback de éxito
            feedback.textContent = '¡Jugada maestra enviada! Te contactaremos pronto.';
            feedback.className = 'form-feedback success';
            form.reset();
        } catch (error) {
            console.error('Error al enviar:', error);
            feedback.textContent = 'Hubo un error en la conexión. Intenta de nuevo o usa WhatsApp.';
            feedback.className = 'form-feedback error';
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    });
}
