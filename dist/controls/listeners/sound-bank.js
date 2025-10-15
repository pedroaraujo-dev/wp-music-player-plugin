import { handleSoundBankButtonClick } from "../handlers/sound-bank.handle.js";
export function bindSoundBankUIListeners() {
    const buttons = document.querySelectorAll(".audio-track-library__tab-button");
    const accordionButtons = document.querySelectorAll(".audio-track-library__content-button");
    if (!buttons || buttons.length === 0)
        return;
    buttons.forEach((button) => {
        const soundBankId = button?.getAttribute('data-id') ?? null;
        const soundBankTitle = button?.getAttribute('data-title') ?? null;
        if (!soundBankId || !soundBankTitle)
            return;
        button.addEventListener("click", () => handleSoundBankButtonClick(soundBankId, soundBankTitle));
    });
    accordionButtons.forEach((button) => {
        const soundBankId = button?.getAttribute('data-id') ?? null;
        const soundBankTitle = button?.getAttribute('data-title') ?? null;
        if (!soundBankId || !soundBankTitle)
            return;
        button.addEventListener("click", () => handleSoundBankButtonClick(soundBankId, soundBankTitle));
    });
}
