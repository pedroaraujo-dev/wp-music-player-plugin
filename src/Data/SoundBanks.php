<?php

namespace MusicPlayer\Data;

class SoundBanks
{
    public static function getAll()
    {
        $json = get_option('sound_banks_data', '[]');
        $banks = json_decode($json, true);

        return $banks;
    }
}