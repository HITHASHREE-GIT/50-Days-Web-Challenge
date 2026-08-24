/* ========================================== */
/* utils.js: Helper Functions                 */
/* ========================================== */

export function debounce(func, delay = 500) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

export function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

export function truncateText(text, maxLength = 150) {
    if (!text || text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
}

export function generateId() {
    return Date.now() + Math.floor(Math.random() * 1000);
}

// ============================================================ */
// NETWORK RESILIENCE - RETRY WITH EXPONENTIAL BACKOFF
// ============================================================ */

export async function fetchWithRetry(url, options = {}, retries = 3, backoff = 500) {
    if (!navigator.onLine) {
        throw new Error("No internet connection detected. Please check your network.");
    }

    console.log(`🔄 fetchWithRetry: Starting for ${url} (${retries} attempts)`);

    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url, options);
            console.log(`📡 Attempt ${i + 1}: Status ${response.status}`);

            if (response.status >= 400 && response.status < 500) {
                console.warn(`⚠️ Client error ${response.status} - not retrying`);
                return response;
            }

            if (!response.ok) {
                throw new Error(`Server Error: ${response.status}`);
            }

            console.log(`✅ Attempt ${i + 1} succeeded!`);
            return response;

        } catch (error) {
            if (i === retries - 1) {
                console.error(`❌ Fetch completely failed after ${retries} attempts.`);
                throw error;
            }

            console.warn(`⚠️ Network attempt ${i + 1} failed. Retrying in ${backoff}ms...`);
            await new Promise(resolve => setTimeout(resolve, backoff));
            backoff *= 2;
        }
    }
}