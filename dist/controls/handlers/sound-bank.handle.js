import { EventBus } from "../../events/event-bus.js";
import { SoundBankUI } from "../../ui/sound-bank.js";
import { renderPlaylistHTML } from "../../ui/templates/playlist.js";
export function handleSoundBankButtonClick(soundBankId, soundBankTitle) {
    const activeTab = document.querySelector(".audio-track-library__tab-button.active");
    const activeTabId = activeTab?.getAttribute("data-id") ?? null;
    if (activeTabId && activeTabId === soundBankId) {
        return;
    }
    SoundBankUI.closeAllTabs();
    const content = document.querySelector(`[data-playlist="${soundBankId}"]`);
    if (!content) {
        fetchPlayer(soundBankId, soundBankTitle);
        EventBus.emit("playlistcontainer:updated");
    }
    SoundBankUI.setTabState(soundBankId);
}
export function fetchPlayer(playlistId, title) {
    const playerHTML = renderPlaylistHTML(playlistId, title);
    SoundBankUI.renderPlayer(playerHTML, playlistId);
}
