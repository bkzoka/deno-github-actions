/** Saudação simples com tipagem estrita */
export function greet(name: string): string {
  if (!name.trim()) {
    throw new Error("O nome não pode estar vazio.");
  }
  return `Olá, ${name}! 👋 Bem-vindo ao Deno compilado via GitHub Actions.`;
}

if (import.meta.main) {
  const nome = Deno.args[0] ?? "Mundo";
  console.log(greet(nome));
  console.log(`Deno versão: ${Deno.version.deno}`);
}
