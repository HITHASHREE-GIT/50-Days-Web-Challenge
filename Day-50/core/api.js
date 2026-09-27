/* ========================================== */
/* api.js - Network Requests                   */
/* ========================================== */

const GITHUB_API = 'https://api.github.com/users';

export async function fetchWithRetry(url, options = {}, retries = 3, backoff = 500) {
    if (!navigator.onLine) {
        throw new Error('No internet connection detected.');
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
            
            console.warn(`⚠️ Attempt ${i + 1} failed. Retrying in ${backoff}ms...`);
            await new Promise(resolve => setTimeout(resolve, backoff));
            backoff *= 2;
        }
    }
}

export async function fetchUserProfile(username) {
    try {
        const response = await fetchWithRetry(`${GITHUB_API}/${username}`);
        
        if (response.status === 403 || response.status === 429) {
            throw new Error('API Rate Limit exceeded. Please wait.');
        }
        
        if (!response.ok) {
            throw new Error(`User not found (Status: ${response.status})`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('❌ Fetch error:', error);
        throw error;
    }
}

export async function fetchUserRepos(username, perPage = 6) {
    try {
        const response = await fetchWithRetry(
            `${GITHUB_API}/${username}/repos?sort=updated&per_page=${perPage}`
        );
        
        if (!response.ok) {
            throw new Error('Failed to fetch repositories');
        }
        
        return await response.json();
    } catch (error) {
        console.error('❌ Repo fetch error:', error);
        throw error;
    }
}

export async function fetchAllUserData(username) {
    try {
        const [profile, repos] = await Promise.all([
            fetchUserProfile(username),
            fetchUserRepos(username, 6)
        ]);
        
        return {
            profile,
            repos,
            timestamp: Date.now()
        };
    } catch (error) {
        console.error('❌ Parallel fetch error:', error);
        throw error;
    }
}
