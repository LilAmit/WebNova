// Portfolio Page - Page-specific code
// (Shared functionality is loaded from script.js)

// Hero Particles
function initHeroParticles() {
    const container = document.getElementById('heroParticles');
    if (!container) return;

    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 6 + 2}px;
            height: ${Math.random() * 6 + 2}px;
            background: rgba(255, 255, 255, ${Math.random() * 0.5 + 0.3});
            border-radius: 50%;
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            animation: floatParticle ${Math.random() * 10 + 10}s linear infinite;
            animation-delay: ${Math.random() * 5}s;
        `;
        container.appendChild(particle);
    }

    if (!document.getElementById('particleStyles')) {
        const style = document.createElement('style');
        style.id = 'particleStyles';
        style.textContent = `
            @keyframes floatParticle {
                0%, 100% {
                    transform: translateY(0) translateX(0);
                    opacity: 0;
                }
                10% {
                    opacity: 1;
                }
                90% {
                    opacity: 1;
                }
                50% {
                    transform: translateY(-100px) translateX(${Math.random() * 100 - 50}px);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Animate project cards on scroll
function initProjectCardAnimations() {
    const cards = document.querySelectorAll('.project-card');
    if (!cards.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('animate');
                }, index * 150);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    cards.forEach(card => observer.observe(card));
}

// Animate stats counters
function initStatsAnimation() {
    const statNumbers = document.querySelectorAll('.portfolio-stats-section .stat-number');
    if (!statNumbers.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStatNumber(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => observer.observe(stat));
}

function animateStatNumber(element) {
    const finalText = element.textContent;
    const number = parseInt(finalText);

    if (isNaN(number)) return;

    const suffix = finalText.replace(/[0-9]/g, '');
    const duration = 1500;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(number * eased);

        element.textContent = current + suffix;

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

// Initialize page-specific features
document.addEventListener('DOMContentLoaded', function() {
    initHeroParticles();
    initProjectCardAnimations();
    initStatsAnimation();
});
