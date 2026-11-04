# Contribuindo para o PLENÁRIO

## Princípios

- Informações políticas devem ser verificáveis, com fonte primária, data e contexto visíveis.
- Não transformar denúncias ou investigações em condenações. Não inventar dados ou rankings morais.
- Preservar o layout editorial minimalista e os critérios de acessibilidade.
- Evitar dependências novas quando bibliotecas existentes já resolvem a necessidade.

## Fluxo de desenvolvimento

1. Crie branch de tópico a partir da branch atual estável. Não faça push direto em `main`.
2. Use Node.js 24 (`.nvmrc`) e `npm ci`.
3. Faça mudanças pequenas, com testes de regressão para as rotas e regras afetadas.
4. Rode `npm run format:check`, `npm run typecheck`, `npm test`, `npm audit --audit-level=high`, `npm run build` e `npm run test:e2e`.
5. Descreva no PR: objetivo, escopo, evidência de testes, impacto em dados/segurança e plano de rollback.

## Segurança e privacidade

Não faça commit de `.env`, bancos SQLite, `var/session.key`, tokens, dados privados de
correções ou credenciais. Para testar, use apenas base temporária e dados fictícios.
Siga [SECURITY.md](SECURITY.md) para vulnerabilidades.

## Estrutura

`src/app/` → páginas e rotas HTTP, `src/components/` → UI,
`src/lib/` → domínio, APIs e persistência, `src/styles/` → visual,
`tests/` → regressões, `docs/` → evidências, `.devcontainer/` → preview isolado.
