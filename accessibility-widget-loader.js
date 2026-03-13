// Accessibility Widget Loader
// Injects the accessibility widget HTML into all pages to avoid duplication
(function() {
    const widgetHTML = `
    <!-- Skip Links - קישורי דילוג לנגישות מקלדת -->
    <div id="skipLinks" role="navigation" aria-label="קישורי דילוג">
        <a href="#main-content" class="skip-link">דלג לתוכן הראשי</a>
        <a href="javascript:void(0)" class="skip-link" onclick="document.querySelector('nav a, header a')?.focus()">דלג לתפריט ניווט</a>
        <a href="#footer" class="skip-link">דלג לתחתית העמוד</a>
    </div>

    <!-- כפתור פתיחת תפריט נגישות -->
    <button class="accessibility-trigger" id="accessibilityBtn" aria-label="פתח תפריט נגישות" title="נגישות - לחץ כאן">
        <i class="fa-solid fa-universal-access"></i>
    </button>

    <!-- פאנל נגישות -->
    <div class="accessibility-panel" id="accessibilityPanel">
        <div class="accessibility-header">
            <h2><i class="fa-solid fa-universal-access"></i> נגישות</h2>
            <button class="accessibility-close" id="accessibilityClose" aria-label="סגור תפריט נגישות">
                <i class="fa-solid fa-times"></i>
            </button>
        </div>

        <div class="accessibility-content">
            <!-- קורא מסך -->
            <div class="accessibility-section">
                <h3><i class="fa-solid fa-volume-high"></i> קורא מסך</h3>
                <button class="accessibility-btn" id="screenReaderBtn" title="קורא מסך - לחיקוק על טקסט כדי לשמוע אותו" aria-pressed="false">
                    <i class="fa-solid fa-headphones"></i>
                    הפעל קורא מסך
                </button>
                <div class="accessibility-buttons" style="margin-top: 10px">
                    <button class="accessibility-btn-small" id="readerSpeedDownBtn" title="האט קריאה">
                        <i class="fa-solid fa-backward"></i> איטי
                    </button>
                    <button class="accessibility-btn-small" id="readerSpeedUpBtn" title="האץ קריאה">
                        <i class="fa-solid fa-forward"></i> מהיר
                    </button>
                </div>
            </div>

            <!-- גודלי גופן -->
            <div class="accessibility-section">
                <h3><i class="fa-solid fa-text-height"></i> גודל טקסט</h3>
                <div class="accessibility-buttons">
                    <button class="accessibility-btn" id="increaseFontBtn" title="הגדל גופן" aria-pressed="false">
                        <i class="fa-solid fa-plus"></i>
                        הגדל טקסט
                    </button>
                    <button class="accessibility-btn" id="decreaseFontBtn" title="הקטן גופן" aria-pressed="false">
                        <i class="fa-solid fa-minus"></i>
                        הקטן טקסט
                    </button>
                </div>
            </div>

            <!-- מרווחים -->
            <div class="accessibility-section">
                <h3><i class="fa-solid fa-arrows-left-right"></i> מרווחים</h3>
                <div class="accessibility-buttons">
                    <button class="accessibility-btn" id="lineHeightBtn" title="הגדל מרווח בין שורות" aria-pressed="false">
                        <i class="fa-solid fa-align-justify"></i>
                        מרווח שורות
                    </button>
                    <button class="accessibility-btn" id="letterSpacingBtn" title="הגדל מרווח בין אותיות" aria-pressed="false">
                        <i class="fa-solid fa-text-width"></i>
                        מרווח אותיות
                    </button>
                </div>
            </div>

            <!-- גופנים -->
            <div class="accessibility-section">
                <h3><i class="fa-solid fa-font"></i> סוג גופן</h3>
                <div class="accessibility-buttons">
                    <button class="accessibility-btn" id="readableFontBtn" title="גופן קריא" aria-pressed="false">
                        <i class="fa-solid fa-font"></i>
                        גופן קריא
                    </button>
                    <button class="accessibility-btn" id="dyslexiaFontBtn" title="גופן לדיסלקציה" aria-pressed="false">
                        <i class="fa-solid fa-book-open-reader"></i>
                        גופן דיסלקציה
                    </button>
                </div>
            </div>

            <!-- ניגודיות וצבעים -->
            <div class="accessibility-section">
                <h3><i class="fa-solid fa-palette"></i> צבעים וניגודיות</h3>
                <div class="accessibility-buttons">
                    <button class="accessibility-btn" id="darkContrastBtn" title="מצב כהה" aria-pressed="false">
                        <i class="fa-solid fa-moon"></i>
                        מצב כהה
                    </button>
                    <button class="accessibility-btn" id="highContrastYellowBtn" title="ניגודיות גבוהה" aria-pressed="false">
                        <i class="fa-solid fa-eye"></i>
                        ניגודיות גבוהה
                    </button>
                </div>
                <button class="accessibility-btn" id="invertColorsBtn" title="הפוך צבעים" aria-pressed="false" style="margin-top: 8px">
                    <i class="fa-solid fa-circle-half-stroke"></i>
                    הפוך צבעים
                </button>
            </div>

            <!-- סמן עכבר -->
            <div class="accessibility-section">
                <h3><i class="fa-solid fa-computer-mouse"></i> סמן עכבר</h3>
                <div class="accessibility-buttons">
                    <button class="accessibility-btn" id="bigCursorBtn" title="סמן גדול" aria-pressed="false">
                        <i class="fa-solid fa-arrow-pointer"></i>
                        סמן גדול
                    </button>
                    <button class="accessibility-btn" id="cursorColorBtn" title="סמן צבעוני" aria-pressed="false">
                        <i class="fa-solid fa-droplet"></i>
                        סמן צבעוני
                    </button>
                </div>
            </div>

            <!-- כלי עזר לקריאה -->
            <div class="accessibility-section">
                <h3><i class="fa-solid fa-book-open"></i> כלי עזר לקריאה</h3>
                <button class="accessibility-btn" id="readingGuideBtn" title="סרגל קריאה - עוקב אחרי העכבר" aria-pressed="false">
                    <i class="fa-solid fa-grip-lines"></i>
                    סרגל קריאה
                </button>
            </div>

            <!-- הדגשות -->
            <div class="accessibility-section">
                <h3><i class="fa-solid fa-highlighter"></i> הדגשות</h3>
                <button class="accessibility-btn" id="highlightLinksBtn" title="הדגש קישורים" aria-pressed="false">
                    <i class="fa-solid fa-link"></i>
                    הדגש קישורים
                </button>
            </div>

            <!-- כיוון טקסט -->
            <div class="accessibility-section">
                <h3><i class="fa-solid fa-compass"></i> ניווט וכיוון</h3>
                <button class="accessibility-btn" id="textDirectionBtn" title="שנה כיוון טקסט" aria-pressed="false">
                    <i class="fa-solid fa-exchange-alt"></i>
                    הפוך כיוון (LTR/RTL)
                </button>
            </div>

            <!-- אנימציות -->
            <div class="accessibility-section">
                <h3><i class="fa-solid fa-film"></i> אנימציות</h3>
                <button class="accessibility-btn" id="stopAnimationsBtn" title="הפסק אנימציות" aria-pressed="false">
                    <i class="fa-solid fa-ban"></i>
                    עצור אנימציות
                </button>
            </div>

            <!-- הסתרת מדיה -->
            <div class="accessibility-section">
                <h3><i class="fa-solid fa-image"></i> תמונות ומדיה</h3>
                <button class="accessibility-btn" id="hideMediaBtn" title="הסתר תמונות ומדיה" aria-pressed="false">
                    <i class="fa-solid fa-eye-slash"></i>
                    הסתר תמונות
                </button>
            </div>

            <!-- ניווט מקלדת -->
            <div class="accessibility-section">
                <h3><i class="fa-solid fa-keyboard"></i> ניווט מקלדת</h3>
                <button class="accessibility-btn" id="keyboardNavBtn" title="הפעל ניווט מקלדת מלא" aria-pressed="false">
                    <i class="fa-solid fa-keyboard"></i>
                    ניווט מקלדת מלא
                </button>
            </div>

            <!-- הצהרת נגישות -->
            <div class="accessibility-section">
                <h3><i class="fa-solid fa-file-lines"></i> הצהרת נגישות</h3>
                <a href="accessibility-statement.html" class="accessibility-statement-btn" target="_blank">
                    <i class="fa-solid fa-file-lines"></i>
                    הצהרת נגישות
                </a>
            </div>

            <!-- איפוס -->
            <div class="accessibility-section">
                <button class="accessibility-reset-btn" id="resetAccessibilityBtn" title="אפס העדפות">
                    <i class="fa-solid fa-undo"></i>
                    אפס הכל
                </button>
            </div>
        </div>
    </div>

    <!-- Reading Guide -->
    <div id="readingGuide" style="display: none"></div>

    <!-- עזר לקורא מסך -->
    <div class="sr-only" role="status" aria-live="polite" aria-atomic="true" id="srAnnouncer"></div>
    `;

    // Inject the widget HTML into the body
    const container = document.createElement('div');
    container.innerHTML = widgetHTML;
    while (container.firstChild) {
        document.body.appendChild(container.firstChild);
    }

    // Load the accessibility widget CSS
    const cssLink = document.createElement('link');
    cssLink.rel = 'stylesheet';
    cssLink.href = 'accessibility-widget.css';
    document.head.appendChild(cssLink);

    // Load the accessibility widget JS
    const script = document.createElement('script');
    script.src = 'accessibility-widget.js';
    document.body.appendChild(script);
})();
