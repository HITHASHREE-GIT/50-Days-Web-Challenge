/* ========================================== */
/* ProductButton.js: The State Publisher      */
/* ========================================== */

import { globalStore } from '../store.js';

class ProductButton extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const productName = this.getAttribute('product-name') || 'Item';
        const productId = this.getAttribute('product-id') || '001';
        const productPrice = this.getAttribute('price') || '$19.99';
        
        console.log(`📦 ProductButton connected: ${productName}`);
        
        this.shadowRoot.innerHTML = `
            <style>
                .product-card {
                    background: #ffffff;
                    border: 2px solid #e0e0e0;
                    border-radius: 12px;
                    padding: 20px 24px;
                    text-align: center;
                    min-width: 180px;
                    transition: all 0.3s ease;
                }
                .dark-theme .product-card {
                    background: #1e1e2a;
                    border-color: #3a3a4a;
                }
                .product-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 8px 24px rgba(0,0,0,0.12);
                }
                .product-name {
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: #1a1a2e;
                    margin: 0 0 4px 0;
                }
                .dark-theme .product-name {
                    color: #e8e8e8;
                }
                .product-price {
                    font-size: 0.9rem;
                    color: #6b7280;
                    margin: 0 0 12px 0;
                }
                .dark-theme .product-price {
                    color: #8a8a9a;
                }
                .btn-add {
                    background: #22c55e;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 0.95rem;
                    font-weight: 600;
                    transition: all 0.3s ease;
                    width: 100%;
                }
                .btn-add:hover {
                    background: #16a34a;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
                }
                .btn-add:active {
                    transform: scale(0.95);
                }
                .dark-theme .btn-add {
                    background: #4ade80;
                }
                .dark-theme .btn-add:hover {
                    background: #22c55e;
                }
                .btn-add:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                    transform: none;
                }
                .added-feedback {
                    color: #22c55e;
                    font-size: 0.8rem;
                    margin-top: 8px;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }
                .added-feedback.show {
                    opacity: 1;
                }
                .dark-theme .added-feedback {
                    color: #4ade80;
                }
            </style>

            <div class="product-card">
                <h3 class="product-name">📦 ${productName}</h3>
                <p class="product-price">${productPrice}</p>
                <button class="btn-add" id="add-btn">➕ Add to Cart</button>
                <div class="added-feedback" id="feedback">✅ Added to cart!</div>
            </div>
        `;

        // Bind the click event to the shadow button
        const btn = this.shadowRoot.getElementById('add-btn');
        const feedback = this.shadowRoot.getElementById('feedback');
        
        if (btn) {
            // Must use an arrow function here to preserve 'this' context if needed!
            btn.addEventListener('click', () => {
                // 1. Read current state
                const currentState = globalStore.getState();
                const currentCount = currentState.cartCount || 0;
                const newCount = currentCount + 1;
                
                // 2. Publish new state
                globalStore.setState({
                    cartCount: newCount
                });
                
                console.log(`✅ Published state change: Added ${productName} (${productId})`);
                
                // 3. Button feedback
                btn.disabled = true;
                btn.textContent = '✅ Added!';
                setTimeout(() => {
                    btn.disabled = false;
                    btn.textContent = '➕ Add to Cart';
                }, 1500);
                
                // 4. Show feedback
                if (feedback) {
                    feedback.classList.add('show');
                    setTimeout(() => feedback.classList.remove('show'), 1500);
                }
            });
        }
    }

    disconnectedCallback() {
        console.log('📦 ProductButton removed from DOM');
    }
}

customElements.define('product-button', ProductButton);
console.log('✅ ProductButton component registered!');