/* ========================================== */
/* GitHubCard.js - User Profile Component     */
/* ========================================== */

class GitHubCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    static get observedAttributes() {
        return ['username', 'name', 'avatar', 'bio', 'repos', 'followers', 'following'];
    }

    attributeChangedCallback() {
        this.render();
    }

    render() {
        const username = this.getAttribute('username') || 'unknown';
        const name = this.getAttribute('name') || 'Unknown User';
        const avatar = this.getAttribute('avatar') || 'https://via.placeholder.com/100';
        const bio = this.getAttribute('bio') || 'No bio available';
        const repos = this.getAttribute('repos') || '0';
        const followers = this.getAttribute('followers') || '0';
        const following = this.getAttribute('following') || '0';

        this.shadowRoot.innerHTML = `
            <style>
                .card {
                    background: var(--bg-card, #ffffff);
                    border: 2px solid var(--border-color, #e0e0e0);
                    border-radius: 12px;
                    padding: 20px;
                    box-shadow: var(--shadow-sm, 0 4px 6px rgba(0,0,0,0.05));
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                    max-width: 350px;
                    margin: 0 auto;
                }
                .card:hover {
                    transform: translateY(-5px);
                    box-shadow: var(--shadow-md, 0 12px 24px rgba(0,0,0,0.12));
                }
                .avatar {
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    border: 3px solid var(--primary-accent, #c084fc);
                    margin-bottom: 12px;
                }
                .name {
                    font-size: 1.2rem;
                    font-weight: 700;
                    color: var(--text-color, #1a1a2e);
                }
                .username {
                    color: var(--text-muted, #6b7280);
                    font-size: 0.85rem;
                }
                .bio {
                    color: var(--text-light, #4a4a6a);
                    font-size: 0.9rem;
                    margin: 8px 0;
                }
                .stats {
                    display: flex;
                    gap: 1rem;
                    justify-content: center;
                    margin-top: 10px;
                    flex-wrap: wrap;
                }
                .stat {
                    text-align: center;
                }
                .stat-value {
                    display: block;
                    font-weight: 700;
                    color: var(--primary-color, #2d1b69);
                }
                .stat-label {
                    font-size: 0.7rem;
                    color: var(--text-muted, #6b7280);
                    text-transform: uppercase;
                }
                .dark-theme .stat-value {
                    color: #7b5ea7;
                }
                .dark-theme .card {
                    background: #1e1e2a;
                    border-color: #3a3a4a;
                }
                .dark-theme .name {
                    color: #e8e8e8;
                }
                .dark-theme .bio {
                    color: #b0b0b8;
                }
            </style>
            <div class="card">
                <img src="${avatar}" alt="${name}" class="avatar">
                <div class="name">${name}</div>
                <div class="username">@${username}</div>
                <div class="bio">${bio}</div>
                <div class="stats">
                    <div class="stat">
                        <span class="stat-value">${repos}</span>
                        <span class="stat-label">Repos</span>
                    </div>
                    <div class="stat">
                        <span class="stat-value">${followers}</span>
                        <span class="stat-label">Followers</span>
                    </div>
                    <div class="stat">
                        <span class="stat-value">${following}</span>
                        <span class="stat-label">Following</span>
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('github-card', GitHubCard);
console.log('✅ GitHubCard component registered!');