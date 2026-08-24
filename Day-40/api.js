/* ========================================== */
/* api.js: Network Requests & Intercepts      */
/* ========================================== */

import { saveOfflineData } from './db.js';

// ============================================================ */
// SUBMIT INITIATIVE (With Offline Intercept)
// ============================================================ */

export async function submitInitiative(dataPayload) {
    
    // ⚡ THE OFFLINE GATEKEEPER
    if (!navigator.onLine) {
        console.warn('🌐 Network offline. Routing payload to local database.');
        
        // Save to IndexedDB instead of failing
        const result = await saveOfflineData(dataPayload);
        
        // Throw a specific error so the UI knows to show an "Offline Saved" message
        throw new Error('OFFLINE_SAVED');
    }

    console.log('📡 Online - Sending proposal to server...');

    try {
        // Standard online fetch logic
        const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify(dataPayload)
        });

        if (!response.ok) {
            throw new Error(`Server rejected payload. Status: ${response.status}`);
        }

        const result = await response.json();
        console.log('✅ Proposal submitted to server:', result);
        return result;

    } catch (error) {
        console.error('❌ Submit error:', error);
        throw error;
    }
}

// ============================================================ */
// SYNC OFFLINE DATA (Try to send stored offline data)
// ============================================================ */

export async function syncOfflineData(offlineItems) {
    const results = {
        synced: [],
        failed: []
    };

    for (const item of offlineItems) {
        try {
            // Try to send each item to the server
            const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
                body: JSON.stringify({
                    title: item.title || 'Offline Proposal',
                    body: item.body || 'No description',
                    userId: 1,
                    _offlineId: item.id,
                    _savedAt: item.savedAt
                })
            });

            if (response.ok) {
                results.synced.push(item.id);
            } else {
                results.failed.push(item.id);
            }
        } catch (error) {
            results.failed.push(item.id);
        }
    }

    return results;
}