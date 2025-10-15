import { UIListeners } from "./controls/listeners/index.js";
import { EventBus } from "./events/event-bus.js";
import { AudioService } from "./service/audio.service.js";
import { AudioUI } from "./ui/audio.js";
import { PlaylistContainerUI } from "./ui/playlist-container.js";
import { SoundBankUI } from "./ui/sound-bank.js";

document.addEventListener('DOMContentLoaded', async () => {

    EventBus.on("playlist:updated", async () => {
        PlaylistContainerUI.renderLoading();
        await AudioService.fetchAudios();
        await PlaylistContainerUI.renderAll();
        PlaylistContainerUI.clearAllLoadings();
    });

    EventBus.on("playlistcontainer:updated", async () => {
        PlaylistContainerUI.syncFromDOM();
    });

    EventBus.emit("playlistcontainer:updated");

    UIListeners.init();
    AudioUI.init();
    SoundBankUI.init();
});