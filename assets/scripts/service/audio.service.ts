import { updateAudios, playerState, updatePlaylistAudios } from '../states/player-state.js';
import { IPlaylist } from '../interfaces/playlist.js';
import { adaptAudioResponse, IAudioItem, sortAudiosBySite } from '../interfaces/audio-item.js';
import { renderPlaylistItemHTML } from '../ui/templates/playlist-item.js';

export class AudioService {
  static async fetchAudios(): Promise<void> {

    const site = (window as any).musicPlayer?.siteId;
    const playlists = playerState.playlists as IPlaylist[];
  
    const results: IPlaylist[] = await Promise.all(
      playlists.map(async (data) => {
        try {
          const res = await fetch(
            `https://conceitovoz.com.br/playlist-directory/get-content.php?site=${site}&playlist=${data.key}`, {
              headers: { 'Name': data.key}
            }
          );
          
          if (!res.ok) return { ...data, audios: [], rendered: false };

          
          const raw: any[] = await res.json();
          const audios = adaptAudioResponse(raw);
          const sortedAudios = sortAudiosBySite(audios, site);
          updatePlaylistAudios(data.key, sortedAudios);
          return { ...data, sortedAudios, rendered: false };
        } catch (error) {
          console.error((error as Error).message);
          return { ...data, audios: [], rendered: false };
        }
      })
    );
  
    const allAudios = results.flatMap((r) => r.audios);
    
    updateAudios(allAudios);
  }
  
  static async fetchAudioItemHTML(audios: IAudioItem[]): Promise<string> {
    const htmlItems = audios.map((audio, index) => 
      renderPlaylistItemHTML(
        audio.id,
        audio.name,
        audio.duration,
        index + 1,
        audio.url
      )
    );

    return htmlItems.join('');
  }
}
