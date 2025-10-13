import { IAudioItem } from "./audio-item.js";

export interface IPlaylist {
    audios: IAudioItem[];
    container: HTMLElement;
    site: string;
    key: string;
    rendered: boolean;
}