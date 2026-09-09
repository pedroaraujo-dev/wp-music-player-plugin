# Revisão do Music Player

Data: 09/09/2026

Este documento registra os cinco achados da revisão e as correções implementadas em 09/09/2026. As alterações preexistentes foram preservadas. Os trechos de problema e evidência abaixo descrevem o estado anterior às correções.

## Resultado das correções

| Ponto | Correção implementada | Validação |
| --- | --- | --- |
| 1 — HTML externo | Escape de texto e atributos, validação HTTP/HTTPS, mensagens de erro como texto e seletores sem interpolação de IDs | Testes de DOM com payloads HTML e IDs contendo aspas |
| 2 — Progresso | Inicialização idempotente; eventos do áudio substituem ciclos de animação; tempos de arraste corrigidos | Vinte inicializações sem duplicar listeners, atualização de tempo e troca de fonte |
| 3 — Download | Endpoint AJAX do próprio WordPress, público com nonce, resolução do ID na API e validação da resposta | Testes no WordPress de entrega de bytes, áudio oculto/inexistente, URL privada, HTML e nonce inválido; cliente usa URL de subpasta |
| 4 — Banco de trilhas | Sincronização desktop/mobile, ARIA e isolamento por contêiner | Cliques em dois bancos independentes e verificação do painel selecionado |
| 5 — Configurações | Validação de cores/JSON, preservação de valor anterior, escape no painel e proteção de valores legados | Testes com funções reais do WordPress, formatos válidos e entradas inválidas |

O bundle em `dist/main.js` foi recompilado. Os comandos de build e desenvolvimento agora usam o mesmo formato de bundle, e o build inclui a checagem TypeScript.

### Executar os testes

- `npm test`: testes de DOM e fluxo do bundle com mídia e API controladas.
- `npm run test:php`: testes integrados ao WordPress local. Exige PHP no PATH e o plugin instalado na estrutura padrão `wp-content/plugins`.
- `npm run build`: checagem TypeScript e compilação do JavaScript distribuído.

Os testes PHP usam filtros temporários no processo, sem gravar opções no banco de dados. Os arquivos de teste PHP bloqueiam execução via navegador.

### Limite da validação

O Site ID do WordPress local estava vazio. Portanto, os testes de API e download usaram respostas controladas, e a reprodução foi validada com a API de mídia simulada em DOM. Não foi confirmada a reprodução sonora nem a entrega de áudio da API real no navegador. Para essa confirmação, é necessário um Site ID e uma playlist válidos.

O endpoint de download admite arquivos de até 50 MB e rejeita respostas que não indiquem áudio ou arquivo binário. Nonce expirado exige atualizar a página.

## 1. Dados da API inseridos no HTML sem escape

**Prioridade:** alta.

**Arquivos:** `assets/scripts/ui/templates/playlist-item.ts`, `assets/scripts/ui/playlist-container.ts`.

### Problema e impacto

O template interpola diretamente nome, tag, duração, ID e URL dos áudios. O resultado é inserido na página por `innerHTML`. Conteúdo retornado pela API pode ser interpretado como marcação, em vez de texto, permitindo injeção de HTML e potencial execução de JavaScript no domínio do site se esses dados contiverem conteúdo malicioso.

### Evidência

Um teste isolado confirmou que um nome contendo `<img src=x onerror=alert(1)>` é preservado no HTML gerado. O teste confirmou a ausência de escape; não executou o payload em um navegador nem identificou comprometimento da API.

### Sugestão de correção

- Construir os elementos com `document.createElement()` e preencher nome, tag e duração com `textContent`.
- Preencher atributos por APIs do DOM, como `dataset`, evitando interpolação em strings HTML.
- Validar URLs antes do uso, aceitando apenas protocolos necessários, como HTTPS e HTTP.
- Se o template em string for mantido, aplicar escape apropriado ao contexto de texto ou atributo em todos os campos externos.
- Aplicar o mesmo cuidado a mensagens de erro inseridas com `innerHTML`.

