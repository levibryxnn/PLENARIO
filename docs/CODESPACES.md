# PLENÁRIO no GitHub Codespaces — atualização e verificação da versão ativa

O merge no GitHub **não reinicia** a aplicação já aberta em `*.app.github.dev`. O link da porta 3000 mostra o processo que está rodando **dentro daquele Codespace**, com os arquivos da branch local em uso.

## Atualização sem perder alterações locais

No terminal do Codespace, dentro do repositório:

```bash
git status --short
git branch --show-current
git fetch origin main
git log -1 --oneline
git log -1 --oneline origin/main
```

Se `git status --short` mostrar arquivos modificados, não descarte nem sobrescreva essas mudanças. Faça commit, stash ou revisão antes de atualizar. Com o diretório limpo, entre em `main` e faça:

```bash
git switch main
git pull --ff-only origin main
npm ci
```

Pare o servidor anterior com `Ctrl+C` no terminal ativo. Se a porta 3000 continuar ocupada, identifique o processo antigo e pare **somente** o processo referente ao PLENÁRIO. Suba o projeto:

```bash
npm run dev -- --port 3000
```

Em **Portas**, encaminhe 3000 e abra a URL correspondente. A visibilidade pode ficar **Private**.

## Verificação objetiva do servidor que está rodando

Com o servidor ativo, execute em outro terminal:

```bash
curl -f http://127.0.0.1:3000/plenario-v3-integridade.txt
curl -I http://127.0.0.1:3000/projetos
npm run preview:verify
```

A primeira resposta deve conter `PLENARIO_LAYOUT_V3_2026-11-05`. O verificador checa status HTTP, a versão e conteúdo esperado das rotas. Se o arquivo retornar **404**, o processo da porta 3000 não está servindo esta versão: confira pasta, branch, `git log -1` e servidor ativo.

Testes no CI comprovam o código daquela versão, não o estado do seu Codespace privado. Não alegue implantação bem-sucedida sem a checagem acima.

## Comportamento esperado

- Em **Cargos**, Município e Estado têm linhas de 2 cartões; União apresenta 3 + 2 no desktop, sem uma única ficha isolada ao lado de colunas vazias.
- Em **Projetos**, clique em qualquer linha PL/PLP/PEC: a explicação aparece logo abaixo, na mesma URL `/projetos`, e pode ser recolhida.
- **Glossário** é uma rota separada da navegação principal, não é destino do clique nos cartões de Projetos.
