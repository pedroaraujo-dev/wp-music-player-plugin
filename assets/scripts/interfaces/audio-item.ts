import { safeAudioURL } from '../utils/html.js';
export interface IAudioLabel {
  name?: string | null;
  description?: string | null;
  background_color?: string | null;
  text_color?: string | null;
  is_scheduled?: boolean;
  starts_at?: string | null;
  ends_at?: string | null;
}
export interface IPublicPlaylist {
  schema_version: number;
  revision?: unknown;
  site_public_id?: string;
  playlist: { public_id?: string; name?: string | null; description?: string | null; icon?: string | null; order?: number; category?: {name?: string | null; icon?: string | null} | null };
  audio_assets: Array<{_player_id: string; name?: string | null; file_url: string; duration?: number | null; order?: number; premium?: {description?: string | null} | null; label?: IAudioLabel | null}>;
}
export interface IAudioItem {
  id: string;
  name: string;
  category: string;
  duration: string;
  url: string;
  tag: string;
  order: number;
  label?: IAudioLabel | null;
  premium?: {description?: string | null} | null;
}
export function adaptAudioResponse(raw: IPublicPlaylist): IAudioItem[] {
  if (raw?.schema_version !== 1 || !raw.playlist || !Array.isArray(raw.audio_assets)) throw new Error('Formato de playlist inválido ou incompatível.');
  return raw.audio_assets.map((item, index) => {
    const url = safeAudioURL(item.file_url);
    if (!url.startsWith('https:') || typeof item._player_id !== 'string') throw new Error('Áudio inválido na playlist.');
    const seconds = typeof item.duration === 'number' && Number.isFinite(item.duration) && item.duration >= 0 ? Math.floor(item.duration / 1000) : null;
    return {
      id: item._player_id,
      name: typeof item.name === 'string' ? item.name : '',
      category: formatCategoryName(raw.playlist.category?.name || ''),
      duration: seconds === null ? '—' : Math.floor(seconds / 60) + ':' + String(seconds % 60).padStart(2, '0'),
      url, tag: '', order: item.order ?? index,
      label: item.label ?? null, premium: item.premium ?? null,
    };
  });
}

export function formatCategoryName(category?: string): string {
  if (!category) return '';

  switch (category) {
    case 'Banco de Vozes Masculinas':
      return 'Vozes Masculinas';
    case 'Banco de Vozes Femininas':
      return 'Vozes Femininas';
    case 'Banco de Vozes Institucionais':
      return 'Vozes Institucionais';
    case 'Esperas Telefônicas - Vozes':
      return 'Vozes para URA';
    case 'Esperas Telefônicas - Trabalhos Feitos':
      return 'Demonstrativos de URA';
    case 'Esperas Telefônicas - Fundos Musicais':
      return 'Fundos Musicais para URA';
  }

  return category;
}
