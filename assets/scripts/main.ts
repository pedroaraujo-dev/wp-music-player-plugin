import { bindPlayerControlsUIEvents } from "./controls/listeners/controls.js";
import { bindPlayerProgressUIEvents } from "./controls/listeners/progress.js";
import { bindSoundBankUIEvents } from "./controls/listeners/sound-bank.js";
import { bindPlayerVolumeUIEvents } from "./controls/listeners/volume.js";
import { EventBus } from "./events/event-bus.js";
import { AudioService } from "./service/audio.service.js";
import { subscribeToPlaylistUpdates } from "./states/player-listener.js";
import { AudioUI } from "./ui/audio.js";
import { PlaylistContainerUI } from "./ui/playlist-container.js";
import { SoundBankUI } from "./ui/sound-bank.js";

document.addEventListener('DOMContentLoaded', async () => {

    subscribeToPlaylistUpdates(async () => {
        await AudioService.fetchAudios();
        await PlaylistContainerUI.renderAll();
    });

    EventBus.on("playlist:updated", async () => {
        PlaylistContainerUI.syncFromDOM();
    });

    EventBus.emit("playlist:updated");

    bindPlayerControlsUIEvents();
    bindPlayerProgressUIEvents();
    bindPlayerVolumeUIEvents();
    bindSoundBankUIEvents();

    AudioUI.init();
    SoundBankUI.init();

    new SoundBankUI();
});