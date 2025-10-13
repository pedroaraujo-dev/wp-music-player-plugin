<?php

namespace MusicPlayer;

use MusicPlayer\Assets\Loader;
use MusicPlayer\Admin\SettingsPage;
use MusicPlayer\Shortcodes\PlayerShortcode;
use MusicPlayer\Shortcodes\SoundBankShortcode;
use MusicPlayer\Ajax\RenderPlaylistHandler;
use MusicPlayer\Ajax\RenderPlayerHandler;

class Init
{
    public static function register()
    {
        Loader::init();
        
        RenderPlaylistHandler::register();
        RenderPlayerHandler::register();
        
        add_action('init', [self::class, 'init']);
        add_action('admin_menu', [SettingsPage::class, 'registerMenu']);
        add_action('admin_init', [SettingsPage::class, 'registerSettings']);
    }

    public static function init()
    {
        add_shortcode('music_player', [PlayerShortcode::class, 'render']);
        add_shortcode('sound_bank',   [SoundBankShortcode::class, 'render']);
    }
}
