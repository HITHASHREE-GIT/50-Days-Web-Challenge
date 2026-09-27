/* ========================================== */
/* store.js - Global State Management         */
/* ========================================== */

class StateStore {
    constructor(initialState = {}) {
        this.state = initialState;
        this.listeners = [];
        this.history = [];
        this.maxHistory = 20;
    }

    getState() { return this.state; }
    get(key) { return this.state[key]; }

    setState(newStatePayload) {
        this.history.push({ ...this.state });
        if (this.history.length > this.maxHistory) {
            this.history.shift();
        }
        this.state = { ...this.state, ...newStatePayload };
        console.log('🔄 State Updated:', this.state);
        this.listeners.forEach(listener => listener(this.state));
    }

    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    resetState() {
        this.state = {};
        this.history = [];
        this.listeners.forEach(listener => listener(this.state));
    }

    getSubscriberCount() {
        return this.listeners.length;
    }
}

export const globalStore = new StateStore({
    userData: null,
    isLoading: false,
    error: null,
    searchQuery: '',
    theme: 'light'
});

console.log('✅ Global Store initialized');