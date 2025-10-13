import { handleBarNext } from "../controls/handlers/next.handle.js";

export class AudioUI {
    static init() {
        const audio = document.querySelector('#audio-player') as HTMLAudioElement | null;
        if (!audio) return;

        audio.removeEventListener("ended", this.handleNext);
        audio.addEventListener("ended", this.handleNext);
    }

    static play() {
        const audio = document.querySelector('#audio-player') as HTMLAudioElement | null;
        if (!audio) return;
        audio.play().catch(() => {});
    }

    static pause() {
        const audio = document.querySelector('#audio-player') as HTMLAudioElement | null;
        if (!audio) return;
        audio.pause();
    }

    static updateSource(sourceUrl: string) {
        const audio = document.querySelector('#audio-player') as HTMLAudioElement | null;
        if (!audio) return;
        audio.src = sourceUrl;
        audio.load();
    }

    static setVolume(volume: number) {
        const audio = document.querySelector('#audio-player') as HTMLAudioElement | null;
        if (!audio) return;
        audio.volume = Math.max(0, Math.min(1, volume));
    }

    static getCurrentTime(): number {
        const audio = document.querySelector('#audio-player') as HTMLAudioElement | null;
        return audio ? audio.currentTime : 0;
    }

    static getDuration(): number {
        const audio = document.querySelector('#audio-player') as HTMLAudioElement | null;
        return audio ? audio.duration || 0 : 0;
    }

    static setCurrentTime(time: number) {
        const audio = document.querySelector('#audio-player') as HTMLAudioElement | null;
        if (!audio) return;
        audio.currentTime = time;
    }

    static handleNext() {
        handleBarNext();
    }

    static isMuted(): boolean {
        const audio = document.querySelector('#audio-player') as HTMLAudioElement | null;
        return audio ? audio.muted : false;
    }

    static mute() {
        const audio = document.querySelector('#audio-player') as HTMLAudioElement | null;
        if (!audio) return;
        audio.muted = true;
    }

    static unmute() {
        const audio = document.querySelector('#audio-player') as HTMLAudioElement | null;
        if (!audio) return;
        audio.muted = false;
    }
}