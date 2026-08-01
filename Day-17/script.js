/* ========================================== */
/* DAY 17: THEME TOGGLE & STATE PERSISTENCE   */
/* ========================================== */

console.log("🚀 TechNova Engine Initialized - Day 17: Dark Mode");

// ============================================================ */
// 1. CHECK PREFERENCES ON LOAD
// ============================================================ */

const STORAGE_THEME_KEY = 'synexus_theme';
const themeToggleBtn = document.getElementById('theme-toggle');

// Check localStorage for saved theme preference
const currentTheme = localStorage.getItem(STORAGE_THEME_KEY);
console.log("📂 Saved theme:", currentTheme);

// If they explicitly saved 'dark' before, apply the class immediately
if (currentTheme === 'dark') {
    document.body.classList.add('dark-theme');
    if (themeToggleBtn) {
        themeToggleBtn.textContent = '☀️'; // Sun icon for dark mode
        themeToggleBtn.setAttribute('aria-label', 'Switch to light mode');
    }
    console.log("🌙 Dark mode applied from storage");
} else if (currentTheme === 'light') {
    document.body.classList.remove('dark-theme');
    if (themeToggleBtn) {
        themeToggleBtn.textContent = '🌙'; // Moon icon for light mode
        themeToggleBtn.setAttribute('aria-label', 'Switch to dark mode');
    }
    console.log("☀️ Light mode applied from storage");
} else {
    // ============================================================ */
    // 2. BONUS: Check System Preference (prefers-color-scheme)
    // ============================================================ */
    
    // If no saved preference, check user's system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    
    if (prefersDark.matches) {
        document.body.classList.add('dark-theme');
        if (themeToggleBtn) {
            themeToggleBtn.textContent = '☀️';
            themeToggleBtn.setAttribute('aria-label', 'Switch to light mode');
        }
        // Save the system preference
        localStorage.setItem(STORAGE_THEME_KEY, 'dark');
        console.log("🌙 Dark mode applied from system preference");
    } else {
        console.log("☀️ No saved theme, using default light mode");
    }
}

// ============================================================ */
// 3. THE TOGGLE LOGIC
// ============================================================ */

if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', function() {
        console.log("🔄 Theme toggle clicked!");
        
        // Step A: Toggle the 'dark-theme' class on the document body
        document.body.classList.toggle('dark-theme');
        
        // Step B: Determine what theme is currently active
        let theme = 'light';
        let icon = '🌙';
        let label = 'Switch to dark mode';
        
        if (document.body.classList.contains('dark-theme')) {
            theme = 'dark';
            icon = '☀️';
            label = 'Switch to light mode';
            console.log("🌙 Switched to dark mode");
        } else {
            console.log("☀️ Switched to light mode");
        }
        
        // Step C: Save that preference to LocalStorage
        localStorage.setItem(STORAGE_THEME_KEY, theme);
        console.log("💾 Theme saved to storage:", theme);
        
        // Update button icon and aria-label
        themeToggleBtn.textContent = icon;
        themeToggleBtn.setAttribute('aria-label', label);
    });
    
    console.log("✅ Theme toggle initialized!");
}

// ============================================================ */
// 4. EXISTING CODE - FORM VALIDATION & LOCALSTORAGE
// ============================================================ */

const STORAGE_KEY = 'synexus_form_draft';
const appForm = document.querySelector('.membership-form');
const nameInput = document.getElementById('fullName');
const emailInput = document.getElementById('emailAddress');
const motivationInput = document.getElementById('motivation');
const nameError = document.getElementById('nameError');
const emailError = document.getElementById('emailError');
const draftIndicator = document.getElementById('draft-indicator');

// Restore form draft if exists
const savedDraft = localStorage.getItem(STORAGE_KEY);
if (savedDraft) {
    try {
        const parsedData = JSON.parse(savedDraft);
        if (nameInput && parsedData.name !== undefined) {
            nameInput.value = parsedData.name;
        }
        if (emailInput && parsedData.email !== undefined) {
            emailInput.value = parsedData.email;
        }
        console.log("📂 Form draft restored:", parsedData);
    } catch (error) {
        console.error("❌ Error parsing saved draft:", error);
        localStorage.removeItem(STORAGE_KEY);
    }
}

