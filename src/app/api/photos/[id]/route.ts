import { NextResponse } from 'next/server';
import { getPolitician } from '@/lib/db';
import { isOfficialCamaraPhotoUrl } from '@/lib/validation';
import { readResponseBytes } from '@/lib/http';
import '@/lib/camara'; // Configure the platform HTTPS proxy used for the official image host.

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let decodedId: string;
  try {
    decodedId = decodeURIComponent(id);
  } catch {
    return NextResponse.json({ error: 'Identificador inválido.' }, { status: 400 });
  }
  const politicianId = /^\d+$/.test(decodedId) ? `camara:${decodedId}` : decodedId;
  if (!/^(?:camara|senado):\d+$/.test(politicianId))
    return NextResponse.json({ error: 'Identificador inválido.' }, { status: 400 });

  const politician = getPolitician(politicianId);
  if (
    !politician?.photoUrl ||
    !politicianId.startsWith('camara:') ||
    !isOfficialCamaraPhotoUrl(politician.photoUrl, politician.officialId)
  ) {
    return NextResponse.json({ error: 'Retrato oficial não disponível.' }, { status: 404 });
  }

  try {
    const response = await fetch(politician.photoUrl, {
      headers: { Accept: 'image/jpeg,image/png,image/webp' },
      redirect: 'error',
      signal: AbortSignal.timeout(10000),
      cache: 'no-store',
    });
    if (!response.ok)
      return NextResponse.json({ error: 'Fonte do retrato indisponível.' }, { status: 502 });
    const contentType = response.headers.get('content-type')?.split(';', 1)[0] ?? '';
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(contentType)) {
      await response.body?.cancel();
      return NextResponse.json({ error: 'Fonte retornou conteúdo inválido.' }, { status: 502 });
    }
    const body = await readResponseBytes(response, 2_000_000);
    return new NextResponse(body, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
        'X-Content-Source': 'Câmara dos Deputados',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Falha ao consultar o retrato oficial.' }, { status: 502 });
  }
}
