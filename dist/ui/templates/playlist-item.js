export function renderPlaylistItemHTML(id, title, duration, order, url) {
    return `
        <div 
            class="music-player__item" 
            data-index="${order}"
            data-id="${id}"
            style="background: var(--audio_bg_color); color: var(--audio_text_color);"
            data-url="${url}"
        >
            <div class="music-player__item-left">
                <button 
                    class="music-player__button music-player__button--play"
                    style="background: var(--button_bg_color); color: var(--button_icon_color);"
                    aria-label="Play áudio"
                    type="button"
                >
                    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="30px" width="30px" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M8 5v14l11-7z"></path></svg>
                </button>

                <button 
                    class="music-player__button music-player__button--pause"
                    style="background: var(--button_bg_color); color: var(--button_icon_color); display: none;"
                    aria-label="Pause áudio"
                    type="button"
                >
                    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="30px" width="30px" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path></svg>
                </button>

                <div class="music-player__track-info">
                    <div class="music-player__track-position">${order}</div>
                    <div class="music-player__track-separator">-</div>
                    <div class="music-player__track-title">${title}</div>
                </div>
            </div>

            <div class="music-player__item-right">
                <div class="music-player__duration">${duration}</div>

                <div 
                    class="music-player__download"
                    style="color: var(--download_icon_color);"
                    data-url="${url}"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-cloud-download-icon lucide-cloud-download"><path d="M12 13v8l-4-4"/><path d="m12 21 4-4"/><path d="M4.393 15.269A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.436 8.284"/></svg>
                </div>

                <div 
                    class="music-player__loading"
                    style="color: var(--download_icon_color); display: none;"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-loader-circle-icon lucide-loader-circle"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                </div>
            </div>
        </div>
    `;
}
