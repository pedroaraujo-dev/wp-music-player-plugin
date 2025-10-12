import { playerState } from "../../states/player-state.js";
import { Audio } from "../../ui/audio.js";
import { FixedBar } from "../../ui/fixed-bar.js";
import { PlaylistItem } from "../../ui/playlist-item.js";
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
        FixedBar.updateInfo(currentAudio);
        Audio.updateSource(currentAudio.url);
        playerState.currentlyPlayingId = musicPlayerItemId;
    }
    PlaylistItem.play(musicPlayerItemId);
    FixedBar.play();
    Audio.play();
    handleAudioProgress();
}
export function handleBarPlay() {
    const currentlyPlayingId = playerState.currentlyPlayingId;
    if (!currentlyPlayingId)
        return;
    handleItemPlay(currentlyPlayingId);
}
