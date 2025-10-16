import { findAudioIndexById, playerState } from "../../states/player-state.js";
import { handleItemPlay } from "./play.handle.js";
export function handleBarPrev() {
    const currentlyPlayingId = playerState.currentlyPlayingId;
    if (!currentlyPlayingId)
        return;
    const currentIndex = findAudioIndexById(currentlyPlayingId);
    if (currentIndex === -1)
        return;
    const prevIndex = (currentIndex - 1 + playerState.audios.length) % playerState.audios.length;
    const prevAudio = playerState.audios[prevIndex];
    handleItemPlay(prevAudio.id);
}
