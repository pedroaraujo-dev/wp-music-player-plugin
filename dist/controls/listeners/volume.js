import { handleVolumeClick, handleVolumeMouseDown, handleVolumeMuteBtnClick, handleVolumeUnmuteBtnClick } from "../handlers/volume.handle.js";
export function bindPlayerVolumeUIEvents() {
    document.addEventListener('click', (event) => {
        const volumeWrapper = event.target?.closest('.music-bar__volume-track');
        const volumeMuteBtn = event.target?.closest('.music-bar__volume-btn--mute');
        const volumeUnmuteBtn = event.target?.closest('.music-bar__volume-btn--unmute');
        if (volumeWrapper) {
            handleVolumeClick(event, volumeWrapper);
        }
        if (volumeMuteBtn) {
            handleVolumeMuteBtnClick();
        }
        if (volumeUnmuteBtn) {
            handleVolumeUnmuteBtnClick();
        }
    });
    document.addEventListener('mousedown', (event) => {
        const volumeWrapper = event.target?.closest('.music-bar__volume-track');
        if (volumeWrapper) {
            handleVolumeMouseDown(event, volumeWrapper);
        }
    });
}
