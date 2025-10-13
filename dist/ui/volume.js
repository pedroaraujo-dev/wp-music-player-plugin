export class VolumeUI {
    static mute() {
        const volumeMuteBtn = document.querySelector('.music-bar__volume-btn--mute');
        const volumeUnmuteBtn = document.querySelector('.music-bar__volume-btn--unmute');
        if (!volumeMuteBtn || !volumeUnmuteBtn)
            return;
        volumeMuteBtn.style.display = 'none';
        volumeUnmuteBtn.style.display = 'flex';
    }
    static unmute() {
        const volumeMuteBtn = document.querySelector('.music-bar__volume-btn--mute');
        const volumeUnmuteBtn = document.querySelector('.music-bar__volume-btn--unmute');
        if (!volumeMuteBtn || !volumeUnmuteBtn)
            return;
        volumeMuteBtn.style.display = 'flex';
        volumeUnmuteBtn.style.display = 'none';
    }
}
