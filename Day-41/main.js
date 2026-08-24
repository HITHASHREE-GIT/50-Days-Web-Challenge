/* ========================================== */
/* main.js: The Main UI Thread & Orchestrator */
/* ========================================== */

import { debounce, formatDate } from './utils.js';

console.log('🚀 TechNova Engine Initialized - Day 41: Web Workers');

// ============================================================ */
// 1. DOM SELECTION
// ============================================================ */

const processBtn = document.getElementById('process-btn');
const terminateBtn = document.getElementById('terminate-btn');
const cancelBtn = document.getElementById('cancel-btn');
const outputDisplay = document.getElementById('computation-output');
const lastRunTime = document.getElementById('last-run-time');
const lastResult = document.getElementById('last-result');
const workerStatus = document.getElementById('worker-status');

let backgroundWorker = null;
let isProcessing = false;

// ============================================================ */
// 2. INITIALIZE THE WORKER
// ============================================================ */

function createWorker() {
    if (backgroundWorker) {
        try {
            backgroundWorker.terminate();
        } catch (e) {}
    }
    
    if (window.Worker) {
        backgroundWorker = new Worker('worker.js');
        console.log('🧵 Worker created');

        // Listen for the worker's response
        backgroundWorker.onmessage = function(event) {
            const payload = event.data;
            console.log('🖥️ [Main] Message from Worker:', payload);
            
            updateWorkerStatus('complete', '✅ Complete');
            
            if (payload.status === 'STARTED') {
                outputDisplay.innerHTML = `
                    <p class="loading-text">${payload.message}</p>
                `;
                updateWorkerStatus('running', '⏳ Processing...');
                return;
            }
            
            if (payload.status === 'PROGRESS') {
                outputDisplay.innerHTML = `
                    <p class="loading-text">⏳ ${payload.message}</p>
                `;
                return;
            }
            
            if (payload.status === 'SUCCESS') {
                console.log('🖥️ [Main] Result received from Worker:', payload.data);
                const formattedResult = payload.data.toLocaleString();
                
                outputDisplay.innerHTML = `
                    <div class="result-success">
                        ✅ Math Complete!
                        <br>
                        <span style="font-size: 1.2rem; font-weight: bold;">${formattedResult}</span>
                        <br>
                        <span style="font-size: 0.85rem; color: var(--text-muted);">
                            ${payload.message}
                        </span>
                    </div>
                `;
                
                lastRunTime.textContent = new Date().toLocaleTimeString();
                lastResult.textContent = formattedResult.substring(0, 20) + '...';
                
                // Reset button
                processBtn.disabled = false;
                processBtn.textContent = '🚀 Run Heavy Process';
                isProcessing = false;
                updateWorkerStatus('idle', 'Idle');
                
                // Hide terminate button
                if (terminateBtn) terminateBtn.style.display = 'none';
                return;
            }
            
            if (payload.status === 'CANCELLED') {
                outputDisplay.innerHTML = `
                    <div class="result-error">
                        🛑 ${payload.message}
                    </div>
                `;
                processBtn.disabled = false;
                processBtn.textContent = '🚀 Run Heavy Process';
                isProcessing = false;
                updateWorkerStatus('idle', 'Idle');
                if (terminateBtn) terminateBtn.style.display = 'none';
                return;
            }
            
            if (payload.status === 'ERROR') {
                outputDisplay.innerHTML = `
                    <div class="result-error">
                        ❌ Error: ${payload.message}
                    </div>
                `;
                processBtn.disabled = false;
                processBtn.textContent = '🚀 Run Heavy Process';
                isProcessing = false;
                updateWorkerStatus('error', '❌ Error');
                if (terminateBtn) terminateBtn.style.display = 'none';
                return;
            }
        };

        backgroundWorker.onerror = function(error) {
            console.error('🖥️ [Main] Worker Error:', error);
            outputDisplay.innerHTML = `
                <div class="result-error">
                    ❌ Worker Error: ${error.message}
                </div>
            `;
            processBtn.disabled = false;
            processBtn.textContent = '🚀 Run Heavy Process';
            isProcessing = false;
            updateWorkerStatus('error', '❌ Error');
            if (terminateBtn) terminateBtn.style.display = 'none';
        };
        
        updateWorkerStatus('idle', 'Idle');
        return true;
    } else {
        console.error('Web Workers are not supported in your browser.');
        outputDisplay.innerHTML = `
            <div class="result-error">
                ❌ Web Workers are not supported in your browser.
            </div>
        `;
        processBtn.disabled = true;
        return false;
    }
}

