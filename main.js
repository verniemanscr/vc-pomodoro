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
const vistaBg = document.getElementById('vista-bg');

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
            vistaBg.style.filter = 'blur(5px) grayscale(0.6) brightness(0.8)';
            completedBlocks++;
            completedBlocksDisplay.textContent = `Blocks: ${completedBlocks}`;
            
            // Check if we need a long break (every 3 blocks)
            if (completedBlocks % 3 === 0) {
                remainingTime = longRestDuration;
                alert(`🎉 Long break time! Take a 15-minute break!`);
            }
        } else {
            vistaBg.style.filter = 'blur(0px) grayscale(0) brightness(1)';
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
    
    // Set initial background
    vistaBg.style.filter = 'blur(0px) grayscale(0) brightness(1)';
};

// Make sure we handle window close to avoid memory leaks
window.addEventListener('beforeunload', () => {
    if (intervalId) {
        clearInterval(intervalId);
    }
});
