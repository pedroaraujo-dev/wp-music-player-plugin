import { LabelUI } from "../ui/labels.js";
import { UIListeners } from "../controls/listeners/index.js";
import { AudioService } from "../service/audio.service.js";
import { AudioUI } from "../ui/audio.js";
import { PlaylistContainerUI } from "../ui/playlist-container.js";
import { SoundBankUI } from "../ui/sound-bank.js";

export class PlayerFlowController {

    private static queue: Promise<void> = Promise.resolve();

    static async init(): Promise<void> {
        PlaylistContainerUI.syncFromDOM();
        UIListeners.init();
        AudioUI.init();
        SoundBankUI.init();
    }

    static async updatePlaylists(): Promise<void> {
        this.queue = this.queue.then(async () => {

            PlaylistContainerUI.renderLoading();
            await AudioService.fetchAudios();
            await PlaylistContainerUI.renderAll();
            LabelUI.sync();

        }).catch((err) => {
            console.error(err);
        }).finally(() => PlaylistContainerUI.clearAllLoadings());

        await this.queue;
    }
}