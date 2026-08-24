/* ========================================== */
/* api.js: Network Requests & Caching         */
/* ========================================== */

import { fetchWithRetry } from './utils.js';

const userCache = new Map();
let cacheHits = 0;
let cacheMisses = 0;

export async function fetchUserProfile(username) {
    const safeUsername = username.toLowerCase();

    if (userCache.has(safeUsername)) {
        cacheHits++;
        console.log(`⚡ Serving [${safeUsername}] from cache! (Hit #${cacheHits})`);
        return userCache.get(safeUsername);
    }

    cacheMisses++;
    console.log(`📡 Fetching [${safeUsername}]... (Miss #${cacheMisses})`);

    try {
        const response = await fetchWithRetry(`https://api.github.com/users/${safeUsername}`);
        
        if (response.status === 403 || response.status === 429) {
            throw new Error('API Rate Limit exceeded.');
        }
        
        if (!response.ok) {
            throw new Error(`User not found (Status: ${response.status})`);
        }

        const data = await response.json();
        userCache.set(safeUsername, data);
        console.log(`💾 Saved [${safeUsername}] to cache. Size: ${userCache.size}`);

        return data;
    } catch (error) {
        console.error(`❌ Error:`, error.message);
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

    try {
        const response = await fetchWithRetry(
            `https://api.github.com/users/${safeUsername}/repos?sort=updated&per_page=${perPage}`
        );
        
        if (!response.ok) {
            throw new Error('Failed to fetch repositories');
        }

        const data = await response.json();
        userCache.set(cacheKey, data);
        return data;
    } catch (error) {
        console.error(`❌ Error fetching repos:`, error.message);
        throw error;
    }
}

export function isUserCached(username) {
    return userCache.has(username.toLowerCase());
}