### Como validar

Renderizar nomes e tags com `<`, `>`, aspas e marcação HTML. O conteúdo deve aparecer como texto, sem criar elementos adicionais ou executar eventos. Verificar também que nomes comuns e URLs válidas continuam funcionando.

## 2. Progresso acumula listeners e ciclos de animação

**Prioridade:** média.

**Arquivos:** `assets/scripts/controls/handlers/play.handle.ts`, `assets/scripts/controls/handlers/progress.handle.ts`.

### Problema e impacto

Cada chamada de `handleItemPlay()` chama novamente `handleAudioProgress()`, que registra novos listeners de `play`, `loadedmetadata` e `ended`. Cada evento de reprodução pode iniciar vários ciclos de `requestAnimationFrame`. Além disso, esses ciclos continuam se reagendando quando o áudio está pausado ou terminou.

Isso gera processamento redundante e pode degradar o desempenho em sessões com muitas pausas ou trocas de faixa.

### Evidência

Uma simulação isolada com três inicializações e eventos de reprodução acumulou três listeners de `play` e seis ciclos de animação. Os seis ciclos continuaram agendados com o áudio pausado.

### Sugestão de correção

- Inicializar o acompanhamento de progresso uma única vez, durante a inicialização do player.
- Remover a chamada de inicialização de `handleItemPlay()`.
- Manter o identificador do ciclo de animação e impedir que outro seja iniciado enquanto houver um ativo.
- Cancelar o ciclo em `pause` e `ended`, reiniciando-o em `play`.
- Alternativamente, atualizar o progresso com `timeupdate`, se a frequência desse evento atender à interface.

### Como validar

Repetir play, pause e troca de faixa várias vezes. Deve existir no máximo um ciclo ativo durante a reprodução e nenhum enquanto pausado. Conferir que duração e progresso continuam corretos ao trocar de áudio.

## 3. Download depende de endpoint externo ao plugin

**Prioridade:** média.

**Arquivo:** `assets/scripts/service/audio.service.ts`.

### Problema e impacto

O download envia um POST para `/download-audio.php`, caminho absoluto na raiz do domínio. O arquivo não faz parte do plugin e não foi encontrado na raiz local do servidor nem na pasta local do WordPress verificadas durante a revisão.

Sem uma implementação externa ou um roteamento equivalente, o download falha. Instalar o WordPress em uma subpasta também não altera o destino dessa URL: a requisição continua indo para a raiz do domínio.

### Evidência

A URL está definida diretamente em `AudioService.downloadAudio()`. A busca nos arquivos do plugin e a verificação das duas localizações locais não encontraram o endpoint. Não foi feita uma requisição HTTP para confirmar a configuração de roteamento do servidor.

### Sugestão de correção

- Implementar o download dentro do plugin usando um endpoint REST ou uma ação AJAX do WordPress.
- Gerar a URL no PHP com as funções do WordPress e disponibilizá-la ao JavaScript, evitando um caminho fixo na raiz.
- Definir explicitamente se visitantes não autenticados podem baixar os áudios e registrar o endpoint de acordo com essa regra.
- Preferir receber um identificador de áudio e resolver a URL no servidor. Se houver busca de uma URL recebida do cliente, validar os destinos permitidos e usar a API HTTP segura do WordPress para evitar acesso indevido a recursos internos.
- Retornar status e mensagens de erro claros, além dos cabeçalhos adequados ao arquivo.
- Se o endpoint externo for intencional, tornar sua URL configurável e documentar essa dependência.

### Como validar

Testar downloads em instalações na raiz e em subpastas, com visitantes e usuários autenticados conforme a regra definida. Conferir o conteúdo do arquivo baixado e os casos de áudio inexistente e erro de rede.

## 4. Botão do banco de trilhas não recebe estado ativo no celular

**Prioridade:** média.

