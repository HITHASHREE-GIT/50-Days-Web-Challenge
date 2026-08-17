/* ========================================== */
/* DAY 31: PAGINATION & INFINITE SCROLL       */
/* ========================================== */

console.log("🚀 TechNova Engine Initialized - Day 31: Infinite Scroll");

// ============================================================ */
// 1. DOM SELECTION
// ============================================================ */

const feedContainer = document.getElementById('data-feed');
const sentinel = document.getElementById('scroll-sentinel');

console.log("📦 Elements selected:", { feedContainer, sentinel });

// ============================================================ */
// 2. STATE TRACKING
// ============================================================ */

let currentPage = 1;
const limit = 10;
let isLoading = false; // THE LOCK: Prevents multiple fetches at the exact same time
let hasMoreData = true; // Tracks if we have reached the end of the database
let totalLoaded = 0;

// ============================================================ */
// 3. THE PAGINATED FETCH FUNCTION
// ============================================================ */

async function fetchNextPage() {
    // Step A: The Gatekeeper checks
    if (isLoading || !hasMoreData) {
        console.log(`⛔ Skipping: isLoading=${isLoading}, hasMoreData=${hasMoreData}`);
        return;
    }
    
    // Lock the function so it can't be called again until this finishes
    isLoading = true;
    console.log(`📥 Fetching page ${currentPage}...`);

    try {
        // Notice the query parameters! ?_page=1&_limit=10
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts?_page=${currentPage}&_limit=${limit}`);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch data. Status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(`📊 Received ${data.length} posts from page ${currentPage}`);

        // Step B: End of Data Check
        if (data.length === 0) {
            hasMoreData = false;
            sentinel.innerHTML = `
                <div class="sentinel-content end">
                    <span>🏁 You've reached the end of the feed.</span>
                </div>
            `;
            sentinel.classList.add('end');
            console.log("🏁 End of data reached");
            return;
        }

        // Step C: Render the chunk
        data.forEach((item, index) => {
            const cardHTML = `
                <div class="feed-card" style="animation-delay: ${index * 0.05}s">
                    <h4>#${item.id}. ${item.title}</h4>
                    <p>${item.body}</p>
                </div>
            `;
            // CRITICAL: Use += to ADD to the container, do not overwrite it!
            feedContainer.innerHTML += cardHTML;
        });

        totalLoaded += data.length;
        console.log(`✅ Loaded ${totalLoaded} posts total`);

        // Increment the page for next time
        currentPage++;

    } catch (error) {
        console.error("❌ Pagination Error:", error);
        sentinel.innerHTML = `
            <div class="sentinel-content error">
                <span>⚠️ Error loading more items. Please try again.</span>
            </div>
        `;
        sentinel.classList.add('error');
    } finally {
        // Step D: Unlock the function so the observer can trigger it again later
        isLoading = false;
        console.log("🔓 Unlocked");
    }
}

// ============================================================ */
// 4. THE INTERSECTION OBSERVER
// ============================================================ */

const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        // If the sentinel crosses into the screen...
        if (entry.isIntersecting && hasMoreData) {
            console.log("👁️ Sentinel visible - fetching next page...");
            fetchNextPage();
        }
    });
}, { 
    rootMargin: "200px", // rootMargin tells it to trigger 200px BEFORE it enters the screen for a smoother experience!
    threshold: 0.1
});

console.log("👁️ Intersection Observer created with 200px rootMargin");

// ============================================================ */
// 5. THEME TOGGLE (From Day 17)
// ============================================================ */

const STORAGE_THEME_KEY = 'synexus_theme';
const themeToggleBtn = document.getElementById('theme-toggle');

const currentTheme = localStorage.getItem(STORAGE_THEME_KEY);
if (currentTheme === 'dark') {
    document.body.classList.add('dark-theme');
    if (themeToggleBtn) themeToggleBtn.textContent = '☀️';
} else if (currentTheme === 'light') {
    document.body.classList.remove('dark-theme');
    if (themeToggleBtn) themeToggleBtn.textContent = '🌙';
} else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    if (prefersDark.matches) {
        document.body.classList.add('dark-theme');
        if (themeToggleBtn) themeToggleBtn.textContent = '☀️';
        localStorage.setItem(STORAGE_THEME_KEY, 'dark');
    }
}

if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', function() {
        document.body.classList.toggle('dark-theme');
        const theme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
        localStorage.setItem(STORAGE_THEME_KEY, theme);
        themeToggleBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
    });
}

// ============================================================ */
// 6. MOBILE MENU TOGGLE (From Day 12)
// ============================================================ */

const menuToggle = document.querySelector('.menu-toggle');
const navLinksContainer = document.querySelector('nav ul');

if (menuToggle && navLinksContainer) {
    menuToggle.addEventListener('click', function() {
        navLinksContainer.classList.toggle('nav-active');
        menuToggle.classList.toggle('active');
        const isExpanded = navLinksContainer.classList.contains('nav-active');
        menuToggle.setAttribute('aria-expanded', isExpanded);
    });
}

// ============================================================ */
// 7. HERO BUTTON (From Day 11)
// ============================================================ */

const heroButton = document.getElementById('heroButton');
const heroHeadline = document.querySelector('.hero-section h1');

if (heroButton && heroHeadline) {
    heroButton.addEventListener('click', function() {
        const original = "Empowering the Next Generation of Engineers";
        const newText = "Welcome to the TechNova Core! 🎉";
        if (heroHeadline.textContent === original) {
            heroHeadline.textContent = newText;
        } else {
            heroHeadline.textContent = original;
        }
        heroHeadline.classList.toggle('active-state');
    });
}

// ============================================================ */
// 8. FORM VALIDATION (From Day 13)
// ============================================================ */

const membershipForm = document.getElementById('membershipForm');
const nameInput = document.getElementById('fullName');
const emailInput = document.getElementById('emailAddress');
const motivationInput = document.getElementById('motivation');
const nameError = document.getElementById('nameError');
const emailError = document.getElementById('emailError');
const draftIndicator = document.getElementById('draft-indicator');

function showError(input, errorElement, message) {
    input.classList.add('error');
    input.classList.remove('success');
    errorElement.textContent = message;
    errorElement.classList.add('show');
}

function showSuccess(input, errorElement) {
    input.classList.remove('error');
    input.classList.add('success');
    errorElement.classList.remove('show');
}

function clearValidation() {
    document.querySelectorAll('.form-group input, .form-group textarea').forEach(input => {
        input.classList.remove('error', 'success');
    });
    document.querySelectorAll('.error-message').forEach(error => {
        error.classList.remove('show');
        error.textContent = '';
    });
    const successMsg = document.querySelector('.success-message');
    if (successMsg) successMsg.classList.remove('show');
}

if (membershipForm) {
    membershipForm.addEventListener('submit', function(e) {
        e.preventDefault();
        clearValidation();
        const nameValue = nameInput.value.trim();
        const emailValue = emailInput.value.trim();
        const motivationValue = motivationInput.value.trim();
        
        let isValid = true;
        if (nameValue === "") { showError(nameInput, nameError, "Full name is required."); isValid = false; }
        else if (nameValue.length < 2) { showError(nameInput, nameError, "Name must be at least 2 characters."); isValid = false; }
        else { showSuccess(nameInput, nameError); }
        
        if (emailValue === "") { showError(emailInput, emailError, "Email address is required."); isValid = false; }
        else if (!emailValue.includes('@')) { showError(emailInput, emailError, "Please enter a valid email address."); isValid = false; }
        else { showSuccess(emailInput, emailError); }
        
        if (isValid) {
            console.log("✅ SUCCESS! Application submitted!");
            const successMsg = document.createElement('div');
            successMsg.className = 'success-message show';
            successMsg.textContent = `✅ Thank you ${nameValue}! Your application has been submitted successfully!`;
            const existingSuccess = document.querySelector('.success-message');
            if (existingSuccess) existingSuccess.remove();
            const submitButton = document.querySelector('.btn-submit');
            submitButton.parentNode.insertBefore(successMsg, submitButton.nextSibling);
            membershipForm.reset();
            setTimeout(() => {
                clearValidation();
                setTimeout(() => {
                    const msg = document.querySelector('.success-message');
                    if (msg) { msg.classList.remove('show'); setTimeout(() => msg.remove(), 300); }
                }, 5000);
            }, 100);
        }
    });
}

// ============================================================ */
// 9. INITIALIZE
// ============================================================ */

if (feedContainer && sentinel) {
    // Load page 1 immediately
    console.log("📄 Loading initial page...");
    fetchNextPage();
    
    // Tell the observer to start watching the sentinel at the bottom
    scrollObserver.observe(sentinel);
    console.log("👁️ Observer watching sentinel");
}

console.log("✅ Day 31 fully loaded!");
console.log("📜 Scroll down to load more posts automatically!");
console.log("💡 The feed will load 10 posts at a time using pagination.");