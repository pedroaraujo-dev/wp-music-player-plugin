import { playerState } from "../../states/player-state.js";
import { FixedBarUI } from "../../ui/fixed-bar.js";
import { PlaylistItemUI } from "../../ui/playlist-item.js";

export async function handleItemDownload(
  musicPlayerItemId: string | null
) {
  if (!musicPlayerItemId) {
    return;
  }

  const audio = playerState.audios.find(a => a.id === musicPlayerItemId);
  if (!audio) return;

  const downloadUrl = audio.url;
  if (!downloadUrl) return;

  try {
    PlaylistItemUI.startDownload(musicPlayerItemId);
    const response = await fetch(downloadUrl);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = audio.name || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  } catch (error) {
    
  } finally {
    PlaylistItemUI.endDownload(musicPlayerItemId);
    FixedBarUI.endDownload();
  }
}

export function handleBarDownload() {
  const currentlyPlayingId = playerState.currentlyPlayingId;
  if (!currentlyPlayingId) return;

  FixedBarUI.startDownload();
  handleItemDownload(currentlyPlayingId);
}