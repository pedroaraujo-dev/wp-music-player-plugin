<?php

namespace MusicPlayer;

use MusicPlayer\Assets\Loader;
use MusicPlayer\Admin\SettingsPage;
use MusicPlayer\Shortcodes\PlayerShortcode;
use MusicPlayer\Ajax\RenderPlaylistHandler;

class Init
{
    public static function register()
    {
        Loader::init();
        RenderPlaylistHandler::register();
        
        add_action('init', [self::class, 'init']);
        add_action('admin_menu', [SettingsPage::class, 'registerMenu']);
        add_action('admin_init', [SettingsPage::class, 'registerSettings']);
    }

    public static function init()
    {
        add_shortcode('music_player', [PlayerShortcode::class, 'render']);
    }
}
