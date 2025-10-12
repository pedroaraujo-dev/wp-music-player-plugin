<?php
/**
 * View: IPlaylist Item
 *
 * Variáveis disponíveis:
 * @var array $audio
 * @var int   $index
 */

$playlist_title_color = get_option('playlist_title_color', '#0d1b2a');
$playlist_bg_color    = get_option('playlist_bg_color', '#f3f3f3');
$audio_bg_color       = get_option('audio_bg_color', '#e0e1dd');
$button_bg_color      = get_option('button_bg_color', '#f77f00');
$button_icon_color    = get_option('button_icon_color', '#ffffff');
$audio_text_color     = get_option('audio_text_color', '#0d1b2a');
$download_icon_color  = get_option('download_icon_color', '#f77f00');

$title    = esc_html($audio['name'] ?? 'Sem título');
$duration = esc_html($audio['duration'] ?? '--:--');
$url      = esc_url($audio['url'] ?? '#');

?>
<div 
    class="music-player__item" 
    data-index="<?php echo esc_attr($index); ?>"
    data-id="<?php echo esc_attr($audio['id'] ?? ''); ?>"
    style="background-color: <?php echo esc_attr($audio_bg_color); ?>; color: <?php echo esc_attr($audio_text_color); ?>;"
    data-url="<?php echo $url; ?>"
>
    <div class="music-player__item-left">
        <button 
            class="music-player__button music-player__button--play"
            style="background-color: <?php echo esc_attr($button_bg_color); ?>; color: <?php echo esc_attr($button_icon_color); ?>;"
            aria-label="Play áudio"
        >
            <?php
                $icon_path = plugin_dir_path(__FILE__) . '../../assets/icons/play.svg';
                if (file_exists($icon_path)) {
                    echo file_get_contents($icon_path);
                }
            ?>
        </button>

        <button 
            class="music-player__button music-player__button--pause"
            style="background-color: <?php echo esc_attr($button_bg_color); ?>; color: <?php echo esc_attr($button_icon_color); ?>; display: none;"
            aria-label="Pause áudio"
        >
            <?php
                $icon_path = plugin_dir_path(__FILE__) . '../../assets/icons/pause.svg';
                if (file_exists($icon_path)) {
                    echo file_get_contents($icon_path);
                }
            ?>
        </button>

        <div class="music-player__track-info">
            <div class="music-player__track-position"><?php echo $index + 1; ?></div>
            <div class="music-player__track-separator">-</div>
            <div class="music-player__track-title"><?php echo $title; ?></div>
        </div>
    </div>

    <div class="music-player__item-right">
        <div class="music-player__duration"><?php echo $duration; ?></div>

        <div 
            class="music-player__download"
            style="color: <?php echo esc_attr($download_icon_color); ?>;"
            data-url="<?php echo $url; ?>"
        >
            <?php
                $icon_path = plugin_dir_path(__FILE__) . '../../assets/icons/download.svg';
                if (file_exists($icon_path)) {
                    echo file_get_contents($icon_path);
                }
            ?>
        </div>

        <div 
            class="music-player__loading"
            style="color: <?php echo esc_attr($download_icon_color); ?>; display: none;"
            data-url="<?php echo $url; ?>"
        >
            <?php
                $icon_path = plugin_dir_path(__FILE__) . '../../assets/icons/loading.svg';
                if (file_exists($icon_path)) {
                    echo file_get_contents($icon_path);
                }
            ?>
        </div>
    </div>
</div>
