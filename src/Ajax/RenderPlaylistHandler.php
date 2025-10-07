<?php

namespace MusicPlayer\Ajax;

class RenderPlaylistHandler
{
    public static function register(): void
    {
        add_action('wp_ajax_render_playlist_items', [self::class, 'handle']);
        add_action('wp_ajax_nopriv_render_playlist_items', [self::class, 'handle']);
    }

    public static function handle(): void
    {
        $playlist = json_decode(stripslashes($_POST['playlist'] ?? '[]'), true);

        if (empty($playlist) || !is_array($playlist)) {
            wp_send_json_error('Playlist inválida ou vazia.');
        }

        ob_start();
        foreach ($playlist as $index => $audio) {
            $context = [
                'audio' => $audio,
                'index' => $index,
            ];
            self::renderView($context);
        }
        $html = ob_get_clean();

        wp_send_json_success(['html' => $html]);
    }
    
    private static function renderView(array $context): void
    {
        $view_path = plugin_dir_path(__FILE__) . '/../Views/playlist-item.php';
        if (file_exists($view_path)) {
            extract($context);
            include $view_path;
        }
    }
}
