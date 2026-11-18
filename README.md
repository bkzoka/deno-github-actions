# 🦕 Deno Compile + GitHub Actions

Projeto de demonstração que compila um programa **DenoJS (TypeScript)** em um executável nativo usando **GitHub Actions** (GitHub Workflows).

## 🚀 O que este projeto faz
- Verifica tipos com `deno check`.
- Roda o programa com `deno run`.
- Compila para binário nativo com `deno compile`.
- Faz upload do executável como **artifact** do workflow.

## 📁 Estrutura
- `main.ts`: Código-fonte do programa (TypeScript).
- `deno.json`: Configuração e tarefas do Deno.
- `.github/workflows/ci.yml`: Pipeline de CI que compila o projeto.

## 🛠️ Como usar localmente
1. Instale o Deno: https://deno.land/#installation
2. Verifique os tipos: `deno task check`
3. Execute: `deno task run`
4. Compile: `deno task compile`

## 🤖 GitHub Actions
A cada `push` ou `pull_request` na branch `main`, o workflow:
1. Faz o setup do Deno.
2. Roda as verificações.
3. Compila o binário.
4. Disponibiliza o executável para download em **Actions → artifacts**.

---
Desenvolvido por [bkzoka](https://github.com/bkzoka) ☁️✨
