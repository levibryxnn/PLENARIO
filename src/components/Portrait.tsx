'use client';

import { useEffect, useRef, useState } from 'react';
import type { Politician } from '@/lib/types';

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join('');
}

/** Keep the official-photo proxy as the single image source and preserve its fallback. */
export function Portrait({
  politician,
  large = false,
}: {
  politician: Politician;
  large?: boolean;
}) {
  const [failedPhoto, setFailedPhoto] = useState<string | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const photoKey = `${politician.id}|${politician.photoUrl ?? ''}`;
  const showPhoto = Boolean(politician.photoUrl) && failedPhoto !== photoKey;
  useEffect(() => {
    // An eager server-rendered image can fail before React attaches onError.
    const image = imageRef.current;
    if (showPhoto && image?.complete && image.naturalWidth === 0) setFailedPhoto(photoKey);
  }, [photoKey, showPhoto]);

  return (
    <div
      className={`portrait ${large ? 'portrait-large' : ''}`}
      role={showPhoto ? undefined : 'img'}
      aria-label={showPhoto ? undefined : `Retrato não disponível de ${politician.name}`}
    >
      {showPhoto ? (
        <img
          key={photoKey}
          ref={imageRef}
          className="portrait-image"
          src={`/api/photos/${encodeURIComponent(politician.id)}`}
          alt={`Foto oficial de ${politician.name}`}
          width={300}
          height={360}
          loading={large ? 'eager' : 'lazy'}
          decoding="async"
          onError={() => setFailedPhoto(photoKey)}
        />
      ) : (
        <>
          <div className="portrait-lines" aria-hidden="true" />
          <span className="portrait-initials" aria-hidden="true">
            {initials(politician.name)}
          </span>
          <span className="portrait-marker" aria-hidden="true">
            BR / {politician.uf}
          </span>
          <span className="portrait-caption" aria-hidden="true">
            RETRATO NÃO DISPONÍVEL
          </span>
        </>
      )}
    </div>
  );
}
