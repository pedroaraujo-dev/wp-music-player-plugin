<?php

namespace MusicPlayer\Shortcodes;

use MusicPlayer\Data\SoundBanks;

class SoundBankShortcode
{
    private static bool $styleEnqueued = false;

    public static function render($atts = [], $content = null)
    {
        $site = get_option('music_player_site_id', '');

        $soundBanks = SoundBanks::getAll();
        
        ob_start();
        include plugin_dir_path(__FILE__) . '/../Views/sound-bank-view.php';
        return ob_get_clean();
    }
}
