import { AudioItem } from "../interfaces/audioItem.js";
import { PlayerState } from "../interfaces/playerState.js";
import { Playlist } from "../interfaces/playlist.js";
import { Subscriber } from "../interfaces/subscriber.js";

function signal<T>(initial: T) {
  let value = initial;
  const subs = new Set<Subscriber<T>>();

  return {
    get: () => value,
    set: (v: T) => {
      value = v;
      subs.forEach((fn) => fn(v));
    },
    subscribe: (fn: Subscriber<T>) => {
      subs.add(fn);
      fn(value);
      return () => subs.delete(fn);
    },
  };
}

export function createPlayerState(): PlayerState {
  return {
    playlists: signal<Playlist[]>([]),
    audios: signal<AudioItem[]>([]),
    currentPlayingId: signal<string | null>(null),
    isPlaying: signal<boolean>(false),
    currentDownloadId: signal<string | null>(null),
    isDownloading: signal<boolean>(false),
    isLoading: signal<boolean>(false),
    error: signal<string | null>(null),
  };
}