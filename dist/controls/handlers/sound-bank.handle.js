import { EventBus } from "../../events/event-bus.js";
import { MusicPlayerService } from "../../service/music-player.service.js";
import { SoundBankUI } from "../../ui/sound-bank.js";
export async function handleSoundBankButtonClick(soundBankId, soundBankTitle) {
    const activeTab = document.querySelector(".audio-track-library__tab-button.active");
    const activeTabId = activeTab?.getAttribute("data-id") ?? null;
    if (activeTabId && activeTabId === soundBankId) {
        return;
    }
    SoundBankUI.closeAllTabs();
    const content = document.querySelector(`[data-playlist="${soundBankId}"]`);
    if (!content) {
        await fetchPlayer(soundBankId, soundBankTitle);
        EventBus.emit("playlistcontainer:updated");
    }
    SoundBankUI.setTabState(soundBankId);
}
export async function fetchPlayer(playlistId, title) {
    const ajaxUrl = window.musicPlayer?.ajaxUrl;
    if (!ajaxUrl) {
        return;
    }
    const musicPlayerService = new MusicPlayerService(ajaxUrl);
    const playerHTML = await musicPlayerService.fetchPlayerHTML(playlistId, title);
    SoundBankUI.renderPlayer(playerHTML);
}