// Save form data in real-time
let saveTimeout;

function saveProgress() {
    if (!nameInput || !emailInput) return;
    const draftData = { name: nameInput.value, email: emailInput.value };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draftData));
    if (draftIndicator) {
        clearTimeout(saveTimeout);
        draftIndicator.textContent = '💾 Draft saved automatically';
        draftIndicator.classList.add('show');
        saveTimeout = setTimeout(() => {
            draftIndicator.classList.remove('show');
        }, 2000);
    }
}

if (nameInput && emailInput) {
    nameInput.addEventListener('input', saveProgress);
    emailInput.addEventListener('input', saveProgress);
}

// Form validation & submit
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
    const allInputs = document.querySelectorAll('.form-group input, .form-group textarea');
    allInputs.forEach(input => {
        input.classList.remove('error', 'success');
    });
    const allErrors = document.querySelectorAll('.error-message');
    allErrors.forEach(error => {
        error.classList.remove('show');
        error.textContent = '';
    });
    const successMsg = document.querySelector('.success-message');
    if (successMsg) {
        successMsg.classList.remove('show');
    }
}

if (appForm) {
    appForm.addEventListener('submit', function(e) {
        e.preventDefault();
        clearValidation();
        
        const nameValue = nameInput.value.trim();
        const emailValue = emailInput.value.trim();
        const motivationValue = motivationInput.value.trim();
        
        let isValid = true;
        
        if (nameValue === "") {
            showError(nameInput, nameError, "Full name is required.");
            isValid = false;
        } else if (nameValue.length < 2) {
            showError(nameInput, nameError, "Name must be at least 2 characters.");
            isValid = false;
        } else {
            showSuccess(nameInput, nameError);
        }
        
        if (emailValue === "") {
            showError(emailInput, emailError, "Email address is required.");
            isValid = false;
        } else if (!emailValue.includes('@')) {
            showError(emailInput, emailError, "Please enter a valid email address (must contain '@').");
            isValid = false;
        } else if (!emailValue.includes('.')) {
            showError(emailInput, emailError, "Please enter a valid email address (must contain '.').");
            isValid = false;
        } else {
            showSuccess(emailInput, emailError);
        }
        
        if (isValid) {
            console.log("✅ SUCCESS! Application submitted!");
            localStorage.removeItem(STORAGE_KEY);
            if (draftIndicator) {
                draftIndicator.classList.remove('show');
            }
            
            const successMsg = document.createElement('div');
            successMsg.className = 'success-message show';
            successMsg.textContent = `✅ Thank you ${nameValue}! Your application has been submitted successfully!`;
            
            const existingSuccess = document.querySelector('.success-message');
            if (existingSuccess) {
                existingSuccess.remove();
            }
            
            const submitButton = document.querySelector('.btn-submit');
            submitButton.parentNode.insertBefore(successMsg, submitButton.nextSibling);
            
            appForm.reset();
            
            setTimeout(() => {
                clearValidation();
                setTimeout(() => {
                    const msg = document.querySelector('.success-message');
                    if (msg) {
                        msg.classList.remove('show');
                        setTimeout(() => {
                            msg.remove();
                        }, 300);
                    }
                }, 5000);
            }, 100);
        } else {
            const firstError = document.querySelector('.form-group .error');
            if (firstError) {
                firstError.focus();
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });
}

// ============================================================ */
// 5. DYNAMIC RENDERING - INITIATIVES
// ============================================================ */

const projectsData = [
    { id: 1, title: "Project StoreLane", description: "A phygital hyperlocal commerce platform designed to digitize small local vendors and connect them with digital consumers.", status: "Active", icon: "🛒" },
    { id: 2, title: "QR Attendance Tracker", description: "Automated student attendance system utilizing progressive web app (PWA) tech and real-time QR code scanning.", status: "Active", icon: "📱" },
    { id: 3, title: "Logistics Management System", description: "Desktop architecture built for tracking shipments and driver status in real-time with live location updates.", status: "Completed", icon: "🚚" },
    { id: 4, title: "Community Dashboard", description: "Real-time analytics dashboard tracking community growth, engagement metrics, and project contributions.", status: "Active", icon: "📊" },
    { id: 5, title: "AI Prompt Workspace", description: "Productivity tool for saving, categorizing, and testing AI prompts with offline-first architecture.", status: "Planning", icon: "🤖" },
    { id: 6, title: "Healthcare Patient Monitor", description: "Zero-fail dashboard for patient monitoring with offline capabilities and real-time data syncing.", status: "Planning", icon: "🏥" },
    { id: 7, title: "Blockchain Identity System", description: "Decentralized identity verification system using blockchain technology for secure authentication.", status: "Planning", icon: "🔗" },
    { id: 8, title: "Smart Classroom Platform", description: "Interactive learning platform with real-time collaboration, whiteboard tools, and student engagement features.", status: "Active", icon: "📚" }
];

const gridContainer = document.getElementById('dynamic-grid');
const searchInput = document.getElementById('search-projects');
const resultsCount = document.getElementById('results-count');

function renderProjects(dataArray) {
    if (!gridContainer) return;
    gridContainer.innerHTML = '';
    if (dataArray.length === 0) {
        gridContainer.innerHTML = `
            <div class="no-results">
                <span class="emoji">🔍</span>
                <p>No initiatives match your search.</p>
                <p style="font-size: 0.9rem; color: var(--text-muted);">Try adjusting your search terms</p>
            </div>
        `;
        if (resultsCount) {
            resultsCount.textContent = `0 results found`;
            resultsCount.style.color = 'var(--error-color)';
        }
        return;
    }
    dataArray.forEach(function(project) {
        let statusClass = '', statusBadgeClass = '';
        if (project.status === "Active") {
            statusClass = 'status-active';
            statusBadgeClass = 'active';
        } else if (project.status === "Completed") {
            statusClass = 'status-completed';
            statusBadgeClass = 'completed';
        } else if (project.status === "Planning") {
            statusClass = 'status-planning';
            statusBadgeClass = 'planning';
        }
        const cardHTML = `
            <div class="initiative-card ${statusClass}">
                <h3>${project.icon || '📌'} ${project.title}</h3>
                <p>${project.description}</p>
                <span class="badge ${statusBadgeClass}">${project.status}</span>
            </div>
        `;
        gridContainer.innerHTML += cardHTML;
    });
    if (resultsCount) {
        resultsCount.textContent = `${dataArray.length} results found`;
        resultsCount.style.color = 'var(--success-color)';
    }
}

renderProjects(projectsData);

if (searchInput) {
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        if (searchTerm === '') {
            renderProjects(projectsData);
            return;
        }
        const filteredProjects = projectsData.filter(function(project) {
            return project.title.toLowerCase().includes(searchTerm) ||
                   project.description.toLowerCase().includes(searchTerm) ||
                   project.status.toLowerCase().includes(searchTerm);
        });
        renderProjects(filteredProjects);
    });
}

// ============================================================ */
// 6. MOBILE MENU TOGGLE
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
// 7. HERO BUTTON INTERACTION
// ============================================================ */

const heroButton = document.getElementById('heroButton');
const heroHeadline = document.querySelector('.hero-section h1');

if (heroButton && heroHeadline) {
    heroButton.addEventListener('click', function() {
        const originalText = "Empowering the Next Generation of Engineers";
        const newText = "Welcome to the TechNova Core! 🎉";
        if (heroHeadline.textContent === originalText) {
            heroHeadline.textContent = newText;
        } else {
            heroHeadline.textContent = originalText;
        }
        heroHeadline.classList.toggle('active-state');
    });
}

console.log("ℹ️ Day 17 - Dark Mode is ready!");
console.log("🌙 Click the theme toggle button to switch between light and dark mode!");
console.log("💾 Your theme preference will be saved automatically!");