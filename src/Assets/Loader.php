<?php

namespace MusicPlayer\Assets;

class Loader
{
    private static bool $styleEnqueued = false;
    private static bool $playerDetected = false;

    public static function init()
    {
        add_action('wp_enqueue_scripts', [self::class, 'enqueueFrontendAssets']);
        add_action('wp_footer', [self::class, 'renderFixedBar']);
    }

    /**
     * Chamado pelo shortcode para registrar que há um player na página.
     */
    public static function markPlayerPresent(): void
    {
        self::$playerDetected = true;
    }

    /**
     * Carrega os assets apenas se houver player.
     */
    public static function enqueueFrontendAssets(): void
    {
        if (!self::$playerDetected || self::$styleEnqueued) {
            return;
        }

        $base_css = plugin_dir_url(__FILE__) . '../../assets/styles/';
        $base_js  = plugin_dir_url(__FILE__) . '../../dist/';
        $path_css = plugin_dir_path(__FILE__) . '../../assets/styles/';
        $path_js  = plugin_dir_path(__FILE__) . '../../dist/';

        $player_css = $path_css . 'player.css';
        $fixed_css  = $path_css . 'fixed-bar.css';
        $player_js  = $path_js . 'main.js';

         wp_enqueue_style(
            'music-player-style',
            $base_css . 'player.css',
            [],
            filemtime($player_css),
            'all'
        );

        wp_enqueue_style(
            'music-player-fixed-bar-style',
            $base_css . 'fixed-bar.css',
            ['music-player-style'],
            filemtime($fixed_css),
            'all'
        );

        wp_enqueue_script(
            'music-player-script',
            $base_js . 'main.js',
            [],
            filemtime($player_js),
            true
        );

        add_filter('script_loader_tag', function ($tag, $handle, $src) {
            if ($handle === 'music-player-script') {
                $tag = '<script type="module" src="' . esc_url($src) . '"></script>';
            }
            return $tag;
        }, 10, 3);

        // Expõe a URL do AJAX e nonce para o script
        wp_localize_script(
            'music-player-script',
            'musicPlayer',
            [
                'ajaxUrl' => admin_url('admin-ajax.php'),
                'nonce'   => wp_create_nonce('music_player_nonce'),
            ]
        );

        self::$styleEnqueued = true;
    }

    /**
     * Renderiza uma barra fixa global (apenas se houver player).
     */
    public static function renderFixedBar(): void
    {
        if (!self::$playerDetected) {
            return;
        }

        include plugin_dir_path(__FILE__) . '/../Views/fixed-bar-view.php';
    }
}
