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
    
    // Update progress bar width
    if (progressBar) {
        progressBar.style.setProperty('--progress-width', percentage + '%');
    }
    
    if (percentageElement) {
        percentageElement.textContent = Math.round(percentage) + '%';
    }
    
    if (subtitleElement && subtitle) {
        subtitleElement.textContent = subtitle;
    }
    
    // Update step icons
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

// Initialize loading
document.addEventListener('DOMContentLoaded', function() {
    // Step 1: Resources loaded
    updateLoadingProgress(33, 1, 'טוען משאבים...');
    
    // Count total videos
    const videos = document.querySelectorAll('video');
    totalVideos = videos.length;
    
    if (totalVideos === 0) {
        // No videos, skip to final step
        updateLoadingProgress(100, 3, 'מכין את האתר...');
        setTimeout(hideLoadingScreen, 1000);
    } else {
        // Step 2: Load videos
        updateLoadingProgress(50, 2, `טוען סרטונים... (0/${totalVideos})`);
        
        let videosReadyCount = 0;
        
        videos.forEach((video, index) => {
            // Set video to load
            video.load();
            
            // When video can play
            video.addEventListener('canplaythrough', function() {
                videosReadyCount++;
                const videoProgress = 50 + (videosReadyCount / totalVideos) * 30;
                updateLoadingProgress(
                    videoProgress, 
                    2, 
                    `טוען סרטונים... (${videosReadyCount}/${totalVideos})`
                );
                
                // All videos loaded
                if (videosReadyCount === totalVideos) {
                    updateLoadingProgress(80, 3, 'מכין את האתר...');
                    
                    // Try to play videos
                    videos.forEach(v => {
                        const playPromise = v.play();
                        if (playPromise !== undefined) {
                            playPromise.catch(error => {
                                console.log('Video autoplay prevented:', error);
                                // Try to play on user interaction
                                document.addEventListener('click', () => {
                                    v.play();
                                }, { once: true });
                            });
                        }
                    });
                    
                    // Wait a bit then hide loading screen
                    setTimeout(hideLoadingScreen, 1000);
                }
            });
            
            // Fallback: if video takes too long
            setTimeout(() => {
                if (videosReadyCount < totalVideos) {
                    console.log('Video loading timeout, proceeding anyway');
                    hideLoadingScreen();
                }
            }, 8000); // 8 second timeout
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

    // Parallax disabled for better performance
    // initParallax();
});

// Parallax Scrolling
function initParallax() {
    const parallaxElements = document.querySelectorAll('.reason-card, .timeline-item, .stat-item');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            if (!element.classList.contains('animate')) return; // Only apply to animated elements
            
            const rect = element.getBoundingClientRect();
            const elementTop = rect.top + scrolled;
            const elementHeight = element.offsetHeight;
            
            if (scrolled + window.innerHeight > elementTop && scrolled < elementTop + elementHeight) {
                const speed = 0.02; // Reduced speed for subtlety
                const yPos = -(scrolled - elementTop) * speed;
                
                // Preserve existing transforms
                const currentTransform = window.getComputedStyle(element).transform;
                if (currentTransform === 'none') {
                    element.style.transform = `translateY(${yPos}px)`;
                }
            }
        });
    });
}

// Scroll animations
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

// Observe existing elements
document.querySelectorAll('.reason-card').forEach(card => {
    observer.observe(card);
});

// Observe timeline items
document.querySelectorAll('.timeline-item').forEach(item => {
    observer.observe(item);
});

// Observe stat items
document.querySelectorAll('.stat-item').forEach(item => {
    observer.observe(item);
});

// Observe code cards
document.querySelectorAll('.code-card').forEach(card => {
    observer.observe(card);
});

const paymentContainer = document.querySelector('.payment-container');
if (paymentContainer) {
    observer.observe(paymentContainer);
}

const contactFormElement = document.querySelector('.contact-form');
if (contactFormElement) {
    observer.observe(contactFormElement);
}

// Scroll to top button with progress
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

// Form submission
const contactForm = document.getElementById('contactForm');
if (contactForm) {
contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const submitBtn = document.querySelector('.submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    
    btnText.style.display = 'none';
    btnLoading.style.display = 'flex';
    submitBtn.disabled = true;

    const templateParams = {
        from_name: document.getElementById('fullName').value,
        from_email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        business_type: document.getElementById('businessType').value,
        message: document.getElementById('message').value
    };

    emailjs.send('service_4gvk08g', 'template_amc3bab', templateParams)
        .then(function(response) {
            console.log('SUCCESS!', response.status, response.text);
            document.getElementById('successMessage').style.display = 'block';
            document.getElementById('contactForm').reset();
            updateFormProgress();
            
            setTimeout(() => {
                document.getElementById('successMessage').style.display = 'none';
            }, 5000);
        }, function(error) {
            console.log('FAILED...', error);
            alert('אופס! משהו השתבש. אנא נסה שוב או צור קשר דרך WhatsApp.');
        })
        .finally(function() {
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
            submitBtn.disabled = false;
        });
});
}

