import { IAudioLabel } from '../interfaces/audio-item.js';
import { escapeHTML } from '../utils/html.js';
import { playerState } from '../states/player-state.js';
export function labelVisible(label: IAudioLabel, now = Date.now()): boolean {
  if (label.is_scheduled !== true) return true;
  const start = label.starts_at == null ? -Infinity : Date.parse(label.starts_at);
  const end = label.ends_at == null ? Infinity : Date.parse(label.ends_at);
  return !Number.isNaN(start) && !Number.isNaN(end) && now >= start && now < end;
}
function color(value: unknown): string {
  if (typeof value !== 'string') return '';
  // Keep CSS values inside a single declaration; never interpolate arbitrary CSS.
  return /^(#[0-9a-f]{3,4}|#[0-9a-f]{6}|#[0-9a-f]{8}|transparent|rgba?\([\d., %]+\))$/i.test(value) ? value : '';
}
export function renderLabelHTML(label?: IAudioLabel | null, fallback = '', now = Date.now()): string {
  if (label && !labelVisible(label, now)) return '';
  const name = label ? (typeof label.name === 'string' ? label.name : '') : fallback;
  if (!name) return '';
  const styles = [color(label?.background_color) ? 'background-color:' + color(label?.background_color) : '', color(label?.text_color) ? 'color:' + color(label?.text_color) : ''].filter(Boolean).join(';');
  return '<span class="music-player__track-tag" title="' + escapeHTML(label?.description) + '" style="' + escapeHTML(styles) + '">' + escapeHTML(name) + '</span>';
}
export class LabelUI {
  private static timer: ReturnType<typeof setTimeout> | undefined;
  static sync(): void {
    if (this.timer !== undefined) clearTimeout(this.timer);
    const audios = new Map(playerState.audios.map(audio => [audio.id, audio]));
    document.querySelectorAll<HTMLElement>('.music-player__item').forEach(item => {
      const audio = audios.get(item.dataset.id || '');
      const slot = item.querySelector('[data-label-slot]');
      if (audio && slot) slot.innerHTML = renderLabelHTML(audio.label, audio.tag);
    });
    const now = Date.now();
    const future = playerState.audios.flatMap(a => a.label?.is_scheduled ? [a.label.starts_at, a.label.ends_at] : []).map(v => v ? Date.parse(v) : NaN).filter(v => Number.isFinite(v) && v > now);
    if (future.length) this.timer = setTimeout(() => this.sync(), Math.min(Math.min(...future) - now, 2147483647));
  }
}
