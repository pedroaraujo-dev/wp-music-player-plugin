<?php

namespace MusicPlayer\Ajax;

use MusicPlayer\Assets\Loader;

class RenderPlayerHandler
{
    public static function register(): void
    {
        add_action('wp_ajax_render_music_player', [self::class, 'handle']);
        add_action('wp_ajax_nopriv_render_music_player', [self::class, 'handle']);
    }

    public static function handle(): void
    {
        $playlist = sanitize_text_field($_POST['playlist'] ?? '');
        $title = sanitize_text_field($_POST['title'] ?? '');
        $site = get_option('music_player_site_id', '');

        Loader::markPlayerPresent();

        ob_start();
        include plugin_dir_path(__FILE__) . '/../Views/player-view.php';
        $html = ob_get_clean();

        wp_send_json_success(['html' => $html]);
    }
}
