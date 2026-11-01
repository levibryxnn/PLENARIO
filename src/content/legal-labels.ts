import type { LegalStatus } from '@/lib/types';

export const legalStatusLabels: Record<LegalStatus, string> = {
  allegation: 'Alegação pública não comprovada',
  investigation: 'Investigação formal documentada',
  'formal-accusation': 'Acusação formal apresentada',
  ongoing: 'Processo em andamento',
  'appealable-conviction': 'Condenação sujeita a recurso',
  'final-conviction': 'Condenação transitada em julgado',
  acquittal: 'Absolvição',
  dismissed: 'Arquivamento',
  annulled: 'Anulação ou reforma de decisão',
  other: 'Outro desfecho documentado',
};

export const legalNatureLabels = {
  criminal: 'Criminal',
  civil: 'Cível',
  electoral: 'Eleitoral',
  administrative: 'Administrativa',
};
