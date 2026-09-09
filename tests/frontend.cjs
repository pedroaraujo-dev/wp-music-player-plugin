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
  'export * from "./assets/scripts/states/player-state.ts";'
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
  w.musicPlayer={siteId:'test'};
  w.fetch=async()=>({ok:true,json:async()=>[{id:'a',name:'Faixa de teste',url:'https://example.com/a.mp3',audioDuration:'1:00',test:{visible:true}}]});
  w.HTMLMediaElement.prototype.load=function(){};
  w.HTMLMediaElement.prototype.play=function(){plays++;this.dispatchEvent(new w.Event('play'));return Promise.resolve()};
  w.HTMLMediaElement.prototype.pause=function(){pauses++;this.dispatchEvent(new w.Event('pause'))};
  w.eval(require('fs').readFileSync('dist/main.js','utf8'));
  await new Promise(resolve=>setTimeout(resolve,30));
  assert.equal(w.document.querySelector('.music-player__track-title').textContent,'Faixa de teste');
  w.document.querySelector('.music-player__button--play').click();
  assert.equal(plays,1);assert.equal(w.document.querySelector('audio').src,'https://example.com/a.mp3');
  assert(w.document.querySelector('.music-player__item').classList.contains('playing'));
  w.document.querySelector('.music-player__button--pause').click();
  assert(pauses>=2);assert(!w.document.querySelector('.music-player__item').classList.contains('playing'));
  dom.window.close();
});
