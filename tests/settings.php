<?php
if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }
require dirname(__DIR__, 4) . '/wp-load.php';
require_once ABSPATH . 'wp-admin/includes/template.php';
use MusicPlayer\Admin\Validation;
function check($condition, $message) { if (!$condition) throw new RuntimeException($message); }
foreach (['#abc', '#abcd', '#112233', '#11223344', 'rgba(255, 0, 10, 0.8)', 'rgb(0, 1, 255)', 'transparent', ''] as $color) check(Validation::color($color) === $color, 'Cor válida rejeitada: ' . $color);
foreach (["</style><script>alert(1)</script>", "red; background:url(x)", 'rgba(256, 0, 0, 1)', 'rgba(0,0,0,2)', 'rgb(1,2,3,0.5)', ['bad']] as $color) check(Validation::color($color) === null, 'Cor inválida aceita');
add_filter('pre_option_audio_text_color', function () { return '#123456'; });
check(Validation::saveColor('bad', 'audio_text_color') === '#123456', 'Não preservou cor anterior');
$valid = '[{"id":"rock","name":"Rock","icon":"https://example.com/icon.svg"}]';
check(count(Validation::banks($valid)) === 1, 'Banco válido rejeitado');
foreach (['{', '{}', '[{}]', '[{"id":"x","name":3}]', '[{"id":"x","name":"X"},{"id":"x","name":"Y"}]', '[{"id":"x","name":"X","icon":"javascript:alert(1)"}]'] as $json) check(Validation::banks($json) === null, 'Banco inválido aceito');
add_filter('pre_option_sound_banks_data', function () use ($valid) { return $valid; });
check(json_decode(Validation::saveBanks('{'), true) === json_decode($valid, true), 'Não preservou JSON anterior');
$export = '{"schema_version":1,"site":{"id":"site-1","name":"Site","domain":"example.com"},"playlists":[{"id":"playlist-1","name":"Trilhas","url":"https://storage.googleapis.com/bucket/playlists/site-1/playlist-1.json"}]}';
check(json_decode(Validation::saveBanks($export), true) === [
    ['id' => 'playlist-1', 'name' => 'Trilhas', 'icon' => '', 'url' => 'https://storage.googleapis.com/bucket/playlists/site-1/playlist-1.json'],
], 'A exportação do painel não foi salva como lista');
foreach ([
    str_replace('"schema_version":1', '"schema_version":2', $export),
    '{"schema_version":1,"playlists":{}}',
    '{"schema_version":1,"audio_assets":[]}',
    str_replace('https://', 'http://', $export),
] as $invalidExport) {
    check(json_decode(Validation::saveBanks($invalidExport), true) === json_decode($valid, true), 'Exportação inválida alterou o cadastro anterior');
}
$payload = "</textarea><script>alert(1)</script>";
add_filter('pre_option_review_payload', function () use ($payload) { return $payload; });
ob_start(); MusicPlayer\Admin\SettingsPage::renderTextAreaField(['id' => 'review_payload']); $html = ob_get_clean();
check(strpos($html, '<script>') === false && substr_count($html, '</textarea>') === 1, 'Escape do textarea falhou');
add_filter('pre_option_review_color', function () { return "' autofocus onfocus='alert(1)"; });
ob_start(); MusicPlayer\Admin\SettingsPage::renderColorField(['id' => 'review_color']); $html = ob_get_clean();
check(strpos($html, "value='' autofocus") === false && strpos($html, '&#039;') !== false, 'Escape de atributo falhou');
add_filter('pre_option_playlist_bg_color', function () { return '</style><script>alert(1)</script>'; });
ob_start(); MusicPlayer\Assets\Loader::injectCustomCSSVariables(); $css = ob_get_clean();
check(strpos($css, '<script>') === false, 'CSS legado inseguro');
check(Validation::colorOption('playlist_bg_color', '#fff') === '#fff', 'Fallback legado falhou');
check(Validation::banks('[{"id":"rock","url":"https://example.com/p.json","icon":"fa fa-music"}]')[0]['icon'] === 'fa fa-music', 'Classe de ícone alterada');
ob_start(); MusicPlayer\Data\SoundBanks::renderIcon('fa fa-music'); $iconHtml = ob_get_clean();
check(strpos($iconHtml, '<img') === false && strpos($iconHtml, 'class="fa fa-music"') !== false, 'Classe de ícone renderizada como URL');
$mixed = '[{"id":"library","url":"https://example.com/library.json","sound_bank":true},{"id":"standalone","url":"https://example.com/standalone.json","sound_bank":false},{"id":"legacy","url":"https://example.com/legacy.json"}]';
check(Validation::banks('[{"id":"bad","sound_bank":"false"}]') === null, 'Aceitou booleano como texto');
check(Validation::banks('[{"id":"bad","sound_bank":null}]') === null, 'Aceitou sound_bank nulo');
check(json_decode(Validation::saveBanks($mixed), true)[1]['sound_bank'] === false, 'Não preservou false ao salvar');
add_filter('pre_option_sound_banks_data', function () use ($mixed) { return $mixed; }, 20);
check(count(MusicPlayer\Data\SoundBanks::getAll()) === 3, 'Playlist avulsa removida do cadastro geral');
check(array_column(MusicPlayer\Data\SoundBanks::getLibrary(), 'id') === ['library', 'legacy'], 'Filtro do banco incorreto');
$bankHtml = MusicPlayer\Shortcodes\SoundBankShortcode::render();
check(strpos($bankHtml, 'data-id="standalone"') === false && strpos($bankHtml, 'data-id="library"') !== false, 'Shortcode do banco incluiu playlist avulsa');
$singleHtml = MusicPlayer\Shortcodes\PlayerShortcode::render(['playlist' => 'standalone']);
check(strpos($singleHtml, 'data-playlist="standalone"') !== false, 'Shortcode individual deixou de funcionar');
add_filter('pre_option_sound_banks_data', function () { return '[{"id":"standalone","url":"https://example.com/standalone.json","sound_bank":false}]'; }, 30);
check(trim(MusicPlayer\Shortcodes\SoundBankShortcode::render()) === '', 'Banco vazio deveria ficar oculto');
echo "PASS: cores, limites, JSON, preservação de opções, escape HTML e CSS legado\n";
