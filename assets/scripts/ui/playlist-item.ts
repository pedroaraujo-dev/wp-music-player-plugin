export class PlaylistItem {
    static getCurrentPlayingId(): string | null {
        const playingItem = document.querySelector('.music-player__item.playing');
        return playingItem ? playingItem.getAttribute('data-id') : null;
    }
    
    static pauseAll(): void {
        const audioItems = document.querySelectorAll('.music-player__item');
    
        audioItems.forEach(item => {
            item.classList.remove('playing');
            const playButton = item.querySelector('.music-player__button--play') as HTMLElement;
            const pauseButton = item.querySelector('.music-player__button--pause') as HTMLElement;
            if (playButton) playButton.style.display = 'flex';
            if (pauseButton) pauseButton.style.display = 'none';
        });
    }
    
    static play(itemId: string): void {
        const item = document.querySelector(`.music-player__item[data-id="${itemId}"]`);
        if (!item) return;
    
        item.classList.add('playing');
        const playButton = item.querySelector('.music-player__button--play') as HTMLElement;
        const pauseButton = item.querySelector('.music-player__button--pause') as HTMLElement;
        if (playButton) playButton.style.display = 'none';
        if (pauseButton) pauseButton.style.display = 'flex';
    }

    static startDownload(itemId: string): void {
        const item = document.querySelector(`.music-player__item[data-id="${itemId}"]`);
        if (!item) return;

        const downloadButton = item.querySelector('.music-player__download') as HTMLElement;
        const loadingButton = item.querySelector('.music-player__loading') as HTMLElement;
        if (downloadButton) downloadButton.style.display = 'none';
        if (loadingButton) loadingButton.style.display = 'flex';
    }

    static endDownload(itemId: string): void {
        const item = document.querySelector(`.music-player__item[data-id="${itemId}"]`);
        if (!item) return;

        const downloadButton = item.querySelector('.music-player__download') as HTMLElement;
        const loadingButton = item.querySelector('.music-player__loading') as HTMLElement;
        if (downloadButton) downloadButton.style.display = 'flex';
        if (loadingButton) loadingButton.style.display = 'none';
    }
}
