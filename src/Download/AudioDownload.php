<?php

namespace MusicPlayer\Download;

class AudioDownload
{
    public static function register(): void
    {
        add_action('wp_ajax_music_player_download', [self::class, 'handle']);
        add_action('wp_ajax_nopriv_music_player_download', [self::class, 'handle']);
    }

    public static function resolveAudio(string $playlist, string $id)
    {
        $data = \MusicPlayer\Data\PublicPlaylists::read($playlist);
        if (is_wp_error($data)) return $data;
        if ($data !== null) foreach ($data['audio_assets'] as $item) {
            $url = $item['file_url'];
            if (\MusicPlayer\Data\PublicPlaylists::audioId($playlist, $url) !== $id) continue;
            if (!wp_http_validate_url($url)) break;
            return ['url' => $url, 'name' => is_string($item['name'] ?? null) ? $item['name'] : 'audio'];
        }
        return new \WP_Error('not_found', 'Áudio não encontrado ou indisponível.');
    }

    public static function handle(): void
    {
        if (!check_ajax_referer('music_player_nonce', 'nonce', false)) {
            wp_send_json_error(['message' => 'Sessão expirada. Atualize a página.'], 403);
            return;
        }
        $playlist = isset($_POST['playlist']) && is_string($_POST['playlist']) ? sanitize_text_field(wp_unslash($_POST['playlist'])) : '';
        $id = isset($_POST['id']) && is_string($_POST['id']) ? sanitize_text_field(wp_unslash($_POST['id'])) : '';
        $audio = self::resolveAudio($playlist, $id);
        if (is_wp_error($audio)) {
            wp_send_json_error(['message' => $audio->get_error_message()], $audio->get_error_code() === 'not_found' ? 404 : 502);
            return;
        }
        require_once ABSPATH . 'wp-admin/includes/file.php';
        $file = wp_tempnam('music-player');
        if (!$file) {
            wp_send_json_error(['message' => 'Não foi possível preparar o download.'], 500);
            return;
        }
        try {
            $limit = 50 * 1024 * 1024;
            $response = wp_safe_remote_get($audio['url'], [
                'timeout' => 60,
                'stream' => true,
                'filename' => $file,
                'limit_response_size' => $limit + 1,
            ]);
            $type = is_wp_error($response) ? '' : strtolower(explode(';', wp_remote_retrieve_header($response, 'content-type'))[0]);
            clearstatcache(true, $file);
            $size = filesize($file);
            if (is_wp_error($response) || wp_remote_retrieve_response_code($response) !== 200 || !$size || $size > $limit || !(strpos($type, 'audio/') === 0 || in_array($type, ['application/octet-stream', 'application/ogg'], true))) {
                $error = 'Não foi possível baixar um arquivo de áudio válido (limite: 50 MB).';
            } else {
                $extension = strtolower(pathinfo((string) parse_url($audio['url'], PHP_URL_PATH), PATHINFO_EXTENSION));
                if (!in_array($extension, ['mp3', 'wav', 'ogg', 'm4a', 'aac', 'flac', 'opus', 'webm'], true)) $extension = 'mp3';
                $name = sanitize_file_name($audio['name']) ?: 'audio';
                if (strtolower(pathinfo($name, PATHINFO_EXTENSION)) !== $extension) $name .= '.' . $extension;
                nocache_headers();
                header('Content-Type: ' . $type);
                header('X-Content-Type-Options: nosniff');
                header('Content-Disposition: attachment; filename="audio.' . $extension . '"; filename*=UTF-8\'\'' . rawurlencode($name));
                header('Content-Length: ' . $size);
                readfile($file);
            }
        } finally {
            wp_delete_file($file);
        }
        if (isset($error)) {
            wp_send_json_error(['message' => $error], 502);
        }
        exit;
    }
}
