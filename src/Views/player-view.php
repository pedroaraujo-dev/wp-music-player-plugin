<?php
$playlist_title_color = get_option('playlist_title_color', '#0d1b2a');
$playlist_bg_color    = get_option('playlist_bg_color', '#f3f3f3');
$audio_bg_color       = get_option('audio_bg_color', '#e0e1dd');
$button_bg_color      = get_option('button_bg_color', '#f77f00');
$button_icon_color    = get_option('button_icon_color', '#ffffff');
$audio_text_color     = get_option('audio_text_color', '#0d1b2a');
$download_icon_color  = get_option('download_icon_color', '#f77f00');
?>

<div
    class="music-player"
    data-site="<?php echo esc_attr($site); ?>"
    data-playlist="<?php echo esc_attr($playlist); ?>"
    style="background-color: <?php echo esc_attr($playlist_bg_color); ?>;"
>
    <div class="music-player__title" style="color: <?php echo esc_attr($playlist_title_color); ?>;">
        <?php echo esc_html($title); ?>
    </div>

    <div class="music-player__playlist">
        <div
            class="music-player__item playing"
            style="background-color: <?php echo esc_attr($audio_bg_color); ?>; color: <?php echo esc_attr($audio_text_color); ?>;"
        >
            <div class="music-player__item-left">
                <button 
                    class="music-player__button"
                    style="background-color: <?php echo esc_attr($button_bg_color); ?>; color: <?php echo esc_attr($button_icon_color); ?>;"
                    aria-label="Play/Pause"
                >
                    <span class="music-player__icon--play">
                        <?php
                            $icon_path = plugin_dir_path(__FILE__) . '../../assets/icons/play.svg';
                            if (file_exists($icon_path)) {
                                echo file_get_contents($icon_path);
                            }
                        ?>
                    </span>

                    <span class="music-player__icon--pause">
                        <?php
                            $icon_path = plugin_dir_path(__FILE__) . '../../assets/icons/pause.svg';
                            if (file_exists($icon_path)) {
                                echo file_get_contents($icon_path);
                            }
                        ?>
                    </span>
                </button>

                <div class="music-player__track-info">
                    <div class="music-player__track-position">
                        1 
                    </div>

                    <div class="music-player__track-separator">
                        -
                    </div>

                    <div class="music-player__track-title">
                        Martins
                    </div>
                </div>
            </div>

            <div class="music-player__item-right">
                <div class="music-player__duration">
                    1:29
                </div>

                <div
                    class="music-player__download"
                    style="color: <?php echo esc_attr($download_icon_color); ?>;"
                >
                    <span class="music-player__icon--download">
                        <?php
                            $icon_path = plugin_dir_path(__FILE__) . '../../assets/icons/download.svg';
                            if (file_exists($icon_path)) {
                                echo file_get_contents($icon_path);
                            }
                        ?>
                    </span>

                    <span class="music-player__icon--loading">
                        <?php
                            $icon_path = plugin_dir_path(__FILE__) . '../../assets/icons/loading.svg';
                            if (file_exists($icon_path)) {
                                echo file_get_contents($icon_path);
                            }
                        ?>
                    </span>
                </div>
            </div>
        </div>

        <div
            class="music-player__item"
            style="background-color: <?php echo esc_attr($audio_bg_color); ?>; color: <?php echo esc_attr($audio_text_color); ?>;"
        >
            <div class="music-player__item-left">
                <button 
                    class="music-player__button"
                    style="background-color: <?php echo esc_attr($button_bg_color); ?>; color: <?php echo esc_attr($button_icon_color); ?>;"
                    aria-label="Play/Pause"
                >
                    <span class="music-player__icon--play">
                        <?php
                            $icon_path = plugin_dir_path(__FILE__) . '../../assets/icons/play.svg';
                            if (file_exists($icon_path)) {
                                echo file_get_contents($icon_path);
                            }
                        ?>
                    </span>

                    <span class="music-player__icon--pause">
                        <?php
                            $icon_path = plugin_dir_path(__FILE__) . '../../assets/icons/pause.svg';
                            if (file_exists($icon_path)) {
                                echo file_get_contents($icon_path);
                            }
                        ?>
                    </span>
                </button>

                <div class="music-player__track-info">
                    <div class="music-player__track-position">
                        2 
                    </div>

                    <div class="music-player__track-separator">
                        -
                    </div>

                    <div class="music-player__track-title">
                        Martins
                    </div>
                </div>
            </div>

            <div class="music-player__item-right">
                <div class="music-player__duration">
                    1:29
                </div>

                <div
                    class="music-player__download downloading"
                    style="color: <?php echo esc_attr($download_icon_color); ?>;"
                >
                    <span class="music-player__icon--download">
                        <?php
                            $icon_path = plugin_dir_path(__FILE__) . '../../assets/icons/download.svg';
                            if (file_exists($icon_path)) {
                                echo file_get_contents($icon_path);
                            }
                        ?>
                    </span>

                    <span class="music-player__icon--loading">
                        <?php
                            $icon_path = plugin_dir_path(__FILE__) . '../../assets/icons/loading.svg';
                            if (file_exists($icon_path)) {
                                echo file_get_contents($icon_path);
                            }
                        ?>
                    </span>
                </div>
            </div>
        </div>
    </div>
</div>
