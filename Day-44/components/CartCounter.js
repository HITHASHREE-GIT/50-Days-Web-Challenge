/* ========================================== */
/* CartCounter.js: The Reactive Subscriber    */
/* ========================================== */

import { globalStore } from '../store.js';

class CartCounter extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        
        // Setup initial UI
        this.shadowRoot.innerHTML = `
            <style>
                .cart-container {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    background: #f8f5ff;
                    padding: 8px 16px;
                    border-radius: 50px;
                    border: 2px solid #c084fc;
                    transition: all 0.3s ease;
                }
                .dark-theme .cart-container {
                    background: #1e1e2a;
                    border-color: #4a2d8a;
                }
                .cart-icon {
                    font-size: 1.2rem;
                }
                .badge {
                    background: #2d1b69;
                    color: white;
                    padding: 2px 12px;
                    border-radius: 20px;
                    font-weight: 700;
                    font-size: 0.9rem;
                    transition: transform 0.2s ease, background 0.3s ease;
                    display: inline-block;
                    min-width: 24px;
                    text-align: center;
                }
                .dark-theme .badge {
                    background: #7b5ea7;
                }
                .badge.pop {
                    transform: scale(1.3);
                    background: #7b2ff7;
                }
                .label {
                    font-size: 0.85rem;
                    color: #4a4a6a;
                    font-weight: 600;
                }
                .dark-theme .label {
                    color: #b0b0b8;
                }
            </style>
            <div class="cart-container">
                <span class="cart-icon">🛒</span>
                <span class="label">Cart</span>
                <span class="badge" id="count">0</span>
            </div>
        `;
    }

    connectedCallback() {
        console.log('🛒 CartCounter connected to DOM');
        
        // 1. Initial Render (Grab the current state instantly)
        const initialState = globalStore.getState();
        this.updateUI(initialState.cartCount);

        // 2. Subscribe to future changes
        // We save the returned function to 'this.unsubscribe' so we can call it later
        this.unsubscribe = globalStore.subscribe((newState) => {
            console.log('📢 CartCounter received state update:', newState);
            this.updateUI(newState.cartCount);
        });
        
        console.log('✅ CartCounter subscribed to store');
    }

    // Helper method to keep the UI logic clean
    updateUI(count) {
        // MUST use this.shadowRoot, not document!
        const countSpan = this.shadowRoot.getElementById('count');
        const badge = this.shadowRoot.querySelector('.badge');
        
        if (countSpan) {
            countSpan.textContent = count || 0;
        }
        
        // Add a quick visual pop effect
        if (badge) {
            badge.classList.remove('pop');
            // Force reflow
            void badge.offsetWidth;
            badge.classList.add('pop');
            setTimeout(() => badge.classList.remove('pop'), 300);
        }
    }

    // 3. MEMORY MANAGEMENT (CRITICAL)
    disconnectedCallback() {
        // If this component is ever removed from the screen, 
        // we MUST sever the connection to the store!
        if (this.unsubscribe) {
            this.unsubscribe();
            console.log('🧹 CartCounter unsubscribed to prevent memory leaks.');
        }
        console.log('🛒 CartCounter removed from DOM');
    }
}

customElements.define('cart-counter', CartCounter);
console.log('✅ CartCounter component registered!');