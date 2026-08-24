/* ========================================== */
/* worker.js: The Isolated CPU Thread         */
/* ========================================== */

console.log('⚙️ [Worker] Web Worker thread started');

// ============================================================ */
// 1. LISTEN FOR MESSAGES FROM MAIN THREAD
// ============================================================ */

self.onmessage = function(event) {
    console.log('⚙️ [Worker] Message received from Main Thread:', event.data);
    
    const command = event.data;

    if (command === 'START_COMPUTATION') {
        processHeavyTask();
    } else if (command === 'CANCEL') {
        console.log('⚙️ [Worker] Received cancel command');
        self.postMessage({ status: 'CANCELLED', message: 'Process cancelled by user' });
    }
};

// ============================================================ */
// 2. HEAVY COMPUTATION TASK
// ============================================================ */

function processHeavyTask() {
    console.log('⚙️ [Worker] Starting heavy CPU task...');
    
    // Simulating a massive data processing task
    let complexResult = 0;
    let progress = 0;
    const totalIterations = 2000000000; // 2 billion iterations
    const reportInterval = 500000000; // Report progress every 500 million
    
    // Send start message
    self.postMessage({ 
        status: 'STARTED', 
        message: 'Processing started...' 
    });
    
    const startTime = performance.now();
    
    // A loop this big would normally freeze the entire browser window!
    for (let i = 0; i < totalIterations; i++) {
        complexResult += i;
        
        // Report progress periodically
        if (i > 0 && i % reportInterval === 0) {
            progress = (i / totalIterations) * 100;
            self.postMessage({ 
                status: 'PROGRESS', 
                progress: Math.round(progress),
                message: `Processing: ${Math.round(progress)}% complete`
            });
        }
    }
    
    const endTime = performance.now();
    const duration = (endTime - startTime) / 1000;

    console.log(`⚙️ [Worker] Task complete in ${duration.toFixed(2)}s. Sending data back.`);
    
    // Send the final result back to the main thread
    self.postMessage({
        status: 'SUCCESS',
        data: complexResult,
        duration: duration,
        iterations: totalIterations,
        message: `Completed ${totalIterations.toLocaleString()} iterations in ${duration.toFixed(2)}s`
    });
}

// ============================================================ */
// 3. ERROR HANDLING
// ============================================================ */

self.onerror = function(error) {
    console.error('⚙️ [Worker] Thread Error:', error.message);
    self.postMessage({ 
        status: 'ERROR', 
        message: error.message 
    });
};

// ============================================================ */
// 4. OPTIONAL: Handle terminate signal
// ============================================================ */

self.addEventListener('close', function() {
    console.log('⚙️ [Worker] Thread terminated');
});

console.log('⚙️ [Worker] Ready to accept messages');