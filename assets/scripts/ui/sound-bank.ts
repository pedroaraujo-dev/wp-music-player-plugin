export class SoundBankUI {

  static init(): void {
    this.openFirstTab();
  }

  static setTabState(tabId: string): void {

    const button = document.querySelector<HTMLButtonElement>(`[data-id="${tabId}"]`);
    const content = document.querySelector<HTMLDivElement>(`[data-playlist="${tabId}"]`);

    if (!button || !content) return;

    button.setAttribute("aria-expanded", "true");
    content.setAttribute("aria-hidden", "true");

    button.classList.add("active");
    content.classList.add("active");
  }

  static closeAllTabs(): void {
    const buttons = document.querySelectorAll<HTMLButtonElement>(".audio-track-library__tab-button");
    const contents = document.querySelectorAll<HTMLDivElement>(".audio-track-library__tab-content");

    buttons.forEach((button) => {
      button.setAttribute("aria-expanded", "false");
      button.classList.remove("active");
    });

    contents.forEach((content) => {
      content.setAttribute("aria-hidden", "true");
      content.classList.remove("active");
    });
  }

  static renderPlayer(html: string): void {
    const soundBankContainer = document.querySelector<HTMLDivElement>(".audio-track-library__content");
    if (!soundBankContainer) return;

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const fragment = document.createDocumentFragment();

    Array.from(doc.body.childNodes).forEach(node => fragment.appendChild(node));
    soundBankContainer.appendChild(fragment);
  }

  static openFirstTab(): void {
    const firstTabButton = document.querySelector<HTMLButtonElement>(".audio-track-library__tab-button");
    if (firstTabButton) {
      firstTabButton.click();
    }
  };
}
