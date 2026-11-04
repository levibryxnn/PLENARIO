# Segurança do PLENÁRIO

## Escopo e informações sensíveis

O PLENÁRIO combina informações públicas com **pedidos privados de correção** e um fluxo editorial
restrito. O projeto é público, mas as credenciais administrativas, sessões e banco de dados de
produção **não** devem ser incluídos no repositório, logs ou exemplos.

**Não envie publicamente explorações, dados pessoais, senhas ou tokens.** Para comunicar um problema,
use preferencialmente o recurso "Report a vulnerability" em
GitHub > Security > Advisories deste repositório, quando disponível.

## Antes de habilitar a administração

1. Escolha senha aleatória exclusiva de no mínimo 16 caracteres; um gerenciador de senhas é recomendado.
2. Defina `CIVIS_PUBLIC_ORIGIN=https://seu-dominio.example` com o domínio HTTPS exato.
   Sem isso, as mutações ficam bloqueadas em produção com administração habilitada.
3. Defina `CIVIS_SESSION_KEY` aleatória, com pelo menos 32 caracteres, e guarde-a fora do Git.
   No modo local uma chave é criada em `var/session.key`; em várias instâncias compartilhe a chave
   por gestor de segredos seguro.
4. Proteja a área editorial com MFA no provedor de acesso/rede, se disponível. A aplicação
   ainda não oferece MFA nativo nem identidade editorial individual por pessoa.
5. Utilize proxy reverso com TLS e limitação de requisições **compartilhada**.
   O limite em memória da aplicação é apenas uma defesa adicional.
6. Configure `CIVIS_TRUSTED_CLIENT_IP_HEADER=cf-connecting-ip` ou `x-real-ip` **somente se**
   o proxy confiável remover e recriar esse cabeçalho, impedindo falsificação pelo cliente.
7. Garanta backups criptografados, volume persistente, permissões restritas e restauração testada.
8. Mantenha importações e revisões editoriais fora do preview público.

## Fluxo de divulgação

Descreva a falha, impacto, versão/commit afetado e passos mínimos de reprodução sem fornecer
dados privados reais. Evite testes de carga em produção sem janela autorizada.

## Controles e limites

- Mutação via POST exige origem explícita e JSON; sessões usam assinatura HMAC e cookie HttpOnly.
- Sessões expiram em oito horas, mas **logout não revoga tokens roubados antes da expiração**.
  Alterar a senha invalida os tokens antigos.
- Os limites de tentativas não são compartilhados entre múltiplos processos. CDN/WAF ou
  armazenamento compartilhado é necessário para implantação distribuída.
- Não há garantia de que `npm audit`, testes E2E ou esta revisão cubram toda classe de ataque.
- Uma fonte oficial não substitui revisão humana de informações jurídicas sensíveis.
