import { updateAudios, playerState, updatePlaylistAudios } from '../states/player-state.js';
import { adaptAudioResponse, sortAudiosBySite } from '../interfaces/audio-item.js';
export class AudioService {
    static async fetchAudios() {
        const playlists = playerState.playlists;
        const results = await Promise.all(playlists.map(async (data) => {
            try {
                const res = await fetch(`https://conceitovoz.com.br/playlist-directory/get-content.php?site=${data.site}&playlist=${data.key}`, {
                    headers: { 'Name': data.key }
                });
                if (!res.ok)
                    return { ...data, audios: [], rendered: false };
                const raw = await res.json();
                const audios = adaptAudioResponse(raw);
                const sortedAudios = sortAudiosBySite(audios, data.site);
                updatePlaylistAudios(data.key, sortedAudios);
                return { ...data, sortedAudios, rendered: false };
            }
            catch (error) {
                console.error(error.message);
                return { ...data, audios: [], rendered: false };
            }
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
