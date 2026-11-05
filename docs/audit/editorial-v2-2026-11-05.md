# PLENÁRIO: UI editorial v2, pesquisa de APIs jurídicas e validação

Revisão de código iniciada em 05/11/2026 na branch
`feat/editorial-ui-projetos-glossario-2026-11-05`.

## Compatibilidade com o repositório existente

- Stack confirmada: Next.js App Router 16, React 19, Node 24, SQLite e CSS nativo.
- Preservar: Selector, comparação, filtros, paginação, perfis, fontes, correções privadas, autenticação, edição e auditoria de conteúdo sensível.
- Novas páginas: `/projetos` com expansão nativa por `<details>` (abertura múltipla, sem JavaScript) e `/glossario` com referência a fontes legislativas.
- Tokens de cor/fontes mantidos na folha existente. Ajustes visuais sobre classes existentes estão isolados em `src/styles/editorial-v2.css`, importada por último. Não substituir estilos de segurança ou status jurídico.
- Fontes Inter/Manrope são obtidas pelo Next.js durante a build, com fontes de sistema como fallback. Confirmar conectividade do CI para carregar as fontes.
- A seção `#processos` já existe em Profile e aplica revisão editorial. Nenhuma acusação ou suposta correspondência por nome deve ser importada sem evidência individualizada.

## API Jusbrasil

**Existe API oficial** em https://api.jusbrasil.com.br/docs/index.html, incluindo consulta por número CNJ, relatórios por nome, CPF/CNPJ, monitoramento e documentos conforme módulos contratados.

**Não é uma API gratuita/anônima**: é necessário contrato e credenciais. Documentação de contratação:
https://api.jusbrasil.com.br/docs/introducao/como_contratar.html

A interface de pesquisa de consumo geral está em https://www.jusbrasil.com.br/consulta-processual/.
Um link externo pode ajudar o visitante a pesquisar; resultados externos NÃO são associados automaticamente aos políticos do PLENÁRIO.

## DataJud/CNJ

A API Pública oficial em https://www.cnj.jus.br/sistemas/datajud/api-publica/
expõe metadados de processos públicos, capa e movimentações. Acesso:
https://datajud-wiki.cnj.jus.br/api-publica/acesso/
Endpoints por tribunal:
https://datajud-wiki.cnj.jus.br/api-publica/endpoints/

O DataJud utiliza chave **pública rotativa** fornecida pelo CNJ e requisições por tribunal. Não é base para classificar culpa, extrair teor integral de decisões, consultar toda a Justiça numa única chamada, nem identificar inequivocamente uma pessoa por nome.

Proposta de integração futura, condicionada a revisão jurídica/LGPD e termos de uso:

1. Consultar somente números CNJ obtidos de fontes oficiais e vinculados à pessoa após checagem individual.
2. Validar formato e dígito verificador, permitir apenas tribunais oficiais (sem URL arbitrária), limitar requisições e aplicar timeout/cache.
3. Tratar DataJud/Jusbrasil como **fontes de pesquisa para editor**, jamais publicação automática.
4. Exigir referência da decisão, papel processual correto, defesa, data, status, verificador humano e histórico de mudanças.
5. Não coletar CPF, manter segredo de justiça fora da indexação pública e respeitar pedidos de correção.

Por essas razões, esta rodada **não faz consultas automáticas por nome, não publica novos processos** e não usa scraping nem endpoints não contratados.

## Testes

Scripts existentes: `npm run format:check`, `npm run typecheck`, `npm test`, `npm run build`, `npm run test:e2e`, `npm audit --audit-level=high`.

O teste `tests/redesign.spec.ts` acrescenta cobertura para:

- abertura simultânea e fechamento de itens em Projetos;
- conteúdo, fontes e navegação do Glossário;
- transbordamento horizontal em 320/390/768/1280px;
- navegação mobile (Radix, foco e fechamento);
- continuidade da seção jurídica e links de pesquisa.

Status: a inclusão dos testes **não equivale a executá-los**; consultar o resultado da CI associada ao PR e registrar falhas reais.

## Cenário de 300 visitas simultâneas

Com servidor de **staging autorizado**, volume SQLite persistente e banco de teste:
`PLENARIO_LOAD_URL=http://127.0.0.1:3100 PLENARIO_LOAD_USERS=300 PLENARIO_LOAD_SECONDS=30 npm run test:load`

O script simula até 300 usuários virtuais GET em paralelo e reporta RPS, erros, timeouts e latências p50/p95/p99 por conjunto de rotas. Por segurança, proíbe destinos remotos sem `PLENARIO_ALLOW_REMOTE_LOAD=CONFIRMO`. Não testa comportamento visual, escritas concorrentes, picos prolongados, redes móveis ou CDN.

**Nenhuma garantia de 300 usuários pode ser declarada antes de teste na hospedagem real**. O backend usa SQLite local e limitador de tráfego em memória por instância. Para produção, conferir número de processos Node, CPU/RAM, persistência, proteção compartilhada, observabilidade e backups; usar p95 e erro sob carga como critérios de aceitação definidos para o ambiente.


## Evidências medidas no GitHub Actions — 05/11/2026

A execução Quality do pull request #4 no commit `c41b49ab` passou por formatação, TypeScript, testes de unidade, auditoria de dependências, build e **21 testes Playwright aprovados**, incluindo novas páginas, 320/390/768/1280 px e navegação móvel:
https://github.com/levibryxnn/PLENARIO/actions/runs/42065028359

Em CI isolada (único servidor Next.js no runner GitHub, banco SQLite próprio, 300 clientes virtuais simultâneos gerando GET de seis rotas, 20 segundos de janela), ocorreram:

- **Primeira rodada**: 939 requisições, 858 sucessos, 81 timeouts (**8,63% erros**), p50 = 5.863 ms, p95 = 10.538 ms, vazão 40,44 req/s. Não aprovado.
  https://github.com/levibryxnn/PLENARIO/actions/runs/42065021145
- **Segunda rodada após deixar Cargos, Projetos, Glossário e Metodologia estáticos, com demais rotas dinâmicas**: 1.336 requisições, 992 sucessos, 344 falhas (**25,75% erros**, das quais 340 timeouts), p50 = 1.994 ms, p95 = 8.839 ms, vazão 47,82 req/s. Também não aprovado.
  https://github.com/levibryxnn/PLENARIO/actions/runs/42065624110

A segunda rodada melhorou p50 e vazão, mas elevou a taxa de erro; não se afirma melhoria global nem suporte sustentado a 300 simultâneos. Resultados variam com CPU do runner, comportamento do gerador e conjunto de páginas. A CLI mede somente solicitações HTTP; não equivale a 300 navegadores, 300 IPs distintos ou garantia em produção.

**Conclusão operacional:** antes da publicação para 300 usuários simultâneos, selecionar hospedagem e testar nela, dimensionar instâncias, aproveitar cache/CDN, avaliar SQLite sob leitura/escrita concorrente, implementar métricas e limites de tráfego externos, repetir carga em rampas e verificar 0 erros e orçamento de latência definido. O job de carga fica apenas em `workflow_dispatch` para evitar testes de estresse involuntários a cada commit.
