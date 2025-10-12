import { IAudioItem } from "./audioItem.js";

export interface IPlaylist {
    audios: IAudioItem[];
    container: HTMLElement;
    site: string;
    key: string;
    rendered: boolean;
}