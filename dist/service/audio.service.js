import { updateAudios, playerState, updatePlaylistAudios } from '../states/player-state.js';
import { adaptAudioResponse } from '../interfaces/audio-item.js';
export class AudioService {
    static async fetchAudios() {
        const playlists = playerState.playlists;
        const results = await Promise.all(playlists.map(async (data) => {
            const res = await fetch(`http://localhost/player/wp-content/plugins/music-player/bdv.json?site=${data.site}&playlist=${data.key}`);
            if (!res.ok)
                throw new Error(`Erro ao carregar playlist ${data.key}`);
            const raw = await res.json();
            const audios = adaptAudioResponse(raw);
            updatePlaylistAudios(data.key, audios);
            return { ...data, audios, rendered: false };
        }));
        const allAudios = results.flatMap((r) => r.audios);
        updateAudios(allAudios);
    }
    static async fetchAudioItemHTML(audios, ajaxUrl) {
        try {
            const res = await fetch(`${ajaxUrl}?action=render_playlist_items`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({ playlist: JSON.stringify(audios) }),
            });
            const json = await res.json();
            if (!json.success) {
                throw new Error('Erro ao renderizar playlist.');
            }
            return json.data.html;
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
}
