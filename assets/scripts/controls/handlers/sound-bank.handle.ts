import { PlaylistContainerUI } from "../../ui/playlist-container.js";
import { SoundBankUI } from "../../ui/sound-bank.js";
import { renderPlaylistHTML } from "../../ui/templates/playlist.js";

export function handleSoundBankButtonClick(soundBankId: string, soundBankTitle: string, root: ParentNode = document): void {

    const activeTab = root.querySelector<HTMLElement>(".audio-track-library__tab-button.active");
    const activeTabId = activeTab?.getAttribute("data-id") ?? null;

    if (activeTabId && activeTabId === soundBankId) {
        return;
    }

    SoundBankUI.closeAllTabs(root);

    const content = SoundBankUI.findContent(soundBankId, root);

    if (!content) {
        fetchPlayer(soundBankId, soundBankTitle, root);
        PlaylistContainerUI.syncFromDOM();
    }

    SoundBankUI.setTabState(soundBankId, root);
}

export function fetchPlayer(playlistId: string, title: string, root: ParentNode = document): void {
    const playerHTML = renderPlaylistHTML(playlistId, title);
    SoundBankUI.renderPlayer(playerHTML, playlistId, root);
}
