<div id="music-player-bar" class="music-player-bar">
    <div class="music-player-bar__content">
        <button class="music-player-bar__toggle">
            <span class="music-player-bar__toggle--play">
                <?php
                    $icon_path = plugin_dir_path(__FILE__) . '../../assets/icons/play.svg';
                    if (file_exists($icon_path)) {
                        echo file_get_contents($icon_path);
                    }
                ?>
            </span>

            <span class="music-player-bar__toggle--pause">
                <?php
                    $icon_path = plugin_dir_path(__FILE__) . '../../assets/icons/pause.svg';
                    if (file_exists($icon_path)) {
                        echo file_get_contents($icon_path);
                    }
                ?>
            </span>
        </button>
        <span class="music-player-bar__info">
            <span class="music-player-bar__track-title">Título da faixa</span>
            <span class="music-player-bar__track-artist">Artista</span>
        </span>
    </div>
</div>
