# Auditoria de organização e ferramentas

Revisão executada em 31/10/2026 no repositório `levibryxnn/screenshot-exact-match`, a partir do commit `541b1c0`. Este relatório cobre organização, dependências e automação; as correções de aplicação e design são registradas separadamente. Não é um pentest nem uma auditoria jurídica.

## Evidência e escopo

Foram lidos o manifesto e lockfile, `AGENTS.md`, TypeScript, scripts, testes, README, arquitetura, estado e documentação incluída no Next.js 16.4.3 sobre ESLint e Playwright. A consulta ao registro npm confirmou Prettier 3.9.10. `npm audit` retornou zero avisos conhecidos antes da inclusão dessa ferramenta. O comando precisou de cache em `/tmp`, pois o diretório padrão do npm não era gravável neste ambiente.

## Achados

| Prioridade | Achado                                                                        | Tratamento nesta revisão                                                                                                                                                 |
| ---------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Média      | Grande parte do código em linhas comprimidas dificultava revisão e manutenção | Prettier de desenvolvimento, padrão de editor e comandos reproduzíveis adicionados; a formatação global deve ocorrer após a integração das alterações                    |
| Média      | Ausência de controles automatizados no repositório                            | Workflow Node 24 com formatação, TypeScript, testes, auditoria de dependências, build e navegador adicionado; execução remota ainda precisa ser observada                |
| Baixa      | Versão do Node sem pin e intervalo aberto a futuros majors                    | `.nvmrc` e `engines.node = 24.x` alinham o ambiente ao runtime testado                                                                                                   |
| Baixa      | Documentação misturava limites, execução, pesquisa e resultados antigos       | README e arquitetura reorganizados por responsabilidade; status diferencia evidência anterior e validação desta revisão                                                  |
| Baixa      | Muitos artefatos de preview duplicam arquivos binários                        | Preservados para manter URLs já compartilhadas; ignorados pelo formatter. Armazenamento de artefatos poderá substituir duplicações em uma migração com redirecionamentos |
| Aberta     | Não há licença própria da aplicação no diretório raiz                         | Não foi inventada uma licença. O titular precisa escolher os termos; licenças de bibliotecas não se estendem automaticamente ao aplicativo, dados ou fotos               |
| Aberta     | Não há deploy público verificado                                              | Documentação mantém essa limitação. CI e um servidor local não equivalem a uma URL de preview publicada                                                                  |

## Decisões

Prettier adiciona uma dependência somente de desenvolvimento, sem JavaScript enviado ao navegador. É uma ferramenta de formatação, e os comandos não são apresentados como lint semântico. A versão instalada do Next.js documenta que `next lint` foi removido; não foi adicionado um comando que deixou de existir. Lint estático mais amplo pode ser adotado numa revisão dedicada das regras, sem desabilitar indiscriminadamente diagnósticos para obter um resultado verde.

Os dados oficiais e arquivos públicos não foram movidos ou regravados. O layout de `src/app`, `src/components` e `src/lib` já corresponde às fronteiras do MVP; não há benefício demonstrado em introduzir monorepo ou mover todos os arquivos para uma arquitetura maior.

O workflow usa permissões somente de leitura do repositório, execução por push/PR, tempo máximo e cancelamento de execuções anteriores da mesma referência. As três Actions são fixadas por SHA, confirmadas nas tags v4 dos repositórios oficiais com `git ls-remote`. Não precisa de credenciais de produção. Evidências de testes de navegador ficam em artefatos temporários com retenção de sete dias.

## Verificações deste trabalho

- `npm view prettier version --cache /tmp/civis-npm-cache`: 3.9.10.
- `npm audit --cache /tmp/civis-npm-cache --json` antes da mudança: zero vulnerabilidades conhecidas reportadas.
- `npm install --save-dev --save-exact prettier@3.9.10 --cache /tmp/civis-npm-cache --no-fund`: concluído.
- `npm install --package-lock-only --ignore-scripts --cache /tmp/civis-npm-cache --no-fund`: concluído após alinhar `engines`.
- `npm audit` após adicionar Prettier: zero avisos conhecidos reportados (122 dependências totais, incluindo opcionais).
- Tags oficiais v4 de `actions/checkout`, `actions/setup-node` e `actions/upload-artifact`: consultadas via Git e usadas como SHAs fixos no workflow.
- Formatação de código-fonte, TypeScript, testes, build e browser da versão integrada: responsabilidade da validação final, não presumidos por este relatório.

## Continuidade

Antes de integrar: aplicar `npm run format`, conferir o diff, executar `npm run format:check`, TypeScript, testes de dados/segurança/editoriais, build e navegador. Depois de enviar os commits, observar o resultado real da CI. Atualizar `docs/STATUS.md` com os resultados efetivamente obtidos, preservando a distinção entre validação local e hospedagem pública.
