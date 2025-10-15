<?php

namespace MusicPlayer\Assets;

class Loader
{
    public static function init()
    {
        add_action('wp_enqueue_scripts', [self::class, 'enqueueFrontendAssets']);
        add_action('wp_footer', [self::class, 'renderFixedBar']);
        add_action('wp_head', [self::class, 'injectCustomCSSVariables']);
    }

    /**
     * Carrega os assets apenas se houver player.
     */
    public static function enqueueFrontendAssets(): void
    {
        $base_css = plugin_dir_url(__FILE__) . '../../assets/styles/';
        $base_js  = plugin_dir_url(__FILE__) . '../../dist/';
        $path_css = plugin_dir_path(__FILE__) . '../../assets/styles/';
        $path_js  = plugin_dir_path(__FILE__) . '../../dist/';

        $player_css = $path_css . 'player.css';
        $sound_bank_css = $path_css . 'sound-bank.css';
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
            'music-player-sound-bank-style',
            $base_css . 'sound-bank.css',
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

        // Inclui o site id para o script
        wp_localize_script(
            'music-player-script',
            'musicPlayer',
            [
                'ajaxUrl' => admin_url('admin-ajax.php'),
                'nonce'   => wp_create_nonce('music_player_nonce'),
                'siteId'  => get_option('music_player_site_id'),
            ]
        );
    }

    /**
     * Renderiza uma barra fixa global (apenas se houver player).
     */
    public static function renderFixedBar(): void
    {
        include plugin_dir_path(__FILE__) . '/../Views/fixed-bar-view.php';
    }

    /**
     * Injeta variáveis CSS personalizadas no frontend.
     */
    public static function injectCustomCSSVariables(): void
    {
        $cssFields = [
            // 🎵 PLAYER SETTINGS
            'playlist_title_color',
            'playlist_bg_color',
            'audio_text_color',
            'audio_bg_color',
            'button_icon_color',
            'button_bg_color',
            'download_icon_color',

            // 📊 FIXED BAR SETTINGS
            'fixed_bar_bg_color',
            'fixed_bar_text_color',
            'fixed_bar_button_icon_color',
            'fixed_bar_navigation_icon_color',
            'fixed_bar_button_color',
            'fixed_bar_close_icon_color',

            // 🎧 SOUND BANK SETTINGS
            'sound_bank_button_background_color',
            'sound_bank_button_text_color',
            'sound_bank_button_background_color_active',
            'sound_bank_button_text_color_active',
        ];

        $cssVariables = '';
        foreach ($cssFields as $key) {
            $value = get_option($key);
            if ($value !== false && $value !== '') {
                $cssVariables .= "--{$key}: {$value};\n";
            }
        }

        if ($cssVariables) {
            echo "<style id='music-player-css-vars'>body {{$cssVariables}}</style>";
        }
    }
}
