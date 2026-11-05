# Playlists públicas — configuração e validação

## Configurar no WordPress

No painel de gerenciamento, abra **Configurações > Integração WordPress** e copie o JSON completo das playlists selecionadas. Cole em **Music Player > Playlists externas**, no campo **Playlists externas (JSON)**. Ao salvar, a seleção substitui o cadastro anterior e aparece como uma lista editável. Para preservar itens anteriores, combine-os na lista antes de salvar.

Para configurar manualmente, informe a URL HTTPS completa de cada publicação:

```json
[
  {
    "id": "rock",
    "url": "https://storage.googleapis.com/SEU_BUCKET/playlists/SITE_PUBLICO/PLAYLIST_PUBLICA.json"
  },
  {
    "id": "vinhetas",
    "url": "https://SEU_CDN/caminho-completo-recebido.json",
    "name": "Vinhetas",
    "icon": "fa fa-music"
  }
]
```

Abaixo do campo, o acordeão **Como cadastrar e exibir as playlists** contém orientações, um exemplo selecionável para copiar e os shortcodes.

Os endereços acima são exemplos: substitua-os pelas URLs recebidas do responsável pelo sistema. O plugin usa a URL cadastrada, sem construir caminhos a partir de IDs. Não é necessário Site ID, SDK Firebase ou credenciais externas.

- `id`: apelido local único usado no shortcode. Não precisa ser o `public_id` do arquivo.
- `url`: URL pública HTTPS completa do JSON, obrigatória.
- `sound_bank`: opcional, `true` ou `false` sem aspas. Use `false` para excluir do banco de trilhas. Se omitido, mantém a inclusão no banco para compatibilidade. O shortcode individual e o download continuam disponíveis.
- `name` e `icon`: opcionais; usados inicialmente nos botões do banco de trilhas. Após carregar o arquivo, seus metadados atualizam os botões. Classes de ícones dependem do CSS de ícones disponível no tema.

Para uma playlist:

```text
[music_player playlist="rock"]
```

Para substituir o título público:

```text
[music_player playlist="rock" title="Minha seleção"]
```

Para reunir as playlists cadastradas com `sound_bank: true` (ou sem esse campo) em abas/acordeão:

```text
[sound_bank]
```

### Playlist avulsa

Cadastre junto às demais, adicionando `sound_bank: false`:

```json
{
  "id": "vinhetas",
  "url": "https://SEU_CDN/caminho-completo-recebido.json",
  "sound_bank": false
}
```

Inclua esse objeto na lista JSON do painel. Use `[music_player playlist="vinhetas"]` na página desejada. Ela não aparecerá em `[sound_bank]`. Todas as playlists, inclusive as pertencentes ao banco, podem ser exibidas individualmente.

Cadastros antigos são preservados para migração, mas precisam receber `url` antes de funcionar no novo fluxo. O salvamento rejeita cadastros sem URL e mantém a configuração anterior. Não há retorno automático à API antiga.

## Funcionamento

O navegador solicita a playlist ao AJAX do próprio WordPress. O PHP lê somente as URLs cadastradas pelo administrador, usando a API HTTP segura do WordPress. Portanto, a leitura do JSON não depende de CORS do bucket/CDN.

Documentos válidos ficam em cache por 30 segundos, por URL. O cache guarda o documento bruto; o agendamento do selo é avaliado no navegador e atualizado quando começa ou termina, sem precisar recarregar a página. Cache da publicação, da CDN e da página WordPress pode acrescentar atraso.

- Aceita `schema_version: 1` e lista de áudios vazia.
- Preserva a ordem de `audio_assets`; não reaplica a ordenação da API antiga.
- Usa `file_url` para reprodução e converte duração em milissegundos para `m:ss`. Duração desconhecida aparece como `—` até o áudio carregar seus metadados.
- Exibe selos com texto escapado e cores limitadas a formatos seguros. Agendamento: início inclusivo, término exclusivo; limite nulo significa sem limite. Datas inválidas ocultam apenas o selo.
- `premium` é mantido como metadado público e não bloqueia reprodução ou download.
- Ícones podem ser URLs HTTPS ou classes CSS; classes não são usadas como `src` de imagem.
- Textos opcionais nulos e campos adicionais não utilizados não impedem a reprodução.

O download consulta o mesmo documento e resolve o áudio por um identificador interno derivado do apelido da playlist e da URL do arquivo. Não depende de um ID de áudio que o contrato público não exige. Reordenar a lista não troca o arquivo associado ao botão. Permanecem o limite de 50 MB e a validação de resposta do endpoint de download.

## Indisponibilidade

- **404 no arquivo externo:** descarta o cache local ao receber a resposta e oculta a playlist. No banco, abre a próxima aba disponível; se nenhuma existir, oculta o banco. Internamente, o AJAX retorna explicitamente `data: null`.
- **403 externo:** informa que a leitura pública precisa ser confirmada.
- **Rede, 5xx ou JSON incompatível:** mostra uma mensagem de indisponibilidade sem quebrar a página. Não mantém cache de erro nem serve cópia antiga; tenta novamente no próximo acesso.
- **Lista vazia:** mostra uma mensagem de ausência de áudios, sem tratar como falha.

## Verificações executadas

Em 09/09/2026:

- `npm run build`: checagem TypeScript e bundle `dist/main.js` aprovados.
- `npm test`: 11 testes de DOM/JavaScript aprovados, incluindo reprodução simulada do bundle, selos, metadados, erros e troca de aba após 404.
- `npm run test:php`: 5 testes aprovados com funções reais do WordPress, incluindo cache, esquema, erros, endpoint AJAX e entrega de bytes do download.
- Sintaxe de todos os arquivos PHP aprovada e `git diff --check` sem erros.

Os testes externos usam respostas controladas por filtros do WordPress. Configurações reais não foram alteradas; os transients de teste são removidos ao terminar. Ainda é necessária uma URL pública real para confirmar acesso ao bucket/CDN e reprodução sonora no ambiente final.
