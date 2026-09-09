export interface IAudioItem {
  id: string;
  name: string;
  category: string;
  duration: string;
  url: string;
  tag: string;
  order: number;
  metadata: Record<string, any>;
}

function parseDuration(duration: string): number {
  const [min, sec] = duration.split(':').map(Number);
  return (min || 0) * 60 + (sec || 0);
}

export function adaptAudioResponse(raw: any[]): IAudioItem[] {
  return raw.reduce<IAudioItem[]>((acc, item) => {
    const metadataKeys = Object.keys(item).filter(
      (key) =>
        typeof item[key] === 'object' &&
        item[key] !== null &&
        'visible' in item[key]
    );

    const site = (window as any).musicPlayer?.siteId;

    const visible = item[site]?.visible ?? true;

    if (!visible) {
      return acc;
    }

    const order = Number(item[site]?.order) || 0;
    const tag = item[site]?.tag || '';
    const label = item[site]?.label || '';

    acc.push({
      id: item.id,
      name: label || item.name || '',
      category: formatCategoryName(item.category),
      duration: item.audioDuration || '',
      url: item.url,
      tag: tag,
      order: order,
      metadata: metadataKeys.reduce((metaAcc, key) => {
        metaAcc[key] = {
          visible: !!item[key].visible,
          order: Number(item[key].order) || 0,
          tag: item[key].tag || '',
          label: item[key].label || '',
        };
        return metaAcc;
      }, {} as Record<string, any>),
    });
    return acc;
  }, []);
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

export function sortAudiosBySite(audios: IAudioItem[], site: string): IAudioItem[] {
  return [...audios].sort((a, b) => {
    const orderA = a.metadata?.[site]?.order ?? 0;
    const orderB = b.metadata?.[site]?.order ?? 0;
    return orderB - orderA;
  });
}