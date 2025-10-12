import { handleVolumeClick, handleVolumeMouseDown, handleVolumeMuteBtnClick, handleVolumeUnmuteBtnClick } from "../handlers/volume.handle.js";

export function bindPlayerVolumeUIEvents() {
    document.addEventListener('click', (event) => {
        const volumeWrapper = (event.target as HTMLElement)?.closest('.music-bar__volume-track');
        const volumeMuteBtn = (event.target as HTMLElement)?.closest('.music-bar__volume-btn--mute');
        const volumeUnmuteBtn = (event.target as HTMLElement)?.closest('.music-bar__volume-btn--unmute');

        if (volumeWrapper) {
            handleVolumeClick(event, volumeWrapper as HTMLElement);
        }

        if (volumeMuteBtn) {
            handleVolumeMuteBtnClick();
        }

        if (volumeUnmuteBtn) {
            handleVolumeUnmuteBtnClick();
        }
    });

    document.addEventListener('mousedown', (event) => {
        const volumeWrapper = (event.target as HTMLElement)?.closest('.music-bar__volume-track');

        if (volumeWrapper) {
            handleVolumeMouseDown(event, volumeWrapper as HTMLElement);
        }
    });
}