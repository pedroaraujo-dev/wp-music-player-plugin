import { playerState } from "../../states/player-state.js";
import { AudioUI } from "../../ui/audio.js";
import { FixedBarUI } from "../../ui/fixed-bar.js";
import { PlaylistItemUI } from "../../ui/playlist-item.js";
import { handlePause } from "./pause.handle.js";
import { handleAudioProgress } from "./progress.handle.js";
export function handleItemPlay(musicPlayerItemId) {
    if (!musicPlayerItemId) {
        return;
    }
    handlePause();
    const currentAudio = playerState.audios.find(audio => audio.id === musicPlayerItemId);
    if (!currentAudio)
        return;
    const isCurrentlyPlaying = playerState.currentlyPlayingId === musicPlayerItemId;
    if (!isCurrentlyPlaying) {
        FixedBarUI.updateInfo(currentAudio);
        AudioUI.updateSource(currentAudio.url);
        playerState.currentlyPlayingId = musicPlayerItemId;
    }
    PlaylistItemUI.play(musicPlayerItemId);
    FixedBarUI.play();
    AudioUI.play();
    handleAudioProgress();
}
export function handleBarPlay() {
    const currentlyPlayingId = playerState.currentlyPlayingId;
    if (!currentlyPlayingId)
        return;
    handleItemPlay(currentlyPlayingId);
}
