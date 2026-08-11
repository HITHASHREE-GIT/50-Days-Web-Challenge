/* ========================================== */
/* DAY 24: SPA CLIENT-SIDE ROUTING            */
/* ========================================== */

console.log("🚀 TechNova Engine Initialized - Day 24: SPA Routing");

// ============================================================ */
// 1. PROJECT DATA (For Initiatives page)
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

// ============================================================ */
// 2. TEAM DATA (For Team page)
// ============================================================ */

const teamData = [
    { name: "Sarah Johnson", role: "Lead Developer", img: "https://via.placeholder.com/150" },
    { name: "Michael Chen", role: "DevOps Engineer", img: "https://via.placeholder.com/150" },
    { name: "Priya Patel", role: "UX Researcher", img: "https://via.placeholder.com/150" },
    { name: "David Kim", role: "Community Manager", img: "https://via.placeholder.com/150" }
];

// ============================================================ */
// 3. KANBAN DATA (For Kanban page)
// ============================================================ */

const initialKanbanTasks = {
    todo: [
        { id: 1, text: "Finalize UI Designs" },
        { id: 2, text: "Write API Documentation" },
        { id: 3, text: "Plan Phase 3 Architecture" }
    ],
    progress: [
        { id: 4, text: "Build Drag and Drop Logic" }
    ],
    done: [
        { id: 5, text: "Phase 1 Integration" }
    ]
};

// ============================================================ */
// 4. DEFINE THE VIEWS (The "Pages")
// ============================================================ */

