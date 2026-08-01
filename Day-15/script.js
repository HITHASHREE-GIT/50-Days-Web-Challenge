/* ========================================== */
/* DAY 15: ARRAY FILTERING & SEARCH           */
/* ========================================== */

console.log("🚀 TechNova Engine Initialized - Day 15: Search & Filter");

// ============================================================ */
// 1. THE DATA PAYLOAD
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
    },
    {
        id: 7,
        title: "Blockchain Identity System",
        description: "Decentralized identity verification system using blockchain technology for secure authentication.",
        status: "Planning",
        icon: "🔗"
    },
    {
        id: 8,
        title: "Smart Classroom Platform",
        description: "Interactive learning platform with real-time collaboration, whiteboard tools, and student engagement features.",
        status: "Active",
        icon: "📚"
    }
];

console.log("📊 Data loaded:", projectsData.length, "projects");

// ============================================================ */
// 2. SELECT TARGET ELEMENTS
// ============================================================ */

const gridContainer = document.getElementById('dynamic-grid');
const searchInput = document.getElementById('search-projects');
const resultsCount = document.getElementById('results-count');

console.log("📦 Grid container:", gridContainer);
console.log("🔍 Search input:", searchInput);

// ============================================================ */
// 3. THE REUSABLE RENDER FUNCTION
// ============================================================ */

function renderProjects(dataArray) {
    // Check if grid container exists
    if (!gridContainer) {
        console.error("❌ Grid container not found!");
        return;
    }

    // CRITICAL: Clear the grid before rendering new data
    gridContainer.innerHTML = '';
    console.log("🧹 Grid cleared");

    // Check for empty results (Bonus Challenge)
    if (dataArray.length === 0) {
        // Show "No Results" message
        const noResultsHTML = `
            <div class="no-results">
                <span class="emoji">🔍</span>
                <p>No initiatives match your search.</p>
                <p style="font-size: 0.9rem; color: var(--text-muted);">Try adjusting your search terms</p>
            </div>
        `;
        gridContainer.innerHTML = noResultsHTML;
        
        // Update results count
        if (resultsCount) {
            resultsCount.textContent = `0 results found`;
            resultsCount.style.color = 'var(--error-color)';
        }
        return;
    }

    // Loop through whatever array is passed into the function
    dataArray.forEach(function(project) {
        // Determine status class
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
        
        // Build the card HTML
        const cardHTML = `
            <div class="initiative-card ${statusClass}">
                <h3>${project.icon || '📌'} ${project.title}</h3>
                <p>${project.description}</p>
                <span class="badge ${statusBadgeClass}">${project.status}</span>
            </div>
        `;
        
        // Append to grid
        gridContainer.innerHTML += cardHTML;
    });

    // Update results count
    if (resultsCount) {
        resultsCount.textContent = `${dataArray.length} results found`;
        resultsCount.style.color = 'var(--success-color)';
    }

    console.log(`✅ Rendered ${dataArray.length} project cards`);
}

// ============================================================ */
// 4. INITIAL RENDER (Show all projects when the page loads)
// ============================================================ */

renderProjects(projectsData);
console.log("📊 Initial render complete - showing all projects");

// ============================================================ */
// 5. THE SEARCH LOGIC
// ============================================================ */

if (searchInput) {
    searchInput.addEventListener('input', function() {
        console.log("✏️ Search input changed:", this.value);
        
        // Step A: Get the search term and make it lowercase
        const searchTerm = this.value.toLowerCase().trim();
        console.log("🔍 Search term:", searchTerm);
        
        // Step B: If search term is empty, show all projects
        if (searchTerm === '') {
            console.log("📊 Search cleared - showing all projects");
            renderProjects(projectsData);
            return;
        }
        
        // Step C: Filter the projectsData array
        // Use .filter() to keep only projects where the title includes the search term
        const filteredProjects = projectsData.filter(function(project) {
            // Convert project title to lowercase and check if it includes the search term
            const titleLowerCase = project.title.toLowerCase();
            const descriptionLowerCase = project.description.toLowerCase();
            const statusLowerCase = project.status.toLowerCase();
            
            // Search in title, description, and status
            return titleLowerCase.includes(searchTerm) ||
                   descriptionLowerCase.includes(searchTerm) ||
                   statusLowerCase.includes(searchTerm);
        });
        
        console.log(`📊 Filtered results: ${filteredProjects.length} projects found`);
        
        // Step D: Pass the newly filtered array into renderProjects()
        renderProjects(filteredProjects);
    });
    
    console.log("✅ Search listener attached!");
    
} else {
    console.error("❌ Search input not found! Check your HTML ID.");
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
// 7. HERO BUTTON INTERACTION (From Day 11)
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
// 8. FORM VALIDATION (From Day 13)
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

console.log("ℹ️ Day 15 - Search & Filter is ready!");
console.log("🔍 Type in the search box to filter projects in real-time!");