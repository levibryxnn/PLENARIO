# Auditoria de segurança e operação — novembro de 2026

Base: branch `design/minimal-v2-audit` do repositório `levibryxnn/PLENARIO`. Escopo:
leitura dos arquivos de segurança, rotas HTTP, persistência, validação, ingestão, testes,
configuração de headers e estrutura de deploy. É uma auditoria estática com regressões
automatizadas; **não é pentest externo**.

## Achados e tratamentos

| Prioridade         | Achado                                                                                                                                                             | Tratamento nesta branch                                                                                                                                                                                       |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Alta (implantação) | Administração em produção podia confiar no Host/requisição sem origem pública configurada. Em proxies com Host manipulável, isso enfraquece a proteção por Origin. | Exigir `CIVIS_PUBLIC_ORIGIN` explícita sempre que a administração estiver ativa em produção. Host fornecido pelo cliente deixa de ser usado como origem autorizada.                                           |
| Média              | Erros inesperados de banco ou serviço externo eram retornados ao cliente pela API editorial.                                                                       | Resposta genérica HTTP 500 para erros internos; mensagens de validação Zod continuam HTTP 400.                                                                                                                |
| Média              | Rate limit para login e correções era global, favorecendo bloqueio compartilhado por um único cliente e com proteção inadequada entre réplicas.                    | Chaves por cliente quando o cabeçalho é fornecido por **proxy explicitamente confiável**, mais limite global de segurança; não aceita X-Forwarded-For direto. Limite compartilhado no edge segue obrigatório. |
| Média              | Respostas administrativas ou pedidos de correção não possuíam Cache-Control explícito.                                                                             | Header `private, no-store` para páginas e API administrativas e correções.                                                                                                                                    |
| Baixa              | Sessão local poderia ler um arquivo preexistente sem reforçar sua permissão.                                                                                       | Permissão 0600 reforçada ao ler `var/session.key`.                                                                                                                                                            |
| Defesa adicional   | Rotas mutáveis aceitam payload JSON mas não exigiam Content-Type JSON.                                                                                             | Rejeitam outros tipos com HTTP 415.                                                                                                                                                                           |
| Operacional        | Não existia preview navegável da aplicação real com base isolada e administração desativada.                                                                       | Configuração GitHub Codespaces com Node 24, banco SQLite temporário, build e porta privada 3000.                                                                                                              |

## Controles confirmados por leitura

- Consultas SQL usam placeholders nas rotas revisadas.
- Cookies são HttpOnly/SameSite Strict e Secure no modo produção.
- CSRF exige Origin; assinatura de sessão usa HMAC e comparação em tempo constante.
- Rotas administrativas dependem de sessão, e uma senha não configurada desativa a administração.
- Proxy de imagens usa URL oficial exata, aceita só JPEG/PNG/WebP, desabilita redirecionamento,
  impõe tamanho máximo e timeout.
- Dados jurídicos importados não são automaticamente publicados; revisão e rastreabilidade
  são obrigatórias para o fluxo previsto.

## Riscos residuais e ações recomendadas

1. **MFA e múltiplos revisores:** uma identidade editorial única permite que uma credencial
   comprometida publique conteúdo de impacto reputacional; recomenda-se adicionar autenticação
   por provedor confiável com MFA e regra de dupla aprovação.
2. **Proteção distribuída e DoS:** contador em memória não oferece controle global confiável,
   especialmente em scale-out. A home SSR/SQLite pode apresentar latência elevada no pico.
   Usar rate limiting no edge e testar com p95, CPU, memória e persistência reais.
3. **CSP:** `script-src 'unsafe-inline'` permanece, compatível com a estratégia atual do Next,
   mas reduz proteção contra injeção. Trabalhar em nonce/headers em uma revisão separada com
   testes de hidratação.
4. **Revogação de sessão:** logout remove cookie do navegador, mas token copiado pode seguir
   válido até expirar. Adotar rotação/revogação persistente em produção.
5. **Backups, logs e disponibilidade:** confirmar infraestrutura de HTTPS, isolamento de segredos,
   logs com retenção, restore testado, monitoração e plano de resposta.
6. **Revisão de imagens/fontes:** respeitar créditos, direitos de imagem e datas de referência;
   nenhum conteúdo jurídico deve ser fabricado para preencher lacunas.

## Testes

A branch adiciona casos para Host forjado, origem pública obrigatória e cabeçalhos de IP
não confiáveis. A CI existente executa TypeScript, testes unitários/segurança,
`npm audit --audit-level=high`, build, Playwright e teste local limitado de 300
visitantes virtuais. Consulte a execução de CI da branch antes de declarar aprovação.

**Importante:** sem URL de hospedagem final e teste no ambiente real, não é possível
atestar ausência de vulnerabilidades, disponibilidade pública ou capacidade de produção.
