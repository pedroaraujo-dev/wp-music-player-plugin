<?php

namespace MusicPlayer\Data;

class PublicPlaylists
{
    public static function register(): void
    {
        add_action('wp_ajax_music_player_playlist', [self::class, 'handle']);
        add_action('wp_ajax_nopriv_music_player_playlist', [self::class, 'handle']);
    }

    public static function cacheKey(string $url): string
    {
        return 'music_playlist_v1_' . hash('sha256', $url);
    }

    /** Returns the public document, null for 404, or WP_Error. Never serves stale data. */
    public static function read(string $key)
    {
        $entry = null;
        foreach (SoundBanks::getAll() as $bank) {
            if ($bank['id'] === $key) { $entry = $bank; break; }
        }
        $url = $entry['url'] ?? '';
        if (!$url || !\MusicPlayer\Admin\Validation::playlistURL($url)) {
            return new \WP_Error('playlist_config', 'Configure a URL HTTPS pública desta playlist no Music Player.');
        }
        $cacheKey = self::cacheKey($url);
        $cached = get_transient($cacheKey);
        if (is_array($cached) && isset($cached['document'])) return $cached['document'];

        $response = wp_safe_remote_get($url, ['timeout' => 10, 'limit_response_size' => 5 * 1024 * 1024]);
        if (is_wp_error($response)) {
            delete_transient($cacheKey);
            return new \WP_Error('playlist_network', 'Playlist temporariamente indisponível. Tente novamente no próximo acesso.');
        }
        $status = (int) wp_remote_retrieve_response_code($response);
        if ($status === 404) { delete_transient($cacheKey); return null; }
        if ($status !== 200) {
            delete_transient($cacheKey);
            return new \WP_Error('playlist_http', $status === 403
                ? 'A playlist não permite leitura pública. Confirme a URL com o responsável pela publicação.'
                : 'Playlist temporariamente indisponível. Tente novamente no próximo acesso.');
        }
        $body = wp_remote_retrieve_body($response);
        $data = json_decode($body, true);
        $shape = json_decode($body);
        if (json_last_error() !== JSON_ERROR_NONE || !is_object($shape)
            || ($data['schema_version'] ?? null) !== 1 || !is_object($shape->playlist ?? null)
            || !is_array($shape->audio_assets ?? null)) {
            delete_transient($cacheKey);
            return new \WP_Error('playlist_schema', 'Formato de playlist inválido ou incompatível.');
        }
        foreach ($data['audio_assets'] as $audio) {
            if (!is_array($audio) || !is_string($audio['file_url'] ?? null)
                || !\MusicPlayer\Admin\Validation::playlistURL($audio['file_url'])) {
                delete_transient($cacheKey);
                return new \WP_Error('playlist_schema', 'A playlist contém um áudio com URL HTTPS inválida.');
            }
        }
        set_transient($cacheKey, ['document' => $data], 30);
        return $data;
    }

    // The public contract has no mandatory audio ID. A URL-based ID survives reordering.
    public static function audioId(string $key, string $url): string
    {
        return hash('sha256', $key . "\n" . $url);
    }

    public static function handle(): void
    {
        // Public read-only endpoint: accepts only administrator-configured aliases, never URLs.
        $key = isset($_GET['playlist']) && is_string($_GET['playlist']) ? sanitize_text_field(wp_unslash($_GET['playlist'])) : '';
        $data = self::read($key);
        nocache_headers();
        if ($data === null) { wp_send_json(['success' => true, 'data' => null]); return; }
        if (is_wp_error($data)) { wp_send_json_error(['message' => $data->get_error_message()], 502); return; }
        foreach ($data['audio_assets'] as &$audio) {
            $audio['_player_id'] = self::audioId($key, $audio['file_url']);
        }
        unset($audio);
        wp_send_json_success($data);
    }
}