**Arquivos:** `assets/scripts/ui/sound-bank.ts`, `src/Views/sound-bank-view.php`.

### Problema e impacto

Cada banco tem uma aba desktop e um botão de acordeão com o mesmo `data-id`. `setTabState()` usa `document.querySelector()` e atualiza somente o primeiro elemento correspondente, que é a aba desktop.

O conteúdo abre, mas o botão visível no celular permanece sem a classe `active` e com `aria-expanded="false"`. A indicação visual e o estado de acessibilidade ficam inconsistentes com o conteúdo exibido.

### Evidência

A view renderiza as abas antes dos botões de acordeão. O método de ativação seleciona apenas um botão, enquanto `closeAllTabs()` remove o estado ativo dos dois grupos.

### Sugestão de correção

- Atualizar tanto a aba quanto o botão de acordeão correspondentes ao banco selecionado.
- Usar seletores específicos das classes desses controles, limitados ao contêiner do banco de trilhas.
- Definir `aria-expanded="true"` e adicionar `active` aos dois controles correspondentes.
- Associar controles e conteúdo com IDs únicos e `aria-controls`.
- Ao montar seletores com IDs externos, usar `CSS.escape()` ou comparar os valores de `dataset` diretamente.

### Como validar

Abrir bancos diferentes em larguras desktop e mobile, inclusive após redimensionar a janela. A indicação de seleção deve acompanhar o conteúdo aberto e o atributo `aria-expanded` deve refletir o estado real.

## 5. Configurações renderizadas sem validação e escape adequados

**Prioridade:** média.

**Arquivos:** `src/Admin/SettingsPage.php`, `src/Assets/Loader.php`.

### Problema e impacto

As cores são registradas sem callbacks de sanitização e inseridas diretamente em um bloco `<style>` público. No painel, `renderColorField()` interpola o valor diretamente em um atributo HTML e `renderTextAreaField()` insere o JSON diretamente no conteúdo do `<textarea>`.

Valores contendo delimitadores HTML podem quebrar a marcação ou inserir conteúdo adicional. O alcance desse problema depende de quem consegue gravar essas opções; o fluxo normal do painel é restrito a administradores.

### Evidência

O código concatena os valores das opções em `$cssVariables` e os imprime dentro de `<style>`. Os campos de cor e JSON também são impressos sem `esc_attr()` e `esc_textarea()`, respectivamente.

### Sugestão de correção

- Registrar callbacks de sanitização para as opções.
- Validar as cores com uma lista explícita dos formatos suportados. Como a interface anuncia `rgba()` e hexadecimal com alfa, preservar esses formatos na validação; `sanitize_hex_color()` sozinho não atende a todos eles.
- Rejeitar valores inválidos com uma mensagem no painel e manter o último valor válido.
- Aplicar `esc_attr()` aos valores dos campos e `esc_textarea()` ao JSON exibido no painel.
- Validar o JSON e sua estrutura antes de salvar: lista de bancos, campos obrigatórios e tipos esperados.
- Gerar o CSS apenas a partir de cores validadas, inclusive ao ler opções antigas já salvas. Escape HTML isolado não substitui validação de CSS.

### Como validar

Salvar cores válidas em todos os formatos anunciados e verificar a aparência. Tentar valores com aspas, fechamento de tags e CSS inválido; eles devem ser rejeitados sem alterar a página. Testar JSON inválido, estrutura incorreta e texto contendo `</textarea>`.

## Validação da revisão inicial (antes das correções)

- Todos os arquivos PHP do plugin passaram em `php -l`.
- Foram executados testes JavaScript isolados para o acúmulo de ciclos de progresso e a ausência de escape no template.
- Não foi executada a checagem completa de TypeScript, pois as dependências locais não estavam instaladas.
- Não houve teste integrado no navegador, confirmação do roteamento HTTP do download ou validação ao vivo da API externa.
- Nenhuma correção foi aplicada e as alterações preexistentes foram preservadas.
