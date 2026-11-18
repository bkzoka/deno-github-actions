/** URL usada no teste de rede (pode ser trocada pelo 2º argumento). */
const DEFAULT_URL = "https://example.com";

function describe(error: unknown): string {
  return error instanceof Error ? `${error.name}: ${error.message}` : String(error);
}

function isBlocked(detail: string): boolean {
  return detail.startsWith("PermissionDenied") || detail.startsWith("NotCapable");
}

export async function testNetwork(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(10_000) });
    await response.body?.cancel();
    console.log(`  [REDE] OK          HTTP ${response.status} <- ${url}`);
    return true;
  } catch (error) {
    const detail = describe(error);
    console.log(`  [REDE] ${isBlocked(detail) ? "BLOQUEADO  " : "FALHOU     "} ${detail}`);
    return false;
  }
}

export async function testFiles(path: string): Promise<boolean> {
  try {
    const entries: string[] = [];
    for await (const entry of Deno.readDir(path)) {
      entries.push(entry.name);
    }
    console.log(
      `  [ARQ ] OK          ${entries.length} entradas em '${path}': ` +
        `${entries.slice(0, 6).join(", ")}${entries.length > 6 ? ", ..." : ""}`,
    );
    return true;
  } catch (error) {
    const detail = describe(error);
    console.log(`  [ARQ ] ${isBlocked(detail) ? "BLOQUEADO  " : "FALHOU     "} ${detail}`);
    return false;
  }
}

async function main(): Promise<void> {
  const mode = Deno.args[0] ?? "all";
  const url = Deno.args[1] ?? DEFAULT_URL;
  console.log(`  modo=${mode}  url=${url}`);
  if (mode === "all" || mode === "net") await testNetwork(url);
  if (mode === "all" || mode === "fs") await testFiles(".");
}

if (import.meta.main) await main();
