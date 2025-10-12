import { IAudioItem } from "../interfaces/audioItem.js";
import { IPlaylist } from "../interfaces/playlist.js";
import { notifyPlaylistListeners } from "./player-listener.js";

const playerState = {
    playlists: [] as IPlaylist[],
    audios: [] as IAudioItem[],
    currentlyPlayingId: null as string | null,
}

export function updatePlaylists(newPlaylists: IPlaylist[]) {
    const keys = new Set(playerState.playlists.map(p => p.key));
    const uniqueNew = newPlaylists.filter(p => !keys.has(p.key));

    if (uniqueNew.length > 0) {
        playerState.playlists.push(...uniqueNew);
        notifyPlaylistListeners();
    }
}

export function updatePlaylistAudios(playlistKey: string, audios: IAudioItem[]) {
    const playlist = playerState.playlists.find(p => p.key === playlistKey);
    if (playlist) playlist.audios = audios;
}

export function updateAudios(newAudios: IAudioItem[]) {
    const ids = new Set(playerState.audios.map(a => a.id));
    const uniqueNew = newAudios.filter(a => !ids.has(a.id));
    playerState.audios.push(...uniqueNew);
}

export { playerState };