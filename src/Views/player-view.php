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

    <div class="music-player__playlist"></div>
</div>
