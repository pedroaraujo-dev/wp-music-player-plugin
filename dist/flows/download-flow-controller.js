import { AudioService } from "../service/audio.service.js";
import { FixedBarUI } from "../ui/fixed-bar.js";
import { PlaylistItemUI } from "../ui/playlist-item.js";
export class DownloadFlowController {
    static async downloadAudio(audio) {
        PlaylistItemUI.startDownload(audio.id);
        FixedBarUI.startDownload();
        try {
            await AudioService.downloadAudio(audio);
        }
        catch (error) {
            console.error("Download error:", error.message);
        }
        finally {
            PlaylistItemUI.endDownload(audio.id);
            FixedBarUI.endDownload();
        }
    }
}
