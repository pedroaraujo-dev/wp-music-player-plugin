const { test } = require('node:test');
const assert = require('node:assert/strict');
const { JSDOM } = require('jsdom');
const { buildSync } = require('esbuild');
const source = buildSync({stdin:{contents:[
  'export * from "./assets/scripts/ui/templates/playlist-item.ts";',
  'export * from "./assets/scripts/ui/templates/playlist.ts";',
  'export * from "./assets/scripts/controls/handlers/progress.handle.ts";',
  'export * from "./assets/scripts/ui/sound-bank.ts";',
  'export * from "./assets/scripts/controls/listeners/sound-bank.ts";',
  'export * from "./assets/scripts/service/audio.service.ts";',
  'export * from "./assets/scripts/states/player-state.ts";',
  'export * from "./assets/scripts/interfaces/audio-item.ts";',
  'export * from "./assets/scripts/ui/labels.ts";',
  'export * from "./assets/scripts/ui/playlist-container.ts";'
].join('\n'),resolveDir:process.cwd()},bundle:true,format:'iife',globalName:'review',write:false}).outputFiles[0].text;
function setup(html='') {
  const dom = new JSDOM(html,{url:'http://localhost/g-playlist/',runScripts:'outside-only'});
  dom.window.eval(source);
  return dom;
}
test('dados externos são texto, atributos preservados e protocolos inseguros bloqueados', () => {
  const dom=setup(), w=dom.window, api=w.review;
  const payload='<img src=x onerror=alert(1)>';
  const id='a"[x]';
  const emptyPremium = api.renderPlaylistItemHTML(id, 'Faixa', '', '1:05', 1, undefined, null, {description: '   '});
  assert.doesNotMatch(emptyPremium, /music-player__track-premium/);
  w.document.body.innerHTML=api.renderPlaylistItemHTML(id,payload,payload,'1:05',1,'javascript:alert(1)');
  assert.equal(w.document.querySelector('img'),null);
  assert.equal(w.document.querySelector('.music-player__track-title').textContent,payload);
  assert.equal(w.document.querySelector('.music-player__item').dataset.id,id);
  assert.equal(w.document.querySelector('.music-player__item').dataset.url,'');
  w.document.body.innerHTML=api.renderPlaylistHTML(id,payload);
  assert.equal(w.document.querySelector('img'),null);
  assert.equal(w.document.querySelector('.music-player').dataset.playlist,id);
  dom.window.close();
});
test('progresso inicializa uma vez, atualiza tempos e não agenda animações', () => {
  const dom=setup('<audio id="audio-player"></audio><div class="music-bar__timeline-fill"></div><span class="music-bar__time--current"></span><span class="music-bar__time--total"></span>');
  const w=dom.window,a=w.document.querySelector('audio');let listeners=0;
  const original=a.addEventListener.bind(a);a.addEventListener=(...args)=>{listeners++;original(...args)};
  Object.defineProperty(a,'duration',{value:120,configurable:true});a.currentTime=30;
  w.requestAnimationFrame=()=>{throw Error('Ciclo inesperado')};
  for(let i=0;i<20;i++)w.review.handleAudioProgress();
  assert.equal(listeners,5);
  assert.equal(w.document.querySelector('.music-bar__timeline-fill').style.getPropertyValue('--width'),'25%');
  a.currentTime=60;a.dispatchEvent(new w.Event('timeupdate'));
  assert.equal(w.document.querySelector('.music-bar__time--current').textContent,'1:00');
  Object.defineProperty(a,'duration',{value:NaN});a.currentTime=0;a.dispatchEvent(new w.Event('emptied'));
  assert.equal(w.document.querySelector('.music-bar__time--total').textContent,'0:00');dom.window.close();
});
test('abas desktop/mobile sincronizam conteúdo e ARIA sem afetar outro banco', () => {
  const bank='<section class="audio-track-library"><button class="audio-track-library__tab-button" data-id="rock" data-title="Rock"></button><button class="audio-track-library__tab-button" data-id="pop" data-title="Pop"></button><div class="audio-track-library__content"><button class="audio-track-library__content-button" data-id="rock" data-title="Rock"></button><button class="audio-track-library__content-button" data-id="pop" data-title="Pop"></button></div></section>';
  const dom=setup(bank+bank),w=dom.window,api=w.review;
  api.bindSoundBankUIListeners();api.SoundBankUI.init();
  const roots=w.document.querySelectorAll('section');
  for(const root of roots)assert.equal(root.querySelectorAll('[aria-expanded="true"]').length,2);
  roots[0].querySelector('.audio-track-library__content-button[data-id="pop"]').click();
  assert.equal(roots[0].querySelector('.music-player.active').dataset.playlist,'pop');
  assert.equal(roots[1].querySelector('.music-player.active').dataset.playlist,'rock');
  for(const button of roots[0].querySelectorAll('[aria-expanded="true"]')) assert.equal(button.getAttribute('aria-controls'),roots[0].querySelector('.music-player.active').id);
  const ids=Array.from(w.document.querySelectorAll('.music-player')).map(el=>el.id);assert.equal(new Set(ids).size,ids.length);
  dom.window.close();
});
test('download usa URL WordPress em subpasta e envia ID, playlist e nonce', async () => {
  const dom=setup(),w=dom.window,api=w.review;const audio={id:'one',name:'Teste',url:'https://example.com/a.mp3'};
  api.playerState.playlists.push({key:'rock',audios:[audio]});
  w.musicPlayer={ajaxUrl:'http://localhost/g-playlist/wp-admin/admin-ajax.php',nonce:'nonce'};
  let clicked=false;
  w.HTMLAnchorElement.prototype.click=function(){clicked=true;assert.equal(this.download,'Teste.mp3')};
  w.URL.createObjectURL=()=> 'blob:test';w.URL.revokeObjectURL=()=>{};
  w.fetch=async(url,options)=>{
    assert.equal(url,w.musicPlayer.ajaxUrl);assert.equal(options.body.get('action'),'music_player_download');
    assert.equal(options.body.get('id'),'one');assert.equal(options.body.get('playlist'),'rock');assert.equal(options.body.get('nonce'),'nonce');assert.equal(options.body.has('url'),false);
    return {ok:true,blob:async()=>new w.Blob(['ID3']),headers:{get:()=>"attachment; filename*=UTF-8''Teste.mp3"}};
  };
  await api.AudioService.downloadAudio(audio);assert(clicked);assert.equal(w.document.querySelector('a'),null);
  w.fetch=async()=>({ok:false,status:403,json:async()=>({data:{message:'Sessão expirada'}})});
  await assert.rejects(api.AudioService.downloadAudio(audio),/Sessão expirada/);dom.window.close();
});

