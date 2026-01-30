// Initialize EmailJS
(function() {
    emailjs.init("mrvxMulPJ4TcR7BFJ");
})();

// Professional Loading Screen Manager
let loadingProgress = 0;
let resourcesLoaded = 0;
let totalResources = 0;
let videosLoaded = 0;
let totalVideos = 0;

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

// Initialize loading and page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Step 1: Resources loaded
    updateLoadingProgress(33, 1, 'טוען משאבים...');

    // Count total videos
    const videos = document.querySelectorAll('video');
    totalVideos = videos.length;

    if (totalVideos === 0) {
        updateLoadingProgress(100, 3, 'מכין את האתר...');
        setTimeout(hideLoadingScreen, 1000);
    } else {
        updateLoadingProgress(50, 2, `טוען סרטונים... (0/${totalVideos})`);

        let videosReadyCount = 0;

        videos.forEach((video, index) => {
            video.load();

            video.addEventListener('canplaythrough', function() {
                videosReadyCount++;
                const videoProgress = 50 + (videosReadyCount / totalVideos) * 30;
                updateLoadingProgress(
                    videoProgress,
                    2,
                    `טוען סרטונים... (${videosReadyCount}/${totalVideos})`
                );

                if (videosReadyCount === totalVideos) {
                    updateLoadingProgress(80, 3, 'מכין את האתר...');

                    videos.forEach(v => {
                        const playPromise = v.play();
                        if (playPromise !== undefined) {
                            playPromise.catch(error => {
                                console.log('Video autoplay prevented:', error);
                                document.addEventListener('click', () => {
                                    v.play();
                                }, { once: true });
                            });
                        }
                    });

                    setTimeout(hideLoadingScreen, 1000);
                }
            });

            setTimeout(() => {
                if (videosReadyCount < totalVideos) {
                    console.log('Video loading timeout, proceeding anyway');
                    hideLoadingScreen();
                }
            }, 8000);
        });
    }

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

    // Add CSS animation dynamically
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

    // Observe elements
    document.querySelectorAll('.pricing-card').forEach(card => observer.observe(card));
    document.querySelectorAll('.trust-badge').forEach(badge => observer.observe(badge));

    const paymentContainer = document.querySelector('.payment-container');
    if (paymentContainer) observer.observe(paymentContainer);
}

// Scroll to top button
const scrollToTopBtn = document.getElementById('scrollToTop');

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    const scrollDegrees = (scrollPercent / 100) * 360;

    scrollToTopBtn.style.setProperty('--scroll-progress', scrollDegrees + 'deg');

    if (scrollTop > 300) {
        scrollToTopBtn.classList.add('visible');
    } else {
        scrollToTopBtn.classList.remove('visible');
    }
});

scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Pricing buttons - redirect to contact
document.querySelectorAll('.pricing-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const pricingCard = this.closest('.pricing-card');
        const packageName = pricingCard.querySelector('.pricing-title').textContent;

        // Redirect to contact form on main page
        window.location.href = `index.html#contact?package=${encodeURIComponent(packageName)}`;
    });
});

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

accessibilityBtn.addEventListener('click', () => {
    accessibilityMenu.classList.toggle('show');
});

document.addEventListener('click', (e) => {
    if (!accessibilityBtn.contains(e.target) && !accessibilityMenu.contains(e.target)) {
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

// Chatbot
const chatbotBtn = document.getElementById('chatbotBtn');
const chatbotWindow = document.getElementById('chatbotWindow');
const chatbotClose = document.getElementById('chatbotClose');
const chatbotMessages = document.getElementById('chatbotMessages');
const chatOptions = document.getElementById('chatOptions');

let chatbotShown = false;

setTimeout(() => {
    if (!chatbotShown) {
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

document.addEventListener('click', (e) => {
    if (!chatbotBtn.contains(e.target) && !chatbotWindow.contains(e.target)) {
        chatbotWindow.classList.remove('show');
    }
});

// Chatbot responses
const responses = {
    'כמה זמן לוקח לבנות אתר?': 'בדרך כלל לוקח בין שבועיים לחודש, תלוי במורכבות האתר. דף נחיתה פשוט יכול להיות מוכן תוך שבוע!',
    'כמה עולה לבנות אתר?': `המחירים שלנו:\n\n💼 דף נחיתה: ₪500-1,000\nמושלם לעסקים קטנים ודפי נחיתה פשוטים\n\n🌐 אתר אינטראקטיבי (הכי פופולרי!): ₪1,000-2,500\nעד 5 דפים עם עיצוב מתקדם ואנימציות\n\n🚀 אתר מלא: ₪2,500-5,000\nדפים ללא הגבלה, עיצוב ייחודי ופאנל ניהול\n\nהמחיר הסופי נקבע לפי הצרכים המדויקים שלך!`,
    'איך זה עובד?': 'תהליך העבודה שלנו כולל 5 שלבים:\n\n📞 פגישת היכרות טלפונית\n🎨 עיצוב האתר\n💻 פיתוח האתר\n🚀 השקת האתר\n📈 רק לכם נשאר לצמוח ולגדול!\n\nכל שלב מתוכנן בקפידה כדי להבטיח את הצלחת הפרויקט שלכם!'
};

const chatFormContainer = document.getElementById('chatFormContainer');
const chatContactForm = document.getElementById('chatContactForm');
const chatBackBtn = document.getElementById('chatBackBtn');

document.querySelectorAll('.chat-option-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const question = this.dataset.response;
        const action = this.dataset.action;

        const userMsg = document.createElement('div');
        userMsg.className = 'chat-message user';
        userMsg.innerHTML = `<div class="message-bubble">${question}</div>`;
        chatbotMessages.appendChild(userMsg);

        if (action === 'show-form') {
            setTimeout(() => {
                const botMsg = document.createElement('div');
                botMsg.className = 'chat-message bot';
                botMsg.innerHTML = `<div class="message-bubble">מעולה! אשמח למלא איתך טופס קצר 📝</div>`;
                chatbotMessages.appendChild(botMsg);
                chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

                setTimeout(() => {
                    chatOptions.style.display = 'none';
                    chatFormContainer.style.display = 'block';
                }, 500);
            }, 500);
        } else {
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

// Handle chat form submission
chatContactForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const submitBtn = this.querySelector('.chat-submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'שולח...';
    submitBtn.disabled = true;

    emailjs.sendForm('service_4gvk08g', 'template_amc3bab', this)
        .then(function() {
            const successMsg = document.createElement('div');
            successMsg.className = 'chat-message bot';
            successMsg.innerHTML = `<div class="message-bubble">תודה רבה! קיבלנו את הפנייה ונחזור אליך בהקדם 🎉</div>`;
            chatbotMessages.appendChild(successMsg);
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

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

chatBackBtn.addEventListener('click', () => {
    chatFormContainer.style.display = 'none';
    chatOptions.style.display = 'block';
});

// Counter Animation for pricing
function animateCounters() {
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.floor(current).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target.toLocaleString();
            }
        };

        // Start animation when element is in view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(counter);
    });
}

// Initialize counter animation
animateCounters();
