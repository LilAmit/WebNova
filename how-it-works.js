// Initialize EmailJS
(function() {
    emailjs.init("mrvxMulPJ4TcR7BFJ");
})();

// Loading Screen
function updateLoadingProgress(percentage, step, subtitle) {
    const progressBar = document.querySelector('.loading-progress-bar');
    const percentageElement = document.getElementById('loadingPercentage');
    const subtitleElement = document.getElementById('loadingSubtitle');

    if (progressBar) {
        progressBar.style.setProperty('--progress-width', percentage + '%');
    }

    if (percentageElement) {
        percentageElement.textContent = Math.round(percentage) + '%';
    }

    if (subtitleElement && subtitle) {
        subtitleElement.textContent = subtitle;
    }

    if (step >= 1) {
        const step1 = document.getElementById('step1');
        if (step1) {
            step1.classList.add('complete');
            step1.querySelector('i').className = 'fas fa-check-circle';
        }
    }

    if (step >= 2) {
        const step2 = document.getElementById('step2');
        if (step2) {
            step2.classList.add('active');
            if (step > 2) {
                step2.classList.remove('active');
                step2.classList.add('complete');
                step2.querySelector('i').className = 'fas fa-check-circle';
            }
        }
    }

    if (step >= 3) {
        const step3 = document.getElementById('step3');
        if (step3) {
            step3.classList.add('active');
            if (step > 3) {
                step3.classList.remove('active');
                step3.classList.add('complete');
                step3.querySelector('i').className = 'fas fa-check-circle';
            }
        }
    }
}

function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    updateLoadingProgress(100, 4, 'הכל מוכן!');

    setTimeout(() => {
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
        }
    }, 500);
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    updateLoadingProgress(33, 1, 'טוען משאבים...');
    updateLoadingProgress(66, 2, 'טוען עיצובים...');
    updateLoadingProgress(100, 3, 'מכין את האתר...');
    setTimeout(hideLoadingScreen, 800);

    // Header scroll effect
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Initialize hero particles
    initHeroParticles();

    // Initialize scroll animations
    initScrollAnimations();

    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('navMenu');

    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });
    }
});

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

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('animate');
                }, index * 100);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.timeline-item').forEach(item => observer.observe(item));
    document.querySelectorAll('.stat-item').forEach(item => observer.observe(item));
    document.querySelectorAll('.reason-card').forEach(card => observer.observe(card));
    document.querySelectorAll('.code-card').forEach(card => observer.observe(card));
}

// Scroll to top button
const scrollToTopBtn = document.getElementById('scrollToTop');

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    const scrollDegrees = (scrollPercent / 100) * 360;

    if (scrollToTopBtn) {
        scrollToTopBtn.style.setProperty('--scroll-progress', scrollDegrees + 'deg');

        if (scrollTop > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    }
});

if (scrollToTopBtn) {
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Accessibility functionality
const accessibilityBtn = document.getElementById('accessibilityBtn');
const accessibilityMenu = document.getElementById('accessibilityMenu');
let activeAccessibilityOptions = new Set();

if (accessibilityBtn) {
    accessibilityBtn.addEventListener('click', () => {
        accessibilityMenu.classList.toggle('show');
    });
}

document.addEventListener('click', (e) => {
    if (accessibilityBtn && accessibilityMenu && !accessibilityBtn.contains(e.target) && !accessibilityMenu.contains(e.target)) {
        accessibilityMenu.classList.remove('show');
    }
});

document.querySelectorAll('.accessibility-option').forEach(option => {
    option.addEventListener('click', function() {
        const action = this.getAttribute('data-action');

        if (action === 'reset') {
            document.body.classList.remove('high-contrast', 'large-text', 'larger-text', 'grayscale', 'invert-colors', 'highlight-links');
            document.querySelectorAll('.accessibility-option').forEach(opt => {
                opt.classList.remove('active');
            });
            activeAccessibilityOptions.clear();
            localStorage.removeItem('accessibility-options');
        } else {
            if (action === 'large-text' || action === 'larger-text') {
                document.body.classList.remove('large-text', 'larger-text');
                document.querySelectorAll('[data-action="large-text"], [data-action="larger-text"]').forEach(opt => {
                    opt.classList.remove('active');
                });
                activeAccessibilityOptions.delete('large-text');
                activeAccessibilityOptions.delete('larger-text');
            }

            const className = action;
            if (document.body.classList.contains(className)) {
                document.body.classList.remove(className);
                this.classList.remove('active');
                activeAccessibilityOptions.delete(action);
            } else {
                document.body.classList.add(className);
                this.classList.add('active');
                activeAccessibilityOptions.add(action);
            }

            localStorage.setItem('accessibility-options', JSON.stringify([...activeAccessibilityOptions]));
        }
    });
});

// Load saved accessibility options
const savedOptions = localStorage.getItem('accessibility-options');
if (savedOptions) {
    try {
        const options = JSON.parse(savedOptions);
        options.forEach(option => {
            document.body.classList.add(option);
            const optionBtn = document.querySelector(`[data-action="${option}"]`);
            if (optionBtn) {
                optionBtn.classList.add('active');
                activeAccessibilityOptions.add(option);
            }
        });
    } catch (e) {
        console.error('Error loading accessibility options:', e);
    }
}

// Scroll Progress Bar
const scrollProgressBar = document.getElementById('scrollProgressBar');
if (scrollProgressBar) {
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercent = (scrollTop / scrollHeight) * 100;
        scrollProgressBar.style.width = scrollPercent + '%';
    });
}

