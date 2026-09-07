/* ========================================== */
/* CounterButton.js: Web Component (Publisher) */
/* ========================================== */

import { globalStore } from '../store.js';

class CounterButton extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.addEventListeners();
        console.log('✅ CounterButton component ready');
    }

    addEventListeners() {
        const addBtn = this.shadowRoot.querySelector('.add-btn');
        const removeBtn = this.shadowRoot.querySelector('.remove-btn');
        const resetBtn = this.shadowRoot.querySelector('.reset-btn');

        if (addBtn) {
            addBtn.addEventListener('click', () => {
                const current = globalStore.getState().cartCount || 0;
                globalStore.setState({ cartCount: current + 1 });
                
                // Add click feedback
                addBtn.style.transform = 'scale(0.95)';
                setTimeout(() => addBtn.style.transform = 'scale(1)', 200);
            });
        }

        if (removeBtn) {
            removeBtn.addEventListener('click', () => {
                const current = globalStore.getState().cartCount || 0;
                if (current > 0) {
                    globalStore.setState({ cartCount: current - 1 });
                    removeBtn.style.transform = 'scale(0.95)';
                    setTimeout(() => removeBtn.style.transform = 'scale(1)', 200);
                }
            });
        }

        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                globalStore.setState({ cartCount: 0 });
                resetBtn.style.transform = 'scale(0.95)';
                setTimeout(() => resetBtn.style.transform = 'scale(1)', 200);
            });
        }
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                .button-group {
                    display: flex;
                    gap: 12px;
                    flex-wrap: wrap;
                    justify-content: center;
                }
                .btn {
                    padding: 12px 24px;
                    border: none;
                    border-radius: 8px;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    min-width: 100px;
                }
                .btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                }
                .btn:active {
                    transform: scale(0.95);
                }
                .btn-add {
                    background: linear-gradient(135deg, #22c55e, #16a34a);
                    color: white;
                }
                .btn-add:hover {
                    box-shadow: 0 4px 16px rgba(34, 197, 94, 0.4);
                }
                .btn-remove {
                    background: linear-gradient(135deg, #f59e0b, #d97706);
                    color: white;
                }
                .btn-remove:hover {
                    box-shadow: 0 4px 16px rgba(245, 158, 11, 0.4);
                }
                .btn-reset {
                    background: linear-gradient(135deg, #6b7280, #4b5563);
                    color: white;
                }
                .btn-reset:hover {
                    box-shadow: 0 4px 16px rgba(107, 114, 128, 0.4);
                }
                .dark-theme .btn-add {
                    background: linear-gradient(135deg, #4ade80, #22c55e);
                }
                .dark-theme .btn-remove {
                    background: linear-gradient(135deg, #fbbf24, #f59e0b);
                }
                .dark-theme .btn-reset {
                    background: linear-gradient(135deg, #9ca3af, #6b7280);
                }
                .counter-label {
                    text-align: center;
                    color: var(--text-muted, #666);
                    font-size: 0.85rem;
                    margin-bottom: 8px;
                }
            </style>

            <div class="button-group">
                <button class="btn btn-add">➕ Add Item</button>
                <button class="btn btn-remove">➖ Remove Item</button>
                <button class="btn btn-reset">🔄 Reset</button>
            </div>
        `;
    }
}

window.customElements.define('counter-button', CounterButton);
console.log('✅ CounterButton component registered!');