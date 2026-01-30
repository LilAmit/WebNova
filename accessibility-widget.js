/**
 * ===========================================================================================
 * |                    מערכת נגישות - תקן ישראלי 5568                        |
 * |                   Accessibility System JavaScript                         |
 * | ----------------------------------------------------------------------------------------|
 * |  קובץ JavaScript עצמאי למערכת נגישות מלאה                                |
 * |  תכונות: קורא מסך בעברית, 20+ פיצ'רי נגישות, שמירת העדפות               |
 * |  תאימות: WCAG 2.0 Level AA / תקן ישראלי 5568                            |
 * ===========================================================================================
 *
 * @author   Sunrise Spa
 * @license  MIT
 * @version  1.0.0
 */

(function() {
  'use strict';

  // ========================
  // מערכת נגישות - Accessibility Manager
  // ========================
  const AccessibilityManager = {
    panel: null,
    trigger: null,
    closeBtn: null,
    resetBtn: null,
    actions: null,
    textSize: 100,
    lineHeight: 1.5,
    letterSpacing: 0,
    cursorSize: 1,
    screenReaderActive: false,
    screenReaderSpeed: 1,
    readingGuideActive: false,

    // אתחול המערכת
    init() {
      // המתן לטעינת ה-DOM
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.initElements());
      } else {
        this.initElements();
      }
    },

    // אתחול אלמנטים
    initElements() {
      this.panel = document.getElementById('accessibilityPanel');
      this.trigger = document.getElementById('accessibilityBtn');
      this.closeBtn = document.getElementById('accessibilityClose');
      this.resetBtn = document.getElementById('resetAccessibilityBtn');
      this.actions = document.querySelectorAll('.accessibility-action');

      if (!this.panel || !this.trigger) {
        console.warn('Accessibility widget elements not found');
        return;
      }

      this.loadSettings();
      this.bindEvents();
      this.initScreenReader();
      this.initReadingGuide();
      this.initAccessibilityButtons();
    },

    // קישור אירועים
    bindEvents() {
      // פתיחה/סגירה
      if (this.trigger) {
        this.trigger.addEventListener('click', () => this.togglePanel());
      }
      if (this.closeBtn) {
        this.closeBtn.addEventListener('click', () => this.closePanel());
      }

      // סגירה ב-ESC ואיפוס ב-Alt+R
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.panel && this.panel.classList.contains('active')) {
          this.closePanel();
        }
        // Alt+R לאיפוס כל ההעדרות נגישות
        if (e.altKey && (e.key === 'r' || e.key === 'R' || e.key === 'ר')) {
          e.preventDefault();
          this.resetAll();
        }
      });

      // איפוס
      if (this.resetBtn) {
        this.resetBtn.addEventListener('click', () => this.resetAll());
      }

      // סגירה בלחיצה מחוץ לפאנל
      document.addEventListener('click', (e) => {
        if (this.panel && this.panel.classList.contains('active') &&
            !this.panel.contains(e.target) &&
            this.trigger && !this.trigger.contains(e.target)) {
          this.closePanel();
        }
      });
    },

    // פתיחה/סגירה של פאנל
    togglePanel() {
      if (!this.panel) return;
      const isOpen = this.panel.classList.toggle('active');
      if (this.trigger) {
        this.trigger.setAttribute('aria-expanded', isOpen);
      }
      this.announce(isOpen ? 'תפריט נגישות נפתח' : 'תפריט נגישות נסגר');

      if (isOpen) {
        const firstBtn = this.panel.querySelector('.accessibility-btn');
        if (firstBtn) firstBtn.focus();
      }
    },

    // סגירת פאנל
    closePanel() {
      if (!this.panel) return;
      this.panel.classList.remove('active');
      if (this.trigger) {
        this.trigger.setAttribute('aria-expanded', 'false');
        this.trigger.focus();
      }
    },

    // ===== קורא מסך (Screen Reader) =====
    initScreenReader() {
      if ('speechSynthesis' in window) {
        this.synth = window.speechSynthesis;
        this.setupHebrewVoice();
      }
    },

    setupHebrewVoice() {
      const loadVoices = () => {
        const voices = this.synth.getVoices();
        // לחפוש קול עברי
        this.hebrewVoice = voices.find(voice =>
          voice.lang.includes('he') ||
          voice.lang.includes('iw') ||
          voice.name.includes('Hebrew')
        );
        // אם אין קול עברי, להשתמש בקול ברירת מחדל
        if (!this.hebrewVoice && voices.length > 0) {
          this.hebrewVoice = voices[0];
        }
      };

      if (this.synth.getVoices().length > 0) {
        loadVoices();
      } else {
        this.synth.addEventListener('voiceschanged', loadVoices);
      }
    },

    toggleScreenReader(btn) {
      this.screenReaderActive = !this.screenReaderActive;
      btn.setAttribute('aria-pressed', this.screenReaderActive);

      if (this.screenReaderActive) {
        this.announce('קורא מסך מופעל. לחץ על אלמנט לשמיעתו.');
        this.enableScreenReaderListeners();
        document.body.classList.add('screen-reader-active');

        // קרא את כותרת העף בהתחלה
        setTimeout(() => {
          const pageTitle = document.querySelector('h1')?.innerText || document.title;
          this.speak(`עמוד: ${pageTitle}`);
        }, 1500);
      } else {
        this.announce('קורא מסך כבוי');
        this.disableScreenReaderListeners();
        document.body.classList.remove('screen-reader-active');
        this.stopSpeaking();
      }
    },

    enableScreenReaderListeners() {
      // פונקציית עזר לקבלת תיאור של אלמנט
      const getElementDescription = (target) => {
        let textToRead = '';
        const tagName = target.tagName;
        const ariaLabel = target.getAttribute('aria-label');
        const title = target.getAttribute('title');

        // אם יש aria-label, להשתמש בו קודם
        if (ariaLabel) {
          textToRead = ariaLabel;
        }
        // קישורים
        else if (tagName === 'A') {
          const href = target.getAttribute('href');
          const text = target.innerText.trim() || title || 'ללא טקסט';
          if (href && href.startsWith('tel:')) {
            textToRead = `קישור לטלפון: ${text}`;
          } else if (href && href.startsWith('mailto:')) {
            textToRead = `קישור לאימייל: ${text}`;
          } else if (target.target === '_blank') {
            textToRead = `קישור חיצוני: ${text} - נפתח בחלון חדש`;
          } else {
            textToRead = `קישור: ${text}`;
          }
        }
        // כפתורים
        else if (tagName === 'BUTTON') {
          const text = target.innerText.trim() || title || ariaLabel || 'ללא תיאור';
          const pressed = target.getAttribute('aria-pressed');
          if (pressed !== null) {
            textToRead = `כפתור מתג: ${text} - ${pressed === 'true' ? 'מופעל' : 'כבוי'}`;
          } else {
            textToRead = `כפתור: ${text}`;
          }
        }
        // כותרות
        else if (tagName.match(/^H[1-6]$/)) {
          const level = tagName.charAt(1);
          textToRead = `כותרת רמה ${level}: ${target.innerText.trim()}`;
        }
        // תמונות
        else if (tagName === 'IMG') {
          textToRead = `תמונה: ${target.alt || 'ללא תיאור'}`;
        }
        // שדות קלט
        else if (tagName === 'INPUT') {
          const type = target.type;
          const label = target.labels?.[0]?.innerText || target.placeholder || ariaLabel || '';
          const value = target.value || '';
          if (type === 'checkbox') {
            textToRead = `תיבת סימון: ${label} - ${target.checked ? 'מסומן' : 'לא מסומן'}`;
          } else if (type === 'radio') {
            textToRead = `כפתור בחירה: ${label} - ${target.checked ? 'נבחר' : 'לא נבחר'}`;
          } else {
            textToRead = `שדה קלט ${label}: ${value || 'ריק'}`;
          }
        }
        // פסקאות ותוכן אחר
        else if (tagName === 'P') {
          textToRead = target.innerText.trim();
        }
        // תוכן אחר
        else if (target.innerText && target.innerText.trim()) {
          if (target.children.length <= 2) {
            textToRead = target.innerText.trim();
          }
        }

        return textToRead;
      };

      // האזנה ללחיצות
      this.screenReaderListener = (e) => {
        const target = e.target;
        const textToRead = getElementDescription(target);
        if (textToRead) {
          this.speak(textToRead);
        }
      };

      // האזנה לשינויי פוקוס
      this.screenReaderFocusListener = (e) => {
        const target = e.target;
        const textToRead = getElementDescription(target);
        if (textToRead) {
          this.speak(textToRead);
        }
      };

      document.body.addEventListener('click', this.screenReaderListener);
      document.body.addEventListener('focusin', this.screenReaderFocusListener);
    },

    disableScreenReaderListeners() {
      if (this.screenReaderListener) {
        document.body.removeEventListener('click', this.screenReaderListener);
      }
      if (this.screenReaderFocusListener) {
        document.body.removeEventListener('focusin', this.screenReaderFocusListener);
      }
    },

    speak(text, quiet = false) {
      if (!this.synth) return;

      // עצור דיבור קודם
      this.synth.cancel();

      const utterance = new SpeechSynthesisUtterance(text);

      if (this.hebrewVoice) {
        utterance.voice = this.hebrewVoice;
      }

      utterance.lang = 'he-IL';
      utterance.rate = this.screenReaderSpeed;
      utterance.pitch = 1;
      utterance.volume = quiet ? 0.5 : 1;

      this.synth.speak(utterance);
    },

    stopSpeaking() {
      if (this.synth) {
        this.synth.cancel();
      }
    },

    adjustReaderSpeed(delta) {
      this.screenReaderSpeed = Math.max(0.5, Math.min(2, this.screenReaderSpeed + delta));
      this.announce(`מהירות קריאה: ${Math.round(this.screenReaderSpeed * 100)}%`);
    },

    // ===== מדריך קריאה (Reading Guide) =====
    initReadingGuide() {
      if (!document.getElementById('readingGuide')) {
        const guide = document.createElement('div');
        guide.id = 'readingGuide';
        guide.style.display = 'none';
        document.body.appendChild(guide);
      }
    },

    toggleReadingGuide(btn) {
      const guide = document.getElementById('readingGuide');
      this.readingGuideActive = !this.readingGuideActive;
      btn.setAttribute('aria-pressed', this.readingGuideActive);

      if (this.readingGuideActive) {
        guide.style.display = 'block';
        this.updateGuideHandler = (e) => {
          guide.style.top = e.clientY + 'px';
        };
        document.addEventListener('mousemove', this.updateGuideHandler);
        document.body.classList.add('reading-guide-active');
        this.announce('מדריך קריאה מופעל');
      } else {
        guide.style.display = 'none';
        if (this.updateGuideHandler) {
          document.removeEventListener('mousemove', this.updateGuideHandler);
        }
        document.body.classList.remove('reading-guide-active');
        this.announce('מדריך קריאה כבוי');
      }
    },

    // ===== פונקציות נוספות =====
    toggleLineHeight(btn) {
      const isActive = document.body.classList.toggle('line-height-active');
      btn.setAttribute('aria-pressed', isActive);
      this.announce(isActive ? 'מרווח שורות מוגדל' : 'מרווח שורות רגיל');
    },

    toggleLetterSpacing(btn) {
      const isActive = document.body.classList.toggle('letter-spacing-active');
      btn.setAttribute('aria-pressed', isActive);
      this.announce(isActive ? 'מרווח אותיות מוגדל' : 'מרווח אותיות רגיל');
    },

    toggleDyslexiaFont(btn) {
      const isActive = document.body.classList.toggle('dyslexia-font-active');
      btn.setAttribute('aria-pressed', isActive);
      this.announce(isActive ? 'גופן דיסלקציה מופעל' : 'גופן דיסלקציה כבוי');
    },

    toggleBigCursor(btn) {
      const isActive = document.body.classList.toggle('big-cursor-active');
      btn.setAttribute('aria-pressed', isActive);
      this.announce(isActive ? 'סמן גדול מופעל' : 'סמן גדול כבוי');
    },

    toggleCursorColor(btn) {
      const isActive = document.body.classList.toggle('cursor-color-active');
      btn.setAttribute('aria-pressed', isActive);
      this.announce(isActive ? 'צבע סמן שונה' : 'צבע סמן רגיל');
    },

    toggleInvertColors(btn) {
      const isActive = document.body.classList.toggle('invert-colors-active');
      btn.setAttribute('aria-pressed', isActive);
      this.announce(isActive ? 'צבעים הפוכים מופעלים' : 'צבעים הפוכים כבויים');
    },

    toggleStopAnimations(btn) {
      const isActive = document.body.classList.toggle('stop-animations-active');
      btn.setAttribute('aria-pressed', isActive);
      this.announce(isActive ? 'אנימציות הושבתו' : 'אנימציות מופעלות');
    },

    toggleTextDirection(btn) {
      const currentDir = document.documentElement.getAttribute('dir') || 'rtl';
      const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
      document.documentElement.setAttribute('dir', newDir);
      btn.setAttribute('aria-pressed', newDir === 'ltr');
      this.announce(`כיוון טקסט שונה ל-${newDir === 'rtl' ? 'ימין לשמאל' : 'שמאל לימין'}`);
    },

    toggleHideMedia(btn) {
      const isActive = document.body.classList.toggle('hide-media-active');
      btn.setAttribute('aria-pressed', isActive);
      this.announce(isActive ? 'תמונות מסתרות' : 'תמונות מוצגות');
    },

    toggleKeyboardNav(btn) {
      const isActive = document.body.classList.toggle('keyboard-nav-active');
      btn.setAttribute('aria-pressed', isActive);

      if (isActive) {
        this.enableFullKeyboardNav();
        this.announce('ניווט מקלדת מלא מופעל. השתמש ב-Tab לניווט, Enter להפעלה');
      } else {
        this.disableFullKeyboardNav();
        this.announce('ניווט מקלדת מלא כבוי');
      }
    },

    enableFullKeyboardNav() {
      // הוספת tabindex לאלמנטים אינטראקטיביים
      const interactiveElements = document.querySelectorAll(
        'a, button, input, select, textarea, [role="button"], ' +
        'h1, h2, h3, h4, h5, h6, p, li'
      );
      interactiveElements.forEach(el => {
        if (!el.hasAttribute('tabindex') && !el.closest('.accessibility-panel')) {
          el.setAttribute('tabindex', '0');
          el.setAttribute('data-keyboard-nav-added', 'true');
        }
      });
    },

    disableFullKeyboardNav() {
      const addedElements = document.querySelectorAll('[data-keyboard-nav-added="true"]');
      addedElements.forEach(el => {
        el.removeAttribute('tabindex');
        el.removeAttribute('data-keyboard-nav-added');
      });
    },

    toggleFeature(feature, btn) {
      const scrollY = window.scrollY;
      const scrollX = window.scrollX;

      const isActive = document.body.classList.toggle(`${feature}-active`);
      btn.setAttribute('aria-pressed', isActive);
      this.announce(`${btn.textContent.trim()} ${isActive ? 'מופעל' : 'כבוי'}`);

      // שמירת מיקום גלילה
      requestAnimationFrame(() => {
        window.scrollTo(scrollX, scrollY);
      });
    },

    changeTextSize(delta) {
      this.textSize = Math.max(80, Math.min(150, this.textSize + delta));
      document.documentElement.style.fontSize = this.textSize + '%';
      this.announce(`גודל טקסט שונה ל-${this.textSize}%`);
      this.saveSettings();
    },

    // אתחול כפתורי נגישות
    initAccessibilityButtons() {
      const buttons = {
        'increaseFontBtn': () => this.changeTextSize(10),
        'decreaseFontBtn': () => this.changeTextSize(-10),
        'darkContrastBtn': (btn) => this.toggleFeature('dark-mode', btn),
        'highContrastYellowBtn': (btn) => this.toggleFeature('high-contrast-yellow', btn),
        'highlightLinksBtn': (btn) => this.toggleFeature('highlight-links', btn),
        'textDirectionBtn': (btn) => this.toggleTextDirection(btn),
        'stopAnimationsBtn': (btn) => this.toggleStopAnimations(btn),
        'readableFontBtn': (btn) => this.toggleFeature('readable-font', btn),
        'screenReaderBtn': (btn) => this.toggleScreenReader(btn),
        'readerSpeedUpBtn': () => this.adjustReaderSpeed(0.25),
        'readerSpeedDownBtn': () => this.adjustReaderSpeed(-0.25),
        'lineHeightBtn': (btn) => this.toggleLineHeight(btn),
        'letterSpacingBtn': (btn) => this.toggleLetterSpacing(btn),
        'dyslexiaFontBtn': (btn) => this.toggleDyslexiaFont(btn),
        'bigCursorBtn': (btn) => this.toggleBigCursor(btn),
        'cursorColorBtn': (btn) => this.toggleCursorColor(btn),
        'invertColorsBtn': (btn) => this.toggleInvertColors(btn),
        'readingGuideBtn': (btn) => this.toggleReadingGuide(btn),
        'hideMediaBtn': (btn) => this.toggleHideMedia(btn),
        'keyboardNavBtn': (btn) => this.toggleKeyboardNav(btn),
      };

      Object.entries(buttons).forEach(([id, handler]) => {
        const btn = document.getElementById(id);
        if (btn) {
          btn.addEventListener('click', () => {
            handler(btn);
            this.saveSettings();
          });
        }
      });
    },

    // איפוס כל ההעדפות
    resetAll() {
      // עצור קורא מסך אם פעיל
      if (this.screenReaderActive) {
        this.stopSpeaking();
        this.disableScreenReaderListeners();
        this.screenReaderActive = false;
      }

      // הסרת כל המחלקות
      document.body.className = '';
      document.documentElement.style.fontSize = '';
      document.documentElement.setAttribute('dir', 'rtl');

      // איפוס משתנים
      this.textSize = 100;
      this.lineHeight = 1.5;
      this.letterSpacing = 0;
      this.screenReaderSpeed = 1;
      this.readingGuideActive = false;

      // איפוס כפתורים
      const allButtons = document.querySelectorAll('.accessibility-panel button, .accessibility-btn');
      allButtons.forEach(btn => {
        btn.setAttribute('aria-pressed', 'false');
      });

      // איפוס מדריך קריאה
      const readingGuide = document.getElementById('readingGuide');
      if (readingGuide) {
        readingGuide.style.display = 'none';
        if (this.updateGuideHandler) {
          document.removeEventListener('mousemove', this.updateGuideHandler);
        }
      }

      localStorage.removeItem('accessibilitySettings');
      this.announce('כל הגדרות הנגישות אופסו');

      // אנימציה לכפתור איפוס
      if (this.resetBtn) {
        const originalHTML = this.resetBtn.innerHTML;
        this.resetBtn.innerHTML = '<i class="fa-solid fa-check"></i> אופס בהצלחה!';
        setTimeout(() => {
          this.resetBtn.innerHTML = originalHTML;
        }, 2000);
      }
    },

    // שמירת העדפות
    saveSettings() {
      const buttonStates = {};
      const buttonIds = [
        'screenReaderBtn', 'increaseFontBtn', 'decreaseFontBtn',
        'darkContrastBtn', 'highContrastYellowBtn', 'highlightLinksBtn',
        'textDirectionBtn', 'stopAnimationsBtn', 'readableFontBtn',
        'lineHeightBtn', 'letterSpacingBtn', 'dyslexiaFontBtn',
        'bigCursorBtn', 'cursorColorBtn', 'invertColorsBtn',
        'readingGuideBtn', 'hideMediaBtn', 'keyboardNavBtn'
      ];

      buttonIds.forEach(id => {
        const btn = document.getElementById(id);
        if (btn) {
          buttonStates[id] = btn.getAttribute('aria-pressed') === 'true';
        }
      });

      const settings = {
        classes: document.body.className,
        textSize: this.textSize,
        screenReaderActive: this.screenReaderActive,
        screenReaderSpeed: this.screenReaderSpeed,
        buttonStates: buttonStates
      };
      localStorage.setItem('accessibilitySettings', JSON.stringify(settings));
    },

    // טעינת העדפות
    loadSettings() {
      const saved = localStorage.getItem('accessibilitySettings');
      if (!saved) return;

      try {
        const settings = JSON.parse(saved);
        document.body.className = settings.classes || '';
        this.textSize = settings.textSize || 100;
        document.documentElement.style.fontSize = this.textSize + '%';

        // טעינת מצב כפתורים
        if (settings.buttonStates) {
          Object.entries(settings.buttonStates).forEach(([id, isActive]) => {
            const btn = document.getElementById(id);
            if (btn && isActive) {
              btn.setAttribute('aria-pressed', 'true');

              // הפעלת קורא מסך אם היה פעיל
              if (id === 'screenReaderBtn') {
                this.screenReaderActive = true;
                this.enableScreenReaderListeners();
                document.body.classList.add('screen-reader-active');
              }

              // הפעלת מדריך קריאה אם היה פעיל
              if (id === 'readingGuideBtn') {
                const guide = document.getElementById('readingGuide');
                if (guide) {
                  guide.style.display = 'block';
                  this.updateGuideHandler = (e) => {
                    guide.style.top = e.clientY + 'px';
                  };
                  document.addEventListener('mousemove', this.updateGuideHandler);
                }
              }

              // הפעלת ניווט מקלדת אם היה פעיל
              if (id === 'keyboardNavBtn') {
                this.enableFullKeyboardNav();
              }
            }
          });
        }

        if (settings.screenReaderSpeed) {
          this.screenReaderSpeed = settings.screenReaderSpeed;
        }
      } catch (e) {
        console.error('Error loading accessibility settings:', e);
      }
    },

    // הכרזה לקורא מסך
    announce(message) {
      const announcer = document.getElementById('srAnnouncer');
      if (announcer) {
        announcer.textContent = message;
        setTimeout(() => (announcer.textContent = ''), 1000);
      }
    }
  };

  // אתחול המערכת
  AccessibilityManager.init();

  // חשיפה גלובלית (אופציונלי)
  window.AccessibilityManager = AccessibilityManager;

})();
