# Pesquisa de interface e decisões aplicadas

Pesquisa desta revisão, 31/10/2026. Objetivo: melhorar leitura e exploração de informações políticas documentadas, mantendo retratos reais, fontes e neutralidade.

## Método e limites

Foram avaliadas documentação versionada, licenças, código de componentes e metadados de pacotes. As páginas HTTP de dez sites de documentação foram bloqueadas pelo proxy (CONNECT 403); isso não foi tratado como inexistência das bibliotecas. A pesquisa prosseguiu pelo proxy Git HTTPS em repositórios oficiais, com revisão do conteúdo via `git show`, e pelo registro npm. Não alegamos auditoria de segurança de todas as dependências ou testes de usabilidade com cidadãos.

Os clones de pesquisa ficaram em `/tmp`, fora do produto. Nenhum script desses projetos foi executado e nenhum template completo foi copiado. Versões mais recentes no registro não motivaram atualizações automáticas de dependências funcionais.

## Comparação das alternativas

| Recurso                           | Licença de software verificada                                                     | Avaliação e decisão                                                                                                                                                          |
| --------------------------------- | ---------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Radix Dialog 1.3.1, já instalado  | MIT                                                                                | Mantido para menus e fontes: foco modal, Escape, descrição e retorno ao acionador. Aparência própria via CSS.                                                                |
| Lucide React 1.61.0, já instalado | ISC; alguns ícones herdados MIT                                                    | Mantido. Ícones pontuais acompanham texto; não substituem rótulos.                                                                                                           |
| Open Props 1.7.23, já instalado   | MIT                                                                                | Mantido apenas o arquivo de curvas de animação. Sem pacote JS de animação no produto.                                                                                        |
| shadcn/ui, CLI consultada 4.23.0  | MIT                                                                                | Sheet usa Dialog; adicionar outra implementação repetiria o primitivo já presente. Padrões de composição estudados, CLI não instalada.                                       |
| Tailwind CSS 4.3.3                | MIT                                                                                | Não introduzido nesta revisão: converter toda a UI para classes utilitárias criaria uma migração sem benefício funcional imediato.                                           |
| Motion 14.9.0                     | MIT                                                                                | Entrada/saída complexa disponível, mas o menu atual precisa apenas de transição CSS e preferência de movimento reduzido. Não instalado.                                      |
| Embla Carousel 8.6.0              | MIT                                                                                | Adequado quando um carrossel é necessário. A grade paginada permite localizar e comparar retratos sem ocultar opções ou iniciar movimento automático. Não instalado.         |
| Recharts 3.10.1                   | MIT                                                                                | Adiado: não há séries comparáveis integradas que justifiquem gráficos; números ausentes não serão inventados. Tabela semântica continua sendo a comparação.                  |
| Pico CSS 2.1.1                    | MIT                                                                                | Bom padrão básico de formulários, mas seus estilos globais concorreriam com o tema existente. Não incorporado.                                                               |
| Bootstrap 5.3.8                   | MIT                                                                                | Componentes maduros, mas o CSS completo e seu sistema visual seriam redundantes. Não incorporado.                                                                            |
| Magic UI                          | MIT no repositório examinado; verificar licença de cada asset                      | Componentes de canvas/partículas examinados usam atualizações contínuas e eventos de mouse. Fundos permanentes desse tipo não ajudam a consulta documental. Não incorporado. |
| GOV.UK Design System              | Reutilização de código MIT e conteúdo sob termos próprios; marcas/assets separados | Referência de legibilidade e serviço público, sem copiar identidade/marca. Aplicados princípios de texto claro, linhas limitadas e navegação previsível.                     |

As versões consultadas no registro descrevem a coleta desta sessão; não são uma promessa de compatibilidade futura. As bibliotecas citadas são gratuitas para uso nos termos de suas licenças. A licença da aplicação e os direitos dos dados/fotos são assuntos separados.

## Adendo às anotações visuais, 31/10/2026

