<?php
if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }
require dirname(__DIR__, 4) . '/wp-load.php';
add_filter('pre_option_music_player_site_id', function () { return 'review_test'; });
$mode = $argv[1] ?? 'resolve';
add_filter('pre_http_request', function ($pre, $args, $url) use ($mode) {
    if (strpos($url, 'https://conceitovoz.com.br/playlist-directory/get-content.php?') === 0) {
        return ['response' => ['code' => 200], 'body' => json_encode([
            ['id' => 'valid', 'name' => 'Teste', 'url' => 'https://example.com/audio.mp3', 'review_test' => ['visible' => true]],
            ['id' => 'hidden', 'url' => 'https://example.com/hidden.mp3', 'review_test' => ['visible' => false]],
            ['id' => 'private', 'url' => 'http://127.0.0.1/private.mp3'],
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
    $audio = \MusicPlayer\Download\AudioDownload::resolveAudio('playlist', 'valid');
    if (is_wp_error($audio) || $audio['url'] !== 'https://example.com/audio.mp3') throw new RuntimeException('Áudio válido rejeitado');
    echo "PASS: resolução de áudio, invisível, inexistente e URL privada\n";
} else {
    $_POST = ['playlist' => 'playlist', 'id' => 'valid'];
    $_REQUEST['nonce'] = $mode === 'nonce' ? 'invalid' : wp_create_nonce('music_player_nonce');
    \MusicPlayer\Download\AudioDownload::handle();
}
