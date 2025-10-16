import { findAudioIndexById, playerState } from "../../states/player-state.js";
import { handleItemPlay } from "./play.handle.js";
export function handleBarNext() {
    const currentlyPlayingId = playerState.currentlyPlayingId;
    if (!currentlyPlayingId)
        return;
    const currentIndex = findAudioIndexById(currentlyPlayingId);
    if (currentIndex === -1)
        return;
    const nextIndex = (currentIndex + 1) % playerState.audios.length;
    const nextAudio = playerState.audios[nextIndex];
    handleItemPlay(nextAudio.id);
}
