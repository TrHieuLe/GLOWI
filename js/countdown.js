
    // ===== COUNTDOWN TIMER =====
    function initCountdown() {
      const launchDate = new Date('2025-11-15T09:00:00').getTime();

      const countdownInterval = setInterval(() => {
        const now = new Date().getTime();
        const distance = launchDate - now;

        if (distance < 0) {
          clearInterval(countdownInterval);
          document.getElementById('countdownMessage').innerHTML =
            '🎉 <strong>Khóa học đã khai giảng!</strong> Đăng ký cho khóa tiếp theo.';
          return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('days').textContent = String(days).padStart(2, '0');
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');

        const slotsLeft = Math.max(1, Math.floor(distance / (1000 * 60 * 60 * 24 * 2)));
        document.getElementById('slotsLeft').textContent = slotsLeft;
      }, 1000);
    }
    function registerNow() {
  const section = document.querySelector('#contact');
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' }); // 👈 cuộn mượt
  }
}
    

    // Khởi động countdown
    initCountdown();
