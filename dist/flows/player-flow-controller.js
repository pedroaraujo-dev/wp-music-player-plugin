import { UIListeners } from "../controls/listeners/index.js";
import { AudioService } from "../service/audio.service.js";
import { AudioUI } from "../ui/audio.js";
import { PlaylistContainerUI } from "../ui/playlist-container.js";
import { SoundBankUI } from "../ui/sound-bank.js";
export class PlayerFlowController {
    static async init() {
        PlaylistContainerUI.syncFromDOM();
        UIListeners.init();
        AudioUI.init();
        SoundBankUI.init();
    }
    static async updatePlaylists() {
        this.queue = this.queue.then(async () => {
            PlaylistContainerUI.renderLoading();
            await AudioService.fetchAudios();
            await PlaylistContainerUI.renderAll();
            PlaylistContainerUI.clearAllLoadings();
        }).catch((err) => {
        });
        await this.queue;
    }
}
PlayerFlowController.queue = Promise.resolve();
