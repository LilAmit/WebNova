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

    // Validate all fields before submission
    const allInputs = document.querySelectorAll('#contactForm input[required], #contactForm select[required]');
    let hasErrors = false;
    allInputs.forEach(input => {
        validateField(input);
        if (!input.classList.contains('valid')) {
            hasErrors = true;
        }
    });

    if (hasErrors) {
        return;
    }

    const submitBtn = document.querySelector('.submit-btn');
    if (!submitBtn) return;
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');

    if (btnText) btnText.style.display = 'none';
    if (btnLoading) btnLoading.style.display = 'flex';
    submitBtn.disabled = true;

    const templateParams = {
        from_name: document.getElementById('fullName').value,
        from_email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        business_type: document.getElementById('businessType').value,
        message: document.getElementById('message').value
    };

    emailjs.send('service_xawxe8j', 'template_amc3bab', templateParams)
        .then(function(response) {
            console.log('SUCCESS!', response.status, response.text);
            document.getElementById('successMessage').style.display = 'block';
            document.getElementById('contactForm').reset();

            // Reset validation states - remove checkmarks and restore icons
            document.querySelectorAll('#contactForm input, #contactForm select').forEach(input => {
                input.classList.remove('valid', 'invalid');
            });
            document.querySelectorAll('#contactForm .error-message').forEach(el => {
                el.textContent = '';
                el.classList.remove('show');
            });

            updateFormProgress();
            
            setTimeout(() => {
                document.getElementById('successMessage').style.display = 'none';
            }, 5000);
        }, function(error) {
            console.log('FAILED...', error);
            alert('אופס! משהו השתבש. אנא נסה שוב או צור קשר דרך WhatsApp.');
        })
        .finally(function() {
            if (btnText) btnText.style.display = 'inline';
            if (btnLoading) btnLoading.style.display = 'none';
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
        if (/[a-zA-Zא-ת]/.test(value)) {
            isValid = false;
            errorMessage = 'מספר טלפון צריך להכיל מספרים בלבד';
        } else {
            const phoneRegex = /^[0-9]{10}$/;
            if (!phoneRegex.test(value.replace(/\s+/g, ''))) {
                isValid = false;
                errorMessage = 'מספר טלפון לא תקין (10 ספרות)';
            }
        }
    }

    // Name validation
    if (fieldName === 'fullName' && value) {
        if (/[0-9]/.test(value)) {
            isValid = false;
            errorMessage = 'שם מלא צריך להכיל אותיות בלבד';
        } else if (value.length < 2) {
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
const chatOptions = document.getElementById('chatOptions'); // Legacy - may not exist

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

// Reusable contact action buttons (clickable, styled pills)
const CONTACT_BUTTONS = '<div class="chat-contact-buttons"><a href="tel:0584549087" class="chat-contact-btn phone"><span class="chat-contact-icon">📞</span>058-454-9087</a><a href="mailto:amitmozapi@gmail.com" class="chat-contact-btn email"><span class="chat-contact-icon">✉️</span>amitmozapi@gmail.com</a><a href="https://wa.me/972584549087" target="_blank" rel="noopener noreferrer" class="chat-contact-btn whatsapp"><span class="chat-contact-icon">💬</span>וואטסאפ</a></div>';

// Chatbot responses
const responses = {
    'כמה זמן לוקח לבנות אתר?': '⏱️ זמני הפיתוח שלנו:\n\n• דף נחיתה: 3-7 ימים\n• אתר תדמית: 1-2 שבועות\n• אתר מלא: 2-4 שבועות\n\nאנחנו עובדים מהר אבל לא מתפשרים על איכות! 💪',
    'כמה עולה לבנות אתר?': '💬 כדי לתת לך הצעה מדויקת, נשמח לשמוע על הפרויקט שלך!\n\nצור איתנו קשר ונחזור אליך עם כל הפרטים:\n\n' + CONTACT_BUTTONS,
    'איך זה עובד?': '🔄 תהליך העבודה ב-5 שלבים:\n\n1️⃣ פגישת היכרות - נבין את הצרכים שלך\n2️⃣ עיצוב - תקבל הצעה ויזואלית לאישור\n3️⃣ פיתוח - נבנה את האתר שלך\n4️⃣ בדיקות - נוודא שהכל עובד מושלם\n5️⃣ השקה - האתר עולה לאוויר! 🎉\n\nלאורך כל התהליך תקבל עדכונים ותוכל לראות את ההתקדמות.'
};

// Keywords for intelligent responses
const keywordResponses = {
    'מחיר|עלות|כסף|תקציב|עולה|כמה|מחירון': responses['כמה עולה לבנות אתר?'],
    'זמן|מהר|דחוף|לוקח|מתי': responses['כמה זמן לוקח לבנות אתר?'],
    'תהליך|שלבים|איך זה עובד|איך עובד|איך אתם עובדים': responses['איך זה עובד?'],
    'וורדפרס|wordpress|קוד|טכנולוגיה': '💻 אנחנו עובדים עם טכנולוגיות מתקדמות:\n\n• HTML5/CSS3/JavaScript לביצועים מעולים\n• עיצוב רספונסיבי לכל מכשיר\n• אופטימיזציה למהירות טעינה\n• אבטחה ברמה גבוהה\n\nהאתר שלך יהיה מהיר, מאובטח ומודרני!',
    'עיצוב|דיזיין|יפה|צבעים|לוגו': '🎨 העיצוב שלנו כולל:\n\n• עיצוב מותאם אישית לעסק שלך\n• צבעים ופונטים מקצועיים\n• אנימציות מרשימות\n• חוויית משתמש מעולה\n\nכל אתר מעוצב מאפס - לא תבניות משעממות!',
    'תמיכה|עזרה|בעיה|תקלה|שאלה': '🛠️ התמיכה שלנו:\n\n• תמיכה טכנית מלאה\n• זמינות גבוהה\n• תיקון באגים מהיר\n• עדכונים שוטפים\n\nאנחנו כאן בשבילך גם אחרי ההשקה!',
    'seo|קידום|גוגל|חיפוש': '📈 קידום אתרים (SEO):\n\n• אופטימיזציה למנועי חיפוש\n• מהירות טעינה גבוהה\n• תגיות מטא נכונות\n• מבנה אתר ידידותי לגוגל\n\nהאתר שלך יופיע בתוצאות החיפוש!',
    'טלפון|ליצור קשר|לדבר|להתקשר|איך יוצרים קשר|איך אפשר ליצור קשר|יצירת קשר': '📞 דרכי יצירת קשר:\n\n' + CONTACT_BUTTONS + '\nנשמח לשמוע ממך!',
    'שלום|היי|הי|בוקר|ערב|מה קורה|מה נשמע|מה המצב|מה המצב?|מה המצב.': '👋 הכל מעולה ותודה ששאלת!\n\nאני הבוט של WebNova ואני כאן לעזור לך.\nאתה יכול לשאול אותי על השירותים שלנו, זמנים, מחירים או כל שאלה אחרת.\n\nאיך אוכל לעזור לך היום?',
    'תודה|מעולה|אחלה|סבבה': '😊 בשמחה! אם יש עוד שאלות, אני כאן.\n\nרוצה ליצור קשר? פשוט לחץ על הכפתור למטה!',
    'רספונסיבי|מובייל|טלפון|נייד|מותאם': '📱 כל האתרים שלנו רספונסיביים!\n\n• מותאמים לכל גודל מסך\n• טלפונים, טאבלטים ומחשבים\n• חוויית משתמש מושלמת בכל מכשיר\n• נבדקים על מגוון דפדפנים\n\nהאתר שלך יראה מעולה בכל מקום!',
    'אחסון|דומיין|שרת|hosting|domain': '🌐 אחסון ודומיין:\n\n• אנחנו יכולים לעזור לך לבחור אחסון מתאים\n• הגדרת דומיין מותאם אישית\n• SSL מאובטח (HTTPS)\n• גיבויים אוטומטיים\n\nנדאג שהאתר שלך יהיה מהיר ומאובטח!',
    'תחזוקה|עדכון|שינוי|לשנות|לעדכן': '🔧 תחזוקה ועדכונים:\n\n• עדכוני תוכן שוטפים\n• שינויים בעיצוב\n• הוספת דפים חדשים\n• תיקוני באגים\n\nאנחנו מציעים חבילות תחזוקה חודשיות. צור קשר לפרטים!',
    'חנות|מכירה|מוצרים|ecommerce|חנות אונליין': '🛒 חנות אונליין:\n\n• בניית חנות מקוונת מלאה\n• ניהול מוצרים ומלאי\n• סליקת אשראי מאובטחת\n• ממשק ניהול נוח\n\nצור קשר ונשמח לעזור!',
    'פורטפוליו|עבודות|דוגמאות|לראות': '🖼️ הפורטפוליו שלנו:\n\nאתה יכול לראות דוגמאות לעבודות שלנו באתר.\nכל פרויקט מעוצב בהתאמה אישית ללקוח.\n\nרוצה לראות דוגמאות ספציפיות? צור קשר ונשמח להציג!',
    'אבטחה|מאובטח|האקר|פריצה|ssl': '🔒 אבטחת אתרים:\n\n• תעודת SSL (HTTPS) בכל אתר\n• הגנה מפני התקפות\n• קוד נקי ומאובטח\n• גיבויים שוטפים\n\nהאבטחה של האתר שלך חשובה לנו!'
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

    emailjs.sendForm('service_xawxe8j', 'template_amc3bab', this)
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

    // Dynamic time/date/day responses
    const dynamic = getDynamicResponse(lowerMessage);
    if (dynamic) return dynamic;

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
    return '🤔 תודה על השאלה!\n\nלא הצלחתי להבין בדיוק מה אתה מחפש, אבל אשמח לעזור!\n\nתוכל ליצור קשר ישירות:\n\n' + CONTACT_BUTTONS;
}

function getDynamicResponse(lowerMessage) {
    const now = new Date();
    const hebrewDays = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
    const hebrewMonths = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];

    // Time
    if (/מה השעה|מה שעה|השעה עכשיו|מה הזמן|איזה שעה|שעה עכשיו/.test(lowerMessage)) {
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        return `🕐 השעה כרגע היא ${hours}:${minutes}\n\nמשהו נוסף שאוכל לעזור בו?`;
    }

    // Day of week
    if (/איזה יום|מה היום|יום בשבוע/.test(lowerMessage)) {
        const dayName = hebrewDays[now.getDay()];
        return `📅 היום יום ${dayName}.\n\nאיך אוכל לעזור לך?`;
    }

    // Date
    if (/מה התאריך|איזה תאריך|התאריך היום/.test(lowerMessage)) {
        const day = now.getDate();
        const month = hebrewMonths[now.getMonth()];
        const year = now.getFullYear();
        return `📆 התאריך היום: ${day} ב${month} ${year}.\n\nעל מה תרצה לדבר?`;
    }

    return null;
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
document.querySelectorAll('.trust-badge, .info-item').forEach(el => {
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

// Only apply image-reveal to logo images
document.querySelectorAll('.logo img').forEach(img => {
    img.classList.add('image-reveal');
    imageObserver.observe(img);
});

// Scroll progress indicator handled by HTML element #scrollProgressBar

// Titles are now clean without animations

// ========================================
// Mobile-Specific Optimizations
// ========================================
(function() {
    const isMobile = window.innerWidth <= 768;
    const isSmallMobile = window.innerWidth <= 480;

    // --- Hamburger Menu (Slide from Left for RTL) ---
    const menuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('navMenu');
    const nav = navMenu ? navMenu.closest('nav') : null;

    if (menuToggle && nav) {
        const headerContent = document.querySelector('.header-content');

        // Create close button inside nav
        const closeBtn = document.createElement('button');
        closeBtn.className = 'mobile-menu-close';
        closeBtn.setAttribute('aria-label', 'סגור תפריט');
        closeBtn.innerHTML = '<span></span><span></span>';
        nav.insertBefore(closeBtn, nav.firstChild);

        // Create dark overlay
        const overlay = document.createElement('div');
        overlay.className = 'mobile-menu-overlay';
        document.body.appendChild(overlay);

        function openMenu() {
            menuToggle.classList.add('active');
            nav.classList.add('mobile-open');
            overlay.classList.add('active');
            document.body.classList.add('mobile-menu-open');
            document.body.style.overflow = 'hidden';
        }

        function closeMenu() {
            menuToggle.classList.remove('active');
            nav.classList.remove('mobile-open');
            overlay.classList.remove('active');
            document.body.classList.remove('mobile-menu-open');
            document.body.style.overflow = '';
        }

        // On mobile, move nav to body so position:fixed works
        // (header has backdrop-filter which creates containing block)
        function setupMobileMenu() {
            if (window.innerWidth <= 768) {
                if (nav.parentElement !== document.body) {
                    document.body.appendChild(nav);
                }
            } else {
                if (nav.parentElement === document.body && headerContent) {
                    headerContent.insertBefore(nav, menuToggle);
                }
                closeMenu();
            }
        }

        setupMobileMenu();
        window.addEventListener('resize', setupMobileMenu);

        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            if (nav.classList.contains('mobile-open')) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        closeBtn.addEventListener('click', closeMenu);

        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        overlay.addEventListener('click', closeMenu);

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && nav.classList.contains('mobile-open')) {
                closeMenu();
            }
        });
    }

    if (isMobile) {
        // Reduce animation intensity
        document.documentElement.style.setProperty('--animation-duration', '0.3s');

        // Disable parallax on mobile for better performance
        window.removeEventListener('scroll', updateParallax);

        // Disable heavy CSS animations on mobile
        const heavyAnimatedEls = document.querySelectorAll('.animated-bg, .floating-shapes');
        heavyAnimatedEls.forEach(el => {
            el.style.animationDuration = '30s'; // Slow down instead of removing
        });

        // Disable 3D transforms on cards for smoother scrolling
        document.querySelectorAll('.reason-card, .pricing-card, .trust-badge, .code-card').forEach(card => {
            card.style.transformStyle = 'flat';
            card.style.perspective = 'none';
        });

        // Passive scroll listeners for smooth performance
        document.addEventListener('touchstart', function(){}, {passive: true});
        document.addEventListener('touchmove', function(){}, {passive: true});

        // Fix iOS viewport height (100vh issue)
        function setVH() {
            document.documentElement.style.setProperty('--vh', (window.innerHeight * 0.01) + 'px');
        }
        setVH();
        window.addEventListener('resize', setVH);

        // Prevent zoom on input focus (iOS)
        document.querySelectorAll('input, textarea, select').forEach(el => {
            el.setAttribute('autocomplete', el.getAttribute('autocomplete') || 'off');
        });
    }

    // Floating buttons always visible on mobile (no hide on scroll)
})();

// ========================================
// Animation Performance Optimization
// ========================================
// Pause all CSS animations when the tab is not visible
(function() {
    const animatedBg = document.querySelector('.animated-bg');
    const floatingShapes = document.querySelector('.floating-shapes');
    const blobContainer = document.querySelector('.blob-container');

    document.addEventListener('visibilitychange', function() {
        const paused = document.hidden;
        [animatedBg, floatingShapes, blobContainer].forEach(el => {
            if (el) {
                el.style.animationPlayState = paused ? 'paused' : 'running';
                el.querySelectorAll('*').forEach(child => {
                    child.style.animationPlayState = paused ? 'paused' : 'running';
                });
            }
        });
    });
})();

// ========================================
// Page Transitions
// ========================================
(function() {
    // Create transition overlay
    const overlay = document.createElement('div');
    overlay.className = 'page-transition-overlay';
    overlay.innerHTML = '<span class="page-transition-logo">WebNova</span>';
    document.body.appendChild(overlay);

    // Page enter animation
    document.body.classList.add('page-enter');
    setTimeout(() => document.body.classList.remove('page-enter'), 400);

    // Intercept internal navigation links
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a');
        if (!link) return;

        const href = link.getAttribute('href');
        if (!href) return;

        // Skip external links, anchors, javascript:, tel:, mailto:, whatsapp
        if (href.startsWith('#') || href.startsWith('http') || href.startsWith('javascript:') ||
            href.startsWith('tel:') || href.startsWith('mailto:') || href.startsWith('https://wa.me') ||
            link.target === '_blank') return;

        // Only handle internal .html links
        if (href.endsWith('.html') || href === '/' || href === '') {
            e.preventDefault();
            overlay.classList.add('active');
            setTimeout(() => {
                window.location.href = href;
            }, 400);
        }
    });
})();

