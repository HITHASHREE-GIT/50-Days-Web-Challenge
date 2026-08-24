/* ========================================== */
/* db.js: IndexedDB Client-Side Database      */
/* ========================================== */

const DB_NAME = 'PlatformDB';
const DB_VERSION = 1;
const STORE_NAME = 'offline_proposals';

// ============================================================ */
// 1. INITIALIZE THE DATABASE (Wrapped in a Promise)
// ============================================================ */

function initDB() {
    return new Promise((resolve, reject) => {
        // Open the connection
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        // The Upgrade Event: Fires if the DB doesn't exist or version increases
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            
            // Create an "Object Store" (similar to a SQL Table)
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
                console.log(`🗄️ Database Store '${STORE_NAME}' created.`);
            }
        };

        // Success: Connection established
        request.onsuccess = (event) => {
            resolve(event.target.result);
        };

        // Error handling
        request.onerror = (event) => {
            console.error('IndexedDB Error:', event.target.errorCode);
            reject('Failed to open database.');
        };
    });
}

// ============================================================ */
// 2. WRITE DATA (The POST Intercept)
// ============================================================ */

export async function saveOfflineData(payload) {
    try {
        const db = await initDB();
        
        return new Promise((resolve, reject) => {
            // Open a transaction with 'readwrite' permissions
            const transaction = db.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            
            // Add the data payload to the store
            const request = store.add({
                ...payload,
                savedAt: Date.now() // Track when it was saved offline
            });

            request.onsuccess = () => {
                console.log('💾 Data safely stored in IndexedDB for future sync.');
                resolve({ success: true, id: request.result });
            };

            request.onerror = (error) => {
                console.error('Failed to save data:', error);
                reject(error);
            };
        });
    } catch (error) {
        console.error('DB Write Error:', error);
        throw error;
    }
}

// ============================================================ */
// 3. READ DATA (Get all offline proposals)
// ============================================================ */

export async function getOfflineData() {
    try {
        const db = await initDB();
        
        return new Promise((resolve, reject) => {
            // Open a transaction with 'readonly' permissions
            const transaction = db.transaction([STORE_NAME], 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            
            // Get all records
            const request = store.getAll();

            request.onsuccess = () => {
                console.log(`📋 Retrieved ${request.result.length} items from IndexedDB`);
                resolve(request.result);
            };

            request.onerror = (error) => {
                console.error('Failed to read data:', error);
                reject(error);
            };
        });
    } catch (error) {
        console.error('DB Read Error:', error);
        throw error;
    }
}

// ============================================================ */
// 4. DELETE DATA (Remove synced or specific items)
// ============================================================ */

export async function deleteOfflineData(id) {
    try {
        const db = await initDB();
        
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            
            const request = store.delete(id);

            request.onsuccess = () => {
                console.log(`🗑️ Deleted item ${id} from IndexedDB`);
                resolve({ success: true, id });
            };

            request.onerror = (error) => {
                console.error('Failed to delete data:', error);
                reject(error);
            };
        });
    } catch (error) {
        console.error('DB Delete Error:', error);
        throw error;
    }
}

// ============================================================ */
// 5. CLEAR ALL DATA
// ============================================================ */

export async function clearOfflineData() {
    try {
        const db = await initDB();
        
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            
            const request = store.clear();

            request.onsuccess = () => {
                console.log('🗑️ All offline data cleared');
                resolve({ success: true });
            };

            request.onerror = (error) => {
                console.error('Failed to clear data:', error);
                reject(error);
            };
        });
    } catch (error) {
        console.error('DB Clear Error:', error);
        throw error;
    }
}

// ============================================================ */
// 6. GET STORAGE INFO
// ============================================================ */

export async function getStorageInfo() {
    try {
        const db = await initDB();
        
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            
            const countRequest = store.count();
            const getAllRequest = store.getAll();

            Promise.all([
                new Promise((res) => { countRequest.onsuccess = () => res(countRequest.result); }),
                new Promise((res) => { getAllRequest.onsuccess = () => res(getAllRequest.result); })
            ]).then(([count, items]) => {
                resolve({
                    count,
                    items,
                    size: items.reduce((acc, item) => acc + JSON.stringify(item).length, 0)
                });
            });

            countRequest.onerror = (error) => {
                reject(error);
            };
        });
    } catch (error) {
        console.error('Storage Info Error:', error);
        throw error;
    }
}