// Real-time Form Validation
const formInputs = document.querySelectorAll('#contactForm input[required], #contactForm select[required]');
if (formInputs.length > 0) {

formInputs.forEach(input => {
    input.addEventListener('input', function() {
        validateField(this);
        updateFormProgress();
    });
    
    input.addEventListener('blur', function() {
        validateField(this);
    });
});

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';
    
    // Check if field is empty
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'שדה חובה';
    }
    
    // Email validation
    if (fieldName === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'כתובת אימייל לא תקינה';
        }
    }
    
    // Phone validation
    if (fieldName === 'phone' && value) {
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(value.replace(/\s+/g, ''))) {
            isValid = false;
            errorMessage = 'מספר טלפון לא תקין (10 ספרות)';
        }
    }
    
    // Name validation
    if (fieldName === 'fullName' && value) {
        if (value.length < 2) {
            isValid = false;
            errorMessage = 'שם חייב להכיל לפחות 2 תווים';
        }
    }
    
    // Update field visual state
    if (isValid && value) {
        field.classList.remove('invalid');
        field.classList.add('valid');
    } else if (!isValid) {
        field.classList.remove('valid');
        field.classList.add('invalid');
    } else {
        field.classList.remove('valid', 'invalid');
    }
    
    // Show/hide error message
    const errorElement = document.getElementById(fieldName + 'Error');
    if (errorElement) {
        errorElement.textContent = errorMessage;
        if (errorMessage) {
            errorElement.classList.add('show');
        } else {
            errorElement.classList.remove('show');
        }
    }
    
    return isValid;
}

// Update form progress bar
function updateFormProgress() {
    const totalFields = formInputs.length;
    let filledFields = 0;

    formInputs.forEach(input => {
        if (input.value.trim() && input.classList.contains('valid')) {
            filledFields++;
        }
    });

    const progress = (filledFields / totalFields) * 100;
    const progressBar = document.getElementById('formProgressBar');
    if (progressBar) {
        progressBar.style.width = progress + '%';
    }
}
}

// Pricing buttons - scroll to contact form
document.querySelectorAll('.pricing-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const pricingCard = this.closest('.pricing-card');
        const packageName = pricingCard.querySelector('.pricing-title').textContent;
        
        // Add ripple effect
        const ripple = document.createElement('span');
        ripple.classList.add('ripple-effect');
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
        
        // Redirect to contact page with package info
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

            // Pre-fill message with package selection
            setTimeout(() => {
                const messageField = document.getElementById('message');
                if (messageField) {
                    messageField.value = `שלום, אני מעוניין/ת בחבילת "${packageName}". אשמח לקבל פרטים נוספים.`;
                    messageField.focus();

                    // Add highlight animation
                    messageField.style.animation = 'fieldHighlight 1s ease';
                    setTimeout(() => {
                        messageField.style.animation = '';
                    }, 1000);
                }
            }, 800);
        } else {
            // Redirect to contact page
            window.location.href = `contact.html?package=${encodeURIComponent(packageName)}`;
        }
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

// Lazy loading for images
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.src;
    });
} else {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
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

// ========================================
// Enhanced Graphics and Effects
// ========================================

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

// Mouse tracking for reason cards (radial gradient spotlight effect)
document.querySelectorAll('.reason-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--mouse-x', x + '%');
        card.style.setProperty('--mouse-y', y + '%');
    });
});

// Smooth reveal animation for elements as they scroll into view
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
});

// Observe elements for reveal animation
document.querySelectorAll('.trust-badge, .info-item, .payment-method').forEach(el => {
    revealObserver.observe(el);
});

// Section titles styling is handled by CSS only (no shimmer effect)

// Tilt effect for pricing cards (3D hover)
document.querySelectorAll('.pricing-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

// Counter animation for stat numbers
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumber = entry.target.querySelector('.stat-number');
            if (statNumber && !statNumber.classList.contains('counted')) {
                statNumber.classList.add('counted');
                animateCounter(statNumber);
            }
        }
    });
}, {
    threshold: 0.5
});

document.querySelectorAll('.stat-item').forEach(stat => {
    counterObserver.observe(stat);
});

function animateCounter(element) {
    const text = element.textContent;
    const hasPlus = text.includes('+');
    const hasPercent = text.includes('%');
    const hasSlash = text.includes('/');

    // Handle special cases like "24/7"
    if (hasSlash) {
        return; // Don't animate 24/7
    }

    const numericValue = parseInt(text.replace(/[^0-9]/g, ''));
    const duration = 2000;
    const steps = 60;
    const increment = numericValue / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
        step++;
        current = Math.min(Math.round(increment * step), numericValue);

        let displayValue = current.toString();
        if (hasPlus) displayValue += '+';
        if (hasPercent) displayValue += '%';

        element.textContent = displayValue;

        if (step >= steps) {
            clearInterval(timer);
            // Restore original text
            element.textContent = text;
        }
    }, duration / steps);
}

