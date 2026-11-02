import type { Metadata } from 'next';
import Link from 'next/link';
import { FileText, Layers, Scale, Shield } from 'lucide-react';
import { LegislativeRecordList, type LegislativeRecord } from '@/components/LegislativeRecordList';

export const metadata: Metadata = {
  title: 'Projetos e votações',
  description:
    'Entenda os tipos de propostas legislativas e o que cada etapa significa, sem confundir apresentação com aprovação.',
};

const records: LegislativeRecord[] = [
  {
    id: 'proposicao',
    title: 'Proposição',
    description: 'Nome geral das matérias que o Legislativo analisa.',
    href: '/glossario#proposicao',
    icon: FileText,
  },
  {
    id: 'pl',
    title: 'PL · Projeto de Lei',
    description: 'Proposta para criar ou alterar uma lei.',
    href: '/glossario#pl',
    icon: Layers,
  },
  {
    id: 'plp',
    title: 'PLP · Projeto de Lei Complementar',
    description: 'Trata de assuntos que a Constituição reservou à lei complementar.',
    href: '/glossario#plp',
    icon: Scale,
  },
  {
    id: 'pec',
    title: 'PEC · Proposta de Emenda à Constituição',
    description: 'Proposta para mudar o texto da Constituição.',
    href: '/glossario#pec',
    icon: Shield,
  },
];

export default function ProjetosPage() {
  return (
    <main id="conteudo" className="page">
      <nav className="back-link" aria-label="Localização">
        <Link href="/">Início</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">Projetos e votações</span>
      </nav>
      <header className="pl-projects-heading">
        <h1>Projetos e votações</h1>
        <p>
          Entenda os tipos de propostas e o significado de cada etapa no Congresso. Apresentar um
          projeto não significa que ele já tenha sido aprovado.
        </p>
      </header>
      <LegislativeRecordList items={records} />
      <section className="pl-detail-section" aria-labelledby="projetos-escopo">
        <h2 id="projetos-escopo">O que é possível consultar?</h2>
        <p>
          Os perfis de parlamentares exibem proposições no recorte disponível das fontes importadas.
          Uma lista nacional de votações nominais ainda não está integrada. A ausência de um projeto
          nesta base não significa que ele não exista.
        </p>
        <p className="pl-detail-meta">
          <Link className="text-link" href="/#explorar">
            Consultar políticos e propostas
          </Link>
          {' · '}
          <Link className="text-link" href="/metodologia">
            Entenda os limites da cobertura
          </Link>
        </p>
      </section>
    </main>
  );
}
