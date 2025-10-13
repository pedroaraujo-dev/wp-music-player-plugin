export class PlaylistItemUI {
    static getCurrentPlayingId() {
        const playingItem = document.querySelector('.music-player__item.playing');
        return playingItem ? playingItem.getAttribute('data-id') : null;
    }
    static pauseAll() {
        const audioItems = document.querySelectorAll('.music-player__item');
        audioItems.forEach(item => {
            item.classList.remove('playing');
            const playButton = item.querySelector('.music-player__button--play');
            const pauseButton = item.querySelector('.music-player__button--pause');
            if (playButton)
                playButton.style.display = 'flex';
            if (pauseButton)
                pauseButton.style.display = 'none';
        });
    }
    static play(itemId) {
        const item = document.querySelector(`.music-player__item[data-id="${itemId}"]`);
        if (!item)
            return;
        item.classList.add('playing');
        const playButton = item.querySelector('.music-player__button--play');
        const pauseButton = item.querySelector('.music-player__button--pause');
        if (playButton)
            playButton.style.display = 'none';
        if (pauseButton)
            pauseButton.style.display = 'flex';
    }
    static startDownload(itemId) {
        const item = document.querySelector(`.music-player__item[data-id="${itemId}"]`);
        if (!item)
            return;
        const downloadButton = item.querySelector('.music-player__download');
        const loadingButton = item.querySelector('.music-player__loading');
        if (downloadButton)
            downloadButton.style.display = 'none';
        if (loadingButton)
            loadingButton.style.display = 'flex';
    }
    static endDownload(itemId) {
        const item = document.querySelector(`.music-player__item[data-id="${itemId}"]`);
        if (!item)
            return;
        const downloadButton = item.querySelector('.music-player__download');
        const loadingButton = item.querySelector('.music-player__loading');
        if (downloadButton)
            downloadButton.style.display = 'flex';
        if (loadingButton)
            loadingButton.style.display = 'none';
    }
}
