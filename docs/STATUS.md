# Estado do projeto

Última revisão desta página: **31/10/2026**. O estado abaixo distingue a versão entregue antes desta rodada, as alterações entregues e as evidências executadas. Publicação de repositório, validação local e deploy público são etapas diferentes.

## Objetivo atual

Auditar o código, tornar sua organização legível e revisar a experiência pública do PLENÁRIO sem perder fontes, rigor editorial ou funções existentes. Esta rodada inclui pesquisa de UI, revisão visual responsiva, correções de segurança/dados que tenham evidência e controles reproduzíveis de qualidade.

## Arquitetura e stack

Next.js 16.4.3 App Router, React 19.3.1, TypeScript, **Node 24**, SQLite (`node:sqlite`), Zod, Radix Dialog, Lucide, Open Props e CSS. Interface pública renderizada no servidor com interações de cliente; conectores e persistência ficam no servidor. Prettier é ferramenta somente de desenvolvimento. Não há infraestrutura paga contratada ou deploy público verificado.

Estrutura: `src/app/` (páginas/APIs), `src/components/` (UI), `src/lib/` (domínio/dados/segurança), `scripts/`, `data/`, `tests/` e `docs/`. [Arquitetura](ARCHITECTURE.md).

## Modelo e dados integrados

- IDs estáveis `camara:<id>` e `senado:<id>`; pessoas não são associadas apenas pelo nome.
- SQLite mantém políticos, versões, lotes de importação, pedidos privados de correção, registros editoriais e auditoria.
- Fontes guardam órgão, URL, identificador, trecho, tipo de evidência e datas distintas de fato, publicação, coleta e verificação.
- Câmara: lista, detalhe, histórico, retratos oficiais e até cinco proposições por deputado no lote distribuído.
- Senado: lista de parlamentares em exercício, mandato, legislatura, partido e UF; proposições e votos ainda pendentes.
- Snapshots de 27/10/2026: **513 deputados e 81 senadores**. O arquivo histórico de 2015 permanece separado. Restaurar esses arquivos não atualiza seu conteúdo.

[Proveniência e limites](SNAPSHOT.md). TSE, DataJud, TCU e Portal da Transparência permanecem pesquisados e não integrados.

## Funcionalidades existentes

Busca sem acentos; filtros por cargo, partido, UF e situação; seleção por retrato e paginação; perfis com trajetória, proposições e fontes; comparação de até quatro pessoas; guia de cargos em linguagem simples; menu móvel com foco/Escape; movimento reduzido; estados de falha e dados ausentes; API paginada; importações transacionais com timeout/retry e preservação de cache.

Pedidos de correção são privados. A administração fica desativada sem senha própria. Quando configurada, há sessão autenticada, rascunhos, aprovação/rejeição de registros sensíveis com justificativa e histórico. Publicações sensíveis expiradas não permanecem como situação vigente sem revisão.

## Auditoria e revisão visual concluídas

A revisão de código, dados, segurança, UX e dependências foi integrada. A interface agora usa fundo claro de leitura, texto escuro e a marca marinho/dourado; preserva retratos e fontes, com fallback confiável. CSS foi consolidado em seis arquivos por responsabilidade e uma entrada global. Comparação persiste na sessão e no retorno de um perfil; paginação mantém resumo coerente; menu cabe em paisagem; armazenamento negado não impede o uso. Trajetórias são exibidas em ordem de data sem alterar a fonte armazenada.

Foram corrigidos limites de streaming, rejeição de SVG no proxy, revisão obrigatória de conteúdo jurídico importado, portas/IDs oficiais, permissões de banco e unicidade de IDs entre Câmara e Senado. A migração foi testada em um banco legado temporário; nenhum banco externo de produção foi migrado.

Formatação consistente, tipos com checagem de símbolos não usados, Node 24 e CI foram adicionados. Nenhuma dependência de runtime foi acrescentada.

[Relatório integrado](audit/README.md), [segurança e dados](audit/backend-audit.md), [UX](audit/frontend-audit.md), [pesquisa de design](audit/design-research.md) e [organização](audit/repository-audit.md).

## Decisões vigentes

