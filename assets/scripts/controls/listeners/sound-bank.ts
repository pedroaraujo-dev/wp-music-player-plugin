import { handleSoundBankButtonClick } from "../handlers/sound-bank.handle.js";

export function bindSoundBankUIEvents() {
    const buttons = document.querySelectorAll<HTMLButtonElement>(".audio-track-library__tab-button");

    if (!buttons || buttons.length === 0) return;

    buttons.forEach((button) => {
        const soundBankId = button?.getAttribute('data-id') ?? null;
        const soundBankTitle = button?.getAttribute('data-title') ?? null;

        if (!soundBankId || !soundBankTitle) return;

        button.addEventListener("click", () => handleSoundBankButtonClick(soundBankId, soundBankTitle));
    });
}