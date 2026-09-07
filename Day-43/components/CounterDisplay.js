/* ========================================== */
/* CounterDisplay.js: Web Component (Subscriber) */
/* ========================================== */

import { globalStore } from '../store.js';

class CounterDisplay extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.unsubscribe = null;
    }

    connectedCallback() {
        this.render();
        
        // Subscribe to store changes
        this.unsubscribe = globalStore.subscribe((state) => {
            this.updateDisplay(state);
        });
        
        console.log('✅ CounterDisplay subscribed to store');
    }

    disconnectedCallback() {
        // Clean up subscription to prevent memory leaks
        if (this.unsubscribe) {
            this.unsubscribe();
            console.log('🗑️ CounterDisplay unsubscribed');
        }
    }

    updateDisplay(state) {
        const count = state.cartCount || 0;
        const display = this.shadowRoot.querySelector('.count-display');
        const countSpan = this.shadowRoot.querySelector('.count');
        const messageSpan = this.shadowRoot.querySelector('.message');
        
        if (display) {
            display.classList.add('animate');
            setTimeout(() => display.classList.remove('animate'), 300);
        }
        
        if (countSpan) {
            countSpan.textContent = count;
        }
        
        if (messageSpan) {
            if (count === 0) {
                messageSpan.textContent = '🛒 Your cart is empty';
            } else if (count === 1) {
                messageSpan.textContent = '🛒 1 item in your cart';
            } else {
                messageSpan.textContent = `🛒 ${count} items in your cart`;
            }
        }
    }

    render() {
        const state = globalStore.getState();
        const count = state.cartCount || 0;

        this.shadowRoot.innerHTML = `
            <style>
                .counter-card {
                    background: var(--card-bg, #ffffff);
                    border: 2px solid var(--border-color, #e0e0e0);
                    border-radius: 12px;
                    padding: 24px 32px;
                    text-align: center;
                    min-width: 200px;
                    transition: all 0.3s ease;
                }
                .counter-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 24px rgba(0,0,0,0.1);
                }
                .count {
                    font-size: 3rem;
                    font-weight: 700;
                    color: var(--primary-color, #2d1b69);
                    display: block;
                    transition: transform 0.3s ease;
                }
                .count.animate {
                    animation: pop 0.3s ease;
                }
                @keyframes pop {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.3); color: #7b2ff7; }
                    100% { transform: scale(1); }
                }
                .label {
                    font-size: 0.85rem;
                    color: var(--text-muted, #666);
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }
                .message {
                    font-size: 1rem;
                    color: var(--text-color, #333);
                    margin-top: 8px;
                }
                .count-display.animate {
                    animation: pulse 0.3s ease;
                }
                @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                    100% { transform: scale(1); }
                }
                .dark-theme .counter-card {
                    background: #1e1e2a;
                    border-color: #3a3a4a;
                }
                .dark-theme .count {
                    color: #7b5ea7;
                }
                .dark-theme .message {
                    color: #e8e8e8;
                }
            </style>

            <div class="counter-card">
                <span class="label">Cart Total</span>
                <span class="count display-${count}">${count}</span>
                <div class="message">${count === 0 ? '🛒 Your cart is empty' : count === 1 ? '🛒 1 item in your cart' : `🛒 ${count} items in your cart`}</div>
            </div>
        `;
    }
}

window.customElements.define('counter-display', CounterDisplay);
console.log('✅ CounterDisplay component registered!');