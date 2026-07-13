// Timer variables
let workDuration = 25 * 60; // 25 minutes in seconds
let restDuration = 5 * 60; // 5 minutes in seconds
let longRestDuration = 15 * 60; // 15 minutes in seconds
let remainingTime = workDuration;
let isPaused = true;
let isWorking = true;
let intervalId;
let completedBlocks = 0;

// DOM elements
const timerTime = document.getElementById('timer-time');
const startPauseBtn = document.getElementById('start-pause-btn');
const skipBtn = document.getElementById('skip-btn');
const completedBlocksDisplay = document.getElementById('completed-blocks');

// Format time to MM:SS
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
}

// Update timer display and progress bar
function updateTimer() {
    if (isPaused) return;

    remainingTime--;

    // Update timer display
    timerTime.textContent = formatTime(remainingTime);

    // Check if timer has finished
    if (remainingTime <= 0) {
        isWorking = !isWorking;
        remainingTime = isWorking ? workDuration : restDuration;
        
        // Update visual feedback
        if (!isWorking) {
            completedBlocks++;
            completedBlocksDisplay.textContent = `Blocks: ${completedBlocks}`;
            
            // Check if we need a long break (every 3 blocks)
            if (completedBlocks % 3 === 0) {
                remainingTime = longRestDuration;
                alert(`🎉 Long break time! Take a 15-minute break!`);
            }
        }

        // Pause timer after reset
        isPaused = true;
        startPauseBtn.textContent = 'Start';
    }
}

// Start/Stop timer
startPauseBtn.addEventListener('click', () => {
    isPaused = !isPaused;
    
    if (isPaused) {
        startPauseBtn.textContent = 'Start';
        if (intervalId) clearInterval(intervalId);
        intervalId = null;
    } else {
        startPauseBtn.textContent = 'Pause';
        if (!intervalId) {
            intervalId = setInterval(updateTimer, 1000);
        }
    }
});

// Skip current block
skipBtn.addEventListener('click', () => {
    isWorking = !isWorking;
    remainingTime = isWorking ? workDuration : restDuration;
    
    if (!isWorking) {
        completedBlocks++;
        completedBlocksDisplay.textContent = `Blocks: ${completedBlocks}`;
        
        // Check if we need a long break (every 3 blocks)
        if (completedBlocks % 3 === 0) {
            remainingTime = longRestDuration;
            alert(`🎉 Long break time! Take a 15-minute break!`);
        }
    }

    startPauseBtn.textContent = 'Pause';
    intervalId = setInterval(updateTimer, 1000);
});

// Initialize timer
window.onload = () => {
    // Set initial state
    startPauseBtn.textContent = 'Start';
    timerTime.textContent = formatTime(workDuration);
    completedBlocksDisplay.textContent = `Blocks: 0`;
};

// Make sure we handle window close to avoid memory leaks
window.addEventListener('beforeunload', () => {
    if (intervalId) {
        clearInterval(intervalId);
    }
});

// Install Button Logic
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    
    // Stash the event so it can be triggered later.
    deferredPrompt = e;
    
    // Update UI to notify the user they can add to home screen
    const installButton = document.getElementById('install-button');
    installButton.style.display = 'block';
});

const installButton = document.getElementById('install-button');
if (installButton) {
    installButton.addEventListener('click', () => {
        // Hide the app provided install promotion
        installButton.style.display = 'none';
        
        // Show the install prompt
        deferredPrompt.prompt();
        
        // Wait for the user to respond to the prompt
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the A2HS prompt');
            } else {
                console.log('User dismissed the A2HS prompt');
            }
            
            // Reset the deferred prompt variable
            deferredPrompt = null;
        });
    });
}

window.addEventListener('appinstalled', (evt) => {
    console.log('INSTALL EVENT TRIGGERED!');
});
