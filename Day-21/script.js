/* ========================================== */
/* DAY 21: PERFORMANCE DEBOUNCING             */
/* ========================================== */

console.log("🚀 TechNova Engine Initialized - Day 21: Performance Debouncing");

// ============================================================ */
// 1. THE DEBOUNCE UTILITY (Higher-Order Function)
// ============================================================ */

function debounce(func, delay = 300) {
    let timeoutId; // This variable is protected by the closure
    
    // We return a new function that acts as the "gatekeeper"
    return function (...args) {
        // Step A: If the user types again before the delay finishes, cancel the old timer!
        clearTimeout(timeoutId);
        
        // Step B: Set a new timer.
        timeoutId = setTimeout(() => {
            // Once the timer finishes, execute the original function
            func.apply(this, args);
        }, delay);
        
        // Show debouncing status
        const statusEl = document.getElementById('search-status');
        if (statusEl) {
            statusEl.textContent = '⌨️ Typing...';
            statusEl.className = 'search-status searching';
        }
    };
}

// ============================================================ */
// 2. THE HEAVY LOGIC (Mock Search API)
// ============================================================ */

const searchInput = document.getElementById('search-projects');
const resultsCount = document.getElementById('results-count');
const gridContainer = document.getElementById('dynamic-grid');
const statusEl = document.getElementById('search-status');

function executeHeavySearch(event) {
    const searchTerm = event.target.value;
    
    // Log to console (simulating API call)
    console.log(`📡 Fetching results for: "${searchTerm}"...`);
    
    // Update status
    if (statusEl) {
        statusEl.textContent = '⏳ Searching...';
        statusEl.className = 'search-status searching';
    }
    
    // Simulate network delay (for demonstration)
    setTimeout(() => {
        // Call the actual filtering logic
        performSearch(searchTerm);
        
        // Update status
        if (statusEl) {
            statusEl.textContent = '✅ Done';
            statusEl.className = 'search-status done';
            setTimeout(() => {
                statusEl.textContent = 'Ready';
                statusEl.className = 'search-status';
            }, 1000);
        }
    }, 100);
}

// ============================================================ */
// 3. THE ACTUAL SEARCH LOGIC (From Day 15)
// ============================================================ */

function performSearch(searchTerm) {
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
    
    // Clear the search term
    const term = searchTerm.toLowerCase().trim();
    
    // Filter projects
    let filteredProjects;
    if (term === '') {
        filteredProjects = projectsData;
    } else {
        filteredProjects = projectsData.filter(project => {
            return project.title.toLowerCase().includes(term) ||
                   project.description.toLowerCase().includes(term) ||
                   project.status.toLowerCase().includes(term);
        });
    }
    
    // Render filtered projects
    renderProjects(filteredProjects);
    
    // Update results count
    if (resultsCount) {
        resultsCount.textContent = `${filteredProjects.length} results found`;
        resultsCount.style.color = filteredProjects.length === 0 ? 'var(--error-color)' : 'var(--success-color)';
    }
}

// ============================================================ */
// 4. RENDER PROJECTS FUNCTION
// ============================================================ */

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
}

// ============================================================ */
// 5. APPLY THE OPTIMIZATION - DEBOUNCE!
// ============================================================ */

if (searchInput) {
    // We wrap our heavy function inside our utility function
    const optimizedSearch = debounce(executeHeavySearch, 400);
    
    // Watch the console: It will only log AFTER you stop typing for 400ms!
    searchInput.addEventListener('input', optimizedSearch);
    
    console.log("✅ Debounced search attached! Search will only run after 400ms of inactivity.");
}

// ============================================================ */
// 6. DEMO: Show count of events with/without debounce
// ============================================================ */

let eventCount = 0;
let debouncedEventCount = 0;

// Counter for regular events (for demonstration)
if (searchInput) {
    searchInput.addEventListener('input', function() {
        eventCount++;
        console.log(`📊 Raw events: ${eventCount}`);
    });
}

