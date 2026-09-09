import { EventBus } from "../events/event-bus.js";
import { IAudioItem } from "../interfaces/audio-item.js";
import { IPlaylist } from "../interfaces/playlist.js";

const playerState = {
    playlists: [] as IPlaylist[],
    audios: [] as IAudioItem[],
    currentlyPlayingId: null as string | null,
}

export function updatePlaylists(newPlaylists: IPlaylist[]) {
    const keys = new Set(playerState.playlists.map(p => p.container));
    const uniqueNew = newPlaylists.filter(p => !keys.has(p.container));

    if (uniqueNew.length > 0) {
        playerState.playlists.push(...uniqueNew);
        EventBus.emit("playlist:updated");
    }
}

export function updatePlaylistAudios(playlistKey: string, audios: IAudioItem[]) {
    playerState.playlists.filter(p => p.key === playlistKey).forEach(playlist => { playlist.audios = audios; });
}

export function updateAudios(newAudios: IAudioItem[]) {
    const ids = new Set(playerState.audios.map(a => a.id));
    const uniqueNew = newAudios.filter(a => {
        if (ids.has(a.id)) return false;
        ids.add(a.id);
        return true;
    });
    playerState.audios.push(...uniqueNew);
}

export function findAudioById(id: string): IAudioItem | undefined {
    return playerState.audios.find(a => a.id === id);
}

export function findAudioIndexById(id: string): number {
    return playerState.audios.findIndex(audio => audio.id === id);
}

export function updateCurrentlyPlayingId(id: string | null) {
    playerState.currentlyPlayingId = id;
}

export { playerState };