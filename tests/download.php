<?php
if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }
require dirname(__DIR__, 4) . '/wp-load.php';
$playlistUrl = 'https://example.com/review-download-' . getmypid() . '.json';
add_filter('pre_option_sound_banks_data', function () use ($playlistUrl) { return json_encode([['id' => 'playlist', 'url' => $playlistUrl, 'sound_bank' => false]]); });
register_shutdown_function(function () use ($playlistUrl) { delete_transient(\MusicPlayer\Data\PublicPlaylists::cacheKey($playlistUrl)); });
$mode = $argv[1] ?? 'resolve';
add_filter('pre_http_request', function ($pre, $args, $url) use ($mode, $playlistUrl) {
    if ($url === $playlistUrl) {
        return ['response' => ['code' => 200], 'body' => json_encode([
            'schema_version' => 1, 'playlist' => ['name' => 'Teste'],
            'audio_assets' => [['name' => 'Teste', 'file_url' => 'https://example.com/audio.mp3', 'premium' => ['description' => 'Premium público']]],
        ]), 'headers' => []];
    }
    if ($url !== 'https://example.com/audio.mp3') throw new RuntimeException('Destino inesperado');
    file_put_contents($args['filename'], $mode === 'html' ? '<html>erro</html>' : 'ID3-test-audio');
    return ['response' => ['code' => 200], 'body' => '', 'headers' => ['content-type' => $mode === 'html' ? 'text/html' : 'audio/mpeg']];
}, 10, 3);
if ($mode === 'resolve') {
    foreach (['hidden', 'private', 'missing'] as $id) {
        if (!is_wp_error(\MusicPlayer\Download\AudioDownload::resolveAudio('playlist', $id))) throw new RuntimeException('Áudio indevido autorizado: ' . $id);
    }
    $audio = \MusicPlayer\Download\AudioDownload::resolveAudio('playlist', \MusicPlayer\Data\PublicPlaylists::audioId('playlist', 'https://example.com/audio.mp3'));
    if (is_wp_error($audio) || $audio['url'] !== 'https://example.com/audio.mp3') throw new RuntimeException('Áudio válido rejeitado');
    echo "PASS: resolução por URL estável, premium público e IDs inexistentes\n";
} else {
    $_POST = ['playlist' => 'playlist', 'id' => \MusicPlayer\Data\PublicPlaylists::audioId('playlist', 'https://example.com/audio.mp3')];
    $_REQUEST['nonce'] = $mode === 'nonce' ? 'invalid' : wp_create_nonce('music_player_nonce');
    \MusicPlayer\Download\AudioDownload::handle();
}
