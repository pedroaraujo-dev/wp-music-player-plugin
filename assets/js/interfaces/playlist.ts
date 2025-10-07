import { AudioItem } from "./audioItem";

export interface Playlist {
    audios: AudioItem[];
    container: HTMLElement;
    site: string;
    key: string;
}