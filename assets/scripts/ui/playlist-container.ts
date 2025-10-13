import { AudioService } from "../service/audio.service.js";
import { playerState, updatePlaylists } from "../states/player-state.js";

declare global {
  interface Window {
    musicPlayer?: { ajaxUrl?: string };
  }
}

export class PlaylistContainerUI {

  static async renderAll(): Promise<void> {
    const playlists = playerState.playlists;
    if (!playlists || playlists.length === 0) return;
  
    for (const playlist of playlists) {
      if (playlist.rendered) continue;
      const container = playlist.container;
      const playlistBox = container.querySelector<HTMLElement>('.music-player__playlist');
      if (!playlistBox) return;
  
      const ajaxUrl = window.musicPlayer?.ajaxUrl;
      if (!ajaxUrl) {
        playlistBox.innerHTML = '<p>ajaxUrl não configurado.</p>';
        return;
      }
  
      playlistBox.innerHTML = '<p>Carregando...</p>';
  
      try {
        const html = await AudioService.fetchAudioItemHTML(playlist.audios, ajaxUrl);
        playlistBox.innerHTML = html;
        playlist.rendered = true;
      } catch (error) {
        playlistBox.innerHTML = `<p>${(error as Error).message}</p>`;
        playlist.rendered = false;
      }
    }
  }
  
  static syncFromDOM(): void {
    const playlistsContainers = document.querySelectorAll('.music-player');
  
    const playlists = Array.from(playlistsContainers)
      .filter((container): container is HTMLElement => container instanceof HTMLElement)
      .map(container => {
        const site = container.getAttribute('data-site') || '';
        const key = container.getAttribute('data-playlist') || '';
        return { site, key, container, audios: [], rendered: false };
      });
  
    updatePlaylists(playlists);
  }
}
