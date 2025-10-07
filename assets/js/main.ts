import { fetchPlaylists, listPlaylistContainer } from "./service/playlistService.js";
import { createPlayerState } from "./state/playlistState.js";
import { renderPlaylist } from "./ui/renderPlaylist.js";

document.addEventListener('DOMContentLoaded', async () => {
    const state = createPlayerState();
    const playlistContainers = listPlaylistContainer();
    await fetchPlaylists(playlistContainers, state);
    await renderPlaylist(state);
});