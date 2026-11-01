# Auditoria integrada do PLENÁRIO

Revisão de 31/10/2026 sobre a base `541b1c0`, aplicada ao código do repositório. Objetivo: leitura acessível, navegação contínua, consistência dos dados e manutenção previsível. A revisão percorreu UI, rotas, dados, integração, autenticação e ferramentas, com inspeção visual e testes locais. Não constitui pentest externo, certificação WCAG ou revisão jurídica.

## Entrega

- Fundo claro para leitura e marca marinho/dourado; tipografia de sistema, hierarquia editorial e retratos oficiais preservados.
- Busca/filtros mais legíveis, seleção consistente com a página da grade, atalhos claros no celular e controles principais de 44 px.
- Comparação continua entre ficha, explorador e recarga da sessão; funciona sem storage. Modal e menu mantêm Radix para foco/Escape e o menu rola em paisagem.
- Fallback de foto considera a identidade da pessoa e falhas anteriores à hidratação. Fotos com sucesso usam o proxy oficial, sem substituições artificiais.
- Timeline exibida em ordem cronológica sem alterar registros da fonte.
- CSS antigo substituído por tokens/base/navegação/explorador/conteúdo/guia. Componentes de retrato e rótulos jurídicos compartilhados evitam imports de páginas inteiras.
- Barreiras de importação/revisão jurídica, limites de download, tipos seguros de imagem, IDs de fontes diferentes e permissões de banco fortalecidos.
- Prettier apenas em desenvolvimento, Node 24 fixado, tipos estritos, CI com permissões de leitura e Actions fixadas por SHA. Dados/arquivos históricos preservados.

## Evidências executadas

| Verificação                            | Resultado                                                                    |
| -------------------------------------- | ---------------------------------------------------------------------------- |
| Formatação, TypeScript e diff          | Aprovados                                                                    |
| Dados, editorial, segurança e migração | 41 testes aprovados, 0 falhas, 0 ignorados                                   |
| Navegador Chromium                     | 12 testes aprovados, 0 falhas, 0 ignorados                                   |
| Build de produção                      | Aprovada                                                                     |
| npm audit                              | 0 avisos conhecidos; não substitui revisão de código                         |
| Axe A/AA nas telas percorridas         | 0 violações; não é certificação                                              |
| Larguras 320/390/768/1280              | Sem overflow da página inicial; tabelas mantêm sua região própria de rolagem |
| CSS build bruta                        | 70.568 → 44.504 bytes                                                        |
| CSS gzip calculado localmente          | 15.351 → 10.336 bytes, redução de 32,7%                                      |

A medição local de carregamento registrou 9 requisições JS / 163.432 bytes, sem nova biblioteca de runtime. Tempos variam entre execuções; não foi feito ensaio de rede móvel/CPU ou Lighthouse. Não alegamos redução de JS ou melhoria universal de velocidade.

Capturas atuais estão em `docs/preview/assets/`, e métricas reproduzíveis desta execução em [browser-metrics.json](browser-metrics.json) e [css-metrics.json](css-metrics.json). As imagens foram capturadas de uma base temporária com os snapshots públicos, sem publicar pedidos reais de correção.

## Detalhes e continuidade

- [Backend e segurança](backend-audit.md)
- [Interface, evidência inicial e achados](frontend-audit.md)
- [Pesquisa de bibliotecas, licenças e princípios](design-research.md)
- [Organização e CI](repository-audit.md)
- [Roteiro manual](../testing/manual-checklist.md)

## Limites e pendências verificáveis

A fonte de fotografias da Câmara continua bloqueada pelo proxy de saída deste ambiente (CONNECT 403). As capturas mostram o fallback real; regressões de imagem usam raster sintético declarado. Não se removeu o vínculo oficial da foto. Conectividade externa precisa ser verificada no host de preview.

A pesquisa HTTP de algumas documentações também foi bloqueada, mas fontes oficiais versionadas foram inspecionadas via Git HTTPS. Não foram executados scripts dos repositórios pesquisados.

Publicação/preview externo e CI remota ainda não foram confirmados. O código enviado ao GitHub e o link do editor Lovable não provam um deploy navegável. Nenhum serviço pago foi contratado. Dados estaduais/municipais, novas integrações, MFA, rate limiting compartilhado, backups/observabilidade de produção e revisão jurídica continuam fora desta entrega.

A migração SQLite foi validada com base legada temporária; produção exige backup e supervisão. A aplicação ainda não tem uma licença própria declarada: isso foi registrado, sem escolher termos pelo proprietário.
