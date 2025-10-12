import { handleProgressClick, handleProgressMouseDown } from "../handlers/progress.handle.js";

export function bindPlayerProgressUIEvents() {
    document.addEventListener('click', (event) => {
        const progressWrapper = (event.target as HTMLElement)?.closest('.music-bar__timeline-bg');

        if (progressWrapper) {
            handleProgressClick(event, progressWrapper as HTMLElement);
        }
    });

    document.addEventListener('mousedown', (event) => {
        const progressWrapper = (event.target as HTMLElement)?.closest('.music-bar__timeline-bg');

        if (progressWrapper) {
            handleProgressMouseDown(event, progressWrapper as HTMLElement);
        }
    });
}