// ========================================
// 3. Letter-by-Letter Section Title Animation
// ========================================
(function() {
    const titles = document.querySelectorAll('.section-title');

    titles.forEach(title => {
        const text = title.textContent.trim();
        title.textContent = '';
        title.setAttribute('aria-label', text);
        title.setAttribute('role', 'heading');

        // Split text into segments: Latin runs, Hebrew runs, spaces, and punctuation
        // This preserves LTR word order (like "WebNova") within RTL text
        const segments = text.match(/[a-zA-Z]+|[\u0590-\u05FF]+|\s+|[^a-zA-Z\u0590-\u05FF\s]+/g) || [];
        let charIndex = 0;

        segments.forEach(segment => {
            if (/^\s+$/.test(segment)) {
                // Space
                const span = document.createElement('span');
                span.className = 'char';
                span.textContent = '\u00A0';
                span.style.transitionDelay = `${charIndex * 0.03}s`;
                span.setAttribute('aria-hidden', 'true');
                title.appendChild(span);
                charIndex++;
                return;
            }

            const isLatin = /^[a-zA-Z]+$/.test(segment);

            if (isLatin) {
                // Wrap Latin word in LTR container to preserve letter order
                const wrapper = document.createElement('span');
                wrapper.style.display = 'inline-flex';
                wrapper.style.direction = 'ltr';
                wrapper.style.unicodeBidi = 'bidi-override';
                wrapper.setAttribute('aria-hidden', 'true');

                [...segment].forEach(char => {
                    const span = document.createElement('span');
                    span.className = 'char';
                    span.textContent = char;
                    span.style.transitionDelay = `${charIndex * 0.03}s`;
                    wrapper.appendChild(span);
                    charIndex++;
                });

                title.appendChild(wrapper);
            } else if (/^[\u0590-\u05FF]+$/.test(segment)) {
                // Hebrew word - wrap in container to prevent mid-word line breaks
                const wrapper = document.createElement('span');
                wrapper.style.display = 'inline-flex';
                wrapper.style.whiteSpace = 'nowrap';
                wrapper.setAttribute('aria-hidden', 'true');

                [...segment].forEach(char => {
                    const span = document.createElement('span');
                    span.className = 'char';
                    span.textContent = char;
                    span.style.transitionDelay = `${charIndex * 0.03}s`;
                    wrapper.appendChild(span);
                    charIndex++;
                });

                title.appendChild(wrapper);
            } else {
                // Punctuation or other characters - render normally
                [...segment].forEach(char => {
                    const span = document.createElement('span');
                    span.className = 'char';
                    span.textContent = char;
                    span.style.transitionDelay = `${charIndex * 0.03}s`;
                    span.setAttribute('aria-hidden', 'true');
                    title.appendChild(span);
                    charIndex++;
                });
            }
        });
    });

    const titleObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('text-animated');
                titleObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    titles.forEach(title => titleObserver.observe(title));
})();

