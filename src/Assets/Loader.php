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

        $base_url = plugin_dir_url(__FILE__)    . '../../assets/css/';
        $player_css = plugin_dir_path(__FILE__) . '../../assets/css/player.css';
        $fixed_css  = plugin_dir_path(__FILE__) . '../../assets/css/fixed-bar.css';

        wp_enqueue_style(
            'music-player-style',
            $base_url . 'player.css',
            [],
            filemtime($player_css),
            'all'
        );

        wp_enqueue_style(
            'music-player-fixed-bar-style',
            $base_url . 'fixed-bar.css',
            ['music-player-style'],
            filemtime($fixed_css),
            'all'
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
