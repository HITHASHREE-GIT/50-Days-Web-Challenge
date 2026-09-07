/* ========================================== */
/* ProjectCard.js: Native Web Component       */
/* ========================================== */

class ProjectCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    static get observedAttributes() {
        return ['title', 'description', 'status', 'language'];
    }

    attributeChangedCallback() {
        this.render();
    }

    getStatusColor(status) {
        const colors = {
            'Active': '#22c55e',
            'Planning': '#f59e0b',
            'Completed': '#6b7280',
            'In Progress': '#3b82f6'
        };
        return colors[status] || '#6b7280';
    }

    getStatusBadge(status) {
        const badges = {
            'Active': 'active',
            'Planning': 'planning',
            'Completed': 'completed',
            'In Progress': 'in-progress'
        };
        return badges[status] || 'completed';
    }

    render() {
        const title = this.getAttribute('title') || 'Untitled Project';
        const description = this.getAttribute('description') || 'No description provided';
        const status = this.getAttribute('status') || 'Planning';
        const language = this.getAttribute('language') || 'N/A';
        const statusColor = this.getStatusColor(status);
        const statusBadge = this.getStatusBadge(status);

        this.shadowRoot.innerHTML = `
            <style>
                .project-card {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background: #ffffff;
                    border: 1px solid #e0e0e0;
                    border-radius: 12px;
                    padding: 20px;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.05);
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                    border-left: 4px solid ${statusColor};
                    margin: 0 auto;
                }
                .project-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 12px 24px rgba(0,0,0,0.12);
                }
                .project-title {
                    margin: 0 0 8px 0;
                    color: #1a1a2e;
                    font-size: 1.1rem;
                    font-weight: 700;
                }
                .project-description {
                    color: #4a4a6a;
                    font-size: 0.9rem;
                    line-height: 1.5;
                    margin: 0 0 12px 0;
                }
                .project-meta {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 8px;
                }
                .project-status {
                    display: inline-block;
                    padding: 2px 12px;
                    border-radius: 12px;
                    font-size: 0.7rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .project-status.active {
                    background: #dcfce7;
                    color: #16a34a;
                }
                .project-status.planning {
                    background: #fef3c7;
                    color: #d97706;
                }
                .project-status.completed {
                    background: #f3f4f6;
                    color: #6b7280;
                }
                .project-status.in-progress {
                    background: #dbeafe;
                    color: #1d4ed8;
                }
                .project-language {
                    font-size: 0.8rem;
                    color: #4a4a6a;
                    background: #f3f4f6;
                    padding: 2px 10px;
                    border-radius: 12px;
                }
                .dark-theme .project-card {
                    background: #1e1e2a;
                    border-color: #3a3a4a;
                }
                .dark-theme .project-title {
                    color: #e8e8e8;
                }
                .dark-theme .project-description {
                    color: #b0b0b8;
                }
                .dark-theme .project-language {
                    background: #2a2a3a;
                    color: #b0b0b8;
                }
            </style>

            <div class="project-card">
                <h3 class="project-title">📁 ${title}</h3>
                <p class="project-description">${description}</p>
                <div class="project-meta">
                    <span class="project-status ${statusBadge}">${status}</span>
                    <span class="project-language">🔄 ${language}</span>
                </div>
            </div>
        `;
    }
}

window.customElements.define('project-card', ProjectCard);
console.log('✅ ProjectCard registered!');