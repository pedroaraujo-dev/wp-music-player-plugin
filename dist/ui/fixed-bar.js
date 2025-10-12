export class FixedBar {
    static play() {
        const fixedBar = document.querySelector('.music-bar');
        if (!fixedBar)
            return;
        fixedBar.classList.remove('music-bar--hidden');
        const playButton = fixedBar.querySelector('.music-bar__button--play');
        const pauseButton = fixedBar.querySelector('.music-bar__button--pause');
        if (playButton)
            playButton.style.display = 'none';
        if (pauseButton)
            pauseButton.style.display = 'flex';
    }
    static pause() {
        const fixedBar = document.querySelector('.music-bar');
        if (!fixedBar)
            return;
        fixedBar.classList.remove('music-bar--hidden');
        const playButton = fixedBar.querySelector('.music-bar__button--play');
        const pauseButton = fixedBar.querySelector('.music-bar__button--pause');
        if (playButton)
            playButton.style.display = 'flex';
        if (pauseButton)
            pauseButton.style.display = 'none';
    }
    static updateInfo(audioItem) {
        const fixedBar = document.querySelector('.music-bar');
        if (!fixedBar)
            return;
        const titleElement = fixedBar.querySelector('.music-bar__track');
        const categoryElement = fixedBar.querySelector('.music-bar__category');
        const durationElement = fixedBar.querySelector('.music-bar__time--total');
        if (titleElement)
            titleElement.textContent = audioItem.name || '';
        if (categoryElement)
            categoryElement.textContent = audioItem.category || '';
        if (durationElement)
            durationElement.textContent = audioItem.duration.toString() || '0:00';
    }
    static hide() {
        const fixedBar = document.querySelector('.music-bar');
        if (!fixedBar)
            return;
        fixedBar.classList.add('music-bar--hidden');
    }
    static startDownload() {
        const fixedBar = document.querySelector('.music-bar');
        if (!fixedBar)
            return;
        const downloadButton = fixedBar.querySelector('.music-bar__download');
        if (downloadButton) {
            downloadButton.ariaDisabled = 'true';
            downloadButton.style.pointerEvents = 'none';
            downloadButton.style.opacity = '0.7';
        }
        const downloadIcon = fixedBar.querySelector('.music-bar__icon--download');
        const loadingIcon = fixedBar.querySelector('.music-bar__icon--loading');
        if (downloadIcon)
            downloadIcon.style.display = 'none';
        if (loadingIcon)
            loadingIcon.style.display = 'flex';
    }
    static endDownload() {
        const fixedBar = document.querySelector('.music-bar');
        if (!fixedBar)
            return;
        const downloadButton = fixedBar.querySelector('.music-bar__download');
        if (downloadButton) {
            downloadButton.ariaDisabled = 'false';
            downloadButton.style.pointerEvents = 'auto';
            downloadButton.style.opacity = '1';
        }
        const downloadIcon = fixedBar.querySelector('.music-bar__icon--download');
        const loadingIcon = fixedBar.querySelector('.music-bar__icon--loading');
        if (downloadIcon)
            downloadIcon.style.display = 'flex';
        if (loadingIcon)
            loadingIcon.style.display = 'none';
    }
}
