<?php

namespace MusicPlayer\Shortcodes;

use MusicPlayer\Data\SoundBanks;

class SoundBankShortcode
{
    private static bool $styleEnqueued = false;

    public static function render($atts = [], $content = null)
    {

        $soundBanks = SoundBanks::getLibrary();
        
        ob_start();
        include plugin_dir_path(__FILE__) . '/../Views/sound-bank-view.php';
        return ob_get_clean();
    }
}
