export class SoundBankUI {

  static init(): void {
    this.openFirstTab();
  }

  static setTabState(tabId: string): void {

    const button = document.querySelector<HTMLButtonElement>(`[data-id="${tabId}"]`);
    const content = document.querySelector<HTMLDivElement>(`[data-playlist="${tabId}"]`);

    if (!button || !content) return;

    button.setAttribute("aria-expanded", "true");
    content.setAttribute("aria-hidden", "false");

    button.classList.add("active");
    content.classList.add("active");
  }

  static closeAllTabs(): void {
    const buttons = document.querySelectorAll<HTMLButtonElement>(".audio-track-library__tab-button");
    const accordionButtons = document.querySelectorAll<HTMLButtonElement>(".audio-track-library__content-button");
    const contents = document.querySelectorAll<HTMLDivElement>(".audio-track-library__content .music-player");

    buttons.forEach((button) => {
      button.setAttribute("aria-expanded", "false");
      button.classList.remove("active");
    });

    accordionButtons.forEach((button) => {
      button.setAttribute("aria-expanded", "false");
      button.classList.remove("active");
    });

    contents.forEach((content) => {
      content.setAttribute("aria-hidden", "true");
      content.classList.remove("active");
    });
  }

  static renderPlayer(html: string, playlistId: string): void {
    const soundBankContainer = document.querySelector<HTMLDivElement>(`.audio-track-library__content .audio-track-library__content-button[data-id="${playlistId}"]`);
    if (!soundBankContainer) return;

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const fragment = document.createDocumentFragment();
    Array.from(doc.body.childNodes).forEach(node => fragment.appendChild(node));
    soundBankContainer.after(fragment);
  }

  static openFirstTab(): void {
    const firstTabButton = document.querySelector<HTMLButtonElement>(".audio-track-library__tab-button");
    if (firstTabButton) {
      firstTabButton.click();
    }
  };
}
