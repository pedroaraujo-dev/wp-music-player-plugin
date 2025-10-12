type Listener = () => void;

const playlistListeners: Listener[] = [];

export function subscribeToPlaylistUpdates(listener: Listener) {
  playlistListeners.push(listener);
}

export function notifyPlaylistListeners() {
  for (const listener of playlistListeners) {
    listener();
  }
}
