/* ========================================== */
/* utils.js: Utility Functions                */
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