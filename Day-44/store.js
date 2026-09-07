/* ========================================== */
/* store.js: Global State Management Engine   */
/* ========================================== */

class StateStore {
    constructor(initialState = {}) {
        this.state = initialState;
        this.listeners = [];
        this.history = [];
        this.maxHistory = 20;
    }

    getState() {
        return this.state;
    }

    get(key) {
        return this.state[key];
    }

    setState(newStatePayload) {
        this.history.push({ ...this.state });
        if (this.history.length > this.maxHistory) {
            this.history.shift();
        }

        this.state = { ...this.state, ...newStatePayload };
        
        console.log('🔄 Global State Updated:', this.state);
        
        this.listeners.forEach((listenerCallback) => {
            listenerCallback(this.state);
        });
    }

    subscribe(listenerCallback) {
        this.listeners.push(listenerCallback);
        
        // Return an unsubscribe function
        return () => {
            this.listeners = this.listeners.filter(l => l !== listenerCallback);
        };
    }

    resetState() {
        this.state = {};
        this.history = [];
        console.log('🔄 State reset');
        this.listeners.forEach((listenerCallback) => {
            listenerCallback(this.state);
        });
    }

    getHistory() {
        return this.history;
    }

    getSubscriberCount() {
        return this.listeners.length;
    }
}

// Export a Singleton
export const globalStore = new StateStore({
    cartCount: 0,
    activeUser: null,
    isDarkMode: false,
    theme: 'light'
});

console.log('✅ Global Store initialized:', globalStore.getState());