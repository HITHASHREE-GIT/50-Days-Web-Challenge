/* ========================================== */
/* DAY 16: LOCAL STORAGE PERSISTENCE          */
/* ========================================== */

console.log("🚀 TechNova Engine Initialized - Day 16: LocalStorage Persistence");

// ============================================================ */
// 1. SELECT ELEMENTS
// ============================================================ */

const appForm = document.querySelector('.membership-form');
const nameInput = document.getElementById('fullName');
const emailInput = document.getElementById('emailAddress');
const motivationInput = document.getElementById('motivation');
const nameError = document.getElementById('nameError');
const emailError = document.getElementById('emailError');
const draftIndicator = document.getElementById('draft-indicator');

console.log("📝 Name input:", nameInput);
console.log("📧 Email input:", emailInput);
console.log("💾 Draft indicator:", draftIndicator);

// ============================================================ */
// 2. STATE RECOVERY ON PAGE LOAD
// This executes immediately when the file loads
// ============================================================ */

const STORAGE_KEY = 'synexus_form_draft';

const savedDraft = localStorage.getItem(STORAGE_KEY);

if (savedDraft) {
    try {
        // Turn the text back into an object using JSON.parse()
        const parsedData = JSON.parse(savedDraft);
        console.log("📂 Saved draft found:", parsedData);
        
        // Restore the values to the form inputs
        if (nameInput && parsedData.name !== undefined) {
            nameInput.value = parsedData.name;
            console.log("✅ Name restored:", parsedData.name);
        }
        
        if (emailInput && parsedData.email !== undefined) {
            emailInput.value = parsedData.email;
            console.log("✅ Email restored:", parsedData.email);
        }
        
        // Show draft indicator briefly
        if (draftIndicator) {
            draftIndicator.textContent = '💾 Draft restored from storage';
            draftIndicator.classList.add('show');
            setTimeout(() => {
                draftIndicator.classList.remove('show');
            }, 2000);
        }
        
    } catch (error) {
        console.error("❌ Error parsing saved draft:", error);
        // If there's an error, clear the corrupted data
        localStorage.removeItem(STORAGE_KEY);
    }
} else {
    console.log("ℹ️ No saved draft found");
}

// ============================================================ */
// 3. SAVING DATA IN REAL-TIME
// ============================================================ */

let saveTimeout;

function saveProgress() {
    if (!nameInput || !emailInput) return;
    
    // Construct the data payload object
    const draftData = {
        name: nameInput.value,
        email: emailInput.value
    };
    
    // Serialize the object to a string using JSON.stringify()
    const stringData = JSON.stringify(draftData);
    console.log("💾 Saving draft:", draftData);
    
    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, stringData);
    
    // Show draft indicator (Bonus Challenge)
    if (draftIndicator) {
        clearTimeout(saveTimeout);
        draftIndicator.textContent = '💾 Draft saved automatically';
        draftIndicator.classList.add('show');
        
        saveTimeout = setTimeout(() => {
            draftIndicator.classList.remove('show');
        }, 2000);
    }
}

// Bind the real-time saver to input events
if (nameInput && emailInput) {
    nameInput.addEventListener('input', saveProgress);
    emailInput.addEventListener('input', saveProgress);
    console.log("✅ Input listeners attached!");
}

// ============================================================ */
// 4. FORM VALIDATION & SUBMISSION
// ============================================================ */

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
        console.log("🛑 Form submission intercepted!");
        
        clearValidation();
        
        const nameValue = nameInput.value.trim();
        const emailValue = emailInput.value.trim();
        const motivationValue = motivationInput.value.trim();
        
        console.log("📝 Name:", nameValue);
        console.log("📧 Email:", emailValue);
        
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
            console.log("✅ SUCCESS! Application Data:", { 
                name: nameValue, 
                email: emailValue, 
                motivation: motivationValue || "Not provided" 
            });
            
            // ============================================================ */
            // 5. CLEAN UP ON SUCCESSFUL SUBMIT
            // ============================================================ */
            
            // Clear the local storage key so the next draft is fresh!
            localStorage.removeItem(STORAGE_KEY);
            console.log("🗑️ Storage cleared after successful submission");
            
            // Show success message
            const successMsg = document.createElement('div');
            successMsg.className = 'success-message show';
            successMsg.textContent = `✅ Thank you ${nameValue}! Your application has been submitted successfully!`;
            
            const existingSuccess = document.querySelector('.success-message');
            if (existingSuccess) {
                existingSuccess.remove();
            }
            
            const submitButton = document.querySelector('.btn-submit');
            submitButton.parentNode.insertBefore(successMsg, submitButton.nextSibling);
            
            // Reset the form
            appForm.reset();
            
            // Hide draft indicator
            if (draftIndicator) {
                draftIndicator.classList.remove('show');
            }
            
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
            console.log("❌ Form validation failed. Please fix errors.");
            const firstError = document.querySelector('.form-group .error');
            if (firstError) {
                firstError.focus();
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });
    
    console.log("✅ Form validation initialized!");
}

// ============================================================ */
// 6. DYNAMIC RENDERING - INITIATIVES (From Day 14)
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
        let statusClass = '';
        let statusBadgeClass = '';
        
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
// 7. MOBILE MENU TOGGLE (From Day 12)
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
// 8. HERO BUTTON INTERACTION (From Day 11)
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

console.log("ℹ️ Day 16 - LocalStorage Persistence is ready!");
console.log("💾 Form data will be saved automatically as you type!");
console.log("🔄 Try refreshing the page - your data will still be there!");