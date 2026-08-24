/* ========================================== */
/* api.js: Network Requests & Authentication  */
/* ========================================== */

import { fetchWithRetry } from './utils.js';

// ============================================================ */
// 1. THE AUTHENTICATION UTILITY
// ============================================================ */

/**
 * Get authentication headers for secure requests
 * @returns {Object} - Headers object with Authorization
 * @throws {Error} - If no token is found
 */
function getAuthHeaders() {
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
        throw new Error("Access Denied: No authentication token found. Please log in.");
    }

    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Note the space!
    };
}

/**
 * Check if user is authenticated
 * @returns {boolean} - True if token exists
 */
export function isAuthenticated() {
    return !!localStorage.getItem('auth_token');
}

/**
 * Get the current auth token
 * @returns {string|null} - The token or null
 */
export function getToken() {
    return localStorage.getItem('auth_token');
}

/**
 * Set the auth token (login)
 * @param {string} token - The token to save
 */
export function setToken(token) {
    localStorage.setItem('auth_token', token);
}

/**
 * Remove the auth token (logout)
 */
export function clearToken() {
    localStorage.removeItem('auth_token');
}

// ============================================================ */
// 2. THE SECURE DELETE FUNCTION
// ============================================================ */

/**
 * Securely delete a resource with Bearer token authentication
 * @param {number} targetId - The ID of the resource to delete
 * @returns {Promise<boolean>} - True if successful
 * @throws {Error} - If authentication fails or network error
 */
export async function secureDeleteResource(targetId) {
    try {
        console.log(`🔒 Initiating secure deletion for resource #${targetId}...`);

        // Generate the secure headers (this will throw an error if no token exists)
        const headers = getAuthHeaders();
        console.log('🔑 Headers:', headers);

        // 3. THE SECURE FETCH
        const response = await fetchWithRetry(`https://jsonplaceholder.typicode.com/posts/${targetId}`, {
            method: 'DELETE',
            headers: headers
        });

        // 4. SECURITY GATEKEEPING
        if (response.status === 401) {
            // 401 means the token is invalid, tampered with, or expired
            clearToken();
            throw new Error("Unauthorized: Your session has expired. Please log in again.");
        }

        if (response.status === 403) {
            // 403 means they are logged in, but don't have ADMIN rights
            throw new Error("Forbidden: You do not have permission to delete this resource.");
        }

        if (!response.ok) {
            throw new Error(`Server Error: ${response.status}`);
        }

        console.log(`✅ Resource #${targetId} securely deleted.`);
        return true;

    } catch (error) {
        console.error("Security/Network Error:", error);
        throw error;
    }
}

// ============================================================ */
// 3. GITHUB API FUNCTIONS (From previous days)
// ============================================================ */

const userCache = new Map();
let cacheHits = 0;
let cacheMisses = 0;

export async function fetchUserProfile(username) {
    const safeUsername = username.toLowerCase();

    if (userCache.has(safeUsername)) {
        cacheHits++;
        console.log(`⚡ Serving [${safeUsername}] from local cache! (Hit #${cacheHits})`);
        return userCache.get(safeUsername);
    }

    cacheMisses++;
    console.log(`📡 Fetching [${safeUsername}] from external server... (Miss #${cacheMisses})`);

    try {
        const response = await fetchWithRetry(`https://api.github.com/users/${safeUsername}`);
        
        if (response.status === 403 || response.status === 429) {
            throw new Error('API Rate Limit exceeded. Please wait a moment.');
        }
        
        if (!response.ok) {
            throw new Error(`User not found (Status: ${response.status})`);
        }

        const data = await response.json();
        userCache.set(safeUsername, data);
        console.log(`💾 Saved [${safeUsername}] to cache. Cache size: ${userCache.size}`);

        return data;

    } catch (error) {
        console.error(`❌ Error fetching [${safeUsername}]:`, error.message);
        throw error;
    }
}

export async function fetchUserRepos(username, perPage = 6) {
    const safeUsername = username.toLowerCase();
    const cacheKey = `${safeUsername}_repos_${perPage}`;
    
    if (userCache.has(cacheKey)) {
        console.log(`⚡ Serving repos for [${safeUsername}] from cache!`);
        return userCache.get(cacheKey);
    }

    console.log(`📡 Fetching repos for [${safeUsername}] from external server...`);

    try {
        const response = await fetchWithRetry(
            `https://api.github.com/users/${safeUsername}/repos?sort=updated&per_page=${perPage}`
        );
        
        if (!response.ok) {
            throw new Error('Failed to fetch repositories');
        }

        const data = await response.json();
        userCache.set(cacheKey, data);
        console.log(`💾 Saved repos for [${safeUsername}] to cache. Cache size: ${userCache.size}`);

        return data;
    } catch (error) {
        console.error(`❌ Error fetching repos for [${safeUsername}]:`, error.message);
        throw error;
    }
}

export function getCacheStats() {
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

export function isUserCached(username) {
    return userCache.has(username.toLowerCase());
}