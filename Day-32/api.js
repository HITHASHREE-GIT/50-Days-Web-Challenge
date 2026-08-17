/* ========================================== */
/* api.js: Network Requests                   */
/* ========================================== */

const GITHUB_API_BASE = 'https://api.github.com/users';
const JSONPLACEHOLDER_BASE = 'https://jsonplaceholder.typicode.com';

// ============================================================ */
// GITHUB API FUNCTIONS
// ============================================================ */

/**
 * Fetch a GitHub user profile by username
 * @param {string} username - GitHub username
 * @returns {Promise<Object>} - User profile data
 */
export async function fetchUserProfile(username) {
    try {
        const response = await fetch(`${GITHUB_API_BASE}/${username}`);
        
        if (response.status === 403 || response.status === 429) {
            throw new Error('API Rate Limit exceeded. Please wait a moment.');
        }
        
        if (!response.ok) {
            throw new Error(`User not found (Status: ${response.status})`);
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
}

/**
 * Fetch a user's repositories
 * @param {string} username - GitHub username
 * @param {number} perPage - Number of repos per page
 * @returns {Promise<Array>} - Array of repositories
 */
export async function fetchUserRepos(username, perPage = 6) {
    try {
        const response = await fetch(`${GITHUB_API_BASE}/${username}/repos?sort=updated&per_page=${perPage}`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch repositories');
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
}

// ============================================================ */
// JSONPLACEHOLDER API FUNCTIONS (Mock API for CRUD)
// ============================================================ */

/**
 * Create a new post (POST request)
 * @param {Object} data - The post data
 * @returns {Promise<Object>} - Created post
 */
export async function createPost(data) {
    try {
        const response = await fetch(`${JSONPLACEHOLDER_BASE}/posts`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`Failed to create post. Status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
}

/**
 * Update a post (PUT request)
 * @param {number} id - Post ID
 * @param {Object} data - Updated post data
 * @returns {Promise<Object>} - Updated post
 */
export async function updatePost(id, data) {
    try {
        const response = await fetch(`${JSONPLACEHOLDER_BASE}/posts/${id}`, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`Failed to update post. Status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
}

/**
 * Delete a post (DELETE request)
 * @param {number} id - Post ID
 * @returns {Promise<void>}
 */
export async function deletePost(id) {
    try {
        const response = await fetch(`${JSONPLACEHOLDER_BASE}/posts/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error(`Failed to delete post. Status: ${response.status}`);
        }

        return { success: true, id };
    } catch (error) {
        throw error;
    }
}

/**
 * Fetch posts with pagination
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Promise<Array>} - Array of posts
 */
export async function fetchPosts(page = 1, limit = 10) {
    try {
        const response = await fetch(`${JSONPLACEHOLDER_BASE}/posts?_page=${page}&_limit=${limit}`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch posts');
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
}

/**
 * Fetch a single post by ID
 * @param {number} id - Post ID
 * @returns {Promise<Object>} - Post data
 */
export async function fetchPostById(id) {
    try {
        const response = await fetch(`${JSONPLACEHOLDER_BASE}/posts/${id}`);
        
        if (!response.ok) {
            throw new Error(`Post not found. Status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
}