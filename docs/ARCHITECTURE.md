# Arquitetura vigente

PLENÁRIO é uma aplicação Next.js App Router com React, TypeScript e Node.js 24. Páginas públicas usam renderização no servidor; busca, seleção, comparação e diálogos são interações de cliente. A persistência usa SQLite (`node:sqlite`) em disco local. Esse recorte mantém o MVP executável sem serviços externos pagos.

## Fronteiras do código

| Camada              | Arquivos                                            | Função                                                         |
| ------------------- | --------------------------------------------------- | -------------------------------------------------------------- |
| Rotas e metadados   | `src/app/`                                          | SSR, carregamento, erros, páginas e handlers HTTP              |
| Componentes         | `src/components/`                                   | Apresentação, navegação e estado de interação                  |
| Domínio e evidência | `src/lib/types.ts`, `validation.ts`, `editorial.ts` | Contratos, IDs, fontes e regras de publicação                  |
| Persistência        | `src/lib/db.ts`                                     | SQL parametrizado, transações, versões, lotes e correções      |
| Integração          | `src/lib/camara.ts`, `senado.ts`                    | Obtenção e normalização por identificador oficial              |
| Segurança           | `src/lib/security.ts`                               | Sessões, origem de mutações, senha, limites e leitura do corpo |
| Operação            | `scripts/`                                          | Inicialização e importação explícitas                          |
| Verificação         | `tests/`                                            | Dados, segurança, regras editoriais e browser                  |

Não há monorepo, microserviços ou um backend separado nesta versão. Introduzir essas camadas sem necessidade aumentaria os pontos de falha. PostgreSQL, processamento assíncrono e limitação de tráfego compartilhada são incrementos condicionados à carga e à infraestrutura.

## Dados e proveniência

IDs internos `camara:<id>` e `senado:<id>` preservam o identificador da fonte. Pessoas de fontes diferentes não são associadas apenas pelo nome. Datas do fato, publicação, coleta e verificação permanecem distintas; campos desconhecidos ficam nulos.

A inicialização de um banco vazio usa os snapshots versionados em `data/`. A importação consulta as fontes oficiais, normaliza e valida o lote, persiste versões e só então altera a seleção ativa da Casa correspondente. Uma falha preserva o lote anterior e gera um registro de execução. O importador não reintroduz conteúdo editorial corrigido ou rejeitado.

O snapshot histórico de 2015 permanece separado dos lotes correntes de Câmara e Senado. Restaurar um snapshot não torna seu conteúdo atual. A interface deve mostrar a data e os limites da cobertura.

## Interface e dependências

Radix Dialog fornece comportamento de foco e fechamento dos diálogos e do menu móvel; Lucide fornece ícones; Open Props fornece tokens CSS de easing. O menu usa superfícies e animações CSS próprias (sheet inferior no celular, painel lateral em telas maiores) e a busca mantém os filtros visíveis, sem instalar outra biblioteca de componentes. Fotos usam primeiro o proxy validado da aplicação; se a requisição falhar, o navegador tenta a URL exata publicada pela Câmara, sem Referer. Nesse caso, o domínio oficial recebe o IP do navegador. Se não houver conexão com nenhum dos caminhos, a tela mantém o placeholder. Bibliotecas de runtime adicionais precisam resolver uma necessidade concreta sem duplicar esses comportamentos.

Prettier é apenas ferramenta de desenvolvimento. `.editorconfig`, `.prettierrc.json` e `.prettierignore` mantêm a organização legível e deixam snapshots e arquivos compartilhados de preview intactos. TypeScript, testes e revisão cobrem responsabilidades diferentes da formatação.

## Segurança e publicação editorial

A administração fica desativada sem segredo próprio e não tem senha padrão. Sessões são assinadas e expiram; a troca da senha invalida sessões anteriores. Mutações exigem origem correspondente. Senhas, chaves e banco não são arquivos públicos.

Investigações, denúncias, processos, condenações recorríveis, trânsito em julgado e desfechos favoráveis são estados distintos. A aprovação exige evidência individualizada, data, cronologia e justificativa humana. Metadados processuais, reportagens e resumos por IA não equivalem ao teor de uma decisão. Validadores são barreiras de consistência e não substituem revisão jurídica.

Pedidos de correção são privados. O público não consulta a fila editorial, a auditoria ou pedidos de terceiros. A operação ainda usa uma única identidade administrativa, sem MFA ou dupla revisão.

## Execução e limites

A aplicação precisa de processo Node e volume persistente para `var/civis.db` e sua chave. Não hospede o banco em disco efêmero de funções serverless. Proxies devem preservar host/origem, usar HTTPS e definir `CIVIS_PUBLIC_ORIGIN` corretamente. Backups e recuperação precisam ser implantados e testados no host escolhido.

A proteção de tráfego em memória atende apenas um processo. Uma implantação com múltiplas instâncias requer limite compartilhado no proxy ou serviço próprio. A CSP atual admite scripts inline necessários ao Next.js; nonce estrito continua pendente. Não há alegação de pentest, auditoria jurídica ou certificação de acessibilidade.

Testes manuais compartilhados devem usar uma base isolada com snapshots públicos e administração desativada. Iniciar o servidor não publica um endereço externo. O projeto ainda não tem um deploy público verificado.

## Evolução prevista

- Dados eleitorais do TSE com referência à eleição, sem inferir automaticamente o mandato atual.
- Atividade legislativa adicional, despesas e votos com contexto de cargo e período.
- Adaptadores de assembleias e câmaras municipais com IDs oficiais e cobertura explícita.
- Gestão multiusuário, revisão por pessoas distintas, correções com prazos e monitoramento operacional.

## Estilos e conteúdo de apresentação

`src/styles/` contém tokens, base e folhas por superfície, importadas uma única vez por `src/app/globals.css`. `src/content/` reúne rótulos processuais e ordenação de trajetória; componentes de página não importam outros exploradores inteiros para reutilizar um retrato. `Portrait.tsx` reserva dimensões e trata falhas por pessoa, inclusive anteriores à hidratação. A comparação preserva identificadores válidos somente na sessão, sem gravar dados políticos novos.
