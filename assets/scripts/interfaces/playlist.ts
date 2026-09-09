import { IAudioItem } from "./audio-item.js";

export interface IPlaylist {
    audios: IAudioItem[];
    container: HTMLElement;
    key: string;
    rendered: boolean;
    status?: 'ready' | 'missing' | 'error';
    error?: string;
    metadata?: import('./audio-item.js').IPublicPlaylist['playlist'];
}