export function renderPlaylistHTML(playlist: string, title: string) {
    return `
        <div
            class="music-player"
            data-playlist="${playlist}"
            style="background: var(--playlist_bg_color);"
        >
            <div class="music-player__title" style="color: var(--playlist_title_color);">
                ${title}
            </div>

            <div class="music-player__playlist"></div>
        </div>
    `;
}