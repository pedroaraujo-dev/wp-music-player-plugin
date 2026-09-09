import { IPlaylist } from '../interfaces/playlist.js';
import { safeAudioURL } from '../utils/html.js';
export class SoundBankUI {
  static updateMetadata(playlist: IPlaylist, container: HTMLElement): void {
    const meta = playlist.metadata;
    if (!meta) return;
    const title = container.querySelector<HTMLElement>('.music-player__title');
    if (title && container.dataset.customTitle !== 'true') title.textContent = typeof meta.name === 'string' ? meta.name : '';
    const root = container.closest('.audio-track-library');
    root?.querySelectorAll<HTMLElement>('.audio-track-library__tab-button, .audio-track-library__content-button').forEach(button => {
      if (button.dataset.id !== playlist.key) return;
      button.replaceChildren();
      if (typeof meta.icon === 'string' && meta.icon) {
        const url = safeAudioURL(meta.icon);
        if (url.startsWith('https:')) {
          const image = document.createElement('img'); image.src = url; image.alt = ''; image.width = image.height = 20; button.append(image);
        } else if (/^[a-zA-Z0-9_ -]+$/.test(meta.icon)) {
          const icon = document.createElement('span'); icon.className = meta.icon; icon.setAttribute('aria-hidden', 'true'); button.append(icon);
        }
      }
      const name = document.createElement('span'); name.textContent = typeof meta.name === 'string' ? meta.name : button.dataset.title || playlist.key;
      button.append(name);
    });
  }
  static removePlaylist(key: string, container: HTMLElement): void {
    const root = container.closest<HTMLElement>('.audio-track-library');
    if (!root) return;
    let wasActive = false;
    root.querySelectorAll<HTMLElement>('.audio-track-library__tab-button, .audio-track-library__content-button').forEach(button => {
      if (button.dataset.id !== key) return;
      wasActive = wasActive || button.classList.contains('active');
      button.hidden = true; button.classList.remove('active'); button.setAttribute('aria-expanded', 'false');
    });
    const next = root.querySelector<HTMLElement>('.audio-track-library__tab-button:not([hidden])');
    if (!next) root.hidden = true;
    else if (wasActive) next.click();
  }

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