SQLite reduz pré-requisitos do MVP e exige volume persistente. PostgreSQL/worker entram quando houver demanda real. Componentes acessíveis já instalados devem ser reutilizados antes de adicionar bibliotecas redundantes. Snapshots, fotos, galerias e arquivos de download compartilhados não são reformatados nem removidos para evitar perda de proveniência e URLs quebradas.

Retratos são obtidos do URL oficial vinculado ao ID parlamentar, com validação e alternativa por iniciais; direitos de uso e crédito requerem revisão antes de distribuição ampla. Fontes jurídicas exigem revisão humana individualizada. A plataforma não recomenda votos, não produz notas morais e não preenche lacunas por IA.

## Testes e evidência

- `npm run format:check`, `npm run typecheck` e `git diff --check`: aprovados.
- `npm test`: **41 testes aprovados**, nenhum ignorado; inclui migração preservando correções/índices, streaming, SVG, IDs, sessões e barreiras editoriais.
- `npm run build`: aprovado sem advertência de tracing após explicitar que o caminho do banco é runtime.
- `npm run test:e2e`: **12 testes aprovados**, nenhum ignorado; filtros, seleção, paginação, perfil, comparação persistente, fontes/foco, correções privadas, autenticação, guia de cargos, fallback de foto, storage negado e menu em paisagem.
- Axe: zero violações A/AA nas telas testadas (início, perfil, cargos, metodologia, correções, comparação, login e menu); não é certificação.
- Layout Chromium: sem overflow de raiz em 320, 390, 768 e 1280 px. Controles de paginação e troca de perfil passaram de 25/24 para 44 px. Nomes nos cards passaram de 12 para 16 px e cargos de 9 para 12 px.
- CSS emitido: 70.568 → 44.504 bytes; gzip calculado localmente 15.351 → 10.336 bytes (**32,7% menor**). Medição não representa uma CDN.
- Medição local de carregamento: 9 solicitações JS / 163.432 bytes de transferência. TTFB 153 ms, DOMContentLoaded 403 ms, load 404 ms nesta execução, sem throttling; não é Lighthouse nem promessa de desempenho real.
- `npm audit`: zero vulnerabilidades conhecidas reportadas. CI foi adicionada, mas sua execução remota não foi verificada.

Fotos oficiais não puderam ser recuperadas nesta rede: `www.camara.leg.br` retornou bloqueio de proxy CONNECT 403. Capturas mostram o fallback real, sem fotos substituídas. Testes de sucesso/falha das imagens usam um raster sintético identificado; não validam a disponibilidade atual do órgão.

Evidências: `docs/audit/browser-metrics.json`, `docs/audit/css-metrics.json`, capturas atuais em `docs/preview/assets/` e relatórios locais ignorados em `test-results/`/`playwright-report/`. Arquivos antigos de download foram preservados.

## Pendências e limites

Cobertura federal não equivale à cobertura nacional de todos os cargos. Faltam TSE eleitoral, estados/municípios, votos/despesas, patrimônio, promessas e histórico eleitoral completo. Ausência de registro não é atestado de ausência de processos ou atuação. Não há pesquisa jurídica exaustiva nem revisão jurídica contratada.

Admin usa uma identidade, sem MFA ou revisão por duas pessoas. Editor de conteúdo sensível ainda usa JSON. Correções não têm prazos/notificações/edição granular. Limitação de tráfego em memória atende uma instância; produção com escala exige proteção compartilhada. CSP usa inline necessário ao Next.js; nonce estrito é melhoria futura. Cron, backups recuperáveis, observabilidade e deploy HTTPS precisam de infraestrutura escolhida e verificada.

Não há teste em dispositivos físicos, pentest, auditoria jurídica ou Lighthouse com perfil de usuário real. Licenças das bibliotecas não definem automaticamente a licença da aplicação ou dos dados.

## Ambiente e próxima ação

Há configuração de instalação e inicialização salva no rascunho do ambiente, inclusive instruções de base isolada para testes manuais e domínio Lovable. Um rascunho salvo não aplica regras de rede, não publica o ambiente e não gera um preview externo. Revalidar o ambiente quando a configuração for aplicada; processos não são preservados por publicação.

Próxima ação: disponibilizar o preview na hospedagem escolhida e testar sua URL e acesso às fontes. O link do editor Lovable e o código enviado ao GitHub não comprovam que exista um deploy navegável atualizado. Roteiro: [testes manuais](testing/manual-checklist.md).
