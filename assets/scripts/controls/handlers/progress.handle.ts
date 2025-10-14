import { AudioUI } from "../../ui/audio.js";

let isUserInteracting = false;

export function handleProgressClick(event: MouseEvent, progressWrapper: HTMLElement) {
  if (isUserInteracting) return;
  updateProgressFromEvent(event, progressWrapper, true);
}

export function handleProgressMouseDown(event: MouseEvent, progressWrapper: HTMLElement) {
  const rect = progressWrapper.getBoundingClientRect();
  const progressBar = document.querySelector<HTMLElement>(".music-bar__timeline-fill");
  const currentTimeDisplay = progressWrapper.querySelector<HTMLElement>(".music-bar__time--current");
  const totalTimeDisplay = progressWrapper.querySelector<HTMLElement>(".music-bar__time--total");
  const duration = AudioUI.getDuration();

  let percentage = 0;
  let isFramePending = false;

  isUserInteracting = true;

  function updateProgress(clientX: number) {
    const mouseX = clientX - rect.left;
    const width = rect.width;
    percentage = Math.max(0, Math.min(1, mouseX / width));

    if (progressBar) {
      progressBar.style.setProperty("--width", `${percentage * 100}%`);
    }

    if (duration > 0) {
      const previewTime = duration * percentage;
      if (currentTimeDisplay) currentTimeDisplay.textContent = formatTime(previewTime);
      if (totalTimeDisplay) totalTimeDisplay.textContent = formatTime(duration);
    }
  }

  function onMouseMove(e: MouseEvent) {
    if (isFramePending) return;
    isFramePending = true;

    requestAnimationFrame(() => {
      updateProgress(e.clientX);
      isFramePending = false;
    });
  }

  function onMouseUp(e: MouseEvent) {
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);

    updateProgress(e.clientX);
    const newTime = duration * percentage;
    AudioUI.setCurrentTime(newTime);

    isUserInteracting = false;
  }

  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", onMouseUp);
  updateProgress(event.clientX);
}

function updateProgressFromEvent(event: MouseEvent, progressWrapper: HTMLElement, setAudioTime = false) {
  const rect = progressWrapper.getBoundingClientRect();
  const clickedX = event.clientX - rect.left;
  const width = rect.width;
  const percentage = Math.max(0, Math.min(1, clickedX / width));

  const progressBar = document.querySelector<HTMLElement>(".music-bar__timeline-fill");
  if (progressBar) {
    progressBar.style.setProperty("--width", `${percentage * 100}%`);
  }

  const duration = AudioUI.getDuration();
  if (duration > 0) {
    const newTime = duration * percentage;
    const currentTimeDisplay = progressWrapper.querySelector<HTMLElement>(".music-bar__time--current");
    const totalTimeDisplay = progressWrapper.querySelector<HTMLElement>(".music-bar__time--total");

    if (setAudioTime) AudioUI.setCurrentTime(newTime);
    if (currentTimeDisplay) currentTimeDisplay.textContent = formatTime(newTime);
    if (totalTimeDisplay) totalTimeDisplay.textContent = formatTime(duration);
  }
}

export function handleAudioProgress() {
  const progressWrapper = document.querySelector<HTMLElement>(".music-bar__timeline");
  const audioElement = document.querySelector<HTMLAudioElement>("#audio-player");
  if (!audioElement || !progressWrapper) return;

  const progressBar = document.querySelector<HTMLElement>(".music-bar__timeline-fill");
  const currentTimeDisplay = document.querySelector<HTMLElement>(".music-bar__time--current");
  const totalTimeDisplay = document.querySelector<HTMLElement>(".music-bar__time--total");

  if (!progressBar || !currentTimeDisplay || !totalTimeDisplay) return;

  audioElement.addEventListener("loadedmetadata", () => {
    const duration = audioElement.duration;
    if (!isNaN(duration)) {
      totalTimeDisplay.textContent = formatTime(duration);
    }
  });

  function updateProgressBar() {
    if (isUserInteracting) {
      requestAnimationFrame(updateProgressBar);
      return;
    }

    if (!audioElement || audioElement.paused || audioElement.ended) {
      requestAnimationFrame(updateProgressBar);
      return;
    }

    const currentTime = audioElement.currentTime;
    const duration = audioElement.duration;

    if (!isNaN(duration) && duration > 0) {
      const progressPercent = currentTime / duration;
      if (!progressBar || !currentTimeDisplay) return;
      progressBar.style.setProperty("--width", `${progressPercent * 100}%`);
      currentTimeDisplay.textContent = formatTime(currentTime);
    }

    requestAnimationFrame(updateProgressBar);
  }

  audioElement.addEventListener("play", () => {
    requestAnimationFrame(updateProgressBar);
  });

  audioElement.addEventListener("ended", () => {
    progressBar.style.setProperty("--width", "0%");
    currentTimeDisplay.textContent = "0:00";
  });
}

function formatTime(time: number): string {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
