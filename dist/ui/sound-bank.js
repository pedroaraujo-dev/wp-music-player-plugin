export class SoundBankUI {
    static init() {
        this.openFirstTab();
    }
    static setTabState(tabId) {
        const button = document.querySelector(`[data-id="${tabId}"]`);
        const content = document.querySelector(`[data-playlist="${tabId}"]`);
        if (!button || !content)
            return;
        button.setAttribute("aria-expanded", "true");
        content.setAttribute("aria-hidden", "true");
        button.classList.add("active");
        content.classList.add("active");
    }
    static closeAllTabs() {
        const buttons = document.querySelectorAll(".audio-track-library__tab-button");
        const contents = document.querySelectorAll(".audio-track-library__tab-content");
        buttons.forEach((button) => {
            button.setAttribute("aria-expanded", "false");
            button.classList.remove("active");
        });
        contents.forEach((content) => {
            content.setAttribute("aria-hidden", "true");
            content.classList.remove("active");
        });
    }
    static renderPlayer(html) {
        const soundBankContainer = document.querySelector(".audio-track-library__content");
        if (!soundBankContainer)
            return;
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const fragment = document.createDocumentFragment();
        Array.from(doc.body.childNodes).forEach(node => fragment.appendChild(node));
        soundBankContainer.appendChild(fragment);
    }
    static openFirstTab() {
        const firstTabButton = document.querySelector(".audio-track-library__tab-button");
        if (firstTabButton) {
            firstTabButton.click();
        }
    }
    ;
}
