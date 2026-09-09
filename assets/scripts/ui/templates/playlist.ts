import { escapeHTML } from "../../utils/html.js";
export function renderPlaylistHTML(playlist: string, title: string) {
    return `
        <div
            class="music-player"
            data-playlist="${escapeHTML(playlist)}"
            style="background: var(--playlist_bg_color);"
        >
            <div class="music-player__title" style="color: var(--playlist_title_color);">
                ${escapeHTML(title)}
            </div>

            <div class="music-player__playlist"></div>
        </div>
    `;
}