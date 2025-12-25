// Initialize EmailJS
(function() {
    emailjs.init("mrvxMulPJ4TcR7BFJ");
})();

// Optimized video loading
document.addEventListener('DOMContentLoaded', function() {
    // Hide skeleton loader
    setTimeout(() => {
        document.getElementById('loadingSkeleton').classList.add('hidden');
    }, 1500);

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

    const videos = document.querySelectorAll('video');
    
    videos.forEach(video => {
        // Force video to load immediately
        video.load();
        
        // Ensure video plays
        const playPromise = video.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log('Video autoplay prevented:', error);
                // Try to play on user interaction
                document.addEventListener('click', () => {
                    video.play();
                }, { once: true });
            });
        }
    });
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

const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    observer.observe(contactForm);
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
document.getElementById('contactForm').addEventListener('submit', function(e) {
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

// Real-time Form Validation
const formInputs = document.querySelectorAll('#contactForm input[required], #contactForm select[required]');

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
    document.getElementById('formProgressBar').style.width = progress + '%';
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
        
        // Scroll to contact form
        const contactForm = document.getElementById('contact');
        contactForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // Pre-fill message with package selection
        setTimeout(() => {
            const messageField = document.getElementById('message');
            messageField.value = `שלום, אני מעוניין/ת בחבילת "${packageName}". אשמח לקבל פרטים נוספים.`;
            messageField.focus();
            
            // Add highlight animation
            messageField.style.animation = 'fieldHighlight 1s ease';
            setTimeout(() => {
                messageField.style.animation = '';
            }, 1000);
        }, 800);
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

// Accessibility functionality
const accessibilityBtn = document.getElementById('accessibilityBtn');
const accessibilityMenu = document.getElementById('accessibilityMenu');
let activeAccessibilityOptions = new Set();

// Toggle accessibility menu
accessibilityBtn.addEventListener('click', () => {
    accessibilityMenu.classList.toggle('show');
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!accessibilityBtn.contains(e.target) && !accessibilityMenu.contains(e.target)) {
        accessibilityMenu.classList.remove('show');
    }
});

// Handle accessibility options
document.querySelectorAll('.accessibility-option').forEach(option => {
    option.addEventListener('click', function() {
        const action = this.getAttribute('data-action');
        
        if (action === 'reset') {
            // Reset all accessibility options
            document.body.classList.remove('high-contrast', 'large-text', 'larger-text', 'grayscale', 'invert-colors', 'highlight-links');
            document.querySelectorAll('.accessibility-option').forEach(opt => {
                opt.classList.remove('active');
            });
            activeAccessibilityOptions.clear();
            localStorage.removeItem('accessibility-options');
        } else {
            // Handle text size options (only one can be active)
            if (action === 'large-text' || action === 'larger-text') {
                document.body.classList.remove('large-text', 'larger-text');
                document.querySelectorAll('[data-action="large-text"], [data-action="larger-text"]').forEach(opt => {
                    opt.classList.remove('active');
                });
                activeAccessibilityOptions.delete('large-text');
                activeAccessibilityOptions.delete('larger-text');
            }
            
            // Toggle the selected option
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
            
            // Save to localStorage
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

// Show chatbot after 10 seconds
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

// Close chatbot when clicking outside
document.addEventListener('click', (e) => {
    if (!chatbotBtn.contains(e.target) && !chatbotWindow.contains(e.target)) {
        chatbotWindow.classList.remove('show');
    }
});

// Chatbot responses
const responses = {
    'כמה זמן לוקח לבנות אתר?': 'בדרך כלל לוקח בין שבועיים לחודש, תלוי במורכבות האתר. דף נחיתה פשוט יכול להיות מוכן תוך שבוע!',
    'מה כלול במחיר?': 'המחיר כולל: עיצוב מותאם אישית, פיתוח מלא, אופטימיזציה למובייל.',
    'איך זה עובד?': 'תהליך העבודה שלנו כולל 5 שלבים:\n\n📞 פגישת היכרות טלפונית\n🎨 עיצוב האתר\n💻 פיתוח האתר\n🚀 השקת האתר\n📈 רק לכם נשאר לצמוח ולגדול!\n\nכל שלב מתוכנן בקפידה כדי להבטיח את הצלחת הפרויקט שלכם!'
};

const chatFormContainer = document.getElementById('chatFormContainer');
const chatContactForm = document.getElementById('chatContactForm');
const chatBackBtn = document.getElementById('chatBackBtn');

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

// Handle chat form submission
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

// Handle back button
chatBackBtn.addEventListener('click', () => {
    chatFormContainer.style.display = 'none';
    chatOptions.style.display = 'block';
});
