import { bindPlayerControlsUIListeners } from "./controls.js";
import { bindPlayerProgressUIListeners } from "./progress.js";
import { bindSoundBankUIListeners } from "./sound-bank.js";
import { bindPlayerVolumeUIListeners } from "./volume.js";
export class UIListeners {
    static init() {
        bindPlayerControlsUIListeners();
        bindPlayerProgressUIListeners();
        bindPlayerVolumeUIListeners();
        bindSoundBankUIListeners();
    }
}
