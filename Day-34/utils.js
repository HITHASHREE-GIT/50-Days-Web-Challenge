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

/**
 * Fetch with automatic retries and exponential backoff
 * @param {string} url - The URL to fetch
 * @param {object} options - Fetch options
 * @param {number} retries - Number of retry attempts (default: 3)
 * @param {number} backoff - Initial backoff delay in ms (default: 500)
 * @returns {Promise<Response>} - The fetch response
 */
export async function fetchWithRetry(url, options = {}, retries = 3, backoff = 500) {
    // Bonus: Check for hard offline states first
    if (!navigator.onLine) {
        throw new Error("No internet connection detected. Please check your network.");
    }

    console.log(`🔄 fetchWithRetry: Starting for ${url} (${retries} attempts)`);

    for (let i = 0; i < retries; i++) {
        try {
            // Attempt the network request
            const response = await fetch(url, options);
            console.log(`📡 Attempt ${i + 1}: Status ${response.status}`);

            // If it's a 400-level error (like 404 Not Found), don't retry.
            // It's a user error - retrying won't help.
            if (response.status >= 400 && response.status < 500) {
                console.warn(`⚠️ Client error ${response.status} - not retrying`);
                return response;
            }

            // If it fails with a 500 (Server Error) or network drop, throw to trigger retry
            if (!response.ok) {
                throw new Error(`Server Error: ${response.status}`);
            }

            // If everything is perfect, return the raw response object
            console.log(`✅ Attempt ${i + 1} succeeded!`);
            return response;

        } catch (error) {
            // If we are on the very last loop iteration, finally give up
            if (i === retries - 1) {
                console.error(`❌ Fetch completely failed after ${retries} attempts.`);
                throw error;
            }

            console.warn(`⚠️ Network attempt ${i + 1} failed. Retrying in ${backoff}ms...`);
            
            // Pause the function execution using a Promise-wrapped timeout
            await new Promise(resolve => setTimeout(resolve, backoff));
            
            // Exponential math: double the wait time for the next loop
            backoff *= 2;
            
            // Show status on UI
            const retryStatus = document.getElementById('retry-status');
            if (retryStatus) {
                retryStatus.className = 'retry-status show retrying';
                retryStatus.innerHTML = `
                    🔄 Retrying... (Attempt ${i + 2} of ${retries}) 
                    <span style="font-size: 0.8rem; opacity: 0.7;">waiting ${backoff/2}ms → ${backoff}ms</span>
                `;
            }
        }
    }
}