export class SoundBankUI {
  private static contentId = 0;
  static init(): void {
    document.querySelectorAll<HTMLElement>('.audio-track-library').forEach(root => {
      root.querySelector<HTMLElement>('.audio-track-library__tab-button')?.click();
    });
  }
  static findContent(tabId: string, root: ParentNode = document): HTMLElement | undefined {
    return Array.from(root.querySelectorAll<HTMLElement>('.music-player')).find(el => el.dataset.playlist === tabId);
  }
  static setTabState(tabId: string, root: ParentNode = document): void {
    const content = this.findContent(tabId, root);
    if (!content) return;
    if (!content.id) content.id = 'music-bank-panel-' + (++this.contentId);
    root.querySelectorAll<HTMLElement>('.audio-track-library__tab-button, .audio-track-library__content-button').forEach(button => {
      if (button.dataset.id !== tabId) return;
      button.setAttribute('aria-expanded', 'true');
      button.setAttribute('aria-controls', content.id);
      button.classList.add('active');
    });
    content.setAttribute('aria-hidden', 'false');
    content.classList.add('active');
  }
  static closeAllTabs(root: ParentNode = document): void {
    root.querySelectorAll<HTMLElement>('.audio-track-library__tab-button, .audio-track-library__content-button').forEach(button => {
      button.setAttribute('aria-expanded', 'false');
      button.classList.remove('active');
    });
    root.querySelectorAll<HTMLElement>('.audio-track-library__content .music-player').forEach(content => {
      content.setAttribute('aria-hidden', 'true');
      content.classList.remove('active');
    });
  }
  static renderPlayer(html: string, playlistId: string, root: ParentNode = document): void {
    const button = Array.from(root.querySelectorAll<HTMLElement>('.audio-track-library__content-button')).find(el => el.dataset.id === playlistId);
    if (!button) return;
    const template = document.createElement('template');
    template.innerHTML = html;
    button.after(template.content);
  }
}
