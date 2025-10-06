<?php

namespace MusicPlayer\Admin;

class SettingsPage
{
    public static function registerMenu()
    {
        add_menu_page(
            'Music Player',
            'Music Player',
            'manage_options',
            'music-player-settings',
            [self::class, 'renderPage'],
            'dashicons-format-audio',
            100
        );
    }

    public static function registerSettings()
    {
        /* -------------------------
         *  SEÇÃO: PLAYER SETTINGS
         * ------------------------- */

        $playerFields = [
            'playlist_title_color' => 'Cor do título da Playlist',
            'playlist_bg_color' => 'Cor de fundo da Playlist',
            'audio_text_color' => 'Cor dos textos do áudio na Playlist',
            'audio_bg_color' => 'Cor de fundo do áudio na Playlist',
            'button_icon_color' => 'Cor do ícone de Play/Pause',
            'button_bg_color' => 'Cor do botão de Play/Pause',
            'download_icon_color' => 'Cor do botão de Download',
        ];

        add_settings_section(
            'music_player_section',
            '🎵 Personalização do Player',
            function () {
                echo '<p>Defina as cores para o player de música e sua playlist.</p>';
            },
            'music-player-settings'
        );

        foreach ($playerFields as $key => $label) {
            register_setting('music_player_settings', $key);
            add_settings_field(
                $key,
                $label,
                [self::class, 'renderColorField'],
                'music-player-settings',
                'music_player_section',
                ['id' => $key]
            );
        }

        /* -------------------------
         *  SEÇÃO: FIXED BAR SETTINGS
         * ------------------------- */

        $barFields = [
            'fixed_bar_bg_color'   => 'Cor de fundo da barra fixa',
            'fixed_bar_text_color' => 'Cor do texto da barra fixa',
            'fixed_bar_button_color' => 'Cor do botão principal',
        ];

        add_settings_section(
            'music_player_fixed_bar_section',
            '📊 Personalização da Fixed Bar',
            function () {
                echo '<p>Defina as cores da barra fixa global do player.</p>';
            },
            'music-player-settings'
        );

        foreach ($barFields as $key => $label) {
            register_setting('music_player_settings', $key);
            add_settings_field(
                $key,
                $label,
                [self::class, 'renderColorField'],
                'music-player-settings',
                'music_player_fixed_bar_section',
                ['id' => $key]
            );
        }
    }

    public static function renderColorField($args)
    {
        $id = $args['id'];
        $value = get_option($id, 'rgba(0, 0, 0, 1)');

        echo "
            <input 
                type='text' 
                id='{$id}' 
                name='{$id}' 
                value='{$value}' 
                class='music-player-color-field'
                placeholder='rgba(255, 255, 255, 0.8)' 
                style='width: 160px;'
            />
            <p class='description'>Aceita formatos: rgba() ou #rrggbbaa.</p>
        ";
    }

    public static function renderPage()
    {
        include plugin_dir_path(__FILE__) . '/../Views/admin-settings-view.php';
    }
}