test('bundle publicado carrega playlist, reproduz e pausa com dados controlados', async () => {
  const dom = new JSDOM('<div class="music-player" data-playlist="rock"><div class="music-player__playlist"></div></div><audio id="audio-player"></audio><div class="music-bar music-bar--hidden"><div class="music-bar__button--play"></div><div class="music-bar__button--pause"></div><div class="music-bar__track"></div><div class="music-bar__category"></div><div class="music-bar__timeline-fill"></div><div class="music-bar__time--current"></div><div class="music-bar__time--total"></div></div>',{url:'http://localhost/g-playlist/',runScripts:'outside-only'});
  const w=dom.window;let plays=0,pauses=0;
  w.musicPlayer={ajaxUrl:'http://localhost/g-playlist/wp-admin/admin-ajax.php'};
  w.fetch=async()=>({ok:true,json:async()=>({success:true,data:{schema_version:1,playlist:{name:'Teste'},audio_assets:[{_player_id:'a',name:'Faixa de teste',file_url:'https://example.com/a.mp3',duration:60000,premium:{description:'Voz "especial" <extra>'}}]}})});
  w.HTMLMediaElement.prototype.load=function(){};
  w.HTMLMediaElement.prototype.play=function(){plays++;this.dispatchEvent(new w.Event('play'));return Promise.resolve()};
  w.HTMLMediaElement.prototype.pause=function(){pauses++;this.dispatchEvent(new w.Event('pause'))};
  w.eval(require('fs').readFileSync('dist/main.js','utf8'));
  await new Promise(resolve=>setTimeout(resolve,30));
  assert.equal(w.document.querySelector('.music-player__track-title').textContent,'Faixa de teste');
  const premium = w.document.querySelector('.music-player__track-premium');
  assert.equal(premium.getAttribute('aria-label'), 'Voz mais cara');
  assert.equal(premium.hasAttribute('title'), false);
  const tooltip = w.document.getElementById(premium.getAttribute('aria-describedby'));
  assert.equal(tooltip.getAttribute('role'), 'tooltip');
  assert.equal(tooltip.textContent, 'Voz "especial" <extra>');
  premium.focus();
  assert.equal(tooltip.parentElement, w.document.body);
  assert.equal(tooltip.hidden, false);
  w.document.dispatchEvent(new w.KeyboardEvent('keydown', {key: 'Escape'}));
  assert.equal(tooltip.hidden, true);
  w.document.querySelector('.music-player__button--play').click();
  assert.equal(plays,1);assert.equal(w.document.querySelector('audio').src,'https://example.com/a.mp3');
  assert(w.document.querySelector('.music-player__item').classList.contains('playing'));
  w.document.querySelector('.music-player__button--pause').click();
  assert(pauses>=2);assert(!w.document.querySelector('.music-player__item').classList.contains('playing'));
  dom.window.close();
});

