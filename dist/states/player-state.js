import { EventBus } from "../events/event-bus.js";
const playerState = {
    playlists: [],
    audios: [],
    currentlyPlayingId: null,
};
export function updatePlaylists(newPlaylists) {
    const keys = new Set(playerState.playlists.map(p => p.key));
    const uniqueNew = newPlaylists.filter(p => !keys.has(p.key));
    if (uniqueNew.length > 0) {
        playerState.playlists.push(...uniqueNew);
        EventBus.emit("playlist:updated");
    }
}
export function updatePlaylistAudios(playlistKey, audios) {
    const playlist = playerState.playlists.find(p => p.key === playlistKey);
    if (playlist)
        playlist.audios = audios;
}
export function updateAudios(newAudios) {
    const ids = new Set(playerState.audios.map(a => a.id));
    const uniqueNew = newAudios.filter(a => !ids.has(a.id));
    playerState.audios.push(...uniqueNew);
}
export function findAudioById(id) {
    return playerState.audios.find(a => a.id === id);
}
export function findAudioIndexById(id) {
    return playerState.audios.findIndex(audio => audio.id === id);
}
export function updateCurrentlyPlayingId(id) {
    playerState.currentlyPlayingId = id;
}
export { playerState };
