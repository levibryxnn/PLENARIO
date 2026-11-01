# Auditoria de backend e dados

Escopo: importação, persistência SQLite, validação, publicação editorial, sessões, APIs públicas e proxy de fotografias da versão atual. A revisão foi por leitura de código e regressões automatizadas; não é pentest externo nem auditoria jurídica.

| Prioridade | Problema encontrado                                                                                      | Correção                                                                                                                                                                                             |
| ---------- | -------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Alta       | Um lote importado poderia carregar `legalRecords` e aparecer na listagem sem aprovação editorial.        | Importação recusa registros jurídicos; listagem pública não publica esse campo. Perfis continuam usando somente registros da revisão editorial. Lote também precisa corresponder à Casa declarada.   |
| Alta       | Downloads oficiais e fotografias eram limitados depois de acumular o corpo inteiro.                      | Leitura por streaming com contagem de bytes, cancelamento do corpo e limite declarado; respostas excessivas não são repetidas.                                                                       |
| Alta       | Proxy de imagem aceitava qualquer `image/*`, inclusive SVG ativo na origem do app.                       | Apenas JPEG, PNG e WebP; SVG rejeitado, corpo cancelado e `nosniff` preservado.                                                                                                                      |
| Média      | `official_id UNIQUE` era global: IDs iguais de Câmara e Senado poderiam colidir.                         | IDs internos continuam com prefixo da fonte. Migração transacional remove unicidade global e preserva linhas, correções, índices e vínculos. Regresso executa migração com um banco legado de teste. |
| Média      | Criação de banco dependia da umask.                                                                      | Arquivo criado/ajustado para 0600 e diretório novo para 0700. Diretórios já existentes não têm permissões arbitrariamente alteradas.                                                                 |
| Média      | URLs oficiais permitiam portas alternativas e parsing de IDs do Senado aceitava sufixos por truncamento. | Portas alternativas recusadas; IDs precisam ser números inteiros seguros e totalmente válidos.                                                                                                       |
| Média      | Fonte de evento na cronologia jurídica não tinha a mesma exigência documental do registro principal.     | Cada desfecho exige documento oficial primário individualizado, revisão e data de verificação.                                                                                                       |
| Baixa      | Token de sessão com segmentos adicionais era parcialmente interpretado.                                  | Exatamente dois segmentos assinados são exigidos.                                                                                                                                                    |

## Verificação

Regressões adicionadas em `tests/http.test.ts`, `tests/migrations.test.ts`, `tests/photos.test.ts`, `tests/data.test.ts` e `tests/security.test.ts`. Dados fictícios desses testes são identificados e ficam em bancos temporários/memória. O resultado integrado e os limites de validação constam em `docs/audit/README.md`.

## Limitações mantidas e declaradas

- Administração ainda usa uma identidade por instalação, sem MFA/dupla revisão. Sem segredo próprio, permanece desativada.
- Rate limiting é por processo; um deploy com várias instâncias precisa de controle no proxy/armazenamento compartilhado.
- SQLite exige disco persistente, backups e execução de migrações supervisionada em produção. Não houve migração de um banco externo de produção durante esta revisão.
- CSP continua permitindo scripts inline necessários ao Next; nonce estrito é melhoria futura. Não há `unsafe-eval` na build de produção.
- Documento oficial e validação estrutural não substituem revisão jurídica humana ou confirmação do teor e da atualização de uma decisão.
- Direitos/licenças das fotos e bases são separados dos pacotes de software.
