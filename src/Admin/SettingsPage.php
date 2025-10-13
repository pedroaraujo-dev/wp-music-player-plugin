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
         *  SEÇÃO: CONFIGURAÇÕES GERAIS
         * ------------------------- */

        add_settings_section(
            'music_player_general_section',
            '⚙️ Configurações Gerais',
            function () {
                echo '<p>Configurações gerais do plugin Music Player.</p>';
            },
            'music-player-settings'
        );

        register_setting('music_player_settings', 'music_player_site_id');

        add_settings_field(
            'music_player_site_id',
            'Site ID',
            [self::class, 'renderTextField'],
            'music-player-settings',
            'music_player_general_section',
            ['id' => 'music_player_site_id']
        );

        /* -------------------------
         *  SEÇÃO: PLAYER SETTINGS
         * ------------------------- */

        $playerFields = [
            'playlist_title_color' => 'Cor do título da IPlaylist',
            'playlist_bg_color' => 'Cor de fundo da IPlaylist',
            'audio_text_color' => 'Cor dos textos do áudio na IPlaylist',
            'audio_bg_color' => 'Cor de fundo do áudio na IPlaylist',
            'button_icon_color' => 'Cor do ícone de Play/Pause',
            'button_bg_color' => 'Cor do botão de Play/Pause',
            'download_icon_color' => 'Cor do botão de Download',
        ];

        add_settings_section(
            'music_player_section',
            '🎵 Personalização do Player',
            function () {
                echo '<p>Defina as cores para o player de música e sua playlist.</p>';
                echo '<p class="description">Aceita formatos: rgba() ou #rrggbbaa.</p>';
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
                echo '<p class="description">Aceita formatos: rgba() ou #rrggbbaa.</p>';
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

        /* -------------------------
         *  SEÇÃO: BANCO DE TRILHAS
         * ------------------------- */

        add_settings_section(
            'music_player_soundbanks_section',
            '🎧 Banco de Trilhas',
            function () {
                echo '<p>Configure o banco de trilhas em formato JSON.</p>';
            },
            'music-player-settings'
        );

        register_setting('music_player_settings', 'sound_banks_data');

        add_settings_field(
            'sound_banks_data',
            'Banco de Trilhas (JSON)',
            [self::class, 'renderTextAreaField'],
            'music-player-settings',
            'music_player_soundbanks_section',
            ['id' => 'sound_banks_data']
        );
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
        ";
    }

    public static function renderPage()
    {
        include plugin_dir_path(__FILE__) . '/../Views/admin-settings-view.php';
    }

    public static function renderTextAreaField($args)
    {
        $id = $args['id'];
        $value = get_option($id, '');
        echo "
            <textarea 
                id='{$id}' 
                name='{$id}' 
                rows='8' 
                cols='60'
                placeholder='[{\"id\":\"rock\",\"name\":\"Rock\",\"icon\":\"rock.svg\"}]'
            >{$value}</textarea>
            <p class='description'>Insira os dados em formato JSON válido.</p>
        ";
    }

    public static function renderTextField($args)
    {
        $id = $args['id'];
        $value = esc_attr(get_option($id, ''));
        echo "
            <input 
                type='text' 
                id='{$id}' 
                name='{$id}' 
                value='{$value}' 
                placeholder='ex: site_12345' 
                style='width: 300px;'
            />
        ";
    }
}
