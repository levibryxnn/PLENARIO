/** Limit upstream downloads while reading, including responses without Content-Length. */
export class ResponseSizeError extends Error {
  readonly permanent = true;

  constructor() {
    super('Resposta da fonte excedeu o limite de segurança.');
    this.name = 'ResponseSizeError';
  }
}

export async function readResponseBytes(
  response: Response,
  maxBytes: number,
): Promise<Uint8Array<ArrayBuffer>> {
  const declaredSize = Number(response.headers.get('content-length') ?? 0);
  if (declaredSize > maxBytes) {
    await response.body?.cancel().catch(() => {});
    throw new ResponseSizeError();
  }
  if (!response.body) return new Uint8Array();

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maxBytes) {
        await reader.cancel().catch(() => {});
        throw new ResponseSizeError();
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const body = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return body;
}

export async function readResponseText(response: Response, maxBytes: number): Promise<string> {
  return new TextDecoder().decode(await readResponseBytes(response, maxBytes));
}
