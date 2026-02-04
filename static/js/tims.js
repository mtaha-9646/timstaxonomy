// ============================================
// TIMS TAXONOMY - INTERACTIVE JAVASCRIPT
// Horizontal Expanding Letter Cards
// ============================================

document.addEventListener('DOMContentLoaded', function () {

    // ============================================
    // MOBILE MENU TOGGLE
    // ============================================

    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');

    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', function () {
            navMenu.classList.toggle('active');

            // Toggle icon
            const icon = this.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function () {
                navMenu.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });
    }

    // ============================================
    // SMOOTH SCROLLING FOR NAVIGATION
    // ============================================

    const scrollLinks = document.querySelectorAll('a[href^="#"]');

    scrollLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const headerHeight = document.querySelector('.tims-header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================================
    // EXPANDING LETTER CARDS
    // ============================================

    const letterCards = [...document.querySelectorAll('.letter-card')];

    function activateCard(card) {
        letterCards.forEach(c => {
            const isActive = (c === card);
            c.classList.toggle('is-active', isActive);
            c.setAttribute('aria-selected', isActive ? 'true' : 'false');
            c.setAttribute('aria-expanded', isActive ? 'true' : 'false');
            c.tabIndex = 0;
        });

        // Focus the card without scrolling
        card.focus({ preventScroll: true });
    }

    // Click to expand
    letterCards.forEach(card => {
        card.addEventListener('click', () => activateCard(card));

        // Keyboard support
        card.addEventListener('keydown', (e) => {
            // Enter or Space to activate
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                activateCard(card);
            }

            // Arrow key navigation (premium feel!)
            const idx = letterCards.indexOf(card);

            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                e.preventDefault();
                activateCard(letterCards[(idx + 1) % letterCards.length]);
            }

            if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                e.preventDefault();
                activateCard(letterCards[(idx - 1 + letterCards.length) % letterCards.length]);
            }
        });
    });

    // ============================================
    // SCROLL ANIMATIONS
    // ============================================

    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for scroll animations
    const animateOnScroll = document.querySelectorAll('.team-card, .timeline-item');

    animateOnScroll.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(element);
    });

    // ============================================
    // HEADER SCROLL EFFECT
    // ============================================

    const header = document.querySelector('.tims-header');
    let lastScroll = 0;

    window.addEventListener('scroll', function () {
        const currentScroll = window.pageYOffset;

        // Add shadow on scroll
        if (currentScroll > 50) {
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
        }

        lastScroll = currentScroll;
    });

    // ============================================
    // PARALLAX EFFECT FOR DECORATIVE ELEMENTS
    // ============================================

    const decorations = document.querySelectorAll('.bg-decoration');

    window.addEventListener('scroll', function () {
        const scrolled = window.pageYOffset;

        decorations.forEach((decoration, index) => {
            const speed = (index + 1) * 0.1;
            decoration.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });

    // ============================================
    // TEAM CARD HOVER EFFECT
    // ============================================

    const teamCards = document.querySelectorAll('.team-card');

    teamCards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            const avatar = this.querySelector('.team-avatar');
            if (avatar) {
                avatar.style.transform = 'scale(1.1) rotate(5deg)';
                avatar.style.transition = 'transform 0.3s ease-out';
            }
        });

        card.addEventListener('mouseleave', function () {
            const avatar = this.querySelector('.team-avatar');
            if (avatar) {
                avatar.style.transform = '';
            }
        });
    });

    // ============================================
    // CREATOR TIMELINE ANIMATION
    // ============================================

    const timelineItems = document.querySelectorAll('.timeline-item');

    const timelineObserver = new IntersectionObserver(function (entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                }, index * 150);
            }
        });
    }, { threshold: 0.2 });

    timelineItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-30px)';
        item.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        timelineObserver.observe(item);
    });

    // ============================================
    // HERO ILLUSTRATION ANIMATION
    // ============================================

    const illustrationLetters = document.querySelectorAll('.illustration-letter');

    illustrationLetters.forEach((letter, index) => {
        letter.addEventListener('mouseenter', function () {
            this.style.transform = 'scale(1.1) rotate(5deg)';
            this.style.transition = 'transform 0.3s ease-out';
        });

        letter.addEventListener('mouseleave', function () {
            this.style.transform = '';
        });
    });

    // ============================================
    // PERFORMANCE OPTIMIZATION
    // ============================================

    // Debounce scroll events
    let scrollTimeout;
    window.addEventListener('scroll', function () {
        if (scrollTimeout) {
            window.cancelAnimationFrame(scrollTimeout);
        }

        scrollTimeout = window.requestAnimationFrame(function () {
            // Scroll-based animations go here
        });
    });

    // ============================================
    // CONSOLE WELCOME MESSAGE
    // ============================================

    console.log('%c🎓 TIMS Taxonomy Framework', 'font-size: 20px; font-weight: bold; color: #2B7FD9;');
    console.log('%cTask → Information → Meaning → Sharing', 'font-size: 14px; color: #6B7280;');
    console.log('%cClick a letter to expand and explore!', 'font-size: 12px; color: #4ECDC4;');

});

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Smooth scroll to top function
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

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
