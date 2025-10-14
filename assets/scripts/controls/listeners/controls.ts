import { handleBarClose } from "../handlers/close.handle.js";
import { handleBarDownload, handleItemDownload } from "../handlers/download.handle.js";
import { handleBarNext } from "../handlers/next.handle.js";
import { handlePause } from "../handlers/pause.handle.js";
import { handleBarPlay, handleItemPlay } from "../handlers/play.handle.js";
import { handleBarPrev } from "../handlers/prev.handle.js";

export function bindPlayerControlsUIListeners() {
  document.addEventListener('click', (event) => {
    const musicPlayButton = (event.target as HTMLElement)?.closest('.music-player__button--play');
    const musicPauseButton = (event.target as HTMLElement)?.closest('.music-player__button--pause');
    const musicDownloadButton = (event.target as HTMLElement)?.closest('.music-player__download');

    const barPlayButton = (event.target as HTMLElement)?.closest('.music-bar__button--play');
    const barPauseButton = (event.target as HTMLElement)?.closest('.music-bar__button--pause');
    const barDownloadButton = (event.target as HTMLElement)?.closest('.music-bar__download');
    const barNextButton = (event.target as HTMLElement)?.closest('.music-bar__button--next');
    const barPrevButton = (event.target as HTMLElement)?.closest('.music-bar__button--prev');
    const barCloseButton = (event.target as HTMLElement)?.closest('.music-bar__close');

    const musicPlayerItem = (event.target as HTMLElement)?.closest('.music-player__item');
    const musicPlayerItemId = musicPlayerItem?.getAttribute('data-id') ?? null;

    if (musicPlayButton) {
      handleItemPlay(musicPlayerItemId);
    }

    if (musicPauseButton) {
      handlePause();
    }

    if (musicDownloadButton) {
      handleItemDownload(musicPlayerItemId);
    }

    if (barPlayButton) {
      handleBarPlay();
    }

    if (barPauseButton) {
      handlePause();
    }

    if (barDownloadButton) {
      handleBarDownload();
    }

    if (barNextButton) {
      handleBarNext();
    }

    if (barPrevButton) {
      handleBarPrev();
    }

    if (barCloseButton) {
      handleBarClose();
    }
  });
}
