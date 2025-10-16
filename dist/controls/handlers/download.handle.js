import { DownloadFlowController } from "../../flows/download-flow-controller.js";
import { findAudioById, playerState } from "../../states/player-state.js";
export async function handleItemDownload(musicPlayerItemId) {
    if (!musicPlayerItemId) {
        return;
    }
    const audio = findAudioById(musicPlayerItemId);
    if (!audio)
        return;
    DownloadFlowController.downloadAudio(audio);
}
export function handleBarDownload() {
    const currentlyPlayingId = playerState.currentlyPlayingId;
    if (!currentlyPlayingId)
        return;
    const audio = findAudioById(currentlyPlayingId);
    if (!audio)
        return;
    DownloadFlowController.downloadAudio(audio);
}
