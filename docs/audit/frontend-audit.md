# Auditoria de interface e experiência

Referência inicial: commit `541b1c0`. Escopo: páginas públicas, seleção, perfis, comparação, guia de cargos, navegação e carregamento de retratos. Esta revisão combina inspeção de código e medições de layout no Chromium local; não constitui certificação de acessibilidade nem pesquisa com usuários reais.

## Método

- Leitura de `AGENTS.md` e das orientações instaladas do Next sobre CSS, imagens e limites entre componentes de servidor/cliente.
- Inspeção de `Selector`, `Header`, `Profile`, `Compare`, `Citation`, guia de cargos e folha global.
- Navegação na build de produção preexistente em larguras de 320, 390, 768 e 1280 px; menu também em 780 × 360 px.
- Conferência de tamanhos computados de texto, áreas de acionamento, largura do documento e rolagem do menu. Não foram simulados usuários com deficiência, leitor de tela físico ou rede móvel real.

## Achados e encaminhamento

| Prioridade | Evidência na referência inicial                                                                                   | Impacto                                                                                                                                                                   | Encaminhamento                                                                                                                                           |
| ---------- | ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Alta       | Nomes dos cards em 12 px; cargos em 9 px; filtros em 10–11 px; conteúdo dos cargos em 11 px.                      | Leitura exige esforço, sobretudo no celular e para o público que precisa de linguagem acessível. A checagem automática de contraste não identifica esse problema sozinha. | Aumentar a escala de leitura, usar menos rótulos em caixa alta e manter contraste claro entre texto e informação secundária.                             |
| Alta       | Menu em 780 × 360 px: `clientHeight=360`, `scrollHeight=513`, `overflow-y:visible`; último link termina a 462 px. | Opções ficam fora da tela enquanto o Dialog bloqueia a rolagem da página.                                                                                                 | Tornar o painel rolável, manter fechamento acessível e validar paisagem e zoom.                                                                          |
| Alta       | Perfil → “Comparar perfil” → comparação com uma pessoa → “Explorar perfis” apontava para `/` sem o identificador. | A pessoa selecionada se perde ao tentar completar a comparação.                                                                                                           | O retorno da comparação agora leva `/?comparar=<ids>#explorar`; a seleção deve restaurar esses IDs.                                                      |
| Média      | Estado de falha do retrato era um booleano único, mesmo ao trocar a pessoa no painel selecionado.                 | Uma foto que falha podia fazer perfis posteriores exibirem somente iniciais.                                                                                              | Retrato extraído; a falha agora pertence ao ID e à URL da foto, com imagem identificada por essa chave.                                                  |
| Média      | Botões de paginação em 25 × 25 px; setas adjacentes em 24 × 24 px.                                                | Acionamento difícil por toque e maior chance de erro.                                                                                                                     | Ampliar controles e áreas de acionamento; almejar 44 px nos principais controles móveis.                                                                 |
| Média      | Documento em 320 px apresentava largura de 324 px.                                                                | Pequena rolagem horizontal fora das áreas que precisam dela.                                                                                                              | Conferir cabeçalho, filtros e grids nessa largura; manter rolagem horizontal apenas na tabela comparativa.                                               |
| Média      | A troca de página da grade preservava no painel uma pessoa da página anterior.                                    | O painel e a grade podem parecer desconectados, sem card destacado visível.                                                                                               | Selecionar explicitamente um item da página atual ou tornar a persistência da seleção clara.                                                             |
| Média      | `localStorage.getItem/setItem` no cabeçalho não tinham tratamento de falha.                                       | Navegadores com armazenamento negado podem lançar erro e impedir o controle de movimento.                                                                                 | Leitura/gravação agora usam tratamento de exceção; a preferência funciona na sessão mesmo sem persistência.                                              |
| Média      | Retratos não declaravam dimensões nem carregamento preguiçoso.                                                    | Solicitações desnecessárias para imagens fora de vista e metadados de tamanho ausentes.                                                                                   | Dimensões 300 × 360, `decoding=async`, carregamento tardio nos cards e imediato no retrato principal. O contêiner continua reservando proporção via CSS. |
| Média      | `globals.css` tinha 67.101 bytes e várias camadas de overrides de redesign.                                       | Alterações pequenas dependem da ordem de regras antigas; difícil prever estados responsivos.                                                                              | Consolidar tokens, base, componentes e regras responsivas em arquivos organizados, sem acrescentar outra camada de correções.                            |
| Baixa      | `Compare` importava rótulos de `Profile`; ambos importavam `Portrait` de `Selector`.                              | Dependências entre páginas de interface sem necessidade; dificulta manutenção e avaliação do grafo cliente.                                                               | Rótulos em `src/content/legal-labels.ts`; retrato em `components/Portrait.tsx`. Nenhuma redução de bundle é alegada antes de medir.                      |
| Baixa      | Famílias DM Sans e Manrope eram citadas no CSS sem fontes locais ou importadas.                                   | O resultado real depende de fontes instaladas e geralmente cai em Arial.                                                                                                  | Escolher uma pilha de sistema explícita ou fontes locais licenciadas; não adicionar uma dependência de rede apenas para reproduzir nomes de fontes.      |

## Pontos que devem ser preservados

- Dialog do Radix para menu e citações: gerenciamento de foco, Escape e retorno ao acionador já fazem parte do fluxo.
- Fontes junto da informação, datas, estados de ausência e avisos sobre limites de cobertura.
- Tabela semântica para comparar dimensões, com área de rolagem identificada; não substituir a comparação por uma pontuação moral.
- Identidade dos políticos via retrato oficial e IDs, sem associação de credibilidade a partido ou cor ideológica.
- Movimento reduzido do sistema e preferência opcional do site.
- SVG original e CSS leve quando bastam; não há necessidade funcional de vídeo de fundo, partículas, carrossel automático ou biblioteca de animação adicional.

## Correções implementadas nesta revisão

1. Armazenamento opcional do controle de movimento com tratamento de falha.
2. Identificação da área “Políticos” na navegação quando um perfil é aberto.
3. Componente de retrato independente, com falha associada à imagem, dimensões, decodificação e carregamento adequados; fallback com nome acessível, sem repetir o texto alternativo da foto no contêiner.
4. Rótulos jurídicos compartilhados em conteúdo estático, mantendo as dez situações distintas.
5. Retorno do comparador ao explorador com os identificadores já escolhidos.

As alterações visuais, restauração da seleção e verificação final de layout são acompanhadas pela implementação principal. As medições acima descrevem a referência inicial, não afirmam o resultado da build final.

## Resultado integrado

Os fluxos acima foram corrigidos e verificados na suíte final de 12 testes de navegador: persistência e retorno à comparação, paginação coerente, storage negado, foto com falha antes da hidratação e troca posterior, menu em paisagem e páginas secundárias. A grade não apresentou overflow nas larguras 320/390/768/1280. Alvos de paginação/troca de perfil medidos em 44 px; nomes 16 px e cargos 12 px. Ver métricas e limitações no relatório integrado.
