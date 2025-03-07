let videoElements = [];
let mainVideo = null;
let isInitialized = false;

function initializeVideo() {
  mainVideo = document.getElementById('main-video');
  const videoMasks = document.querySelector('.video-masks');
  const spans = document.querySelectorAll('.mask');

  // Создает видео элементы один раз
  spans.forEach(() => {
    const video = document.createElement('video');
    video.src = mainVideo.currentSrc;
    video.className = 'mask-video';
    video.autoplay = true;
    video.loop = true;
    video.muted = true;
    video.playsinline = true;

    videoMasks.appendChild(video);
    videoElements.push(video);

    // Синхронизация времени воспроизведения
    video.addEventListener('loadedmetadata', () => {
      video.currentTime = mainVideo.currentTime;
    });
  });

  // Основная синхронизация видео
  mainVideo.addEventListener('timeupdate', () => {
    videoElements.forEach(video => {
      if (Math.abs(video.currentTime - mainVideo.currentTime) > 0.1) {
        video.currentTime = mainVideo.currentTime;
      }
    });
  });

  isInitialized = true;
}

function updateMaskPositions() {
  if (!isInitialized) return;

  const spans = document.querySelectorAll('.mask');

  spans.forEach((span, index) => {
    if (index >= videoElements.length) return;

    const rect = span.getBoundingClientRect();
    const video = videoElements[index];

    // Обновляет только clip-path
    const clipPath = `inset(${rect.top}px ${window.innerWidth - rect.right}px ${window.innerHeight - rect.bottom}px ${rect.left}px)`;

    // Использует requestAnimationFrame для плавного обновления
    requestAnimationFrame(() => {
      video.style.clipPath = clipPath;
    });
  });
}

// Инициализация при загрузке
window.addEventListener('load', () => {
  initializeVideo();
  updateMaskPositions();
});

// Плавное обновление при изменении размера
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(updateMaskPositions, 16); // примерно 60fps
});

// Периодическое обновление позиций для поддержания синхронизации
setInterval(updateMaskPositions, 1000);
