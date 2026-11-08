# Skills Codex P1 — escopo PLENARIO

Instaladas apenas nesta branch e apenas neste repositório, via arquivos em `.agents/skills/`, sem instalação global, sem novos pacotes npm, sem scripts executados e sem alterações no código-fonte da aplicação.

| Skill | Upstream fixado | Licença | Uso |
|---|---|---|---|
| `animate` | [emilkowalski/skills@c8a7962](https://github.com/emilkowalski/skills/tree/c8a79627b59d72d764d6ab6f2c87c09a48169833/skills/animate) | MIT | Criar motion de componentes sem sobrepor design system |
| `gsap-web` | [iart-ai/web-animation-skills@b6dba3e](https://github.com/iart-ai/web-animation-skills/tree/b6dba3eb759726845a44163ff0bad70dd9e7fbb6/skills/gsap-web) | MIT | GSAP/ScrollTrigger somente quando o projeto realmente precisar |
| `vercel-react-best-practices` | [vercel-labs/agent-skills@1a2c79d](https://github.com/vercel-labs/agent-skills/tree/1a2c79d4e6c4a2283dc2c614b6538cbe1ed5ca62/skills/react-best-practices) | MIT declarado no SKILL.md | React/Next.js; regras individuais carregadas sob demanda |

Os arquivos de suporte e regras foram incluídos para a skill continuar utilizável offline. Licenças MIT upstream incluídas nos dois primeiros diretórios; a skill Vercel declara MIT em seu frontmatter.

## Validação após aprovação do PR
- Inspecionar diffs e confirmar que **somente** `.agents/skills/` e este documento foram adicionados.
- No Codex aberto **na pasta deste projeto**, procurar `$animate`, `$gsap-web`, `$vercel-react-best-practices` no catálogo de skills.
- Acionar explicitamente apenas a skill adequada à tarefa. Não acrescentar GSAP nem outra dependência sem autorização.
- Para qualquer alteração futura de código: abrir branch separada, reproduzir falha, executar `npm run check`, `npm run build` e `npm run test:e2e` quando pertinentes, com capturas visuais e teste de redução de movimento.
- Como a branch apenas adiciona instruções e exemplos, não há execução de scripts, instalação de Node nem comparação A/B concluída.

## Remoção
Reverter o PR, ou remover os três diretórios `.agents/skills/<nome>` e este documento. Para desabilitar sem excluir, utilizar a configuração de skills documentada pelo Codex.
