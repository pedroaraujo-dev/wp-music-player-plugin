import { handleProgressClick, handleProgressMouseDown } from "../handlers/progress.handle.js";
export function bindPlayerProgressUIListeners() {
    document.addEventListener('click', (event) => {
        const progressWrapper = event.target?.closest('.music-bar__timeline');
        if (progressWrapper) {
            handleProgressClick(event, progressWrapper);
        }
    });
    document.addEventListener('mousedown', (event) => {
        const progressWrapper = event.target?.closest('.music-bar__timeline');
        if (progressWrapper) {
            handleProgressMouseDown(event, progressWrapper);
        }
    });
}
