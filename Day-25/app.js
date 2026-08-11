/* ========================================== */
/* DAY 25: PHASE 2 CAPSTONE ENGINE            */
/* ========================================== */

console.log("🚀 TechNova Core Engine: Initializing...");

// ============================================================ */
// 1. DATA (Shared across views)
// ============================================================ */

const PROJECTS_DATA = [
    { id: 1, title: "Project StoreLane", description: "A phygital hyperlocal commerce platform designed to digitize small local vendors and connect them with digital consumers.", status: "Active", icon: "🛒" },
    { id: 2, title: "QR Attendance Tracker", description: "Automated student attendance system utilizing progressive web app (PWA) tech and real-time QR code scanning.", status: "Active", icon: "📱" },
    { id: 3, title: "Logistics Management System", description: "Desktop architecture built for tracking shipments and driver status in real-time with live location updates.", status: "Completed", icon: "🚚" },
    { id: 4, title: "Community Dashboard", description: "Real-time analytics dashboard tracking community growth, engagement metrics, and project contributions.", status: "Active", icon: "📊" },
    { id: 5, title: "AI Prompt Workspace", description: "Productivity tool for saving, categorizing, and testing AI prompts with offline-first architecture.", status: "Planning", icon: "🤖" },
    { id: 6, title: "Healthcare Patient Monitor", description: "Zero-fail dashboard for patient monitoring with offline capabilities and real-time data syncing.", status: "Planning", icon: "🏥" },
    { id: 7, title: "Blockchain Identity System", description: "Decentralized identity verification system using blockchain technology for secure authentication.", status: "Planning", icon: "🔗" },
    { id: 8, title: "Smart Classroom Platform", description: "Interactive learning platform with real-time collaboration, whiteboard tools, and student engagement features.", status: "Active", icon: "📚" }
];

const TEAM_DATA = [
    { name: "Sarah Johnson", role: "Lead Developer", img: "https://via.placeholder.com/150" },
    { name: "Michael Chen", role: "DevOps Engineer", img: "https://via.placeholder.com/150" },
    { name: "Priya Patel", role: "UX Researcher", img: "https://via.placeholder.com/150" },
    { name: "David Kim", role: "Community Manager", img: "https://via.placeholder.com/150" }
];

// ============================================================ */
// 2. GLOBAL UI MODULES (Run once on load)
// ============================================================ */

function initThemeToggle() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (!themeToggleBtn) return;

    const currentTheme = localStorage.getItem('synexus_theme');
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeToggleBtn.textContent = '☀️';
    }

    themeToggleBtn.addEventListener('click', function() {
        document.body.classList.toggle('dark-theme');
        const theme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
        localStorage.setItem('synexus_theme', theme);
        this.textContent = theme === 'dark' ? '☀️' : '🌙';
    });
    console.log("✅ Theme toggle initialized");
}

function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('nav ul');
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('nav-active');
            this.classList.toggle('active');
            const isExpanded = navLinks.classList.contains('nav-active');
            this.setAttribute('aria-expanded', isExpanded);
        });
        console.log("✅ Mobile menu initialized");
    }
}

function initModal() {
    const modal = document.getElementById('project-modal');
    const closeBtn = document.getElementById('close-modal');
    const overlay = document.querySelector('.modal-overlay');

    if (!modal || !closeBtn || !overlay) return;

    // Close on X button
    closeBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        modal.style.display = 'none';
        modal.classList.remove('show');
        document.body.style.overflow = '';
    });

    // Close on overlay click
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            modal.style.display = 'none';
            modal.classList.remove('show');
            document.body.style.overflow = '';
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'flex') {
            modal.style.display = 'none';
            modal.classList.remove('show');
            document.body.style.overflow = '';
        }
    });

    console.log("✅ Modal initialized");
}

// ============================================================ */
// 3. VIEW-SPECIFIC MODULES (Run when routed)
// ============================================================ */

function initHeroButton() {
    const heroButton = document.getElementById('heroButton');
    const heroHeadline = document.querySelector('.hero-section h1');
    if (!heroButton || !heroHeadline) return;

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
    console.log("✅ Hero button initialized");
}

function initScrollObserver() {
    const hiddenElements = document.querySelectorAll('.hidden');
    if (hiddenElements.length === 0) {
        console.log("ℹ️ No hidden elements found");
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                observer.unobserve(entry.target);
                console.log(`👁️ Element visible:`, entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    hiddenElements.forEach(el => observer.observe(el));
    console.log(`✅ Scroll observer watching ${hiddenElements.length} elements`);
}

function initKanbanBoard() {
    console.log("📋 Initializing Kanban board...");

    const columns = document.querySelectorAll('.kanban-column .task-list');
    if (columns.length === 0) {
        console.log("ℹ️ No Kanban columns found");
        return;
    }

    // Get all task cards
    const taskCards = document.querySelectorAll('.task-card');

    // Setup drag events on cards
    taskCards.forEach(card => {
        card.addEventListener('dragstart', function() {
            this.classList.add('is-dragging');
            console.log(`📦 Drag started: ${this.querySelector('.task-text')?.textContent || 'Task'}`);
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
                console.log(`📥 Card dropped into: ${this.closest('.kanban-column').id}`);
            }
        });
    });

    updateKanbanCounts();
    console.log("✅ Kanban board initialized");
}

function updateKanbanCounts() {
    const todoList = document.getElementById('todo-list');
    const progressList = document.getElementById('progress-list');
    const doneList = document.getElementById('done-list');
    const todoCount = document.getElementById('todo-count');
    const progressCount = document.getElementById('progress-count');
    const doneCount = document.getElementById('done-count');

    if (todoList && todoCount) todoCount.textContent = todoList.children.length;
    if (progressList && progressCount) progressCount.textContent = progressList.children.length;
    if (doneList && doneCount) doneCount.textContent = doneList.children.length;
}

function initJoinForm() {
    const form = document.getElementById('membershipForm');
    if (!form) {
        console.log("ℹ️ Join form not found");
        return;
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('fullName')?.value.trim();
        const email = document.getElementById('emailAddress')?.value.trim();
        const motivation = document.getElementById('motivation')?.value.trim();

        if (name && email && email.includes('@')) {
            alert(`✅ Thank you ${name}! Your application has been submitted!`);
            form.reset();
            console.log("✅ Form submitted successfully");
        } else {
            alert('❌ Please fill in all required fields with valid data.');
            console.log("❌ Form validation failed");
        }
    });
    console.log("✅ Join form initialized");
}

