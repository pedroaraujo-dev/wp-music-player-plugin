import { AudioItem } from "./audioItem";
import { Playlist } from "./playlist";
import { Subscriber } from "./subscriber";

export interface PlayerState {
    playlists: {
        get: () => Playlist[];
        set: (v: Playlist[]) => void;
        subscribe: (fn: Subscriber<Playlist[]>) => () => boolean;
    };
    audios: {
        get: () => AudioItem[];
        set: (v: AudioItem[]) => void;
        subscribe: (fn: Subscriber<AudioItem[]>) => () => boolean;
    };
    currentPlayingId: {
        get: () => string | null;
        set: (v: string | null) => void;
        subscribe: (fn: Subscriber<string | null>) => () => boolean;
    };
    isPlaying: {
        get: () => boolean;
        set: (v: boolean) => void;
        subscribe: (fn: Subscriber<boolean>) => () => boolean;
    };
    currentDownloadId: {
        get: () => string | null;
        set: (v: string | null) => void;
        subscribe: (fn: Subscriber<string | null>) => () => boolean;
    };
    isDownloading: {
        get: () => boolean;
        set: (v: boolean) => void;
        subscribe: (fn: Subscriber<boolean>) => () => boolean;
    };
    isLoading: {
        get: () => boolean;
        set: (v: boolean) => void;
        subscribe: (fn: Subscriber<boolean>) => () => boolean;
    };
    error: {
        get: () => string | null;
        set: (v: string | null) => void;
        subscribe: (fn: Subscriber<string | null>) => () => boolean;
    };
}