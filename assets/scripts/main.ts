import { bindPlayerControlsUIEvents } from "./controls/listeners/controls.js";
import { bindPlayerProgressUIEvents } from "./controls/listeners/progress.js";
import { bindPlayerVolumeUIEvents } from "./controls/listeners/volume.js";
import { AudioService } from "./service/audio.service.js";
import { subscribeToPlaylistUpdates } from "./states/player-listener.js";
import { Audio } from "./ui/audio.js";
import { findPlaylistsContainers, renderPlaylists } from "./ui/playlists.js";

document.addEventListener('DOMContentLoaded', async () => {

    subscribeToPlaylistUpdates(async () => {
        await AudioService.fetchAudios();
        await renderPlaylists();
    });

    findPlaylistsContainers();
    bindPlayerControlsUIEvents();
    bindPlayerProgressUIEvents();
    bindPlayerVolumeUIEvents();
    Audio.init();
});