const routes = {
    "/": `
        <div class="view-container hero-section">
            <h1>Empowering the Next Generation of Engineers</h1>
            <p>Join our community of passionate developers building the future, one line of code at a time.</p>
            <a href="/about" class="nav-link btn-primary">Learn More</a>
        </div>
    `,
    "/about": `
        <div class="view-container">
            <h2>About Our Community</h2>
            <p>TechNova is a global community of engineers, developers, and tech enthusiasts dedicated to advancing the standards of web development.</p>
            <p><strong>"Standard, not a trend. The logic, not a language."</strong></p>
            <p>We believe in building resilient, enterprise-grade applications while empowering developers to understand the fundamental architecture of the web.</p>
        </div>
    `,
    "/initiatives": `
        <div class="view-container">
            <h2>Our Initiatives</h2>
            <div class="initiatives-grid" id="initiatives-grid">
                ${projectsData.map(project => {
                    let statusClass = '';
                    let statusBadgeClass = '';
                    if (project.status === "Active") { statusClass = 'status-active'; statusBadgeClass = 'active'; }
                    else if (project.status === "Completed") { statusClass = 'status-completed'; statusBadgeClass = 'completed'; }
                    else if (project.status === "Planning") { statusClass = 'status-planning'; statusBadgeClass = 'planning'; }
                    return `
                        <div class="initiative-card ${statusClass}">
                            <h3>${project.icon || '📌'} ${project.title}</h3>
                            <p>${project.description}</p>
                            <span class="badge ${statusBadgeClass}">${project.status}</span>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `,
    "/team": `
        <div class="view-container">
            <h2>Community Leadership</h2>
            <div class="team-grid">
                ${teamData.map(member => `
                    <div class="profile-card">
                        <img src="${member.img}" alt="${member.name}" width="150" height="150">
                        <h3>${member.name}</h3>
                        <p>${member.role}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    `,
    "/kanban": `
        <div class="view-container">
            <h2>📋 Kanban Board</h2>
            <p style="color: var(--text-muted); margin-bottom: 1.5rem;">Drag and drop tasks to move them through your workflow</p>
            <div class="kanban-board">
                <div class="kanban-column" id="todo-col">
                    <div class="column-header">
                        <h3>📝 To Do</h3>
                        <span class="task-count" id="todo-count">${initialKanbanTasks.todo.length}</span>
                    </div>
                    <div class="task-list" id="todo-list">
                        ${initialKanbanTasks.todo.map(task => `
                            <div class="task-card" draggable="true" data-id="${task.id}">
                                <span class="task-text">${task.text}</span>
                                <span class="task-tag tag-todo">To Do</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="kanban-column" id="progress-col">
                    <div class="column-header">
                        <h3>🔄 In Progress</h3>
                        <span class="task-count" id="progress-count">${initialKanbanTasks.progress.length}</span>
                    </div>
                    <div class="task-list" id="progress-list">
                        ${initialKanbanTasks.progress.map(task => `
                            <div class="task-card" draggable="true" data-id="${task.id}">
                                <span class="task-text">${task.text}</span>
                                <span class="task-tag tag-progress">In Progress</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="kanban-column" id="done-col">
                    <div class="column-header">
                        <h3>✅ Done</h3>
                        <span class="task-count" id="done-count">${initialKanbanTasks.done.length}</span>
                    </div>
                    <div class="task-list" id="done-list">
                        ${initialKanbanTasks.done.map(task => `
                            <div class="task-card" draggable="true" data-id="${task.id}">
                                <span class="task-text">${task.text}</span>
                                <span class="task-tag tag-done">Done</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    `,
    "/join": `
        <div class="view-container join-community">
            <h2>Join The Engineering Community</h2>
            <p><strong>"Standard, not a trend. Build with us."</strong></p>
            <form class="membership-form" id="membershipForm">
                <div class="form-group">
                    <label for="fullName">Full Name <span class="required">*</span></label>
                    <input type="text" id="fullName" placeholder="Jane Doe" required>
                </div>
                <div class="form-group">
                    <label for="emailAddress">Student Email <span class="required">*</span></label>
                    <input type="email" id="emailAddress" placeholder="jane@student.edu" required>
                </div>
                <div class="form-group">
                    <label for="motivation">Why do you want to join?</label>
                    <textarea id="motivation" rows="4" placeholder="I want to solve actual problems..."></textarea>
                </div>
                <button type="submit" class="btn-submit">Submit Application</button>
                <p class="form-note">* All fields are required</p>
            </form>
        </div>
    `
};

// ============================================================ */
// 5. 404 PAGE
// ============================================================ */

const error404 = `
    <div class="view-container error-404">
        <h1>404</h1>
        <p>Oops! You've wandered off the path.</p>
        <p style="font-size: 0.9rem; color: var(--text-muted);">The page you're looking for doesn't exist.</p>
        <a href="/" class="nav-link btn-primary" style="margin-top: 1.5rem;">🏠 Go Home</a>
    </div>
`;

// ============================================================ */
// 6. THE ROUTER ENGINE
// ============================================================ */

function router() {
    // Grab the URL path (e.g., "/", "/team")
    let path = window.location.pathname;
    
    // Fix for GitHub Pages subfolder
    if (path.includes('index.html')) path = '/';
    if (path.endsWith('/')) path = path.slice(0, -1);
    if (path === '') path = '/';
    
    console.log(`📍 Navigating to: ${path}`);
    
    // Get the HTML string from our routes object, fallback to 404
    const viewHTML = routes[path] || error404;
    
    // Inject the HTML into our app root
    document.getElementById('app-root').innerHTML = viewHTML;
    
    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active-route');
        if (link.getAttribute('href') === path) {
            link.classList.add('active-route');
        }
    });
    
    // If the page is Kanban, set up drag and drop
    if (path === '/kanban') {
        setTimeout(setupKanban, 100);
    }
    
    // If the page is Join, set up form validation
    if (path === '/join') {
        setTimeout(setupJoinForm, 100);
    }
    
    console.log(`✅ Rendered: ${path || '/'}`);
}

// ============================================================ */
// 7. KANBAN SETUP
// ============================================================ */

function setupKanban() {
    console.log("📋 Setting up Kanban board...");
    
    const taskCards = document.querySelectorAll('.task-card');
    const columns = document.querySelectorAll('.kanban-column .task-list');
    
    // Setup drag events on cards
    taskCards.forEach(card => {
        card.addEventListener('dragstart', function() {
            this.classList.add('is-dragging');
        });
        card.addEventListener('dragend', function() {
            this.classList.remove('is-dragging');
        });
    });
    
    // Setup drop zones
    columns.forEach(column => {
        column.addEventListener('dragover', function(e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            this.closest('.kanban-column').classList.add('drag-over');
        });
        
        column.addEventListener('dragleave', function(e) {
            this.closest('.kanban-column').classList.remove('drag-over');
        });
        
        column.addEventListener('drop', function(e) {
            e.preventDefault();
            this.closest('.kanban-column').classList.remove('drag-over');
            
            const draggedCard = document.querySelector('.is-dragging');
            if (draggedCard) {
                this.appendChild(draggedCard);
                updateKanbanCounts();
            }
        });
    });
    
    updateKanbanCounts();
}

function updateKanbanCounts() {
    const todoCount = document.getElementById('todo-count');
    const progressCount = document.getElementById('progress-count');
    const doneCount = document.getElementById('done-count');
    const todoList = document.getElementById('todo-list');
    const progressList = document.getElementById('progress-list');
    const doneList = document.getElementById('done-list');
    
    if (todoList && todoCount) todoCount.textContent = todoList.children.length;
    if (progressList && progressCount) progressCount.textContent = progressList.children.length;
    if (doneList && doneCount) doneCount.textContent = doneList.children.length;
}

// ============================================================ */
// 8. JOIN FORM SETUP
// ============================================================ */

function setupJoinForm() {
    console.log("📝 Setting up join form...");
    const form = document.getElementById('membershipForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('fullName').value.trim();
            const email = document.getElementById('emailAddress').value.trim();
            const motivation = document.getElementById('motivation').value.trim();
            
            if (name && email && email.includes('@')) {
                alert(`✅ Thank you ${name}! Your application has been submitted!`);
                form.reset();
            } else {
                alert('❌ Please fill in all required fields with valid data.');
            }
        });
    }
}

// ============================================================ */
// 9. INTERCEPT NAVIGATION
// ============================================================ */

document.body.addEventListener('click', function(e) {
    // Check if the clicked element has the '.nav-link' class
    const link = e.target.closest('.nav-link');
    if (link) {
        // CRITICAL: Stop the browser from hard-reloading the page
        e.preventDefault();
        
        // Push the new URL to the browser's history
        const newUrl = link.getAttribute('href');
        window.history.pushState(null, "", newUrl);
        
        // Manually trigger the router to update the UI
        router();
    }
});

// ============================================================ */
// 10. HANDLE THE BROWSER BACK BUTTON
// ============================================================ */

window.addEventListener('popstate', router);

// ============================================================ */
// 11. THEME TOGGLE
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
// 12. MOBILE MENU TOGGLE
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
// 13. INITIALIZE
// ============================================================ */

router();

console.log("✅ Day 24 fully loaded!");
console.log("💡 Click the navigation links to see SPA routing in action!");
console.log("📍 Current route:", window.location.pathname);