// ========================================
// 4. Hero Particles (Homepage)
// ========================================
(function() {
    const container = document.getElementById('heroParticlesHome') || document.getElementById('heroParticles');
    if (!container) return;

    const count = 40;
    for (let i = 0; i < count; i++) {
        const p = document.createElement('div');
        p.className = 'hero-particle';
        const size = Math.random() * 5 + 2;
        const duration = Math.random() * 15 + 10;
        const delay = Math.random() * 10;
        const startX = Math.random() * 100;
        const startY = Math.random() * 100;
        const brightness = Math.random() * 0.4 + 0.2;

        p.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            background: rgba(255, 255, 255, ${brightness});
            left: ${startX}%;
            top: ${startY}%;
            animation: heroFloat ${duration}s ease-in-out ${delay}s infinite;
        `;
        container.appendChild(p);
    }

    if (!document.getElementById('heroParticleStyle')) {
        const style = document.createElement('style');
        style.id = 'heroParticleStyle';
        style.textContent = `
            @keyframes heroFloat {
                0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
                25% { transform: translate(${Math.random() * 60 - 30}px, -${Math.random() * 80 + 20}px) scale(1.3); opacity: 0.7; }
                50% { transform: translate(${Math.random() * 40 - 20}px, -${Math.random() * 60 + 10}px) scale(0.8); opacity: 0.5; }
                75% { transform: translate(${Math.random() * 50 - 25}px, ${Math.random() * 30}px) scale(1.1); opacity: 0.6; }
            }
        `;
        document.head.appendChild(style);
    }
})();

// ========================================
// 5. Magnetic Buttons
// ========================================
(function() {
    const magneticBtns = document.querySelectorAll('.cta-btn, .btn-primary, .portfolio-btn');

    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            this.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px) scale(1.05)`;
        });

        btn.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
})();

