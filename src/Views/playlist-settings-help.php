<?php
$example = <<<'JSON'
[
  {
    "id": "trilhas",
    "name": "Trilhas musicais",
    "url": "https://storage.googleapis.com/SEU_BUCKET/playlists/SEU_SITE/PLAYLIST_TRILHAS.json",
    "sound_bank": true
  },
  {
    "id": "vozes",
    "name": "Banco de Vozes Masculinas",
    "url": "https://storage.googleapis.com/SEU_BUCKET/playlists/SEU_SITE/PLAYLIST_VOZES.json",
    "sound_bank": false
  }
]
JSON;
?>
<details style="margin-top: 12px; max-width: 900px; padding: 12px 16px; border: 1px solid #c3c4c7; border-radius: 4px; background: #fff;">
    <summary style="cursor: pointer; font-weight: 600;">Como cadastrar e exibir as playlists</summary>
    <p>Este campo recebe uma lista de configurações. Não cole aqui o conteúdo do arquivo público que contém <code>schema_version</code> e <code>audio_assets</code>.</p>
    <ol>
        <li>Escolha um <code>id</code> local único para cada playlist, como <code>trilhas</code> ou <code>vozes</code>. Ele será usado no shortcode.</li>
        <li>Em <code>url</code>, cole a URL HTTPS completa do JSON recebida do responsável pelo sistema. Bucket, ID público do site e ID público da playlist já fazem parte desse endereço; não precisam de campos separados. URLs de CDN também são aceitas.</li>
        <li>Use <code>"sound_bank": true</code> para incluir no banco de trilhas ou <code>"sound_bank": false</code> para deixar avulsa. Escreva <code>true</code> e <code>false</code> sem aspas. Se omitir o campo, a playlist será incluída no banco.</li>
        <li><code>name</code> e <code>icon</code> são opcionais. O nome identifica o botão inicialmente; após carregar, os metadados publicados atualizam o banco. O ícone aceita uma URL de imagem ou classes CSS disponíveis no tema.</li>
        <li>Mantenha os colchetes da lista, separe os cadastros com vírgulas e clique em <strong>Salvar alterações</strong>.</li>
    </ol>
    <p><label for="music-player-playlists-example"><strong>Exemplo para copiar e adaptar</strong></label></p>
    <p>Selecione e copie o exemplo abaixo. Substitua as URLs pelas reais antes de salvar. Se já houver playlists cadastradas, acrescente os novos objetos à lista existente para preservar as anteriores.</p>
    <textarea id="music-player-playlists-example" class="large-text code" rows="16" readonly spellcheck="false"><?php echo esc_textarea($example); ?></textarea>
    <p><strong>Na página ou no post, adicione um bloco Shortcode:</strong></p>
    <ul>
        <li>Playlist avulsa: <code>[music_player playlist="vozes"]</code></li>
        <li>Playlist com título personalizado: <code>[music_player playlist="vozes" title="Conheça nossas vozes"]</code></li>
        <li>Banco de trilhas: <code>[sound_bank]</code> — reúne somente as playlists com <code>sound_bank: true</code> ou com o campo omitido.</li>
    </ul>
    <p>Qualquer playlist cadastrada também pode ser exibida individualmente, mesmo quando faz parte do banco.</p>
</details>
