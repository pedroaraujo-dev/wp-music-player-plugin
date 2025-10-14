import { AudioUI } from "../../ui/audio.js";
import { VolumeUI } from "../../ui/volume.js";
let isVolumeInteracting = false;
export function handleVolumeMuteBtnClick() {
    AudioUI.mute();
    VolumeUI.mute();
}
export function handleVolumeUnmuteBtnClick() {
    AudioUI.unmute();
    VolumeUI.unmute();
}
export function handleVolumeClick(event, volumeWrapper) {
    if (isVolumeInteracting)
        return;
    updateVolumeFromEvent(event, volumeWrapper, true);
}
export function handleVolumeMouseDown(event, volumeWrapper) {
    const rect = volumeWrapper.getBoundingClientRect();
    const volumeBar = document.querySelector(".music-bar__volume-fill");
    let percentage = 0;
    let isFramePending = false;
    isVolumeInteracting = true;
    function updateVolume(clientX) {
        const mouseX = clientX - rect.left;
        const width = rect.width;
        percentage = Math.max(0, Math.min(1, mouseX / width));
        if (volumeBar) {
            volumeBar.style.setProperty("--width", `${percentage * 100}%`);
        }
        AudioUI.setVolume(percentage);
    }
    function onMouseMove(e) {
        if (isFramePending)
            return;
        isFramePending = true;
        requestAnimationFrame(() => {
            updateVolume(e.clientX);
            isFramePending = false;
        });
    }
    function onMouseUp(e) {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
        updateVolume(e.clientX);
        isVolumeInteracting = false;
    }
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    updateVolume(event.clientX);
}
function updateVolumeFromEvent(event, volumeWrapper, setAudioVolume = false) {
    const rect = volumeWrapper.getBoundingClientRect();
    const clickedX = event.clientX - rect.left;
    const width = rect.width;
    const percentage = Math.max(0, Math.min(1, clickedX / width));
    const volumeBar = document.querySelector(".music-bar__volume-fill");
    if (volumeBar) {
        volumeBar.style.setProperty("--width", `${percentage * 100}%`);
    }
    if (setAudioVolume) {
        AudioUI.setVolume(percentage);
    }
}
