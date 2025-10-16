import { AudioService } from "../service/audio.service.js";
import { playerState, updatePlaylists } from "../states/player-state.js";
import { renderPlaylistItemSkeletonHTML } from "./templates/playlist-item-skeleton.js";

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

      if (!playlistBox || !playlist.audios || playlist.audios.length === 0) continue;
  
      try {
        const html = AudioService.fetchAudioItemHTML(playlist.audios);
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

    const site = (window as any).musicPlayer?.siteId;
  
    const playlists = Array.from(playlistsContainers)
      .filter((container): container is HTMLElement => container instanceof HTMLElement)
      .map(container => {
        const key = container.getAttribute('data-playlist') || '';
        return { site, key, container, audios: [], rendered: false };
      });
  
    updatePlaylists(playlists);
  }

  static renderLoading(): void {

    const playlists = playerState.playlists;
    if (!playlists || playlists.length === 0) return;

    const playlistsNotRendered = playlists.filter(playlist => !playlist.rendered);
    if (playlistsNotRendered.length === 0) return;

    playlistsNotRendered.forEach(playlist => {
      const loadingContainer = document.createElement('div');
      loadingContainer.className = 'music-player--loading';

      const playlistItemsContainer = playlist.container.querySelector<HTMLElement>('.music-player__playlist');
      if (!playlistItemsContainer) return;
  
      playlistItemsContainer.appendChild(loadingContainer);
  
      for (let i = 0; i < 10; i++) {
        const parser = new DOMParser();
        const html = renderPlaylistItemSkeletonHTML();
        const doc = parser.parseFromString(html, 'text/html');
        const fragment = document.createDocumentFragment();
        Array.from(doc.body.childNodes).forEach(node => fragment.appendChild(node));
        loadingContainer.appendChild(fragment);
      }
    });
  }

  static clearAllLoadings(): void {
    const loadingContainer = document.querySelectorAll(`.music-player--loading`);
    loadingContainer.forEach(container => container.remove());
  }
}