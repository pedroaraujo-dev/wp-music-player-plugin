export class VolumeUI {
    static mute(): void {
        const volumeMuteBtn = document.querySelector('.music-bar__volume-btn--mute') as HTMLElement;
        const volumeUnmuteBtn = document.querySelector('.music-bar__volume-btn--unmute') as HTMLElement;
        if (!volumeMuteBtn || !volumeUnmuteBtn) return;

        volumeMuteBtn.style.display = 'none';
        volumeUnmuteBtn.style.display = 'flex';
    }

    static unmute(): void {
        const volumeMuteBtn = document.querySelector('.music-bar__volume-btn--mute') as HTMLElement;
        const volumeUnmuteBtn = document.querySelector('.music-bar__volume-btn--unmute') as HTMLElement;
        if (!volumeMuteBtn || !volumeUnmuteBtn) return;

        volumeMuteBtn.style.display = 'flex';
        volumeUnmuteBtn.style.display = 'none';
    }
}