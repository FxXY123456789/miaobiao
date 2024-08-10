let startTime = 0;
let elapsedTime = 0;
let lastSegmentTime = 0;
let timerInterval;
let isPaused = false;

const display = document.getElementById('display');
const segmentList = document.getElementById('segmentList');

document.getElementById('startBtn').addEventListener('click', startTimer);
document.getElementById('segmentBtn').addEventListener('click', recordSegment);
document.getElementById('pauseBtn').addEventListener('click', pauseResumeTimer);
document.getElementById('stopBtn').addEventListener('click', stopTimer);
document.getElementById('exportBtn').addEventListener('click', exportSegments);

function startTimer() {
    if (!timerInterval) {
        startTime = Date.now() - elapsedTime;
        lastSegmentTime = startTime;
        timerInterval = setInterval(updateTimer, 10);
    }
}

function pauseResumeTimer() {
    if (timerInterval) {
        if (isPaused) {
            startTimer();
            isPaused = false;
        } else {
            clearInterval(timerInterval);
            timerInterval = null;
            isPaused = true;
            alert('计时已暂停');
        }
    }
}

function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    elapsedTime = 0;
    isPaused = false;
    updateDisplay();
    alert('计时已结束');
}

function updateTimer() {
    elapsedTime = Date.now() - startTime;
    updateDisplay();
}

function updateDisplay() {
    const totalMilliseconds = Math.floor(elapsedTime);
    const totalSeconds = Math.floor(totalMilliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = Math.floor((totalMilliseconds % 1000) / 10);

    display.textContent = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}.${pad(milliseconds)}`;
}

function pad(number, digits = 2) {
    return number.toString().padStart(digits, '0');
}

function recordSegment() {
    const currentTime = Date.now();
    const segmentTime = (currentTime - lastSegmentTime) / 1000; // 获取自上次分段的时间差
    const formattedTime = segmentTime.toFixed(2); // 保留两位小数
    const listItem = document.createElement('li');
    listItem.textContent = `${formattedTime} 秒`;
    segmentList.appendChild(listItem);
    lastSegmentTime = currentTime;
}

function exportSegments() {
    let data = '时间段记录:\n';
    const items = segmentList.querySelectorAll('li');
    items.forEach((item, index) => {
        data += `第${index + 1}段: ${item.textContent}\n`;
    });

    const blob = new Blob([data], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = '计时记录.txt';
    a.click();

    URL.revokeObjectURL(url);
}
