import test from 'node:test';
import assert from 'node:assert/strict';
import { readResponseBytes, readResponseText, ResponseSizeError } from '../src/lib/http';
import { fetchCamaraJson } from '../src/lib/camara';

test('limite de download interrompe e cancela resposta em streaming sem Content-Length', async () => {
  let canceled = false;
  let produced = 0;
  const stream = new ReadableStream<Uint8Array>({
    pull(controller) {
      produced++;
      controller.enqueue(new Uint8Array(4));
      if (produced === 100) controller.close();
    },
    cancel() {
      canceled = true;
    },
  });
  await assert.rejects(() => readResponseBytes(new Response(stream), 6), ResponseSizeError);
  assert.equal(canceled, true);
  assert.ok(produced < 100, 'Não baixar toda a resposta antes de verificar o limite.');
});

test('limite é medido em bytes e respostas pequenas continuam legíveis', async () => {
  await assert.rejects(() => readResponseText(new Response('á'.repeat(4)), 4), ResponseSizeError);
  assert.equal(await readResponseText(new Response('ação'), 10), 'ação');
});

test('resposta oficial declaradamente excessiva não é repetida nem consumida', async () => {
  let attempts = 0;
  let canceled = false;
  await assert.rejects(
    () =>
      fetchCamaraJson('https://dadosabertos.camara.leg.br/api/v2/deputados', {
        retries: 2,
        fetcher: async () => {
          attempts++;
          return new Response(
            new ReadableStream({
              cancel() {
                canceled = true;
              },
            }),
            {
              headers: { 'Content-Length': '5000001' },
            },
          );
        },
      }),
    ResponseSizeError,
  );
  assert.equal(attempts, 1);
  assert.equal(canceled, true);
});
