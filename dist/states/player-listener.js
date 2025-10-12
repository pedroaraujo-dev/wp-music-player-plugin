const playlistListeners = [];
export function subscribeToPlaylistUpdates(listener) {
    playlistListeners.push(listener);
}
export function notifyPlaylistListeners() {
    for (const listener of playlistListeners) {
        listener();
    }
}
