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
    static async downloadAudio(audio) {
        const audioLink = audio.url;
        const audioName = audio.name || "audio";
        const postUrl = "https://conceitovoz.com.br/download-audio.php";
        const postData = new URLSearchParams({
            url: audioLink,
            audioname: audioName
        });
        try {
            const response = await fetch(postUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: postData
            });
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            const blob = await response.blob();
            if (blob.size === 0) {
                throw new Error("Áudio inválido ou vazio");
            }
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${audioName}.mp3`;
            document.body.appendChild(a);
            a.click();
            setTimeout(() => window.URL.revokeObjectURL(url), 1000);
            return true;
        }
        catch (error) {
            console.error("Falha ao baixar áudio:", error);
            throw error;
        }
    }
    static fetchAudioItemHTML(audios) {
        const htmlItems = audios.map((audio, index) => renderPlaylistItemHTML(audio.id, audio.name, audio.duration, index + 1, audio.url));
        return htmlItems.join('');
    }
}
