import { AudioUI } from "../../ui/audio.js";
import { FixedBarUI } from "../../ui/fixed-bar.js";
import { PlaylistItemUI } from "../../ui/playlist-item.js";

export function handleBarClose() {
    AudioUI.pause();
    PlaylistItemUI.pauseAll();
    FixedBarUI.pause();
    FixedBarUI.hide();
}