/* ========================================== */
/* UserCard.js: Native Web Component          */
/* ========================================== */

class UserCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    static get observedAttributes() {
        return ['name', 'role'];
    }

    attributeChangedCallback() {
        this.render();
    }

    render() {
        const name = this.getAttribute('name') || 'Unknown User';
        const role = this.getAttribute('role') || 'Member';
        const initial = name.charAt(0).toUpperCase();

        this.shadowRoot.innerHTML = `
            <style>
                .card {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background: #ffffff;
                    border: 1px solid #e0e0e0;
                    border-radius: 12px;
                    padding: 24px;
                    text-align: center;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.05);
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                    max-width: 260px;
                    margin: 0 auto;
                }
                .card:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 12px 24px rgba(0,0,0,0.12);
                }
                .avatar {
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #c084fc, #2d1b69);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 15px;
                    font-size: 2.5rem;
                    font-weight: 700;
                    color: white;
                    border: 3px solid #c084fc;
                }
                h3 {
                    margin: 0 0 5px 0;
                    color: #1a1a2e;
                    font-size: 1.2rem;
                    font-weight: 700;
                }
                p {
                    margin: 0 0 8px 0;
                    color: #4a4a6a;
                    font-size: 0.85rem;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    font-weight: 600;
                }
                .role-badge {
                    display: inline-block;
                    background: #c084fc;
                    color: #2d1b69;
                    padding: 4px 14px;
                    border-radius: 12px;
                    font-size: 0.7rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .dark-theme .card {
                    background: #1e1e2a;
                    border-color: #3a3a4a;
                }
                .dark-theme h3 {
                    color: #e8e8e8;
                }
                .dark-theme p {
                    color: #b0b0b8;
                }
                .dark-theme .role-badge {
                    background: #4a2d8a;
                    color: #c084fc;
                }
            </style>

            <div class="card">
                <div class="avatar">${initial}</div>
                <h3>${name}</h3>
                <p>${role}</p>
                <span class="role-badge">${role}</span>
            </div>
        `;
    }
}

window.customElements.define('user-card', UserCard);
console.log('✅ UserCard registered!');