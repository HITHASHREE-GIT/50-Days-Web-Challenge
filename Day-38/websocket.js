/* ========================================== */
/* websocket.js: Persistent Data Streams      */
/* ========================================== */

// 1. ESTABLISH THE CONNECTION
// We use 'wss://' (WebSocket Secure) instead of 'https://'
const wsUrl = 'wss://ws.postman-echo.com/raw';
let liveSocket = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;

// ============================================================ */
// CONNECTION STATUS UI HELPER
// ============================================================ */

function updateConnectionStatus(status, message) {
    const statusIndicator = document.getElementById('connection-status');
    if (!statusIndicator) return;
    
    statusIndicator.textContent = message;
    statusIndicator.className = status;
}

// ============================================================ */
// CONNECT FUNCTION
// ============================================================ */

export function connectWebSocket() {
    console.log("🔌 Attempting to connect to live server...");
    updateConnectionStatus('connecting', '🔌 Connecting...');

    // Initialize the native browser WebSocket object
    liveSocket = new WebSocket(wsUrl);

    // 2. EVENT: CONNECTION OPENED
    liveSocket.onopen = (event) => {
        console.log("🟢 Live Connection Established!");
        updateConnectionStatus('online', '🟢 Online');
        reconnectAttempts = 0; // Reset reconnect attempts on successful connection
        
        // Enable the send button
        const sendBtn = document.getElementById('ws-send');
        const wsInput = document.getElementById('ws-input');
        if (sendBtn) sendBtn.disabled = false;
        if (wsInput) wsInput.disabled = false;
        
        // Add system message to feed
        addMessageToFeed('🔌 Connected to WebSocket server', 'system');
    };

    // 3. EVENT: MESSAGE RECEIVED FROM SERVER
    liveSocket.onmessage = (event) => {
        console.log("📥 Incoming Stream:", event.data);
        addMessageToFeed(event.data, 'received');
    };

    // 4. EVENT: ERRORS AND DISCONNECTS
    liveSocket.onerror = (error) => {
        console.error("⚠️ WebSocket Error:", error);
        addMessageToFeed('⚠️ WebSocket error occurred', 'error');
    };

    liveSocket.onclose = (event) => {
        console.warn("🔴 Connection Lost.");
        updateConnectionStatus('offline', '🔴 Offline');
        
        // Disable input and send button
        const sendBtn = document.getElementById('ws-send');
        const wsInput = document.getElementById('ws-input');
        if (sendBtn) sendBtn.disabled = true;
        if (wsInput) wsInput.disabled = true;
        
        addMessageToFeed('🔴 Connection lost', 'error');

        // Bonus: Auto-reconnect logic!
        if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
            reconnectAttempts++;
            const delay = 3000 * Math.pow(1.5, reconnectAttempts - 1); // Exponential backoff
            console.log(`🔄 Auto-reconnecting in ${delay/1000}s (Attempt ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})`);
            addMessageToFeed(`🔄 Reconnecting in ${delay/1000}s (Attempt ${reconnectAttempts})`, 'system');
            
            setTimeout(() => {
                connectWebSocket();
            }, delay);
        } else {
            addMessageToFeed('❌ Max reconnect attempts reached. Please refresh.', 'error');
            console.error('❌ Max reconnect attempts reached.');
        }
    };
}

// ============================================================ */
// ADD MESSAGE TO FEED
// ============================================================ */

function addMessageToFeed(message, type = 'received') {
    const feedContainer = document.getElementById('live-feed');
    if (!feedContainer) return;
    
    // Remove placeholder if present
    const placeholder = feedContainer.querySelector('.feed-placeholder');
    if (placeholder) placeholder.remove();
    
    const timestamp = new Date().toLocaleTimeString();
    let colorClass = '';
    let label = '';
    
    switch(type) {
        case 'sent':
            colorClass = 'sent';
            label = 'You';
            break;
        case 'received':
            colorClass = 'received';
            label = 'Server';
            break;
        case 'system':
            colorClass = 'system';
            label = 'System';
            break;
        case 'error':
            colorClass = 'error';
            label = '⚠️';
            break;
        default:
            colorClass = 'received';
            label = 'Server';
    }
    
    const messageHTML = `
        <div class="msg ${colorClass}">
            <strong>${label}:</strong> ${message}
            <span class="timestamp">${timestamp}</span>
        </div>
    `;
    
    feedContainer.innerHTML += messageHTML;
    
    // Auto-scroll to the bottom of the feed
    feedContainer.scrollTop = feedContainer.scrollHeight;
}

// ============================================================ */
// 5. TRANSMISSION UTILITY
// ============================================================ */

export function sendLiveMessage(payloadText) {
    // Defensive check: Is the socket actually open and ready?
    if (liveSocket && liveSocket.readyState === WebSocket.OPEN) {
        
        // Send the payload to the server
        liveSocket.send(payloadText);
        console.log("📤 Outgoing Stream:", payloadText);
        
        // Update the UI immediately for the user
        addMessageToFeed(payloadText, 'sent');
        
        return true;
        
    } else if (liveSocket && liveSocket.readyState === WebSocket.CONNECTING) {
        console.warn("⏳ Connection is still establishing. Please wait.");
        alert("⏳ Connection is still establishing. Please wait a moment.");
        return false;
    } else {
        console.error("❌ Cannot transmit: Connection is not open.");
        alert("❌ Cannot transmit: Connection is not open.");
        return false;
    }
}

// ============================================================ */
// DISCONNECT UTILITY
// ============================================================ */

export function disconnectWebSocket() {
    if (liveSocket) {
        liveSocket.close();
        console.log("🔌 WebSocket disconnected manually.");
        addMessageToFeed('🔌 Disconnected manually', 'system');
    }
}

// ============================================================ */
// CHECK CONNECTION STATUS
// ============================================================ */

export function getConnectionStatus() {
    if (!liveSocket) return 'disconnected';
    switch(liveSocket.readyState) {
        case WebSocket.CONNECTING: return 'connecting';
        case WebSocket.OPEN: return 'open';
        case WebSocket.CLOSING: return 'closing';
        case WebSocket.CLOSED: return 'closed';
        default: return 'unknown';
    }
}