import { PlayerState } from '../interfaces/playerState.js';
import { PlaylistContainer } from '../interfaces/playlistContainer.js';
import { adaptAudioResponse } from './audioAdapter.js';

export async function fetchPlaylists(playlistContainers: PlaylistContainer[], state: PlayerState): Promise<void> {

  state.isLoading.set(true);
  state.error.set('');

  try {
    const results = await Promise.all(
      playlistContainers.map(async (data) => {
        const res = await fetch(
          `http://localhost/player/wp-content/plugins/music-player/assets/json/bdv.json?site=${data.site}&playlist=${data.key}`
        );

        if (!res.ok) throw new Error(`Erro ao carregar playlist ${data.key}`);

        const raw: any[] = await res.json();
        const audios = adaptAudioResponse(raw);
        return { ...data, audios };
      })
    );

    const allAudios = results.flatMap((r) => r.audios);

    state.playlists.set(results);
    state.audios.set(allAudios);
  } catch (err: any) {
    state.error.set(err.message);
  } finally {
    state.isLoading.set(false);
  }
}

export function listPlaylistContainer() {
  const playlists = document.querySelectorAll('.music-player');

  let containers: PlaylistContainer[] = [];

  playlists.forEach(container => {
    const site = container.getAttribute('data-site') || '';
    const key = container.getAttribute('data-playlist') || '';
    containers.push({ site, key, container: container as HTMLElement });
  });

  return containers;
}