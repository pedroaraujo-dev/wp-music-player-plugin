import { playerState } from '../states/player-state.js';
import { IPlaylist } from '../interfaces/playlist.js';
import { adaptAudioResponse, IAudioItem } from '../interfaces/audio-item.js';
import { renderPlaylistItemHTML } from '../ui/templates/playlist-item.js';

export class AudioService {
  static async fetchAudios(): Promise<void> {

    const pending = playerState.playlists.filter(p => !p.rendered);
    await Promise.all([...new Set(pending.map(p => p.key))].map(async key => {
      const targets = pending.filter(p => p.key === key);
      try {
        if (!window.musicPlayer?.ajaxUrl) throw new Error('Configuração do player indisponível.');
        const url = new URL(window.musicPlayer.ajaxUrl, window.location.href);
        url.searchParams.set('action', 'music_player_playlist');
        url.searchParams.set('playlist', key);
        const response = await fetch(url.href, {cache: 'no-store'});
        const result = await response.json();
        if (!response.ok || !result.success) throw new Error(result?.data?.message || 'Playlist temporariamente indisponível.');
        const audios = result.data === null ? [] : adaptAudioResponse(result.data);
        targets.forEach(p => {
          p.audios = audios;
          p.status = result.data === null ? 'missing' : 'ready';
          p.metadata = result.data?.playlist;
          p.error = undefined;
        });
      } catch (error) {
        targets.forEach(p => { p.audios = []; p.status = 'error'; p.error = (error as Error).message; });
      }
    }));
    playerState.audios = [...new Map(playerState.playlists.flatMap(p => p.audios).map(a => [a.id, a])).values()];
  }

  static async downloadAudio(audio: IAudioItem): Promise<boolean> {

    const playlist = playerState.playlists.find(p => p.audios.some(item => item.id === audio.id));
    const config = window.musicPlayer;
    if (!playlist || !config?.ajaxUrl || !config.nonce) throw new Error("Configuração de download indisponível.");
    const audioName = audio.name || "audio";

    const postUrl = config.ajaxUrl;
    const postData = new URLSearchParams({
      action: 'music_player_download',
      nonce: config.nonce,
      playlist: playlist.key,
      id: audio.id
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
        const error = await response.json().catch(() => null);
        throw new Error(error?.data?.message || `Erro HTTP: ${response.status}`);
      }

      const blob = await response.blob();
      if (blob.size === 0) {
        throw new Error("Áudio inválido ou vazio");
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const filename = response.headers.get("Content-Disposition")?.match(/filename\*=UTF-8''([^;]+)/i)?.[1];
      a.download = filename ? decodeURIComponent(filename) : `${audioName}.mp3`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      setTimeout(() => window.URL.revokeObjectURL(url), 1000);

      return true;
    } catch (error) {
      console.error("Falha ao baixar áudio:", error);
      throw error;
    }
  }

  static fetchAudioItemHTML(audios: IAudioItem[]): string {
    const htmlItems = audios.map((audio, index) => 
      renderPlaylistItemHTML(
        audio.id,
        audio.name,
        audio.tag,
        audio.duration,
        index + 1,
        audio.url,
        audio.label,
        audio.premium
      )
    );

    return htmlItems.join('');
  }
}
