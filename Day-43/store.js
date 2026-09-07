/* ========================================== */
/* store.js: Global State Management Engine   */
/* ========================================== */

class StateStore {
    constructor(initialState = {}) {
        this.state = initialState;
        
        // This array holds the callbacks of anyone who wants to know when data changes
        this.listeners = [];
        this.history = [];
        this.maxHistory = 20;
    }

    // 1. READ STATE
    getState() {
        return this.state;
    }

    // 2. GET SPECIFIC VALUE
    get(key) {
        return this.state[key];
    }

    // 3. WRITE STATE & BROADCAST
    setState(newStatePayload) {
        // Save history before update (for debugging)
        this.history.push({ ...this.state });
        if (this.history.length > this.maxHistory) {
            this.history.shift();
        }

        // Merge the old state with the new changes
        this.state = { ...this.state, ...newStatePayload };
        
        console.log('🔄 Global State Updated:', this.state);
        console.log('📊 History:', this.history.length, 'entries');

        // Notify every single subscriber that the data has changed
        this.listeners.forEach((listenerCallback) => {
            listenerCallback(this.state);
        });
    }

    // 4. THE SUBSCRIPTION PIPELINE
    subscribe(listenerCallback) {
        // Add the component's callback to our broadcast list
        this.listeners.push(listenerCallback);

        // Return an unsubscribe function to prevent memory leaks!
        return () => {
            this.listeners = this.listeners.filter(l => l !== listenerCallback);
        };
    }

    // 5. RESET STATE
    resetState() {
        this.state = {};
        this.history = [];
        console.log('🔄 State reset');
        this.listeners.forEach((listenerCallback) => {
            listenerCallback(this.state);
        });
    }

    // 6. GET STATE HISTORY (for debugging)
    getHistory() {
        return this.history;
    }

    // 7. GET SUBSCRIBER COUNT
    getSubscriberCount() {
        return this.listeners.length;
    }
}

// 4. EXPORT A SINGLETON
// We export ONE instance so the entire app shares the exact same memory bank
export const globalStore = new StateStore({
    cartCount: 0,
    activeUser: null,
    isDarkMode: false,
    notification: '',
    theme: 'light'
});

console.log('✅ Global Store initialized:', globalStore.getState());