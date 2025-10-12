import { Audio } from "../../ui/audio.js";
import { FixedBar } from "../../ui/fixed-bar.js";
import { PlaylistItem } from "../../ui/playlist-item.js";

export function handleBarClose() {
    Audio.pause();
    PlaylistItem.pauseAll();
    FixedBar.pause();
    FixedBar.hide();
}