// ============================================================ */
// 3. UPDATE WORKER STATUS
// ============================================================ */

function updateWorkerStatus(status, text) {
    if (!workerStatus) return;
    workerStatus.textContent = text;
    workerStatus.className = 'stat-value ' + status;
}

// ============================================================ */
// 4. SEND COMMANDS TO THE WORKER
// ============================================================ */

if (processBtn) {
    processBtn.addEventListener('click', () => {
        // Ensure worker exists
        if (!backgroundWorker) {
            const created = createWorker();
            if (!created) return;
        }
        
        if (isProcessing) {
            alert('⚠️ A process is already running. Please wait.');
            return;
        }
        
        outputDisplay.innerHTML = `
            <p class="loading-text">🚀 Processing 2 billion iterations in the background...</p>
            <p style="font-size: 0.85rem; color: var(--text-muted); text-align: center;">
                Notice how the spinner animation keeps spinning smoothly!
            </p>
        `;
        
        // Disable button to prevent spam clicking
        processBtn.disabled = true;
        processBtn.textContent = '⏳ Processing...';
        isProcessing = true;
        
        // Show terminate button
        if (terminateBtn) terminateBtn.style.display = 'inline-block';
        
        updateWorkerStatus('running', '⏳ Processing...');

        // Dispatch the command to the background thread
        backgroundWorker.postMessage('START_COMPUTATION');
    });
}

// ============================================================ */
// 5. CANCEL PROCESS
// ============================================================ */

if (cancelBtn && backgroundWorker) {
    cancelBtn.addEventListener('click', () => {
        if (!isProcessing) {
            alert('No process is currently running.');
            return;
        }
        
        if (backgroundWorker) {
            backgroundWorker.postMessage('CANCEL');
            outputDisplay.innerHTML = `
                <p class="loading-text">🛑 Cancelling process...</p>
            `;
            updateWorkerStatus('idle', 'Cancelling...');
        }
    });
}

// ============================================================ */
// 6. TERMINATE THE THREAD (Bonus)
// ============================================================ */

if (terminateBtn) {
    terminateBtn.addEventListener('click', () => {
        if (!backgroundWorker) return;
        
        console.warn('🖥️ [Main] Terminating the background thread instantly.');
        
        // Kills the worker dead in its tracks
        backgroundWorker.terminate();
        backgroundWorker = null;
        
        outputDisplay.innerHTML = `
            <div class="result-error">
                🛑 Process forcibly canceled by user.
            </div>
        `;
        
        // Reset button states
        processBtn.disabled = false;
        processBtn.textContent = '🚀 Run Heavy Process';
        isProcessing = false;
        updateWorkerStatus('idle', 'Idle');
        if (terminateBtn) terminateBtn.style.display = 'none';
        
        // Recreate worker for future use
        setTimeout(() => {
            createWorker();
        }, 500);
    });
}

// ============================================================ */
// 7. THEME TOGGLE
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
// 9. HERO BUTTON
// ============================================================ */

const heroButton = document.getElementById('heroButton');
const heroHeadline = document.querySelector('.hero-section h1');

if (heroButton && heroHeadline) {
    heroButton.addEventListener('click', function() {
        const original = 'Empowering the Next Generation of Engineers';
        const newText = 'Welcome to the TechNova Core! 🎉';
        if (heroHeadline.textContent === original) {
            heroHeadline.textContent = newText;
        } else {
            heroHeadline.textContent = original;
        }
        heroHeadline.classList.toggle('active-state');
    });
}

// ============================================================ */
// 10. FORM VALIDATION
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
        if (nameValue === '') { showError(nameInput, nameError, 'Full name is required.'); isValid = false; }
        else if (nameValue.length < 2) { showError(nameInput, nameError, 'Name must be at least 2 characters.'); isValid = false; }
        else { showSuccess(nameInput, nameError); }
        
        if (emailValue === '') { showError(emailInput, emailError, 'Email address is required.'); isValid = false; }
        else if (!emailValue.includes('@')) { showError(emailInput, emailError, 'Please enter a valid email address.'); isValid = false; }
        else { showSuccess(emailInput, emailError); }
        
        if (isValid) {
            console.log('✅ SUCCESS! Application submitted!');
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
// 11. INITIALIZATION
// ============================================================ */

// Create worker on load
createWorker();

console.log('✅ Day 41 fully loaded!');
console.log('🧵 Multithreading with Web Workers active!');
console.log('💡 Click "Run Heavy Process" and watch the spinner keep spinning!');