test('schema v1 preserva ordem, duração em ms, nulos e premium sem bloqueio', () => {
  const dom=setup(),api=dom.window.review;
  const raw={schema_version:1,revision:'r1',playlist:{name:null,category:null,icon:'fa fa-music'},audio_assets:[
    {_player_id:'first',name:'Primeiro',file_url:'https://example.com/first.mp3',duration:65000,order:90,premium:{description:'Público'}},
    {_player_id:'second',name:null,file_url:'https://example.com/second.mp3',duration:null,order:1,label:null}
  ]};
  const audios=api.adaptAudioResponse(raw);
  assert.deepEqual(Array.from(audios,a=>a.id),['first','second']);assert.equal(audios[0].duration,'1:05');assert.equal(audios[1].duration,'—');
  assert.equal(audios[0].premium.description,'Público');assert.equal(audios[1].category,'');
  assert.throws(()=>api.adaptAudioResponse({...raw,schema_version:2}),/incompatível/);dom.window.close();
});
test('selo respeita intervalo UTC e limites nulos, sem ocultar áudio', () => {
  const dom=setup(),api=dom.window.review;
  const label={name:'<b>Promo</b>',description:'Descrição',background_color:'#123456',text_color:'#fff',is_scheduled:true,starts_at:'2026-09-09T12:00:00Z',ends_at:'2026-09-09T13:00:00Z'};
  assert.equal(api.labelVisible(label,Date.parse('2026-09-09T11:59:59Z')),false);
  assert.equal(api.labelVisible(label,Date.parse(label.starts_at)),true);
  assert.equal(api.labelVisible(label,Date.parse(label.ends_at)),false);
  assert.equal(api.labelVisible({...label,starts_at:null,ends_at:null},0),true);
  assert.equal(api.labelVisible({...label,starts_at:'inválido'},0),false);
  assert.equal(api.labelVisible({...label,is_scheduled:false},0),true);
  const html=api.renderLabelHTML(label,'',Date.parse(label.starts_at));
  assert(html.includes('&lt;b&gt;Promo'));assert(html.includes('background-color:#123456'));
  const invalid=api.renderLabelHTML({...label,background_color:'red;position:fixed',is_scheduled:false});assert(!invalid.includes('position:fixed'));
  const item=api.renderPlaylistItemHTML('a','Áudio','','1:05',1,'https://example.com/a.mp3',{...label,starts_at:'2999-01-01T00:00:00Z',ends_at:null});
  assert(item.includes('Áudio'));assert(!item.includes('Promo'));dom.window.close();
});
test('selos mudam na página aberta quando começa e termina o agendamento', () => {
  const dom=setup(),w=dom.window,api=w.review;let now=1000,next;
  w.Date.now=()=>now;w.setTimeout=(fn,delay)=>{next={fn,delay};return 1};w.clearTimeout=()=>{};
  const label={name:'Selo',is_scheduled:true,starts_at:new Date(2000).toISOString(),ends_at:new Date(3000).toISOString()};
  api.playerState.audios.push({id:'a',tag:'',label});
  w.document.body.innerHTML=api.renderPlaylistItemHTML('a','Áudio','','1:05',1,'https://example.com/a.mp3',label);
  api.LabelUI.sync();assert.equal(w.document.querySelector('[data-label-slot]').textContent,'');assert.equal(next.delay,1000);
  now=2000;next.fn();assert.equal(w.document.querySelector('[data-label-slot]').textContent,'Selo');assert.equal(next.delay,1000);
  now=3000;next.fn();assert.equal(w.document.querySelector('[data-label-slot]').textContent,'');dom.window.close();
});
test('leitura usa AJAX local, deduplica containers e distingue vazio, 404 e erro', async () => {
  const dom=setup('<div class="music-player" data-playlist="rock"><div class="music-player__title"></div><div class="music-player__playlist">antigo</div></div><div class="music-player" data-playlist="rock"><div class="music-player__playlist">antigo</div></div>'),w=dom.window,api=w.review;
  w.musicPlayer={ajaxUrl:'http://localhost/g-playlist/wp-admin/admin-ajax.php'};
  api.PlaylistContainerUI.syncFromDOM();let calls=0,result={success:true,data:{schema_version:1,playlist:{name:'Nova'},audio_assets:[]}};
  w.fetch=async url=>{calls++;assert.equal(new URL(url).origin,'http://localhost');assert.equal(new URL(url).searchParams.get('playlist'),'rock');return {ok:true,json:async()=>result}};
  await api.AudioService.fetchAudios();await api.PlaylistContainerUI.renderAll();assert.equal(calls,1);
  assert.equal(w.document.querySelector('.music-player__title').textContent,'Nova');assert(w.document.querySelector('.music-player__playlist').textContent.includes('Nenhum áudio'));
  api.playerState.playlists.forEach(p=>p.rendered=false);result={success:true,data:null};
  await api.AudioService.fetchAudios();await api.PlaylistContainerUI.renderAll();assert.equal(w.document.querySelectorAll('.music-player[hidden]').length,2);assert.equal(api.playerState.audios.length,0);
  api.playerState.playlists.forEach(p=>p.rendered=false);w.fetch=async()=>{throw Error('Falha temporária')};
  await api.AudioService.fetchAudios();await api.PlaylistContainerUI.renderAll();assert.equal(w.document.querySelectorAll('.music-player[hidden]').length,0);assert(w.document.querySelector('.music-player__playlist').textContent.includes('Falha temporária'));
  dom.window.close();
});
test('ícone por classe não vira imagem e textos remotos não viram HTML', () => {
  const dom=setup('<section class="audio-track-library"><button class="audio-track-library__tab-button" data-id="rock"></button><div class="music-player"><div class="music-player__title"></div></div></section>'),w=dom.window;
  w.review.SoundBankUI.updateMetadata({key:'rock',metadata:{name:'<img src=x>',icon:'fa fa-music'}},w.document.querySelector('.music-player'));
  assert.equal(w.document.querySelector('img'),null);assert(w.document.querySelector('.fa-music'));assert.equal(w.document.querySelector('button').textContent,'<img src=x>');dom.window.close();
});

