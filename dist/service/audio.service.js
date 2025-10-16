import { updateAudios, playerState, updatePlaylistAudios } from '../states/player-state.js';
import { adaptAudioResponse, sortAudiosBySite } from '../interfaces/audio-item.js';
import { renderPlaylistItemHTML } from '../ui/templates/playlist-item.js';
export class AudioService {
    static async fetchAudios() {
        const site = window.musicPlayer?.siteId;
        const playlists = playerState.playlists;
        const results = await Promise.all(playlists.map(async (data) => {
            try {
                const res = await fetch(`https://conceitovoz.com.br/playlist-directory/get-content.php?site=${site}&playlist=${data.key}`, {
                    headers: { 'Name': data.key }
                });
                if (!res.ok)
                    return { ...data, audios: [], rendered: false };
                const raw = await res.json();
                const audios = adaptAudioResponse(raw);
                const sortedAudios = sortAudiosBySite(audios, site);
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
    static async downloadAudio(url) {
        try {
            const res = await fetch(url);
            if (!res.ok)
                throw new Error('Network response was not ok');
            const blob = await res.blob();
            const downloadUrl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = url.split('/').pop() || 'download';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(downloadUrl);
        }
        catch (error) {
            console.error('Download failed:', error.message);
        }
    }
    static fetchAudioItemHTML(audios) {
        const htmlItems = audios.map((audio, index) => renderPlaylistItemHTML(audio.id, audio.name, audio.duration, index + 1, audio.url));
        return htmlItems.join('');
    }
}
