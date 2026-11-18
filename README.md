# 🦕 Deno Compile + GitHub Actions — Isolamento de Permissões

Demonstração prática do maior diferencial do Deno: **as permissões são gravadas dentro do binário compilado**. Não é um `chmod`, não é config de runtime — é um sandbox real, decidido em `deno compile`.

## 🎯 As 3 variantes

| Binário | Rede | Arquivos | Resultado esperado |
|---|---|---|---|
| `no-fs` | ✅ liberada | ❌ bloqueada | `fetch` funciona, listar pasta falha |
| `no-net` | ❌ bloqueada | ✅ liberada | `fetch` falha, listar pasta funciona |
| `locked` | ❌ bloqueada | ❌ bloqueada | os dois falham |

Cada binário tenta **as duas operações**, e o `test.sh` mostra qual foi barrada pelo sandbox.

## 🧪 Os testes

- **Rede:** `fetch()` em `https://example.com` (configurável com `TEST_URL`).
- **Arquivos:** `Deno.readDir(".")` listando a pasta atual.

Quando bloqueado, o Deno 2.x lança `NotCapable` com uma dica de qual flag falta:
```
NotCapable: Requires net access to "example.com:443",
specify the required permissions during compilation using `deno compile --allow-net`
```

## 🛠️ Rodando localmente

```bash
deno task check     # checagem de tipos
deno task compile   # gera dist/no-fs, dist/no-net, dist/locked
deno task test      # executa os 3 e imprime o resumo

# com alvo de rede customizado:
TEST_URL=http://localhost:8080 bash test.sh dist
```

> Não é preciso `--allow-*` para rodar os binários: as permissões já estão embutidas. Não há prompt nem como escalá-las depois.

## 🤖 GitHub Actions

A cada push em `main`, o workflow `.github/workflows/ci.yml`:
1. Faz `deno check`
2. Compila as 3 variantes
3. Roda `test.sh` e imprime a matrix no log
4. Sobe tudo como artifact **`deno-perm-bins`**

---
Desenvolvido por [bkzoka](https://github.com/bkzoka) ☁️✨