test('banco pula playlist removida e carrega a próxima pelo fluxo completo', async () => {
  const bank='<section class="audio-track-library"><button class="audio-track-library__tab-button" data-id="removed" data-title="Removida"></button><button class="audio-track-library__tab-button" data-id="ready" data-title="Pronta"></button><div class="audio-track-library__content"><button class="audio-track-library__content-button" data-id="removed" data-title="Removida"></button><button class="audio-track-library__content-button" data-id="ready" data-title="Pronta"></button></div></section>';
  const dom=new JSDOM(bank,{url:'http://localhost/g-playlist/',runScripts:'outside-only'}),w=dom.window;
  w.musicPlayer={ajaxUrl:'http://localhost/g-playlist/wp-admin/admin-ajax.php'};
  w.fetch=async url=>({ok:true,json:async()=>({success:true,data:new URL(url).searchParams.get('playlist')==='removed'?null:{schema_version:1,playlist:{name:'Pronta'},audio_assets:[{_player_id:'ok',name:'Áudio pronto',file_url:'https://example.com/a.mp3',duration:1000}]}})});
  w.eval(require('fs').readFileSync('dist/main.js','utf8'));await new Promise(resolve=>setTimeout(resolve,40));
  assert(w.document.querySelector('.audio-track-library__tab-button[data-id="removed"]').hidden);
  assert.equal(w.document.querySelector('.music-player.active .music-player__track-title').textContent,'Áudio pronto');dom.window.close();
});