console.log("ℹ️ Day 21 - Performance Debouncing is ready!");
console.log("💡 Type in the search box and watch the console!");
console.log("⏱️ The search will only run after you stop typing for 400ms!");

// ============================================================ */
// 7. THEME TOGGLE (From Day 17)
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
// 8. TASK TRACKER (From Day 20)
// ============================================================ */

let taskState = [];
const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const taskListContainer = document.getElementById('task-list');
const taskCount = document.getElementById('task-count');
const taskCompletedCount = document.getElementById('task-completed-count');
const clearCompletedBtn = document.getElementById('clear-completed-btn');

const STORAGE_TASKS_KEY = 'technova_tasks';

function loadTasksFromStorage() {
    const saved = localStorage.getItem(STORAGE_TASKS_KEY);
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed)) {
                taskState = parsed;
            }
        } catch (e) {}
    }
}

function saveTasksToStorage() {
    try {
        localStorage.setItem(STORAGE_TASKS_KEY, JSON.stringify(taskState));
    } catch (e) {}
}

function updateStats() {
    if (taskCount) {
        taskCount.textContent = `${taskState.length} task${taskState.length !== 1 ? 's' : ''}`;
    }
    if (taskCompletedCount) {
        const completed = taskState.filter(task => task.completed).length;
        taskCompletedCount.textContent = `${completed} completed`;
    }
    if (clearCompletedBtn) {
        clearCompletedBtn.disabled = !taskState.some(task => task.completed);
    }
}

