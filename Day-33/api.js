/* ========================================== */
/* api.js: Network Requests & Caching         */
/* ========================================== */

// ============================================================ */
// 1. THE MEMORY BANK (Cache)
// ============================================================ */

// This Map lives entirely inside this module. It cannot be touched by main.js!
const userCache = new Map();

// Cache stats for debugging
let cacheHits = 0;
let cacheMisses = 0;

console.log('📦 Cache initialized (Map)');

// ============================================================ */
// 2. CACHE HELPER FUNCTIONS
// ============================================================ */

function getCacheStats() {
    return {
        size: userCache.size,
        hits: cacheHits,
        misses: cacheMisses,
        total: cacheHits + cacheMisses,
        hitRate: cacheHits + cacheMisses > 0 
            ? Math.round((cacheHits / (cacheHits + cacheMisses)) * 100) 
            : 0
    };
}

// ============================================================ */
// 3. API FUNCTIONS WITH CACHING
// ============================================================ */

/**
 * Fetch a GitHub user profile with caching
 * @param {string} username - GitHub username
 * @returns {Promise<Object>} - User profile data
 */
export async function fetchUserProfile(username) {
    // Normalize the username (case-insensitive)
    const safeUsername = username.toLowerCase();

    // ============================================================ */
    // 2. THE CACHE INTERCEPT
    // ============================================================ */
    
    // Gatekeeper: Do we already have this data?
    if (userCache.has(safeUsername)) {
        cacheHits++;
        console.log(`⚡ Serving [${safeUsername}] from local cache! (Hit #${cacheHits})`);
        console.log(`📊 Cache stats: ${cacheHits} hits, ${cacheMisses} misses (${getCacheStats().hitRate}% hit rate)`);
        
        // Return the saved data instantly, bypassing the network entirely
        return userCache.get(safeUsername);
    }

    cacheMisses++;
    console.log(`📡 Fetching [${safeUsername}] from external server... (Miss #${cacheMisses})`);

    try {
        const response = await fetch(`https://api.github.com/users/${safeUsername}`);
        
        // Rate limit check
        if (response.status === 403 || response.status === 429) {
            throw new Error('API Rate Limit exceeded. Please wait a moment.');
        }
        
        // Not found check
        if (!response.ok) {
            throw new Error(`User not found (Status: ${response.status})`);
        }

        const data = await response.json();

        // ============================================================ */
        // 3. SAVE TO MEMORY
        // ============================================================ */
        
        // If the fetch was successful, save the payload for next time
        userCache.set(safeUsername, data);
        console.log(`💾 Saved [${safeUsername}] to cache. Cache size: ${userCache.size}`);

        return data;

    } catch (error) {
        console.error(`❌ Error fetching [${safeUsername}]:`, error.message);
        throw error;
    }
}

/**
 * Fetch a user's repositories (with caching)
 * @param {string} username - GitHub username
 * @param {number} perPage - Number of repos per page
 * @returns {Promise<Array>} - Array of repositories
 */
export async function fetchUserRepos(username, perPage = 6) {
    const safeUsername = username.toLowerCase();
    const cacheKey = `${safeUsername}_repos_${perPage}`;
    
    // Check cache for repos
    if (userCache.has(cacheKey)) {
        console.log(`⚡ Serving repos for [${safeUsername}] from cache!`);
        return userCache.get(cacheKey);
    }

    console.log(`📡 Fetching repos for [${safeUsername}] from external server...`);

    try {
        const response = await fetch(
            `https://api.github.com/users/${safeUsername}/repos?sort=updated&per_page=${perPage}`
        );
        
        if (!response.ok) {
            throw new Error('Failed to fetch repositories');
        }

        const data = await response.json();
        
        // Save repos to cache
        userCache.set(cacheKey, data);
        console.log(`💾 Saved repos for [${safeUsername}] to cache. Cache size: ${userCache.size}`);

        return data;
    } catch (error) {
        console.error(`❌ Error fetching repos for [${safeUsername}]:`, error.message);
        throw error;
    }
}

/**
 * Get cache statistics
 * @returns {Object} - Cache stats
 */
export function getCacheStats() {
    return {
        size: userCache.size,
        hits: cacheHits,
        misses: cacheMisses,
        total: cacheHits + cacheMisses,
        hitRate: cacheHits + cacheMisses > 0 
            ? Math.round((cacheHits / (cacheHits + cacheMisses)) * 100) 
            : 0,
        keys: Array.from(userCache.keys())
    };
}

/**
 * Clear the cache
 */
export function clearCache() {
    userCache.clear();
    cacheHits = 0;
    cacheMisses = 0;
    console.log('🧹 Cache cleared');
}

/**
 * Check if a user is in the cache
 * @param {string} username - GitHub username
 * @returns {boolean} - True if cached
 */
export function isUserCached(username) {
    return userCache.has(username.toLowerCase());
}