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
            'playlist_title_color' => 'Cor do título da Playlist',
            'playlist_bg_color' => 'Cor de fundo da Playlist',
            'audio_text_color' => 'Cor dos textos do áudio na Playlist',
            'audio_bg_color' => 'Cor de fundo do áudio na Playlist',
            'audio_active_bg_color' => 'Cor de fundo do áudio ativo na Playlist',
            'button_icon_color' => 'Cor do ícone de Play/Pause do áudio na Playlist',
            'button_bg_color' => 'Cor do botão de Play/Pause do áudio na Playlist',
            'download_icon_color' => 'Cor do botão de Download do áudio na Playlist',
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
            'fixed_bar_text_color' => 'Cor dos textos da barra fixa',
            'fixed_bar_button_icon_color' => 'Cor do ícone do botão Play/Pause da barra fixa',
            'fixed_bar_navigation_icon_color' => 'Cor do ícone Próximo/Anterior da barra fixa',
            'fixed_bar_button_color' => 'Cor de fundo do botão Play/Pause da barra fixa',
            'fixed_bar_close_icon_color' => 'Cor do ícone de fechar da barra fixa',
            'fixed_bar_download_icon_color' => 'Cor do ícone de download da barra fixa',
            'fixed_bar_download_button_color' => 'Cor de fundo do botão de download da barra fixa',
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

        $soundBankFields = [
            'sound_bank_button_background_color'   => 'Cor de fundo do botão do banco de trilhas',
            'sound_bank_button_text_color' => 'Cor do texto do botão do banco de trilhas',
            'sound_bank_button_background_color_active'   => 'Cor de fundo do botão do banco de trilhas ativo',
            'sound_bank_button_text_color_active' => 'Cor do texto do botão do banco de trilhas ativo',
        ];

        foreach ($soundBankFields as $key => $label) {
            register_setting('music_player_settings', $key);
            add_settings_field(
                $key,
                $label,
                [self::class, 'renderColorField'],
                'music-player-settings',
                'music_player_soundbanks_section',
                ['id' => $key]
            );
        }

        register_setting('music_player_settings', 'sound_banks_data');

        add_settings_field(
            'sound_banks_data',
            'Banco de Trilhas (JSON)',
            [self::class, 'renderTextAreaField'],
            'music-player-settings',
            'music_player_soundbanks_section',
            ['id' => 'sound_banks_data']
        );

        /* -------------------------
        *  SECTION: PLAYER SKELETON
        * ------------------------- */

        add_settings_section(
            'music_player_skeleton_section',
            '💀 Player Skeleton',
            function () {
                echo '<p>Define the appearance of the loading skeleton for the player.</p>';
                echo '<p class="description">Accepts formats like rgba() or #rrggbbaa.</p>';
            },
            'music-player-settings'
        );

        $skeletonFields = [
            'skeleton_background_color' => 'Skeleton background color',
            'skeleton_gradient_color'   => 'Skeleton animation gradient color',
            'skeleton_element_color'    => 'Skeleton element background color',
        ];

        foreach ($skeletonFields as $key => $label) {
            register_setting('music_player_settings', $key);
            add_settings_field(
                $key,
                $label,
                [self::class, 'renderColorField'],
                'music-player-settings',
                'music_player_skeleton_section',
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
