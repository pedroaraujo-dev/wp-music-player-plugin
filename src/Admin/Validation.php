<?php

namespace MusicPlayer\Admin;

class Validation
{
    public static function color($value): ?string
    {
        if (!is_string($value)) return null;
        $value = trim($value);
        if ($value === '' || strtolower($value) === 'transparent') return strtolower($value);
        if (preg_match('/^#(?:[a-f0-9]{3}|[a-f0-9]{4}|[a-f0-9]{6}|[a-f0-9]{8})$/i', $value)) return $value;
        if (!preg_match('/^(rgb|rgba)\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*(0|1|0?\.\d+|1\.0+))?\s*\)$/i', $value, $parts)) return null;
        if (max((int) $parts[2], (int) $parts[3], (int) $parts[4]) > 255) return null;
        if ((strtolower($parts[1]) === 'rgba') !== isset($parts[5])) return null;
        return $value;
    }

    public static function colorOption(string $key, string $default = ''): string
    {
        return self::color(get_option($key, $default)) ?? $default;
    }

    public static function saveColor($value, string $key): string
    {
        $color = self::color($value);
        if ($color !== null) return $color;
        add_settings_error($key, 'invalid_color', 'Cor inválida. Use hexadecimal, rgb() ou rgba().');
        return self::colorOption($key);
    }

    public static function banks($value): ?array
    {
        if (!is_string($value)) return null;
        if (trim($value) === '') return [];
        if (!is_array(json_decode($value))) return null;
        $banks = json_decode($value, true);
        $result = [];
        $ids = [];
        foreach ($banks as $bank) {
            if (!is_array($bank) || !isset($bank['id'], $bank['name']) || !is_string($bank['id']) || !is_string($bank['name'])) return null;
            $id = sanitize_text_field($bank['id']);
            $name = sanitize_text_field($bank['name']);
            if ($id === '' || $name === '' || in_array($id, $ids, true)) return null;
            $icon = $bank['icon'] ?? '';
            if (!is_string($icon)) return null;
            $safeIcon = esc_url_raw($icon, ['http', 'https']);
            if ($icon !== '' && $safeIcon === '') return null;
            $ids[] = $id;
            $result[] = ['id' => $id, 'name' => $name, 'icon' => $safeIcon];
        }
        return $result;
    }

    public static function saveBanks($value): string
    {
        $banks = self::banks($value);
        if ($banks !== null) return wp_json_encode($banks, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        add_settings_error('sound_banks_data', 'invalid_banks', 'JSON inválido. Informe uma lista com id único, name e icon opcional.');
        return wp_json_encode(self::banks(get_option('sound_banks_data', '[]')) ?? [], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    }
}
