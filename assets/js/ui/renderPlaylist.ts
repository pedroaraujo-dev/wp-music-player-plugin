import { PlayerState } from "../interfaces/playerState";
import { Playlist } from "../interfaces/playlist";

declare global {
  interface Window {
    musicPlayer?: { ajaxUrl?: string };
  }
}

export async function renderPlaylist(state: PlayerState): Promise<void> {

  const playlists = state.playlists.get();
  if (!playlists || playlists.length === 0) return;

  for (const playlist of playlists) {
    const container = playlist.container;
    await renderSinglePlaylist(container, playlist);
  }
}

async function renderSinglePlaylist(container: HTMLElement, playlist: Playlist): Promise<void> {
  const playlistBox = container.querySelector<HTMLElement>('.music-player__playlist');
  if (!playlistBox) return;

  const ajaxUrl = window.musicPlayer?.ajaxUrl;
  if (!ajaxUrl) {
    playlistBox.innerHTML = '<p>ajaxUrl não configurado.</p>';
    return;
  }

  try {
    playlistBox.innerHTML = '<p>Carregando...</p>';

    const res = await fetch(`${ajaxUrl}?action=render_playlist_items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ playlist: JSON.stringify(playlist.audios) }),
    });

    const json = await res.json();
    if (!json.success) throw new Error('Erro ao renderizar playlist.');

    playlistBox.innerHTML = json.data.html;
  } catch (error) {
    playlistBox.innerHTML = `<p>${(error as Error).message}</p>`;
  }
}