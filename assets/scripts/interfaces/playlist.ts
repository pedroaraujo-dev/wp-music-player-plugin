import { IAudioItem } from "./audio-item.js";

export interface IPlaylist {
    audios: IAudioItem[];
    container: HTMLElement;
    key: string;
    rendered: boolean;
}