// Chatbot
const chatbotBtn = document.getElementById('chatbotBtn');
const chatbotWindow = document.getElementById('chatbotWindow');
const chatbotClose = document.getElementById('chatbotClose');
const chatbotMessages = document.getElementById('chatbotMessages');
const chatOptions = document.getElementById('chatOptions');

let chatbotShown = false;

if (chatbotBtn && chatbotWindow && chatbotClose) {
    // Show chatbot after 10 seconds
    setTimeout(() => {
        if (!chatbotShown && chatbotBtn) {
            chatbotBtn.style.animation = 'pulse 1s ease 3';
        }
    }, 10000);

    chatbotBtn.addEventListener('click', () => {
        chatbotWindow.classList.toggle('show');
        chatbotShown = true;
    });

    chatbotClose.addEventListener('click', () => {
        chatbotWindow.classList.remove('show');
    });

    // Close chatbot when clicking outside
    document.addEventListener('click', (e) => {
        if (chatbotBtn && chatbotWindow && !chatbotBtn.contains(e.target) && !chatbotWindow.contains(e.target)) {
            chatbotWindow.classList.remove('show');
        }
    });
}

// Chatbot responses
const responses = {
    'כמה זמן לוקח לבנות אתר?': 'בדרך כלל לוקח בין שבועיים לחודש, תלוי במורכבות האתר. דף נחיתה פשוט יכול להיות מוכן תוך שבוע!',
    'כמה עולה לבנות אתר?': `המחירים שלנו:\n\n💼 דף נחיתה: ₪500-1,000\nמושלם לעסקים קטנים ודפי נחיתה פשוטים\n\n🌐 אתר אינטראקטיבי (הכי פופולרי!): ₪1,000-2,500\nעד 5 דפים עם עיצוב מתקדם ואנימציות\n\n🚀 אתר מלא: ₪2,500-5,000\nדפים ללא הגבלה, עיצוב ייחודי ופאנל ניהול\n\nהמחיר הסופי נקבע לפי הצרכים המדויקים שלך!`,
    'איך זה עובד?': 'תהליך העבודה שלנו כולל 5 שלבים:\n\n📞 פגישת היכרות טלפונית\n🎨 עיצוב האתר\n💻 פיתוח האתר\n🚀 השקת האתר\n📈 רק לכם נשאר לצמוח ולגדול!\n\nכל שלב מתוכנן בקפידה כדי להבטיח את הצלחת הפרויקט שלכם!'
};

const chatFormContainer = document.getElementById('chatFormContainer');
const chatContactForm = document.getElementById('chatContactForm');
const chatBackBtn = document.getElementById('chatBackBtn');

if (chatbotMessages && chatOptions) {
    document.querySelectorAll('.chat-option-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const question = this.dataset.response;
            const action = this.dataset.action;

            // Add user message
            const userMsg = document.createElement('div');
            userMsg.className = 'chat-message user';
            userMsg.innerHTML = `<div class="message-bubble">${question}</div>`;
            chatbotMessages.appendChild(userMsg);

            // Check if this button should show the form
            if (action === 'show-form') {
                setTimeout(() => {
                    const botMsg = document.createElement('div');
                    botMsg.className = 'chat-message bot';
                    botMsg.innerHTML = `<div class="message-bubble">מעולה! אשמח למלא איתך טופס קצר 📝</div>`;
                    chatbotMessages.appendChild(botMsg);
                    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

                    // Show form after another delay
                    setTimeout(() => {
                        chatOptions.style.display = 'none';
                        chatFormContainer.style.display = 'block';
                    }, 500);
                }, 500);
            } else {
                // Add bot response after delay
                setTimeout(() => {
                    const botMsg = document.createElement('div');
                    botMsg.className = 'chat-message bot';
                    botMsg.innerHTML = `<div class="message-bubble">${responses[question]}</div>`;
                    chatbotMessages.appendChild(botMsg);
                    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
                }, 500);
            }

            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        });
    });
}

// Handle chat form submission
if (chatContactForm) {
    chatContactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const submitBtn = this.querySelector('.chat-submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'שולח...';
        submitBtn.disabled = true;

        emailjs.sendForm('service_4gvk08g', 'template_amc3bab', this)
            .then(function() {
                // Show success message
                const successMsg = document.createElement('div');
                successMsg.className = 'chat-message bot';
                successMsg.innerHTML = `<div class="message-bubble">תודה רבה! קיבלנו את הפנייה ונחזור אליך בהקדם 🎉</div>`;
                chatbotMessages.appendChild(successMsg);
                chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

                // Reset and hide form
                chatContactForm.reset();
                chatFormContainer.style.display = 'none';
                chatOptions.style.display = 'block';
            }, function(error) {
                alert('אופס! משהו השתבש. אנא נסה שוב או צור קשר דרך WhatsApp.');
            })
            .finally(function() {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            });
    });
}

// Handle back button
if (chatBackBtn && chatFormContainer && chatOptions) {
    chatBackBtn.addEventListener('click', () => {
        chatFormContainer.style.display = 'none';
        chatOptions.style.display = 'block';
    });
}