function renderTasks() {
    if (!taskListContainer) return;
    taskListContainer.innerHTML = '';
    
    if (taskState.length === 0) {
        taskListContainer.innerHTML = `
            <div class="empty-state">
                <span class="emoji">📝</span>
                <p>No tasks yet. Add your first task above!</p>
            </div>
        `;
        updateStats();
        return;
    }
    
    taskState.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'done' : ''}`;
        li.innerHTML = `
            <input type="checkbox" class="toggle-check" data-id="${task.id}" ${task.completed ? 'checked' : ''}>
            <span>${task.text}</span>
            <button class="delete-btn" data-id="${task.id}" aria-label="Delete task">&times;</button>
        `;
        taskListContainer.appendChild(li);
    });
    updateStats();
}

if (addTaskBtn && taskInput) {
    addTaskBtn.addEventListener('click', function() {
        const textValue = taskInput.value.trim();
        if (textValue === '') return;
        taskState.push({ id: Date.now(), text: textValue, completed: false });
        saveTasksToStorage();
        taskInput.value = '';
        taskInput.focus();
        renderTasks();
    });
    taskInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') { e.preventDefault(); addTaskBtn.click(); }
    });
}

if (taskListContainer) {
    taskListContainer.addEventListener('click', function(e) {
        const targetId = Number(e.target.getAttribute('data-id'));
        if (!targetId) return;
        if (e.target.classList.contains('delete-btn')) {
            taskState = taskState.filter(task => task.id !== targetId);
            saveTasksToStorage();
            renderTasks();
            return;
        }
        if (e.target.classList.contains('toggle-check')) {
            const foundTask = taskState.find(task => task.id === targetId);
            if (foundTask) {
                foundTask.completed = !foundTask.completed;
                saveTasksToStorage();
                renderTasks();
            }
            return;
        }
    });
}

if (clearCompletedBtn) {
    clearCompletedBtn.addEventListener('click', function() {
        if (!taskState.some(task => task.completed)) return;
        taskState = taskState.filter(task => !task.completed);
        saveTasksToStorage();
        renderTasks();
    });
}

loadTasksFromStorage();
renderTasks();

// ============================================================ */
// 9. TESTIMONIALS CAROUSEL (From Day 18)
// ============================================================ */

const testimonialsData = [
    { name: "Sarah Johnson", quote: "TechNova changed how I approach engineering. It's about logic, not just languages." },
    { name: "Michael Chen", quote: "Building real-world architecture in this community has been a game changer." },
    { name: "Priya Patel", quote: "The focus on standard protocols over fleeting trends is exactly what the industry needs." },
    { name: "David Kim", quote: "The 50-day challenge pushed me beyond my limits." },
    { name: "Harshit Singh", quote: "Synexus changed how I approach engineering. It's about logic, not just languages." }
];

const testimonialName = document.getElementById('testimonial-name');
const testimonialQuote = document.getElementById('testimonial-quote');
const carouselDots = document.getElementById('carousel-dots');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const timerBar = document.getElementById('timer-bar');

let currentIdx = 0;
let carouselTimer = null;
let isAutoPlaying = true;

function createDots() {
    if (!carouselDots) return;
    carouselDots.innerHTML = '';
    testimonialsData.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.className = `dot ${index === 0 ? 'active' : ''}`;
        dot.dataset.index = index;
        dot.addEventListener('click', function() {
            goToTestimonial(parseInt(this.dataset.index));
        });
        carouselDots.appendChild(dot);
    });
}

function updateDots() {
    document.querySelectorAll('.dot').forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIdx);
    });
}

function updateTestimonial() {
    if (!testimonialName || !testimonialQuote) return;
    const data = testimonialsData[currentIdx];
    testimonialName.textContent = data.name;
    testimonialQuote.textContent = data.quote;
    updateDots();
    if (timerBar && isAutoPlaying) {
        timerBar.style.transition = 'none';
        timerBar.style.width = '100%';
        void timerBar.offsetWidth;
        timerBar.style.transition = 'width 3s linear';
        timerBar.style.width = '0%';
    }
    currentIdx++;
    if (currentIdx >= testimonialsData.length) currentIdx = 0;
}

function goToTestimonial(index) {
    if (isAutoPlaying) {
        clearInterval(carouselTimer);
        isAutoPlaying = false;
    }
    currentIdx = index;
    updateTestimonial();
    setTimeout(() => { if (!isAutoPlaying) startAutoPlay(); }, 5000);
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
        currentIdx--;
        if (currentIdx < 0) currentIdx = testimonialsData.length - 1;
        updateTestimonial();
        setTimeout(() => { if (!isAutoPlaying) startAutoPlay(); }, 5000);
    });
    nextBtn.addEventListener('click', function() {
        stopAutoPlay();
        currentIdx++;
        if (currentIdx >= testimonialsData.length) currentIdx = 0;
        updateTestimonial();
        setTimeout(() => { if (!isAutoPlaying) startAutoPlay(); }, 5000);
    });
}

// ============================================================ */
// 10. MODAL (From Day 19)
// ============================================================ */

const projectModal = document.getElementById('project-modal');
const modalTitle = document.getElementById('modal-title');
const modalDescription = document.getElementById('modal-description');
const modalStatus = document.getElementById('modal-status');
const closeModalBtn = document.getElementById('close-modal');
const modalOverlay = document.querySelector('.modal-overlay');

if (gridContainer) {
    gridContainer.addEventListener('click', function(e) {
        const clickedButton = e.target.closest('.view-btn');
        if (!clickedButton) return;
        
        modalTitle.textContent = clickedButton.getAttribute('data-title');
        modalDescription.textContent = clickedButton.getAttribute('data-description') || "More details soon.";
        modalStatus.textContent = clickedButton.getAttribute('data-status') || "Active";
        modalStatus.className = 'badge';
        modalStatus.classList.add(modalStatus.textContent.toLowerCase());
        
        projectModal.style.display = 'flex';
        projectModal.classList.add('show');
        document.body.style.overflow = 'hidden';
    });
}

function closeModal() {
    projectModal.style.display = 'none';
    projectModal.classList.remove('show');
    document.body.style.overflow = '';
}

if (closeModalBtn) {
    closeModalBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        closeModal();
    });
}

if (modalOverlay) {
    modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay) closeModal();
    });
}

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && projectModal.style.display === 'flex') closeModal();
});

// ============================================================ */
// 11. MOBILE MENU TOGGLE (From Day 12)
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
// 12. HERO BUTTON (From Day 11)
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

console.log("✅ Day 21 fully loaded!");
console.log("⏱️ The search is now DEBOUNCED - it only runs after you stop typing!");