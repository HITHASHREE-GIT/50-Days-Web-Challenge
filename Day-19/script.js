/* ========================================== */
/* DAY 19: EVENT DELEGATION & MODALS          */
/* ========================================== */

console.log("🚀 TechNova Engine Initialized - Day 19: Event Delegation");

// ============================================================ */
// 1. SELECT TARGETS
// ============================================================ */

const gridContainer = document.getElementById('dynamic-grid');
const projectModal = document.getElementById('project-modal');
const modalTitle = document.getElementById('modal-title');
const modalDescription = document.getElementById('modal-description');
const modalStatus = document.getElementById('modal-status');
const closeModalBtn = document.getElementById('close-modal');
const modalOverlay = document.querySelector('.modal-overlay');

console.log("📦 Elements selected:", { gridContainer, projectModal, modalTitle });

// ============================================================ */
// 2. EVENT DELEGATION (The Core Logic)
// ============================================================ */

if (gridContainer) {
    // We attach ONE listener to the parent container
    gridContainer.addEventListener('click', function(e) {
        
        // Use .closest() to find out if a .view-btn was clicked (or clicked inside of)
        const clickedButton = e.target.closest('.view-btn');
        
        // If the click wasn't on a button, ignore it and stop the function
        if (!clickedButton) {
            console.log("👆 Clicked on:", e.target.tagName, "- Not a view button");
            return;
        }
        
        // Step A: Extract the data from the button's data-title attribute
        const projectTitle = clickedButton.getAttribute('data-title');
        const projectDescription = clickedButton.getAttribute('data-description') || "More details about this initiative will be available soon.";
        const projectStatus = clickedButton.getAttribute('data-status') || "Active";
        
        console.log(`🔍 View Details clicked for: ${projectTitle}`);
        
        // Step B: Inject that data into the modal
        modalTitle.textContent = projectTitle;
        modalDescription.textContent = projectDescription;
        modalStatus.textContent = projectStatus;
        modalStatus.className = 'badge';
        modalStatus.classList.add(projectStatus.toLowerCase());
        
        // Step C: Show the modal
        projectModal.style.display = 'flex';
        projectModal.classList.add('show');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    });
    
    console.log("✅ Event delegation attached to grid container!");
}

// ============================================================ */
// 3. CLOSING THE MODAL - Multiple Ways
// ============================================================ */

function closeModal() {
    projectModal.style.display = 'none';
    projectModal.classList.remove('show');
    document.body.style.overflow = '';
    console.log("❌ Modal closed");
}

// A. Close button
if (closeModalBtn) {
    closeModalBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        closeModal();
    });
}

// B. Click on overlay (outside the modal content)
if (modalOverlay) {
    modalOverlay.addEventListener('click', function(e) {
        // Only close if the click is on the overlay itself, not the modal content
        if (e.target === modalOverlay) {
            closeModal();
        }
    });
}

// C. Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && projectModal.style.display === 'flex') {
        closeModal();
        console.log("⌨️ Modal closed with Escape key");
    }
});

// ============================================================ */
// 4. TESTIMONIALS CAROUSEL (From Day 18)
// ============================================================ */

const testimonialsData = [
    { name: "Sarah Johnson", quote: "TechNova changed how I approach engineering. It's about logic, not just languages. The focus on standards over frameworks transformed my entire career." },
    { name: "Michael Chen", quote: "Building real-world architecture in this community has been a game changer. I finally understand how the web actually works under the hood." },
    { name: "Priya Patel", quote: "The focus on standard protocols over fleeting trends is exactly what the industry needs. This is where I learned to be a real engineer." },
    { name: "David Kim", quote: "The 50-day challenge pushed me beyond my limits. Now I can build enterprise-grade applications from scratch without any frameworks." },
    { name: "Harshit Singh", quote: "Synexus changed how I approach engineering. It's about logic, not just languages. The community support is incredible." }
];

const testimonialName = document.getElementById('testimonial-name');
const testimonialQuote = document.getElementById('testimonial-quote');
const carouselDots = document.getElementById('carousel-dots');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const timerBar = document.getElementById('timer-bar');

let currentIndex = 0;
let carouselTimer = null;
let isAutoPlaying = true;

function createDots() {
    if (!carouselDots) return;
    carouselDots.innerHTML = '';
    testimonialsData.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.className = `dot ${index === 0 ? 'active' : ''}`;
        dot.setAttribute('aria-label', `Go to testimonial ${index + 1}`);
        dot.dataset.index = index;
        dot.addEventListener('click', function() {
            goToTestimonial(parseInt(this.dataset.index));
        });
        carouselDots.appendChild(dot);
    });
}

function updateDots() {
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
    });
}

function updateTestimonial() {
    if (!testimonialName || !testimonialQuote) return;
    const currentData = testimonialsData[currentIndex];
    testimonialName.textContent = currentData.name;
    testimonialQuote.textContent = currentData.quote;
    updateDots();
    if (timerBar && isAutoPlaying) {
        timerBar.style.transition = 'none';
        timerBar.style.width = '100%';
        void timerBar.offsetWidth;
        timerBar.style.transition = 'width 3s linear';
        timerBar.style.width = '0%';
    }
    currentIndex++;
    if (currentIndex >= testimonialsData.length) {
        currentIndex = 0;
    }
}

function goToTestimonial(index) {
    if (isAutoPlaying) {
        clearInterval(carouselTimer);
        isAutoPlaying = false;
    }
    currentIndex = index;
    updateTestimonial();
    setTimeout(() => {
        if (!isAutoPlaying) {
            startAutoPlay();
        }
    }, 5000);
}

