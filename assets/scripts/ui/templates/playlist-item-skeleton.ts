export function renderPlaylistItemSkeletonHTML() {
  return `
    <div class="playlist-item-skeleton">
      <div class="playlist-item-skeleton__left">
        <div class="playlist-item-skeleton__button"></div>
        <div class="playlist-item-skeleton__info">
          <div class="playlist-item-skeleton__order"></div>
          <div class="playlist-item-skeleton__separator"></div>
          <div class="playlist-item-skeleton__title"></div>
        </div>
      </div>
      <div class="playlist-item-skeleton__right">
        <div class="playlist-item-skeleton__time"></div>
        <div class="playlist-item-skeleton__download"></div>
      </div>
    </div>
  `;
}