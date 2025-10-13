import { adaptAudioResponse } from "../interfaces/audio-item";
import { playerState, updateAudios, updatePlaylistAudios } from "../states/player-state";
export class SoundBankService {
    static async get(soundBankId) {
        const response = await fetch("https://conceitovoz.com.br/playlist-directory/get-content.php", {
            headers: new Headers({ Name: soundBankId }),
        });
        if (!response.ok) {
            throw new Error(`Erro ao carregar o banco de trilhas ${soundBankId} (status: ${response.status})`);
        }
        const data = await response.json();
        const container = document.createElement("div");
        container.classList.add("tab-content");
        container.id = soundBankId;
        container.setAttribute("aria-hidden", "false");
        container.innerHTML = `
        <p>Conteúdo carregado do banco de trilhas <strong>${soundBankId}</strong> (${data.length} trilhas)</p>
      `;
        return container;
    }
    static async fetchAudios(soundBankId) {
        const playlists = playerState.playlists;
        const results = await Promise.all(playlists.map(async (data) => {
            const res = await fetch(`http://localhost/player/wp-content/plugins/music-player/bdv.json?site=${data.site}&playlist=${data.key}`, {
                headers: new Headers({ Name: soundBankId }),
            });
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
}
