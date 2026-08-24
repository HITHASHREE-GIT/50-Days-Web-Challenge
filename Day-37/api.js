/* ========================================== */
/* api.js: Parallel Network Requests          */
/* ========================================== */

import { fetchWithRetry } from './utils.js';

// ============================================================ */
// DASHBOARD DATA - PARALLEL REQUESTS WITH Promise.all
// ============================================================ */

/**
 * Fetch dashboard data using parallel network requests
 * @param {string} username - GitHub username
 * @returns {Promise<Object>} - Unified dashboard data
 */
export async function fetchDashboardData(username) {
    const safeUsername = username.toLowerCase();
    console.log(`📡 Dispatching parallel requests for [${safeUsername}]...`);
    console.time(`⏱️ Dashboard load time for ${safeUsername}`);

    try {
        // 1. SETUP THE PROMISES (Notice there is NO 'await' here!)
        // We are firing these requests off at the exact same time.
        const profileReq = fetchWithRetry(`https://api.github.com/users/${safeUsername}`);
        const reposReq = fetchWithRetry(`https://api.github.com/users/${safeUsername}/repos?sort=updated&per_page=6`);
        const followersReq = fetchWithRetry(`https://api.github.com/users/${safeUsername}/followers?per_page=6`);

        // 2. THE MASTER AWAIT
        // Wait for ALL of them to cross the finish line
        console.log('⏳ Waiting for all requests to complete...');
        const responses = await Promise.all([profileReq, reposReq, followersReq]);

        // Gatekeeping: Check if any of them failed
        responses.forEach((res, index) => {
            if (!res.ok) {
                const names = ['Profile', 'Repos', 'Followers'];
                console.warn(`⚠️ ${names[index]} request failed with status ${res.status}`);
            }
        });

        // 3. PARSE IN PARALLEL
        // .json() is also asynchronous, so we use Promise.all again!
        const parsedData = await Promise.all(responses.map(res => {
            if (res.ok) {
                return res.json();
            }
            return null; // Return null for failed requests
        }));

        // 4. ARRAY DESTRUCTURING
        // We extract the data based on the exact order we put the promises in
        const [profile, repos, followers] = parsedData;

        console.timeEnd(`⏱️ Dashboard load time for ${safeUsername}`);

        // 5. RETURN A UNIFIED PAYLOAD
        return {
            profile: profile || null,
            recentRepos: repos || [],
            recentFollowers: followers || []
        };

    } catch (error) {
        console.error("❌ Dashboard Fetch Error:", error);
        throw error;
    }
}

// ============================================================ */
// BONUS: Promise.allSettled Version (Graceful Partial Data)
// ============================================================ */

/**
 * Fetch dashboard data using Promise.allSettled (graceful partial data)
 * @param {string} username - GitHub username
 * @returns {Promise<Object>} - Unified dashboard data with partial results
 */
export async function fetchDashboardDataSettled(username) {
    const safeUsername = username.toLowerCase();
    console.log(`📡 Dispatching parallel requests (settled) for [${safeUsername}]...`);
    console.time(`⏱️ Dashboard load time (settled) for ${safeUsername}`);

    try {
        const profileReq = fetchWithRetry(`https://api.github.com/users/${safeUsername}`);
        const reposReq = fetchWithRetry(`https://api.github.com/users/${safeUsername}/repos?sort=updated&per_page=6`);
        const followersReq = fetchWithRetry(`https://api.github.com/users/${safeUsername}/followers?per_page=6`);

        // 2. Use Promise.allSettled - waits for everything, regardless of success/failure
        const results = await Promise.allSettled([profileReq, reposReq, followersReq]);

        console.timeEnd(`⏱️ Dashboard load time (settled) for ${safeUsername}`);

        // 3. Process results
        const [profileResult, reposResult, followersResult] = results;

        let profile = null;
        let repos = [];
        let followers = [];

        // Handle each result individually
        if (profileResult.status === 'fulfilled' && profileResult.value.ok) {
            profile = await profileResult.value.json();
        } else {
            console.warn('⚠️ Profile data unavailable');
        }

        if (reposResult.status === 'fulfilled' && reposResult.value.ok) {
            repos = await reposResult.value.json();
        } else {
            console.warn('⚠️ Repositories data unavailable');
        }

        if (followersResult.status === 'fulfilled' && followersResult.value.ok) {
            followers = await followersResult.value.json();
        } else {
            console.warn('⚠️ Followers data unavailable');
        }

        return {
            profile: profile || null,
            recentRepos: repos || [],
            recentFollowers: followers || [],
            partial: !profile || repos.length === 0 || followers.length === 0
        };

    } catch (error) {
        console.error("❌ Dashboard Fetch Error:", error);
        throw error;
    }
}