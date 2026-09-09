<?php

namespace MusicPlayer\Data;

class SoundBanks
{
    public static function renderIcon(string $icon): void
    {
        if ($icon === '') return;
        if (preg_match('/^[a-zA-Z0-9_-]+(?: [a-zA-Z0-9_-]+)*$/', $icon)) {
            echo '<span class="' . esc_attr($icon) . '" aria-hidden="true"></span>';
        } else {
            echo '<img src="' . esc_url($icon) . '" alt="" width="20" height="20">';
        }
    }

    public static function getLibrary(): array
    {
        return array_values(array_filter(self::getAll(), function ($playlist) {
            return $playlist['sound_bank'] ?? true;
        }));
    }

    public static function getAll()
    {
        $json = get_option('sound_banks_data', '[]');
        $banks = \MusicPlayer\Admin\Validation::banks($json) ?? [];

        return $banks;
    }
}