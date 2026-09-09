import { AudioUI } from "../../ui/audio.js";

let isUserInteracting = false;

export function handleProgressClick(event: MouseEvent, progressWrapper: HTMLElement) {
  if (isUserInteracting) return;
  updateProgressFromEvent(event, progressWrapper, true);
}

export function handleProgressMouseDown(event: PointerEvent, progressWrapper: HTMLElement) {
  if (isUserInteracting || AudioUI.getDuration() <= 0) return;
  event.preventDefault();

  const rect = progressWrapper.getBoundingClientRect();
  const progressBar = document.querySelector<HTMLElement>(".music-bar__timeline-fill");
  const currentTimeDisplay = document.querySelector<HTMLElement>(".music-bar__time--current");
  const totalTimeDisplay = document.querySelector<HTMLElement>(".music-bar__time--total");
  const duration = AudioUI.getDuration();

  let percentage = 0;
  let isFramePending = false;
  isUserInteracting = true;

  progressWrapper.setPointerCapture(event.pointerId);

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

  function onPointerMove(e: PointerEvent) {
    if (isFramePending) return;
    isFramePending = true;

    requestAnimationFrame(() => {
      updateProgress(e.clientX);
      isFramePending = false;
    });
  }

  function onPointerUp(e: PointerEvent) {
    document.removeEventListener("pointermove", onPointerMove);
    document.removeEventListener("pointerup", onPointerUp);

    updateProgress(e.clientX);
    const newTime = duration * percentage;
    AudioUI.setCurrentTime(newTime);

    document.removeEventListener("pointercancel", onPointerCancel);
    isUserInteracting = false;
  }

  function onPointerCancel() {
    document.removeEventListener('pointermove', onPointerMove);
    document.removeEventListener('pointerup', onPointerUp);
    document.removeEventListener('pointercancel', onPointerCancel);
    isUserInteracting = false;
  }
  document.addEventListener('pointercancel', onPointerCancel);
  document.addEventListener("pointermove", onPointerMove);
  document.addEventListener("pointerup", onPointerUp);

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
    const currentTimeDisplay = document.querySelector<HTMLElement>(".music-bar__time--current");
    const totalTimeDisplay = document.querySelector<HTMLElement>(".music-bar__time--total");

    if (setAudioTime) AudioUI.setCurrentTime(newTime);
    if (currentTimeDisplay) currentTimeDisplay.textContent = formatTime(newTime);
    if (totalTimeDisplay) totalTimeDisplay.textContent = formatTime(duration);
  }
}

const initializedAudios = new WeakSet<HTMLAudioElement>();

export function handleAudioProgress() {
  const audio = document.querySelector<HTMLAudioElement>('#audio-player');
  const bar = document.querySelector<HTMLElement>('.music-bar__timeline-fill');
  const current = document.querySelector<HTMLElement>('.music-bar__time--current');
  const total = document.querySelector<HTMLElement>('.music-bar__time--total');
  if (!audio || !bar || !current || !total || initializedAudios.has(audio)) return;
  initializedAudios.add(audio);
  const update = () => {
    if (isUserInteracting) return;
    const duration = Number.isFinite(audio.duration) ? audio.duration : 0;
    const time = Number.isFinite(audio.currentTime) ? audio.currentTime : 0;
    bar.style.setProperty('--width', `${duration > 0 ? time / duration * 100 : 0}%`);
    current.textContent = formatTime(time);
    total.textContent = formatTime(duration);
  };
  ['timeupdate', 'loadedmetadata', 'seeked', 'emptied', 'ended'].forEach(event => audio.addEventListener(event, update));
  update();
}

function formatTime(time: number): string {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