// Parallax effect for floating shapes
const shapes = document.querySelectorAll('.shape');
let ticking = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const scrolled = window.pageYOffset;
            shapes.forEach((shape, index) => {
                const speed = 0.1 + (index * 0.05);
                const yPos = -(scrolled * speed);
                shape.style.transform = `translateY(${yPos}px)`;
            });
            ticking = false;
        });
        ticking = true;
    }
});

// Add sparkle effect to logo on hover
const logoText = document.querySelector('.logo-text');
if (logoText) {
    logoText.addEventListener('mouseenter', () => {
        logoText.style.animation = 'sparkle 0.5s ease';
        setTimeout(() => {
            logoText.style.animation = '';
        }, 500);
    });
}

// Typing effect for hero subtitle (only on page load)
const heroSubtitle = document.querySelector('.hero p');
if (heroSubtitle && !sessionStorage.getItem('heroTyped')) {
    const originalText = heroSubtitle.textContent;
    heroSubtitle.textContent = '';
    heroSubtitle.style.minHeight = '30px';

    let charIndex = 0;
    const typeInterval = setInterval(() => {
        if (charIndex < originalText.length) {
            heroSubtitle.textContent += originalText[charIndex];
            charIndex++;
        } else {
            clearInterval(typeInterval);
            sessionStorage.setItem('heroTyped', 'true');
        }
    }, 50);
}

// Enhanced button effects with ripple on click
document.querySelectorAll('.btn, .submit-btn, .pricing-btn, .cta-btn').forEach(btn => {
    // Ripple effect on click
    btn.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Create ripple element
        const ripple = document.createElement('span');
        ripple.className = 'btn-ripple';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.width = '20px';
        ripple.style.height = '20px';

        this.appendChild(ripple);

        // Remove ripple after animation
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });

    // Mouse position tracking for hover effects
    btn.addEventListener('mouseenter', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        this.style.setProperty('--x', x + 'px');
        this.style.setProperty('--y', y + 'px');
    });
});

// ========================================
// Enhanced Scroll Animations
// ========================================

// Section visibility observer
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    sectionObserver.observe(section);
});

// Smooth scroll reveal for cards
const cardRevealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('card-enter');
            }, index * 100);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -30px 0px'
});

document.querySelectorAll('.reason-card, .pricing-card, .code-card, .trust-badge').forEach(card => {
    cardRevealObserver.observe(card);
});

// Enhanced parallax effect for background elements
let lastScrollY = window.scrollY;
let ticking2 = false;

function updateParallax() {
    const scrollY = window.scrollY;

    // Parallax for floating shapes
    document.querySelectorAll('.shape').forEach((shape, index) => {
        const speed = 0.05 + (index * 0.02);
        const yPos = scrollY * speed;
        shape.style.transform = `translateY(${-yPos}px)`;
    });

    // Parallax for blob container
    const blobs = document.querySelectorAll('.blob');
    blobs.forEach((blob, index) => {
        const speed = 0.03 + (index * 0.01);
        const yPos = scrollY * speed;
        blob.style.transform = `translateY(${-yPos}px)`;
    });

    lastScrollY = scrollY;
    ticking2 = false;
}

window.addEventListener('scroll', () => {
    if (!ticking2) {
        requestAnimationFrame(updateParallax);
        ticking2 = true;
    }
}, { passive: true });

// Smooth header shadow on scroll
const header = document.getElementById('header');
if (header) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('shadow-on-scroll', 'scrolled');
        } else {
            header.classList.remove('shadow-on-scroll', 'scrolled');
        }
    }, { passive: true });
}

// Add float animation to icons
document.querySelectorAll('.reason-icon, .pricing-icon, .badge-icon').forEach((icon, index) => {
    icon.style.animationDelay = `${index * 0.2}s`;
    icon.classList.add('float-icon');
});

// Image reveal on scroll
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
        }
    });
}, {
    threshold: 0.3
});

// Only apply image-reveal to logo images, not qr-image (which is handled by payment container)
document.querySelectorAll('.logo img').forEach(img => {
    img.classList.add('image-reveal');
    imageObserver.observe(img);
});

// Scroll progress indicator
const createScrollProgress = () => {
    const existingProgress = document.getElementById('scroll-progress');
    if (existingProgress) return;

    const progress = document.createElement('div');
    progress.id = 'scroll-progress';
    progress.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
        z-index: 10001;
        transition: width 0.1s ease-out;
        width: 0%;
    `;
    document.body.appendChild(progress);

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progress.style.width = `${scrollPercent}%`;
    }, { passive: true });
};

createScrollProgress();

// Titles are now clean without animations

// Mobile-specific optimizations
if (window.innerWidth <= 768) {
    // Reduce animation intensity on mobile
    document.documentElement.style.setProperty('--animation-duration', '0.3s');

    // Disable parallax on mobile for better performance
    window.removeEventListener('scroll', updateParallax);
}
