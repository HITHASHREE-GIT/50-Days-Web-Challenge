/* ========================================== */
/* main.js: Form Submission Handler           */
/* ========================================== */

import { submitInitiative, syncOfflineData } from './api.js';
import { getOfflineData, deleteOfflineData, clearOfflineData, getStorageInfo, formatTimestamp } from './db.js';

console.log('🚀 TechNova Engine Initialized - Day 40: IndexedDB');

// ============================================================ */
// 1. DOM SELECTION
// ============================================================ */

const proposalForm = document.getElementById('proposal-form');
const titleInput = document.getElementById('initiative-title');
const descInput = document.getElementById('initiative-desc');
const feedbackMessage = document.getElementById('feedback-message');
const submitBtn = document.getElementById('proposal-submit-btn');
const syncBtn = document.getElementById('sync-offline-btn');
const viewBtn = document.getElementById('view-offline-btn');
const offlineList = document.getElementById('offline-data-list');
const offlineItems = document.getElementById('offline-items');
const connectionIndicator = document.getElementById('connection-indicator');
const connectionText = document.getElementById('connection-text');

// ============================================================ */
// 2. UPDATE CONNECTION STATUS
// ============================================================ */

function updateConnectionStatus() {
    const isOnline = navigator.onLine;
    const banner = document.getElementById('offline-banner');
    
    if (isOnline) {
        connectionIndicator.textContent = '🌐';
        connectionText.textContent = 'Online';
        banner.className = 'offline-status-banner online';
    } else {
        connectionIndicator.textContent = '📴';
        connectionText.textContent = 'Offline';
        banner.className = 'offline-status-banner offline';
    }
}

// ============================================================ */
// 3. FORM SUBMISSION HANDLER
// ============================================================ */

if (proposalForm) {
    proposalForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const title = titleInput.value.trim();
        const body = descInput.value.trim();
        
        if (!title || !body) {
            feedbackMessage.className = 'feedback-message error';
            feedbackMessage.innerHTML = '⚠️ Please fill in all fields.';
            return;
        }

        feedbackMessage.className = 'feedback-message';
        feedbackMessage.innerHTML = '⏳ Processing...';
        submitBtn.disabled = true;
        submitBtn.textContent = '⏳ Submitting...';

        const payload = {
            title: title,
            body: body,
            userId: 1
        };

        try {
            const result = await submitInitiative(payload);
            feedbackMessage.className = 'feedback-message success';
            feedbackMessage.innerHTML = `✅ Proposal submitted to server! (ID: ${result.id})`;
            proposalForm.reset();
            
        } catch (error) {
            // Handle the specific offline state we threw in api.js
            if (error.message === 'OFFLINE_SAVED') {
                feedbackMessage.className = 'feedback-message offline';
                feedbackMessage.innerHTML = '📡 You are offline. Proposal saved securely to your device and will sync later!';
                proposalForm.reset();
                
                // Refresh offline list
                await loadOfflineData();
            } else {
                feedbackMessage.className = 'feedback-message error';
                feedbackMessage.innerHTML = `⚠️ ${error.message}`;
            }
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = '🚀 Submit Proposal';
        }
    });
}

// ============================================================ */
// 4. LOAD OFFLINE DATA
// ============================================================ */

async function loadOfflineData() {
    try {
        const data = await getOfflineData();
        const info = await getStorageInfo();
        
        offlineItems.innerHTML = '';
        
        if (data.length === 0) {
            offlineItems.innerHTML = '<li style="color: var(--text-muted); text-align: center; padding: 1rem;">No offline proposals found</li>';
            return;
        }
        
        data.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span class="offline-item-title">${item.title || 'Untitled'}</span>
                <span class="offline-item-time">📅 ${formatTimestamp(item.savedAt)}</span>
                <br>
                <span style="font-size: 0.8rem; color: var(--text-muted);">${item.body ? item.body.substring(0, 80) + '...' : 'No description'}</span>
                <button class="delete-offline-btn" data-id="${item.id}" style="float: right; background: none; border: none; color: var(--error-color); cursor: pointer;">✕</button>
            `;
            offlineItems.appendChild(li);
        });
        
        // Add delete handlers
        document.querySelectorAll('.delete-offline-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = parseInt(btn.dataset.id);
                if (confirm(`Delete offline proposal #${id}?`)) {
                    await deleteOfflineData(id);
                    await loadOfflineData();
                }
            });
        });
        
    } catch (error) {
        console.error('Error loading offline data:', error);
        offlineItems.innerHTML = '<li style="color: var(--error-color);">Error loading offline data</li>';
    }
}

// ============================================================ */
// 5. VIEW OFFLINE DATA TOGGLE
// ============================================================ */

if (viewBtn) {
    viewBtn.addEventListener('click', async () => {
        if (offlineList.style.display === 'block') {
            offlineList.style.display = 'none';
            viewBtn.textContent = '📋 View Offline Proposals';
            return;
        }
        
        viewBtn.textContent = '⏳ Loading...';
        await loadOfflineData();
        offlineList.style.display = 'block';
        viewBtn.textContent = '📋 Hide Offline Proposals';
    });
}

// ============================================================ */
// 6. SYNC OFFLINE DATA
// ============================================================ */

if (syncBtn) {
    syncBtn.addEventListener('click', async () => {
        if (!navigator.onLine) {
            alert('📡 You are offline. Please connect to the internet to sync.');
            return;
        }
        
        const data = await getOfflineData();
        if (data.length === 0) {
            alert('✅ No offline data to sync.');
            return;
        }
        
        syncBtn.disabled = true;
        syncBtn.textContent = '⏳ Syncing...';
        
        try {
            const results = await syncOfflineData(data);
            
            // Delete successfully synced items
            for (const id of results.synced) {
                await deleteOfflineData(id);
            }
            
            const message = `✅ Synced ${results.synced.length} items${results.failed.length > 0 ? `, ${results.failed.length} failed` : ''}`;
            alert(message);
            
            // Refresh view
            await loadOfflineData();
            
        } catch (error) {
            console.error('Sync error:', error);
            alert('❌ Error syncing offline data');
        } finally {
            syncBtn.disabled = false;
            syncBtn.textContent = '🔄 Sync Offline Data';
        }
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

updateConnectionStatus();

// Listen for online/offline events
window.addEventListener('online', () => {
    updateConnectionStatus();
    // Check if there's offline data to sync
    getOfflineData().then(data => {
        if (data.length > 0) {
            console.log(`📡 ${data.length} offline items waiting to sync`);
        }
    });
});

window.addEventListener('offline', updateConnectionStatus);

console.log('✅ Day 40 fully loaded!');
console.log('🗄️ IndexedDB client-side database ready!');
console.log('💡 Try submitting a proposal while offline - it will be saved to IndexedDB!');