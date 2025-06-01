const DELAY_SECONDS = 5;
let delayTimeout;
let countdownInterval;

export function startWithDelay() {
  cancelStart(); // Очистка предыдущего

  let secondsLeft = DELAY_SECONDS;
  showToast(`Ролик начнется через ${secondsLeft} секунд...`);

  countdownInterval = setInterval(() => {
    secondsLeft--;
    if (secondsLeft > 0) {
      showToast(`Ролик начнется через ${secondsLeft} секунд...`);
    } else {
      clearInterval(countdownInterval);
    }
  }, 1000);

  delayTimeout = setTimeout(() => {
    hideToast();
    showAd();
  }, DELAY_SECONDS * 1000);
}

export function cancelStart() {
  if (delayTimeout) {
    clearTimeout(delayTimeout);
    delayTimeout = null;
  }
  if (countdownInterval) {
    clearInterval(countdownInterval);
    countdownInterval = null;
  }

  showToast("Показ ролика отменён.");

  setTimeout(() => {
    hideToast();
  }, 4000);
}

function showAd() {
  document.getElementById('overlay').style.display = 'block';
  document.getElementById('modal').style.display = 'block';
  const video = document.getElementById('adVideo');
  video.currentTime = 0;
  video.play();

  video.onended = () => {
    closeModal();
    showEndMessage();
  };
}

function closeModal() {
  document.getElementById('overlay').style.display = 'none';
  document.getElementById('modal').style.display = 'none';
}

function showEndMessage() {
  const message = document.getElementById('endMessage');
  message.style.display = 'flex';
  message.style.alignItems = 'center';
  message.style.justifyContent = 'center';

  setTimeout(() => {
    message.style.display = 'none';
  }, 4000);
}

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
}

function hideToast() {
  const toast = document.getElementById('toast');
  toast.classList.remove('show');
}