function startAutoPlay() {
    if (carouselTimer) clearInterval(carouselTimer);
    isAutoPlaying = true;
    carouselTimer = setInterval(updateTestimonial, 3000);
    if (timerBar) {
        timerBar.style.transition = 'none';
        timerBar.style.width = '100%';
        void timerBar.offsetWidth;
        timerBar.style.transition = 'width 3s linear';
        timerBar.style.width = '0%';
    }
}

function stopAutoPlay() {
    if (carouselTimer) {
        clearInterval(carouselTimer);
        carouselTimer = null;
        isAutoPlaying = false;
    }
}

createDots();
updateTestimonial();
startAutoPlay();

if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', function() {
        stopAutoPlay();
        currentIndex--;
        if (currentIndex < 0) currentIndex = testimonialsData.length - 1;
        updateTestimonial();
        setTimeout(() => { if (!isAutoPlaying) startAutoPlay(); }, 5000);
    });
    nextBtn.addEventListener('click', function() {
        stopAutoPlay();
        currentIndex++;
        if (currentIndex >= testimonialsData.length) currentIndex = 0;
        updateTestimonial();
        setTimeout(() => { if (!isAutoPlaying) startAutoPlay(); }, 5000);
    });
}

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
// 6. DYNAMIC RENDERING - INITIATIVES (with View Details button)
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
        if (project.status === "Active") { statusClass = 'status-active'; statusBadgeClass = 'active'; }
        else if (project.status === "Completed") { statusClass = 'status-completed'; statusBadgeClass = 'completed'; }
        else if (project.status === "Planning") { statusClass = 'status-planning'; statusBadgeClass = 'planning'; }
        
        const cardHTML = `
            <div class="initiative-card ${statusClass}">
                <h3>${project.icon || '📌'} ${project.title}</h3>
                <p>${project.description}</p>
                <span class="badge ${statusBadgeClass}">${project.status}</span>
                <button class="view-btn" 
                    data-title="${project.title}" 
                    data-description="${project.description}" 
                    data-status="${project.status}">
                    View Details
                </button>
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
// 7. FORM VALIDATION & LOCALSTORAGE (From Day 16)
// ============================================================ */

const STORAGE_KEY = 'synexus_form_draft';
const appForm = document.querySelector('.membership-form');
const nameInput = document.getElementById('fullName');
const emailInput = document.getElementById('emailAddress');
const motivationInput = document.getElementById('motivation');
const nameError = document.getElementById('nameError');
const emailError = document.getElementById('emailError');
const draftIndicator = document.getElementById('draft-indicator');

const savedDraft = localStorage.getItem(STORAGE_KEY);
if (savedDraft) {
    try {
        const parsedData = JSON.parse(savedDraft);
        if (nameInput && parsedData.name !== undefined) nameInput.value = parsedData.name;
        if (emailInput && parsedData.email !== undefined) emailInput.value = parsedData.email;
    } catch (error) {
        localStorage.removeItem(STORAGE_KEY);
    }
}

let saveTimeout;
function saveProgress() {
    if (!nameInput || !emailInput) return;
    const draftData = { name: nameInput.value, email: emailInput.value };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draftData));
    if (draftIndicator) {
        clearTimeout(saveTimeout);
        draftIndicator.textContent = '💾 Draft saved automatically';
        draftIndicator.classList.add('show');
        saveTimeout = setTimeout(() => { draftIndicator.classList.remove('show'); }, 2000);
    }
}

if (nameInput && emailInput) {
    nameInput.addEventListener('input', saveProgress);
    emailInput.addEventListener('input', saveProgress);
}

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

if (appForm) {
    appForm.addEventListener('submit', function(e) {
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
        else if (!emailValue.includes('@')) { showError(emailInput, emailError, "Please enter a valid email address (must contain '@')."); isValid = false; }
        else if (!emailValue.includes('.')) { showError(emailInput, emailError, "Please enter a valid email address (must contain '.')."); isValid = false; }
        else { showSuccess(emailInput, emailError); }
        
        if (isValid) {
            console.log("✅ SUCCESS! Application submitted!");
            localStorage.removeItem(STORAGE_KEY);
            if (draftIndicator) draftIndicator.classList.remove('show');
            const successMsg = document.createElement('div');
            successMsg.className = 'success-message show';
            successMsg.textContent = `✅ Thank you ${nameValue}! Your application has been submitted successfully!`;
            const existingSuccess = document.querySelector('.success-message');
            if (existingSuccess) existingSuccess.remove();
            const submitButton = document.querySelector('.btn-submit');
            submitButton.parentNode.insertBefore(successMsg, submitButton.nextSibling);
            appForm.reset();
            setTimeout(() => {
                clearValidation();
                setTimeout(() => {
                    const msg = document.querySelector('.success-message');
                    if (msg) { msg.classList.remove('show'); setTimeout(() => msg.remove(), 300); }
                }, 5000);
            }, 100);
        } else {
            const firstError = document.querySelector('.form-group .error');
            if (firstError) { firstError.focus(); firstError.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
        }
    });
}

// ============================================================ */
// 8. MOBILE MENU TOGGLE
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
// 9. HERO BUTTON INTERACTION
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

console.log("ℹ️ Day 19 - Event Delegation is ready!");
console.log("💡 Click 'View Details' on any initiative card to open the modal!");
console.log("🔍 Only ONE event listener is attached to the entire grid!");