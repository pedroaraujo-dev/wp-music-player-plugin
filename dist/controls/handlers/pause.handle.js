import { Audio } from "../../ui/audio.js";
import { FixedBar } from "../../ui/fixed-bar.js";
import { PlaylistItem } from "../../ui/playlist-item.js";
export function handlePause() {
    Audio.pause();
    FixedBar.pause();
    PlaylistItem.pauseAll();
}