O novo pedido especifica uma navegação e uma busca com acabamento premium inspirado no iOS. A referência é o uso de superfícies translúcidas com contraste, hierarquia, painéis arredondados, estados ativos claros, áreas de toque confortáveis e gavetas que respeitam a área segura do aparelho. A marca, a paleta marinho/dourado e os rótulos do PLENÁRIO permanecem próprios do projeto. As [Human Interface Guidelines da Apple](https://developer.apple.com/design/human-interface-guidelines/) não puderam ser consultadas pelo proxy desta execução (HTTP CONNECT 403); a implementação não depende de copiar ativos ou código proprietário da Apple.

| Alternativa adicional                                                       | Licença/estado verificado                                                     | Decisão para esta alteração                                                                                                                                                                                                        |
| --------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Vaul 1.1.2](https://www.npmjs.com/package/vaul/v/1.1.2)                    | MIT no pacote npm; depende de `@radix-ui/react-dialog`                        | O padrão de drawer e a adaptação por dispositivo são relevantes. Não adicionado: já temos o mesmo primitivo Radix para modal/foco/Escape e o efeito pedido pode ser feito com CSS, preservando tamanho e comportamento conhecidos. |
| [Base UI React 1.9.0](https://www.npmjs.com/package/@base-ui/react/v/1.9.0) | MIT no pacote npm; primitivos headless, pacote publicado com 10.377.319 bytes | Boa alternativa quando a equipe quer migrar componentes para essa família; neste produto, introduzir agora duplicaria Dialog e exigiria revalidar toda a navegação. Não instalado.                                                 |
| Radix Dialog 1.3.1 + CSS próprio                                            | MIT, já é dependência do produto                                              | Mantido como base acessível para o menu. O visual do drawer usa `backdrop-filter` com fallback opaco, bordas grandes, `env(safe-area-inset-bottom)`, animação curta e `prefers-reduced-motion`.                                    |
| CSS nativo: sticky, `backdrop-filter`, `env()`                              | Recursos da plataforma do navegador                                           | Aplicado sem biblioteca nova. O menu móvel vira um sheet inferior rolável; desktop mantém painel lateral. O painel de busca ganhou borda suave, sombra curta, campos agrupados e foco visível no conjunto.                         |

Vaul declara compatibilidade com React 19 e licencia o pacote sob MIT, mas seu repositório ainda depende do Radix Dialog e inclui interações de arraste/snap que não são necessárias ao menu do PLENÁRIO. O último commit consultado do repositório foi `3e97aac` (03/10/2025), então a cadência recente também recomenda cautela. A busca não deve parecer um controle de painel administrativo: recebeu maior área de toque, grupos de filtros arredondados e realce consistente para teclado. O topo e o hero foram compactados para trazer os resultados para mais perto do título; a imagem decorativa foi reduzida. Na comparação das capturas de 1280 px, o painel de busca passa de aproximadamente y=675 para y=550, e o início dos cartões de y=878 para y=748. As capturas estão em `docs/preview/assets/`.

### Fotos oficiais

O snapshot Câmara contém URL oficial para 513 dos 513 deputados; o snapshot do Senado e o recorte histórico não contêm URLs de foto. A captura marcada pelo usuário mostra placeholders porque o servidor desta execução não consegue abrir `www.camara.leg.br`: o proxy responde HTTP CONNECT 403. O endpoint no servidor continua sendo o caminho principal, com validação de host, formato e tamanho. Se ele falhar, o componente tenta a mesma URL oficial já validada no navegador, sem cabeçalho Referer; isso permite que navegadores conectados exibam o retrato mesmo quando o proxy da aplicação não alcança a fonte. Se ambos os caminhos falharem ou o registro não tiver foto oficial, permanece o fallback claramente identificado. A segunda tentativa é limitada ao host e ao caminho exatos da foto da Câmara, não a URLs arbitrárias.

## Evidência em fontes versionadas

- [Radix Dialog](https://github.com/radix-ui/primitives/blob/eb3a2b7091293e27df8f9ba906632d8daa3d81a3/packages/react/dialog/src/dialog.tsx), commit `eb3a2b7091293e27df8f9ba906632d8daa3d81a3`: implementação do foco preso ao modal aberto, retorno de foco e identificação por título/descrição. Licença na raiz do mesmo commit.
- [shadcn Sheet](https://github.com/shadcn-ui/ui/blob/c0d63c339d6cd2fc26135590a54cf1f362269451/apps/v4/content/docs/components/radix/sheet.mdx), commit `c0d63c339d6cd2fc26135590a54cf1f362269451`: documentação do painel construído sobre Dialog.
- [Open Props](https://github.com/argyleink/open-props/tree/f39ab7c377a0e047f930982e3611bbc95254a260), commit `f39ab7c377a0e047f930982e3611bbc95254a260`: tokens CSS e licença. O produto importa somente easings.
- [Embla](https://github.com/davidjerleke/embla-carousel/tree/0423b61463dd6f095d7aca810a49bbf194d6c291), commit `0423b61463dd6f095d7aca810a49bbf194d6c291`: alternativa estudada para slides, sem incorporar uma navegação que esconda perfis.
- [Motion](https://github.com/motiondivision/motion/tree/7415b6cd14dfdb35d91dfc5b9758994444cc228b), commit `7415b6cd14dfdb35d91dfc5b9758994444cc228b`: referência de animação React, não adicionada ao bundle.
- [Magic UI](https://github.com/magicuidesign/magicui/tree/3104579193fa2e2d3c659dcd9441bbd370a3296c), commit `3104579193fa2e2d3c659dcd9441bbd370a3296c`: inspeção de componentes de fundo e licença; efeitos de partículas não usados.
- [GOV.UK: layout](https://github.com/alphagov/govuk-design-system/blob/cafbeeac22fcbaadd0112d90c777322e31cd439c/src/styles/layout/index.md) e [tabs](https://github.com/alphagov/govuk-design-system/blob/cafbeeac22fcbaadd0112d90c777322e31cd439c/src/components/tabs/index.md), commit `cafbeeac22fcbaadd0112d90c777322e31cd439c`: coluna única móvel, comprimento de linha controlado e cuidado com conteúdo escondido. No perfil, mantivemos seções e sumário, sem esconder evidências em abas.

## Peso de CSS examinado

Arquivos completos de distribuições, antes de qualquer tree shaking ou build customizada: Pico 83.319 bytes brutos / 11.640 gzip; Bootstrap 232.111 / 30.869 gzip; Open Props easings instalado 5.504 / 1.505 gzip. Esses valores não são o custo final de uma aplicação e uma distribuição parcial pode ser menor. A comparação justifica evitar um segundo framework global, não afirma que qualquer biblioteca seja inerentemente lenta.

## Conceitos aplicados ao PLENÁRIO

1. **Registro editorial:** papel claro, texto escuro, marinho na marca e seleção, dourado restrito a hierarquia e detalhes. Sem cores de partido como juízo de valor.
2. **Busca como tarefa principal:** título direto, campo com tamanho de leitura, filtros nomeados, estados de seleção e resultado compreensíveis.
3. **Identificação:** retratos reais preservados, fallback por pessoa, resumo selecionado e link explícito para a ficha.
4. **Leitura:** fontes de sistema declaradas de forma honesta, títulos serifados, texto de conteúdo em 15–18 px, metadados legíveis e fontes próximas às afirmações. Sem download de fontes externas.
5. **Toque e teclado:** alvos principais com 44 px, foco visível, menu rolável em paisagem e retorno pelo Escape. No celular o resumo tem um atalho explícito, sem rolar a página automaticamente ao selecionar.
6. **Continuidade:** comparação persiste durante a sessão, inclusive no caminho de um perfil para a escolha do segundo. Armazenamento bloqueado não quebra navegação.
7. **Movimento e fundos:** apenas feedback curto de cor e painel; sistema e controle do usuário reduzem movimento. Ilustração arquitetônica SVG original em um detalhe do hero; nenhum vídeo, canvas ou efeito de cursor contínuo.
8. **Manutenção:** uma definição de tokens e estilos separados por superfície, importados em ordem pelo layout. As camadas antigas de overrides foram substituídas.

## O que ainda exige pesquisa com pessoas

A revisão técnica não substitui observação de uso com eleitores de diferentes níveis de escolaridade, leitores de tela e aparelhos reais. Próximo estudo recomendado: localizar um parlamentar, conferir a data da fonte e comparar dois perfis, registrando erros de interpretação e conclusão de tarefa. Nenhuma certificação de acessibilidade é alegada.
