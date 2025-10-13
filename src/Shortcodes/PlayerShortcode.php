<?php

namespace MusicPlayer\Shortcodes;

use MusicPlayer\Assets\Loader;

class PlayerShortcode
{
    private static bool $styleEnqueued = false;

    public static function render($atts = [], $content = null)
    {
        $atts = shortcode_atts([
            'playlist' => '',
            'title' => ''
        ], $atts, 'music_player');

        $site = get_option('music_player_site_id', '');
        $playlist = sanitize_text_field($atts['playlist']);
        $title = sanitize_text_field($atts['title']);

        Loader::markPlayerPresent();

        ob_start();
        include plugin_dir_path(__FILE__) . '/../Views/player-view.php';
        return ob_get_clean();
    }
}
