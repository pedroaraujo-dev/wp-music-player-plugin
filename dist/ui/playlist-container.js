import { AudioService } from "../service/audio.service.js";
import { playerState, updatePlaylists } from "../states/player-state.js";
export class PlaylistContainerUI {
    static async renderAll() {
        const playlists = playerState.playlists;
        if (!playlists || playlists.length === 0)
            return;
        for (const playlist of playlists) {
            if (playlist.rendered)
                continue;
            const container = playlist.container;
            const playlistBox = container.querySelector('.music-player__playlist');
            if (!playlistBox)
                return;
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
            }
            catch (error) {
                playlistBox.innerHTML = `<p>${error.message}</p>`;
                playlist.rendered = false;
            }
        }
    }
    static syncFromDOM() {
        const playlistsContainers = document.querySelectorAll('.music-player');
        const playlists = Array.from(playlistsContainers)
            .filter((container) => container instanceof HTMLElement)
            .map(container => {
            const site = container.getAttribute('data-site') || '';
            const key = container.getAttribute('data-playlist') || '';
            return { site, key, container, audios: [], rendered: false };
        });
        updatePlaylists(playlists);
    }
}
