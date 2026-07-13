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
const circleProgress = document.querySelector('.circle-progress');
const startPauseBtn = document.getElementById('start-pause-btn');
const skipBtn = document.getElementById('skip-btn');
const completedBlocksDisplay = document.getElementById('completed-blocks');

// Function to format time as MM:SS
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
}

// Function to update the circle progress
function updateCircleProgress(progress) {
    const dashOffset = 282.7 - (progress * 282.7);
    circleProgress.style.strokeDashoffset = dashOffset;
}

// Update timer display and progress bar
function updateTimer() {
    if (isPaused) return;

    remainingTime--;

    // Update timer display
    const timeString = formatTime(remainingTime);
    timerTime.textContent = timeString;

    // Calculate the progress percentage
    const totalSeconds = isWorking ? workDuration : restDuration;
    const progress = remainingTime / totalSeconds;

    // Update circle progress
    updateCircleProgress(progress);

    // Check if timer has finished
    if (remainingTime <= 0) {
        isWorking = !isWorking; // Toggle between work and rest

        if (!isWorking) {
            completedBlocks++;
            completedBlocksDisplay.textContent = `Blocks: ${completedBlocks}`;

            // Check if we need a long break (every 4 blocks)
            if (completedBlocks % 4 === 0) {
                remainingTime = longRestDuration;
                alert(`🎉 Long break time! Take a 15-minute break!`);
            } else {
                remainingTime = restDuration; // Regular break
            }
        } else {
            remainingTime = workDuration;
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
        clearInterval(intervalId);
        intervalId = null;
        startPauseBtn.textContent = 'Start';
    } else {
        intervalId = setInterval(updateTimer, 1000);
        startPauseBtn.textContent = 'Pause';
    }
});

// Skip current block
skipBtn.addEventListener('click', () => {
    if (isWorking) {
        remainingTime = restDuration;
    } else {
        completedBlocks++;
        completedBlocksDisplay.textContent = `Blocks: ${completedBlocks}`;
        if (completedBlocks % 4 === 0) {
            remainingTime = longRestDuration;
        } else {
            remainingTime = workDuration;
        }
    }

    // Update timer display
    const timeString = formatTime(remainingTime);
    timerTime.textContent = timeString;

    // Calculate the progress percentage and update circle
    const totalSeconds = isWorking ? restDuration : workDuration;
    const progress = remainingTime / totalSeconds;
    updateCircleProgress(progress);

    // Resume timer if it was running
    if (!isPaused) {
        clearInterval(intervalId);
        intervalId = setInterval(updateTimer, 1000);
        startPauseBtn.textContent = 'Pause';
    }
});

// Initialize timer
window.onload = () => {
    // Set initial state
    startPauseBtn.textContent = 'Start';

    const timeString = formatTime(remainingTime);
    timerTime.textContent = timeString;

    // Update circle progress to full
    updateCircleProgress(1);
};

// Make sure we handle window close to avoid memory leaks
window.addEventListener('beforeunload', () => {
    if (intervalId) {
        clearInterval(intervalId);
    }
});

// Install Button Logic
let deferredPrompt;

// Event listener for beforeinstallprompt event
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    const installButton = document.getElementById('install-button');
    installButton.style.display = 'block';
});

// Event listener for the install button click
const installButton = document.getElementById('install-button');
if (installButton) {
    installButton.addEventListener('click', () => {
        installButton.style.display = 'none';
        
        // Show the prompt
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

// Event listener for appinstalled event
window.addEventListener('appinstalled', (evt) => {
    console.log('INSTALL EVENT TRIGGERED!');
});
