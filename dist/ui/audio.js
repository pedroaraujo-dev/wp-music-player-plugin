import { handleBarNext } from "../controls/handlers/next.handle.js";
export class Audio {
    static init() {
        const audio = document.querySelector('#audio-player');
        if (!audio)
            return;
        audio.removeEventListener("ended", this.handleNext);
        audio.addEventListener("ended", this.handleNext);
    }
    static play() {
        const audio = document.querySelector('#audio-player');
        if (!audio)
            return;
        audio.play().catch(() => { });
    }
    static pause() {
        const audio = document.querySelector('#audio-player');
        if (!audio)
            return;
        audio.pause();
    }
    static updateSource(sourceUrl) {
        const audio = document.querySelector('#audio-player');
        if (!audio)
            return;
        audio.src = sourceUrl;
        audio.load();
    }
    static setVolume(volume) {
        const audio = document.querySelector('#audio-player');
        if (!audio)
            return;
        audio.volume = Math.max(0, Math.min(1, volume));
    }
    static getCurrentTime() {
        const audio = document.querySelector('#audio-player');
        return audio ? audio.currentTime : 0;
    }
    static getDuration() {
        const audio = document.querySelector('#audio-player');
        return audio ? audio.duration || 0 : 0;
    }
    static setCurrentTime(time) {
        const audio = document.querySelector('#audio-player');
        if (!audio)
            return;
        audio.currentTime = time;
    }
    static handleNext() {
        handleBarNext();
    }
    static isMuted() {
        const audio = document.querySelector('#audio-player');
        return audio ? audio.muted : false;
    }
    static mute() {
        const audio = document.querySelector('#audio-player');
        if (!audio)
            return;
        audio.muted = true;
    }
    static unmute() {
        const audio = document.querySelector('#audio-player');
        if (!audio)
            return;
        audio.muted = false;
    }
}
