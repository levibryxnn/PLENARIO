# PLENÁRIO

Uma plataforma brasileira de informação política com registros oficiais, fontes junto das afirmações e comparação factual. Não recomenda votos, não atribui notas de honestidade e não publica acusações automaticamente.

O núcleo atual permite pesquisar parlamentares federais, consultar perfis e proposições, comparar até quatro pessoas e entender as atribuições dos cargos públicos. A cobertura ainda não inclui toda a política brasileira.

## Começar

Requisitos: **Node.js 24**, npm e disco local. A versão do Node está em [`.nvmrc`](.nvmrc); as dependências estão fixadas pelo lockfile.

```bash
cd screenshot-exact-match
npm ci --cache /tmp/civis-npm-cache --no-fund
npm run db:init
npm run dev
```

O banco é criado em `var/civis.db` e recebe os snapshots oficiais quando estiver vazio. Nenhum segredo é necessário para a navegação pública. A porta padrão é 3000.

Para executar a build de produção:

```bash
npm run build
npm run start
```

Um servidor iniciado no ambiente não cria uma URL pública. O repositório não contém uma hospedagem publicada ou um serviço pago contratado. A versão anterior do template Lovable permanece em [`lovable-preview-legacy`](https://github.com/levibryxnn/screenshot-exact-match/tree/lovable-preview-legacy), sem reescrita de histórico.

## Funcionalidades

- Busca tolerante a acentos, filtros por cargo, partido, UF e situação, seleção por retrato e paginação.
- Perfis com identificação oficial, trajetória documentada, proposições e fontes por registro.
- Comparação de até quatro pessoas, sem pontuação geral ou equivalência entre métricas incompatíveis.
- Guia dos cargos públicos em linguagem simples, da esfera municipal à federal.
- Navegação por teclado, menu móvel acessível e preferência de movimento reduzido.
- Importação com validação, repetição controlada, versões e preservação do cache em falhas.
- Pedidos privados de correção e fluxo editorial autenticado para revisão humana de registros sensíveis.

Os snapshots distribuídos contêm **513 deputados e 81 senadores**, coletados em 27/10/2026. A Câmara inclui até cinco proposições por deputado. Esses números descrevem a cobertura importada; não comprovam atualização contínua nem a totalidade da atividade parlamentar. [Datas, origem e limitações dos snapshots](docs/SNAPSHOT.md).

## Organização

| Caminho           | Responsabilidade                                                        |
| ----------------- | ----------------------------------------------------------------------- |
| `src/app/`        | Rotas públicas, metadados e APIs do Next.js                             |
| `src/components/` | Interface e interações reutilizáveis                                    |
| `src/lib/`        | Contratos, validação, dados, conectores, segurança e política editorial |
| `scripts/`        | Inicialização e importação de dados                                     |
| `data/`           | Snapshots oficiais sanitizados, com proveniência                        |
| `tests/`          | Dados, regras editoriais, segurança e navegação                         |
| `docs/`           | Arquitetura, metodologia, pesquisa, auditoria e evidências              |
| `public/`         | Identidade visual e arquivos públicos                                   |
| `var/`            | Banco e chave locais; ignorados pelo Git                                |

A aplicação usa Next.js App Router, React, TypeScript, Node 24, SQLite, Zod, Radix Dialog, Lucide e CSS. Não exige PostgreSQL ou uma conta paga para desenvolvimento. [Arquitetura e limites operacionais](docs/ARCHITECTURE.md).

## Qualidade e colaboração

```bash
npm run format          # aplica a formatação padrão ao código e à documentação
npm run format:check    # verifica sem modificar arquivos
npm run typecheck
npm test
npm run build
npm run test:e2e
npm audit --cache /tmp/civis-npm-cache
```

Prettier padroniza a leitura do código; não substitui revisão, TypeScript ou testes. Snapshots, imagens, arquivos de download e galerias históricas ficam fora da formatação. A CI em [`.github/workflows/quality.yml`](.github/workflows/quality.yml) executa esses controles com Node 24 e preserva evidências do navegador. Adicionar o workflow não comprova que uma execução remota já ocorreu.

Os testes de navegador iniciam um servidor de produção na porta 3100, com banco temporário e senha aleatória. Não alteram a base de desenvolvimento. Usam Chromium do sistema quando disponível; em outro ambiente:

```bash
npx playwright install --with-deps chromium
```

Leia [`AGENTS.md`](AGENTS.md) antes de modificar a aplicação e a documentação incluída na versão instalada do Next.js. [Estado atual e testes executados](docs/STATUS.md).

## Testes manuais isolados

Use uma base diferente da base de desenvolvimento. Em Linux, para testar apenas a interface pública com a administração desativada:

```bash
mkdir -m 700 -p /tmp/plenario-manual-test
CIVIS_DB_PATH=/tmp/plenario-manual-test/civis.db npm run db:init
npm run build
env -u CIVIS_ADMIN_PASSWORD -u CIVIS_SESSION_KEY -u CIVIS_PUBLIC_ORIGIN \
  CIVIS_DB_PATH=/tmp/plenario-manual-test/civis.db npm run start
```

Essa base começa com registros públicos e não recebe pedidos anteriores de correção. Submissões feitas durante a sessão permanecem nessa base temporária. Não aponte um preview para armazenamento de produção. Para compartilhar a sessão, use uma hospedagem ou proxy HTTPS com controle de acesso; não exponha diretamente o servidor de desenvolvimento.

## Dados e atualização

```bash
npm run data:import -- --source=all
# Atualizar também os snapshots versionados é uma decisão explícita:
npm run data:import -- --source=all --snapshot
```

A opção `--snapshot` modifica os arquivos distribuídos. Um lote bem-sucedido substitui a seleção ativa da respectiva Casa, preservando versões e perfis anteriores. Falhas preservam o lote anterior e retornam erro. Não execute importações concorrentes. Agendamento e monitoramento ainda dependem da infraestrutura de implantação.

Câmara e Senado estão integrados. TSE, DataJud, TCU e Portal da Transparência foram pesquisados e continuam pendentes. Não se usa o TSE como prova automática de exercício atual. Ainda faltam votos nominais, despesas, patrimônio, promessas, histórico eleitoral completo, assembleias estaduais e câmaras municipais. Município não é inferido da UF. Ausência de registro nunca significa ausência de atuação ou processos.

## Administração e implantação

Sem `CIVIS_ADMIN_PASSWORD` com pelo menos 16 caracteres, a administração fica desativada. Use uma senha exclusiva e defina `CIVIS_ADMIN_NAME` para identificar o responsável. Segredos devem ficar no ambiente, nunca no repositório. [Variáveis disponíveis](.env.example).

Sessões usam assinatura, cookie HttpOnly/SameSite Strict, Secure em produção e invalidação ao trocar a senha. A chave local fica em `var/session.key` (0600), ou pode ser fornecida por `CIVIS_SESSION_KEY`. Atrás de proxy, configure `CIVIS_PUBLIC_ORIGIN` com a origem HTTPS exata. Faça backup do banco e da chave separadamente.

SQLite exige um processo Node com **disco persistente**. Não use filesystem efêmero/serverless para o banco de produção. A limitação de tráfego em memória serve uma instância; múltiplas instâncias precisam de proteção compartilhada no proxy ou armazenamento próprio. O MVP tem uma identidade administrativa: MFA, múltiplos editores e separação entre revisão e aprovação permanecem pendentes.

Registros sensíveis exigem documentação oficial individualizada e revisão humana. Validadores não substituem análise jurídica. Antes de lançamento amplo, ainda são necessários revisão jurídica/LGPD proporcional, observabilidade, recuperação de backups e revisão dos direitos de uso das fotografias. [Contrato editorial](docs/EDITORIAL.md).

## Documentação

- [Estado e próximos incrementos](docs/STATUS.md)
- [Auditoria de organização e ferramentas](docs/audit/repository-audit.md)
- [Arquitetura](docs/ARCHITECTURE.md)
- [Pesquisa de UI e licenças](docs/research-ui.md)
- [Projetos pesquisados](docs/research-projects.md)
- [Fontes oficiais](docs/research-sources.md)
- [Análise do material Gemini](docs/GEMINI-REVIEW.md)
- [Galeria histórica de capturas](docs/preview/index.html)

Os arquivos de preview existentes são preservados para não quebrar links compartilhados. Bibliotecas mantêm suas próprias licenças; isso não licencia automaticamente os dados, as fotos ou o código da aplicação. Não houve cópia de código de CandData ou dos projetos cívicos pesquisados.

## Auditoria e experiência

A revisão de código e design está documentada no [relatório integrado](docs/audit/README.md), com [pesquisa de bibliotecas e referências](docs/audit/design-research.md), resultados e limites. Para conferir as funções, use o [roteiro de testes manuais](docs/testing/manual-checklist.md). Os estilos têm uma entrada em `src/app/globals.css` e responsabilidades em `src/styles/`; a revisão não adiciona dependências de runtime.
