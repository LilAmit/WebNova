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
    'כמה זמן לוקח לבנות אתר?': '⏱️ זמני הפיתוח שלנו:\n\n• דף נחיתה: 3-7 ימים\n• אתר תדמית: 1-2 שבועות\n• אתר מלא: 2-4 שבועות\n\nאנחנו עובדים מהר אבל לא מתפשרים על איכות! 💪',
    'כמה עולה לבנות אתר?': '💰 המחירים שלנו:\n\n💼 דף נחיתה: ₪500-1,000\nמושלם להשקות, קמפיינים ועסקים קטנים\n\n🌐 אתר תדמית: ₪1,000-2,500\nעד 5 דפים + עיצוב מתקדם + אנימציות\n\n🚀 אתר מלא: ₪2,500-5,000\nדפים ללא הגבלה + עיצוב ייחודי + פאנל ניהול\n\n✨ כל החבילות כוללות: עיצוב רספונסיבי, SEO בסיסי, ותמיכה טכנית!',
    'איך זה עובד?': '🔄 תהליך העבודה ב-5 שלבים:\n\n1️⃣ פגישת היכרות - נבין את הצרכים שלך\n2️⃣ עיצוב - תקבל הצעה ויזואלית לאישור\n3️⃣ פיתוח - נבנה את האתר שלך\n4️⃣ בדיקות - נוודא שהכל עובד מושלם\n5️⃣ השקה - האתר עולה לאוויר! 🎉\n\nלאורך כל התהליך תקבל עדכונים ותוכל לראות את ההתקדמות.'
};

// Keywords for intelligent responses
const keywordResponses = {
    'מחיר|עלות|כסף|תקציב|עולה|כמה': responses['כמה עולה לבנות אתר?'],
    'זמן|מהר|דחוף|לוקח|מתי': responses['כמה זמן לוקח לבנות אתר?'],
    'עובד|תהליך|שלבים|איך': responses['איך זה עובד?'],
    'וורדפרס|wordpress|קוד|טכנולוגיה': '💻 אנחנו עובדים עם טכנולוגיות מתקדמות:\n\n• HTML5/CSS3/JavaScript לביצועים מעולים\n• עיצוב רספונסיבי לכל מכשיר\n• אופטימיזציה למהירות טעינה\n• אבטחה ברמה גבוהה\n\nהאתר שלך יהיה מהיר, מאובטח ומודרני!',
    'עיצוב|דיזיין|יפה|צבעים|לוגו': '🎨 העיצוב שלנו כולל:\n\n• עיצוב מותאם אישית לעסק שלך\n• צבעים ופונטים מקצועיים\n• אנימציות מרשימות\n• חוויית משתמש מעולה\n\nכל אתר מעוצב מאפס - לא תבניות משעממות!',
    'תמיכה|עזרה|בעיה|תקלה|שאלה': '🛠️ התמיכה שלנו:\n\n• תמיכה טכנית מלאה\n• זמינות גבוהה\n• תיקון באגים מהיר\n• עדכונים שוטפים\n\nאנחנו כאן בשבילך גם אחרי ההשקה!',
    'seo|קידום|גוגל|חיפוש': '📈 קידום אתרים (SEO):\n\n• אופטימיזציה למנועי חיפוש\n• מהירות טעינה גבוהה\n• תגיות מטא נכונות\n• מבנה אתר ידידותי לגוגל\n\nהאתר שלך יופיע בתוצאות החיפוש!',
    'טלפון|ליצור קשר|לדבר|להתקשר': '📞 דרכי יצירת קשר:\n\n• טלפון: 058-454-9087\n• אימייל: contact@webnova.co.il\n• וואטסאפ: לחץ על הכפתור הירוק\n\nנשמח לשמוע ממך!',
    'שלום|היי|הי|בוקר|ערב': '👋 שלום! נעים להכיר!\n\nאני הבוט של WebNova ואני כאן לעזור לך.\nאתה יכול לשאול אותי על מחירים, זמנים, או כל שאלה אחרת.\n\nאיך אוכל לעזור לך היום?',
    'תודה|מעולה|אחלה|סבבה': '😊 בשמחה! אם יש עוד שאלות, אני כאן.\n\nרוצה לקבל הצעת מחיר? פשוט לחץ על הכפתור למטה!'
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

// Handle free text input
const chatTextInput = document.getElementById('chatTextInput');
const chatSendBtn = document.getElementById('chatSendBtn');

function getSmartResponse(message) {
    const lowerMessage = message.toLowerCase();

    // Check keyword patterns
    for (const [pattern, response] of Object.entries(keywordResponses)) {
        const keywords = pattern.split('|');
        for (const keyword of keywords) {
            if (lowerMessage.includes(keyword)) {
                return response;
            }
        }
    }

    // Default response if no keywords match
    return '🤔 תודה על השאלה!\n\nלא הצלחתי להבין בדיוק מה אתה מחפש, אבל אשמח לעזור!\n\nתוכל:\n• לבחור מהאפשרויות למעלה\n• ליצור קשר ישירות: 058-454-9087\n• להשאיר פרטים ונחזור אליך\n\nמה תעדיף?';
}

function sendChatMessage() {
    if (!chatTextInput || !chatbotMessages) return;

    const message = chatTextInput.value.trim();
    if (!message) return;

    // Add user message
    const userMsg = document.createElement('div');
    userMsg.className = 'chat-message user';
    userMsg.innerHTML = `<div class="message-bubble">${message}</div>`;
    chatbotMessages.appendChild(userMsg);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

    // Clear input
    chatTextInput.value = '';

    // Get and show bot response
    setTimeout(() => {
        const response = getSmartResponse(message);
        const botMsg = document.createElement('div');
        botMsg.className = 'chat-message bot';
        botMsg.innerHTML = `<div class="message-bubble">${response.replace(/\n/g, '<br>')}</div>`;
        chatbotMessages.appendChild(botMsg);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }, 600);
}

if (chatTextInput && chatSendBtn) {
    chatSendBtn.addEventListener('click', sendChatMessage);

    chatTextInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            sendChatMessage();
        }
    });
}

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