// ========================================
// 6. Infinite Tech Ticker
// ========================================
(function() {
    const ticker = document.getElementById('techTicker');
    if (!ticker) return;

    const techs = [
        { icon: 'fa-brands fa-html5', name: 'HTML5' },
        { icon: 'fa-brands fa-css3-alt', name: 'CSS3' },
        { icon: 'fa-brands fa-js', name: 'JavaScript' },
        { icon: 'fa-brands fa-react', name: 'React' },
        { icon: 'fa-brands fa-node-js', name: 'Node.js' },
        { icon: 'fa-solid fa-mobile-screen', name: 'Responsive' },
        { icon: 'fa-solid fa-magnifying-glass', name: 'SEO' },
        { icon: 'fa-solid fa-gauge-high', name: 'Performance' },
        { icon: 'fa-solid fa-shield-halved', name: 'Security' },
        { icon: 'fa-solid fa-universal-access', name: 'Accessibility' },
        { icon: 'fa-brands fa-figma', name: 'Figma' },
        { icon: 'fa-solid fa-palette', name: 'UI/UX Design' },
    ];

    const itemsHTML = techs.map(t =>
        `<div class="ticker-item"><i class="${t.icon}"></i> ${t.name}</div>`
    ).join('');

    // Duplicate many times for seamless infinite loop with no gaps
    ticker.innerHTML = `<div class="ticker-track">${itemsHTML}${itemsHTML}${itemsHTML}${itemsHTML}${itemsHTML}${itemsHTML}</div>`;
})();

// ========================================
// 7. Portfolio Image Reveal on Scroll
// ========================================
(function() {
    const portfolioObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, index * 200);
                portfolioObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.portfolio-item').forEach(item => {
        item.classList.add('reveal-ready');
        portfolioObserver.observe(item);
    });
})();

// ========================================
// 2. Portfolio 3D Tilt Effect
// ========================================
(function() {
    if (window.innerWidth <= 768) return; // Disable on mobile

    document.querySelectorAll('.portfolio-item').forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 15;
            const rotateY = (centerX - x) / 15;

            this.classList.add('tilt-active');
            this.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
        });

        card.addEventListener('mouseleave', function() {
            this.classList.remove('tilt-active');
            this.style.transform = '';
        });
    });
})();

