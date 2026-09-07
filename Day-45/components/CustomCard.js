/* ========================================== */
/* CustomModal.js: Template Cloning Module    */
/* ========================================== */

class CustomModal extends HTMLElement {
    constructor() {
        super();
        
        // 1. Attach the Shadow DOM to protect the component
        this.attachShadow({ mode: 'open' });
        
        // 2. Query the main document for the template element
        const template = document.getElementById('modal-template');
        
        // Safety check: Does the template exist in the HTML file?
        if (template) {
            // 3. Clone the nodes deeply (true means clone all nested children too)
            const templateContent = template.content.cloneNode(true);
            
            // 4. Inject the clone into the Shadow DOM
            this.shadowRoot.appendChild(templateContent);
        } else {
            console.error("CustomModal Error: Cannot find 'modal-template' in the DOM.");
        }
    }

    connectedCallback() {
        // Add event listeners after the component is added to DOM
        const overlay = this.shadowRoot.getElementById('modal-overlay');
        const closeBtn = this.shadowRoot.getElementById('modal-close-btn');
        const defaultBtn = this.shadowRoot.getElementById('modal-default-btn');
        
        // If the modal has an 'open' attribute, show it on load
        if (this.hasAttribute('open')) {
            this.open();
        }
        
        // Close button event
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.close();
            });
        }
        
        // Default close button in footer
        if (defaultBtn) {
            defaultBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.close();
            });
        }
        
        // Close on overlay click (background)
        if (overlay) {
            overlay.addEventListener('click', (e) => {
                // Only close if the click is directly on the overlay, not the modal content
                if (e.target === overlay) {
                    this.close();
                }
            });
        }
        
        // Close on Escape key
        this._handleEscape = (e) => {
            if (e.key === 'Escape' && this.hasAttribute('open')) {
                this.close();
            }
        };
        document.addEventListener('keydown', this._handleEscape);
        
        // Find all close buttons inside slotted content
        this.shadowRoot.querySelectorAll('.modal-close-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.close();
            });
        });
    }

    disconnectedCallback() {
        // Clean up event listeners to prevent memory leaks
        document.removeEventListener('keydown', this._handleEscape);
    }

    open() {
        const overlay = this.shadowRoot.getElementById('modal-overlay');
        if (overlay) {
            overlay.classList.add('open');
        }
        this.setAttribute('open', '');
        // Prevent body scrolling
        document.body.style.overflow = 'hidden';
    }

    close() {
        const overlay = this.shadowRoot.getElementById('modal-overlay');
        if (overlay) {
            overlay.classList.remove('open');
        }
        this.removeAttribute('open');
        // Restore body scrolling
        document.body.style.overflow = '';
    }

    toggle() {
        if (this.hasAttribute('open')) {
            this.close();
        } else {
            this.open();
        }
    }
}

// Register the custom element
customElements.define('custom-modal', CustomModal);

console.log('✅ CustomModal component registered!');