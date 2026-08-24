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

export async function fetchWithRetry(url, options = {}, retries = 3, backoff = 500) {
    if (!navigator.onLine) {
        throw new Error("No internet connection detected.");
    }

    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url, options);
            if (response.status >= 400 && response.status < 500) {
                return response;
            }
            if (!response.ok) {
                throw new Error(`Server Error: ${response.status}`);
            }
            return response;
        } catch (error) {
            if (i === retries - 1) throw error;
            await new Promise(resolve => setTimeout(resolve, backoff));
            backoff *= 2;
        }
    }
}