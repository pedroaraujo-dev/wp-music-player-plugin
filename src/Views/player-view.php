<?php
$playlist_title_color = get_option('playlist_title_color', '#003049');
$playlist_bg_color    = get_option('playlist_bg_color', '#f3f3f3');
?>

<div
    class="music-player"
    data-site="<?php echo esc_attr($site); ?>"
    data-playlist="<?php echo esc_attr($playlist); ?>"
    style="background: <?php echo esc_attr($playlist_bg_color); ?>;"
>
    <div class="music-player__title" style="color: <?php echo esc_attr($playlist_title_color); ?>;">
        <?php echo esc_html($title); ?>
    </div>

    <div class="music-player__playlist"></div>
</div>