// ============================================================ */
// 4. VIEW DEFINITIONS (The "Pages")
// ============================================================ */

const routes = {
    "/": `
        <div class="view-container hero-section">
            <h1>Empowering the Next Generation of Engineers</h1>
            <p>Join our community of passionate developers building the future, one line of code at a time.</p>
            <button id="heroButton" class="btn-primary">Join Now</button>
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
                ${PROJECTS_DATA.map(project => {
                    let statusClass = '', statusBadgeClass = '';
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
                ${TEAM_DATA.map(member => `
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
                        <span class="task-count" id="todo-count">3</span>
                    </div>
                    <div class="task-list" id="todo-list">
                        <div class="task-card" draggable="true">
                            <span class="task-text">Finalize UI Designs</span>
                            <span class="task-tag tag-todo">To Do</span>
                        </div>
                        <div class="task-card" draggable="true">
                            <span class="task-text">Write API Documentation</span>
                            <span class="task-tag tag-todo">To Do</span>
                        </div>
                        <div class="task-card" draggable="true">
                            <span class="task-text">Plan Phase 3 Architecture</span>
                            <span class="task-tag tag-todo">To Do</span>
                        </div>
                    </div>
                </div>
                <div class="kanban-column" id="progress-col">
                    <div class="column-header">
                        <h3>🔄 In Progress</h3>
                        <span class="task-count" id="progress-count">1</span>
                    </div>
                    <div class="task-list" id="progress-list">
                        <div class="task-card" draggable="true">
                            <span class="task-text">Build Drag and Drop Logic</span>
                            <span class="task-tag tag-progress">In Progress</span>
                        </div>
                    </div>
                </div>
                <div class="kanban-column" id="done-col">
                    <div class="column-header">
                        <h3>✅ Done</h3>
                        <span class="task-count" id="done-count">1</span>
                    </div>
                    <div class="task-list" id="done-list">
                        <div class="task-card" draggable="true">
                            <span class="task-text">Phase 1 Integration</span>
                            <span class="task-tag tag-done">Done</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    "/join": `
        <div class="view-container">
            <h2>Join The Engineering Community</h2>
            <p style="color: var(--text-muted); margin-bottom: 1.5rem;"><strong>"Standard, not a trend. Build with us."</strong></p>
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

const error404 = `
    <div class="view-container error-404">
        <h1>404</h1>
        <p>Oops! You've wandered off the path.</p>
        <p style="font-size: 0.9rem; color: var(--text-muted);">The page you're looking for doesn't exist.</p>
        <a href="/" class="nav-link btn-primary" style="margin-top: 1.5rem;">🏠 Go Home</a>
    </div>
`;

// ============================================================ */
// 5. THE ROUTER ENGINE (The Orchestrator)
// ============================================================ */

function router() {
    let path = window.location.pathname;
    if (path.includes('index.html')) path = '/';
    if (path.endsWith('/') && path !== '/') path = path.slice(0, -1);
    if (path === '') path = '/';

    console.log(`📍 Navigating to: ${path}`);

    const viewHTML = routes[path] || error404;
    document.getElementById('app-root').innerHTML = viewHTML;

    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active-route');
        if (link.getAttribute('href') === path) {
            link.classList.add('active-route');
        }
    });

    // ============================================================ */
    // ⚡ THE CRITICAL STEP: Re-initialize view-specific logic
    // ============================================================ */

    if (path === '/') {
        initHeroButton();
        // Hidden elements on home page
        setTimeout(initScrollObserver, 100);
    } else if (path === '/kanban') {
        setTimeout(initKanbanBoard, 100);
    } else if (path === '/join') {
        setTimeout(initJoinForm, 100);
    } else if (path === '/initiatives' || path === '/team') {
        setTimeout(initScrollObserver, 100);
    }

    console.log(`✅ Rendered: ${path || '/'}`);
}

// ============================================================ */
// 6. INTERCEPT NAVIGATION
// ============================================================ */

document.body.addEventListener('click', function(e) {
    const link = e.target.closest('.nav-link');
    if (link) {
        e.preventDefault();
        const newUrl = link.getAttribute('href');
        window.history.pushState(null, "", newUrl);
        router();
    }
});

// ============================================================ */
// 7. HANDLE THE BROWSER BACK BUTTON
// ============================================================ */

window.addEventListener('popstate', router);

// ============================================================ */
// 8. ENGINE INITIALIZATION
// ============================================================ */

function initApp() {
    console.log("⚡ Synexus Core Engine: Online.");

    // 1. Start global features (run once)
    initThemeToggle();
    initMobileMenu();
    initModal();

    // 2. Render the initial view
    router();

    console.log("✅ Core Engine fully initialized!");
    console.log("💡 Phase 2 Complete! 🎉");
}

// ============================================================ */
// 9. WAIT FOR DOM TO LOAD
// ============================================================ */

document.addEventListener('DOMContentLoaded', initApp);