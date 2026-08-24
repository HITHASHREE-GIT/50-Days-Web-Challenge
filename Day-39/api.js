/* ========================================== */
/* api.js: API Functions                      */
/* ========================================== */

// Simple API functions for the app
export async function fetchUserData(username) {
    const response = await fetch(`https://api.github.com/users/${username}`);
    if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
    }
    return response.json();
}

export async function fetchRepos(username) {
    const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`);
    if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
    }
    return response.json();
}