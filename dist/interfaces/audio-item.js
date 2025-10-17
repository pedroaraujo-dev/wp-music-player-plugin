function parseDuration(duration) {
    const [min, sec] = duration.split(':').map(Number);
    return (min || 0) * 60 + (sec || 0);
}
export function adaptAudioResponse(raw) {
    return raw.map((item) => {
        const metadataKeys = Object.keys(item).filter((key) => typeof item[key] === 'object' &&
            item[key] !== null &&
            'visible' in item[key]);
        return {
            id: item.id,
            name: item.name || '',
            category: item.category || '',
            duration: item.audioDuration,
            url: item.url,
            tags: metadataKeys,
            metadata: metadataKeys.reduce((acc, key) => {
                acc[key] = {
                    visible: !!item[key].visible,
                    order: Number(item[key].order) || 0,
                    tag: item[key].tag || '',
                    label: item[key].label || '',
                };
                return acc;
            }, {}),
        };
    });
}
export function sortAudiosBySite(audios, site) {
    return [...audios].sort((a, b) => {
        const orderA = a.metadata?.[site]?.order ?? 0;
        const orderB = b.metadata?.[site]?.order ?? 0;
        return orderB - orderA;
    });
}
