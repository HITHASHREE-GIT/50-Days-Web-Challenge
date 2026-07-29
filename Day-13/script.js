/* ========================================== */
/* DAY 13: FORM VALIDATION LOGIC              */
/* ========================================== */

console.log("🚀 TechNova Engine Initialized - Day 13: Form Validation");

// ============================================================ */
// 1. SELECT THE FORM (Not the button!)
// ============================================================ */

const membershipForm = document.getElementById('membershipForm');
const nameInput = document.getElementById('fullName');
const emailInput = document.getElementById('emailAddress');
const motivationInput = document.getElementById('motivation');

// Error message containers
const nameError = document.getElementById('nameError');
const emailError = document.getElementById('emailError');

console.log("Form:", membershipForm);
console.log("Name Input:", nameInput);
console.log("Email Input:", emailInput);

// ============================================================ */
// 2. HELPER FUNCTIONS
// ============================================================ */

// Function to show error on an input
function showError(input, errorElement, message) {
    input.classList.add('error');
    input.classList.remove('success');
    errorElement.textContent = message;
    errorElement.classList.add('show');
}

// Function to show success on an input
function showSuccess(input, errorElement) {
    input.classList.remove('error');
    input.classList.add('success');
    errorElement.classList.remove('show');
}

// Function to clear all validation states
function clearValidation() {
    // Clear all inputs
    const allInputs = document.querySelectorAll('.form-group input, .form-group textarea');
    allInputs.forEach(input => {
        input.classList.remove('error', 'success');
    });
    
    // Clear all error messages
    const allErrors = document.querySelectorAll('.error-message');
    allErrors.forEach(error => {
        error.classList.remove('show');
        error.textContent = '';
    });
    
    // Remove any success message
    const successMsg = document.querySelector('.success-message');
    if (successMsg) {
        successMsg.classList.remove('show');
    }
}

// ============================================================ */
// 3. INTERCEPT THE SUBMIT EVENT
// ============================================================ */

if (membershipForm) {
    
    membershipForm.addEventListener('submit', function(e) {
        
        // CRITICAL: Stop the browser from reloading the page
        e.preventDefault();
        console.log("🛑 Form submission intercepted!");
        
        // Clear previous validation states
        clearValidation();
        
        // ============================================================ */
        // 4. EXTRACT THE VALUES
        // ============================================================ */
        
        // .trim() removes accidental whitespace
        const nameValue = nameInput.value.trim();
        const emailValue = emailInput.value.trim();
        const motivationValue = motivationInput.value.trim();
        
        console.log("📝 Name:", nameValue);
        console.log("📧 Email:", emailValue);
        console.log("💭 Motivation:", motivationValue);
        
        // ============================================================ */
        // 5. CONDITIONAL LOGIC (The Gatekeeper)
        // ============================================================ */
        
        let isValid = true;
        
        // ----- Check Name -----
        if (nameValue === "") {
            console.log("❌ Error: Name cannot be blank.");
            showError(nameInput, nameError, "Full name is required.");
            isValid = false;
        } else if (nameValue.length < 2) {
            console.log("❌ Error: Name must be at least 2 characters.");
            showError(nameInput, nameError, "Name must be at least 2 characters.");
            isValid = false;
        } else {
            showSuccess(nameInput, nameError);
        }
        
        // ----- Check Email -----
        if (emailValue === "") {
            console.log("❌ Error: Email cannot be blank.");
            showError(emailInput, emailError, "Email address is required.");
            isValid = false;
        } else if (!emailValue.includes('@')) {
            console.log("❌ Error: Email must contain @ symbol.");
            showError(emailInput, emailError, "Please enter a valid email address (must contain '@').");
            isValid = false;
        } else if (!emailValue.includes('.')) {
            console.log("❌ Error: Email must contain a period.");
            showError(emailInput, emailError, "Please enter a valid email address (must contain '.').");
            isValid = false;
        } else {
            showSuccess(emailInput, emailError);
        }
        
        // ============================================================ */
        // 6. SUCCESS OR FAILURE
        // ============================================================ */
        
        if (isValid) {
            // Success Logic!
            console.log("✅ SUCCESS! Application Data:", { 
                name: nameValue, 
                email: emailValue, 
                motivation: motivationValue || "Not provided" 
            });
            
            // Show success message
            const successMsg = document.createElement('div');
            successMsg.className = 'success-message show';
            successMsg.textContent = `✅ Thank you ${nameValue}! Your application has been submitted successfully!`;
            
            // Remove any existing success message
            const existingSuccess = document.querySelector('.success-message');
            if (existingSuccess) {
                existingSuccess.remove();
            }
            
            // Insert success message after the submit button
            const submitButton = document.querySelector('.btn-submit');
            submitButton.parentNode.insertBefore(successMsg, submitButton.nextSibling);
            
            // Reset the form
            membershipForm.reset();
            
            // Clear validation states after reset
            setTimeout(() => {
                clearValidation();
                // Remove success message after 5 seconds
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
            
            // Scroll to first error
            const firstError = document.querySelector('.form-group .error');
            if (firstError) {
                firstError.focus();
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });
    
    console.log("✅ Form validation initialized!");
    
} else {
    console.error("❌ Membership form not found!");
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

console.log("ℹ️ Test the form:");
console.log("  1. Click 'Submit Application' with empty fields");
console.log("  2. See error messages appear");
console.log("  3. Fill in valid data and submit");
console.log("  4. See success message!");
