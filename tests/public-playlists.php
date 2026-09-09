<?php
if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }
require dirname(__DIR__, 4) . '/wp-load.php';
require_once ABSPATH . 'wp-admin/includes/template.php';
use MusicPlayer\Data\PublicPlaylists;
use MusicPlayer\Admin\Validation;
function check($condition, $message) { if (!$condition) throw new RuntimeException($message); }
$url = 'https://example.com/review-playlists-' . getmypid() . '.json';
$cache = PublicPlaylists::cacheKey($url);
register_shutdown_function(function () use ($cache) { delete_transient($cache); });
add_filter('pre_option_sound_banks_data', function () use ($url) { return json_encode([['id'=>'rock','url'=>$url]]); });
$requests = 0; $status = 200;
$data = ['schema_version'=>1,'revision'=>'r1','site_public_id'=>'public-site','playlist'=>['public_id'=>'p','name'=>'Rock','category'=>null,'icon'=>'fa fa-music'],'audio_assets'=>[['name'=>'Áudio','file_url'=>'https://example.com/a.mp3','duration'=>65000,'premium'=>['description'=>'público']]]];
$body = json_encode($data); $network = false;
add_filter('pre_http_request', function ($pre,$args,$requestUrl) use (&$requests,&$status,&$body,&$network,$url) {
    check($requestUrl === $url, 'A URL configurada foi alterada');
    check($args['timeout'] === 10, 'Timeout incorreto');
    $requests++;
    return $network ? new WP_Error('network','offline') : ['response'=>['code'=>$status],'body'=>$body,'headers'=>[]];
},10,3);
if (($argv[1] ?? '') === 'endpoint404') { $status=404; $_GET['playlist']='rock'; PublicPlaylists::handle(); }
if (($argv[1] ?? '') === 'endpoint200') { $_GET['playlist']='rock'; PublicPlaylists::handle(); }
$first = PublicPlaylists::read('rock'); check($first === $data, 'Documento válido rejeitado');
check(PublicPlaylists::read('rock') === $data && $requests === 1, 'Cache de sucesso não reutilizado');
check((int)get_option('_transient_timeout_' . $cache) <= time()+30, 'TTL maior que 30 segundos');
delete_transient($cache); $status=404;
check(PublicPlaylists::read('rock') === null && get_transient($cache) === false, '404 não removeu cache');
$status=403; check(is_wp_error(PublicPlaylists::read('rock')), '403 não tratado');
$status=500; check(is_wp_error(PublicPlaylists::read('rock')), '500 não tratado');
$status=200; $body='{'; check(is_wp_error(PublicPlaylists::read('rock')), 'JSON inválido aceito');
$body=json_encode(array_merge($data,['schema_version'=>2])); check(is_wp_error(PublicPlaylists::read('rock')), 'Schema incompatível aceito');
$body=json_encode(array_merge($data,['audio_assets'=>(object)[]])); check(is_wp_error(PublicPlaylists::read('rock')), 'Objeto aceito como lista');
$network=true; check(is_wp_error(PublicPlaylists::read('rock')), 'Falha de rede não tratada');
$network=false; $body=json_encode(array_merge($data,['audio_assets'=>[]])); check(PublicPlaylists::read('rock')['audio_assets'] === [], 'Lista vazia rejeitada');
delete_transient($cache); $body=json_encode($data); check(PublicPlaylists::read('rock') === $data, 'Recuperação após falha não funcionou');
$before=$requests; check(is_wp_error(PublicPlaylists::read('https://unconfigured.example/playlist.json')) && $requests===$before, 'Visitante escolheu URL arbitrária');
check(Validation::banks('[{"id":"rock","url":"https://cdn.example.com/site/p.json"}]')[0]['url'] === 'https://cdn.example.com/site/p.json', 'URL CDN rejeitada');
check(Validation::banks('[{"id":"rock","url":"http://example.com/p.json"}]') === null, 'HTTP aceito');
check(Validation::saveBanks('[{"id":"rock","name":"Rock"}]') !== '[{"id":"rock","name":"Rock"}]', 'Configuração sem URL aceita');
echo "PASS: URL fixa, cache, 404, 403, 5xx, JSON/schema, rede, recuperação, lista vazia e configuração\n";
