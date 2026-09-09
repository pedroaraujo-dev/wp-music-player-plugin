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
echo "PASS: cores, limites, JSON, preservação de opções, escape HTML e CSS legado\n";
