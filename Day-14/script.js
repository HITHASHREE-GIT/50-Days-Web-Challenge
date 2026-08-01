/* ========================================== */
/* DAY 14: DYNAMIC DOM RENDERING              */
/* ========================================== */

console.log("🚀 TechNova Engine Initialized - Day 14: Dynamic Rendering");

// ============================================================ */
// 1. THE DATA PAYLOAD (Array of Objects)
// In the real world, this data would come from a backend database or API!
// ============================================================ */

const projectsData = [
    {
        id: 1,
        title: "Project StoreLane",
        description: "A phygital hyperlocal commerce platform designed to digitize small local vendors and connect them with digital consumers.",
        status: "Active",
        icon: "🛒"
    },
    {
        id: 2,
        title: "QR Attendance Tracker",
        description: "Automated student attendance system utilizing progressive web app (PWA) tech and real-time QR code scanning.",
        status: "Active",
        icon: "📱"
    },
    {
        id: 3,
        title: "Logistics Management System",
        description: "Desktop architecture built for tracking shipments and driver status in real-time with live location updates.",
        status: "Completed",
        icon: "🚚"
    },
    {
        id: 4,
        title: "Community Dashboard",
        description: "Real-time analytics dashboard tracking community growth, engagement metrics, and project contributions.",
        status: "Active",
        icon: "📊"
    },
    {
        id: 5,
        title: "AI Prompt Workspace",
        description: "Productivity tool for saving, categorizing, and testing AI prompts with offline-first architecture.",
        status: "Planning",
        icon: "🤖"
    },
    {
        id: 6,
        title: "Healthcare Patient Monitor",
        description: "Zero-fail dashboard for patient monitoring with offline capabilities and real-time data syncing.",
        status: "Planning",
        icon: "🏥"
    }
];

console.log("📊 Data loaded:", projectsData.length, "projects");

// ============================================================ */
// 2. SELECT THE TARGET CONTAINER
// ============================================================ */

const gridContainer = document.getElementById('dynamic-grid');

console.log("📦 Grid container:", gridContainer);

// ============================================================ */
// 3. ITERATE & BUILD - DYNAMIC RENDERING!
// ============================================================ */

if (gridContainer) {
    
    // Clear any existing content (just in case)
    gridContainer.innerHTML = '';
    
    // Loop through each project in the data array
    projectsData.forEach(function(project, index) {
        
        console.log(`🔄 Rendering project ${index + 1}:`, project.title);
        
        // ============================================================ */
        // 4. CONDITIONAL RENDERING (Bonus Challenge)
        // ============================================================ */
        
        // Determine the status class for styling
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
        
        // ============================================================ */
        // 5. CONSTRUCT THE HTML STRING (Template Literals)
        // ============================================================ */
        
        const cardHTML = `
            <div class="initiative-card ${statusClass}">
                <h3>${project.icon || '📌'} ${project.title}</h3>
                <p>${project.description}</p>
                <span class="badge ${statusBadgeClass}">${project.status}</span>
            </div>
        `;
        
        // ============================================================ */
        // 6. INJECT INTO THE DOM
        // CRITICAL: Use += to append, not = (which would overwrite!)
        // ============================================================ */
        
        gridContainer.innerHTML += cardHTML;
        
    });
    
    console.log(`✅ Successfully rendered ${projectsData.length} project cards!`);
    
    // ============================================================ */
    // 7. DEMONSTRATE DATA-DRIVEN UI
    // ============================================================ */
    
    // Log the final HTML structure
    console.log("📝 Final grid HTML:", gridContainer.innerHTML);
    
    // Display a count of rendered cards
    const cardCount = document.querySelectorAll('.initiative-card').length;
    console.log(`📊 Total cards rendered: ${cardCount}`);
    
    // Add a counter display to the page
    const countDisplay = document.createElement('p');
    countDisplay.style.textAlign = 'right';
    countDisplay.style.fontSize = '0.9rem';
    countDisplay.style.color = 'var(--text-muted)';
    countDisplay.style.marginTop = '1rem';
    countDisplay.textContent = `📊 ${cardCount} initiatives loaded dynamically`;
    gridContainer.parentNode.appendChild(countDisplay);
    
} else {
    console.error("❌ Grid container not found! Check your HTML ID.");
}

// ============================================================ */
// 8. MOBILE MENU TOGGLE (From Day 12)
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
// 9. HERO BUTTON INTERACTION (From Day 11)
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

// ============================================================ */
// 10. FORM VALIDATION (From Day 13)
// ============================================================ */

const membershipForm = document.getElementById('membershipForm');
const nameInput = document.getElementById('fullName');
const emailInput = document.getElementById('emailAddress');
const motivationInput = document.getElementById('motivation');
const nameError = document.getElementById('nameError');
const emailError = document.getElementById('emailError');

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

if (membershipForm) {
    membershipForm.addEventListener('submit', function(e) {
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
            console.log("❌ Error: Name cannot be blank.");
            showError(nameInput, nameError, "Full name is required.");
            isValid = false;
        } else if (nameValue.length < 2) {
            showError(nameInput, nameError, "Name must be at least 2 characters.");
            isValid = false;
        } else {
            showSuccess(nameInput, nameError);
        }
        
        if (emailValue === "") {
            console.log("❌ Error: Email cannot be blank.");
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
            
            const successMsg = document.createElement('div');
            successMsg.className = 'success-message show';
            successMsg.textContent = `✅ Thank you ${nameValue}! Your application has been submitted successfully!`;
            
            const existingSuccess = document.querySelector('.success-message');
            if (existingSuccess) {
                existingSuccess.remove();
            }
            
            const submitButton = document.querySelector('.btn-submit');
            submitButton.parentNode.insertBefore(successMsg, submitButton.nextSibling);
            
            membershipForm.reset();
            
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
}

console.log("ℹ️ Day 14 - Dynamic Rendering is ready!");
console.log("📊 The Initiatives grid is now generated from JavaScript data!");