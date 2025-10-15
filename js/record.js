const recordBtn = document.getElementById('recordBtn');
const stopBtn = document.getElementById('stopBtn');
const playBtn = document.getElementById('playBtn');
const status = document.getElementById('status');
const timerEl = document.getElementById('timer');
const audioPlayback = document.getElementById('audioPlayback');
const downloadLink = document.getElementById('downloadLink');

let mediaRecorder = null;
let audioChunks = [];
let timerInterval = null;
let startTime = 0;
let currentBlob = null;

function formatTime(sec) {
  const s = String(sec % 60).padStart(2, '0');
  const m = String(Math.floor(sec / 60)).padStart(2, '0');
  return `${m}:${s}`;
}

function startTimer() {
  startTime = Date.now();
  timerInterval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    timerEl.textContent = formatTime(elapsed);
  }, 250);
}

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

recordBtn.addEventListener('click', async () => {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    alert('Trình duyệt không hỗ trợ ghi âm.');
    return;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    audioChunks = [];

    mediaRecorder.ondataavailable = e => {
      if (e.data.size > 0) audioChunks.push(e.data);
    };

    mediaRecorder.onstart = () => {
      status.textContent = "Đang ghi...";
      recordBtn.disabled = true;
      stopBtn.disabled = false;
      playBtn.disabled = true;
      downloadLink.style.display = 'none';
      audioPlayback.style.display = 'none';
      timerEl.textContent = '00:00';
      startTimer();
    };

    mediaRecorder.onstop = () => {
      stopTimer();
      status.textContent = "Hoàn tất ghi âm!";
      recordBtn.disabled = false;
      stopBtn.disabled = true;

      currentBlob = new Blob(audioChunks, { type: audioChunks[0]?.type || 'audio/webm' });
      const blobUrl = URL.createObjectURL(currentBlob);
      audioPlayback.src = blobUrl;
      audioPlayback.style.display = 'block';
      playBtn.disabled = false;

      downloadLink.href = blobUrl;
      downloadLink.download = "recording.webm";
      downloadLink.style.display = 'inline-block';

      mediaRecorder.stream.getTracks().forEach(track => track.stop());
    };

    mediaRecorder.start();
  } catch (err) {
    alert('Không thể truy cập micro. Hãy kiểm tra quyền truy cập.');
  }
});

stopBtn.addEventListener('click', () => {
  if (mediaRecorder && mediaRecorder.state === "recording") {
    mediaRecorder.stop();
  }
});

playBtn.addEventListener('click', () => {
  if (audioPlayback.src) audioPlayback.play();
});
