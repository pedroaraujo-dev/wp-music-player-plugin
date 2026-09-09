<?php

namespace MusicPlayer\Data;

class SoundBanks
{
    public static function getAll()
    {
        $json = get_option('sound_banks_data', '[]');
        $banks = \MusicPlayer\Admin\Validation::banks($json) ?? [];

        return $banks;
    }
}