import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { legislativeTerms } from '@/content/legislative-terms';

export const metadata: Metadata = {
  title: 'Glossário',
  description: 'Termos essenciais da política e do processo legislativo em linguagem acessível.',
};

const additionalTerms = [
  {
    title: 'Tramitação',
    explanation:
      'Caminho percorrido por uma proposição dentro do processo legislativo, com análises, pareceres e votações conforme o tipo de matéria.',
  },
  {
    title: 'Emenda',
    explanation:
      'Proposta de mudança em um texto legislativo em discussão. Não é necessariamente uma emenda à Constituição.',
  },
  {
    title: 'Relator(a)',
    explanation:
      'Parlamentar responsável por analisar uma matéria e apresentar um relatório ou parecer no órgão legislativo competente.',
  },
  {
    title: 'Sanção',
    explanation:
      'Aprovação, pelo chefe do Executivo, de projeto de lei submetido a essa etapa após a deliberação legislativa.',
  },
  {
    title: 'Veto',
    explanation:
      'Recusa total ou parcial do chefe do Executivo à sanção de um projeto de lei, sujeita às regras de análise legislativa.',
  },
  {
    title: 'Arquivamento',
    explanation:
      'Encerramento da tramitação de uma matéria em determinada situação regimental. As hipóteses variam conforme a Casa e o tipo de proposição.',
  },
];

const glossarySource = 'https://www12.senado.leg.br/noticias/glossario-legislativo';

export default function GlossarioPage() {
  return (
    <main id="conteudo" className="page editorial-page">
      <nav className="editorial-breadcrumb" aria-label="Você está aqui">
        <Link href="/">Início</Link>
        <span aria-hidden="true">›</span>
        <span aria-current="page">Glossário</span>
      </nav>
      <header className="editorial-heading">
        <h1>Glossário</h1>
        <p>Termos para entender notícias, projetos, mandatos e decisões públicas.</p>
      </header>

      <section className="editorial-glossary-list" aria-label="Termos legislativos">
        {legislativeTerms.map((term) => (
          <article className="editorial-definition" key={term.id} id={term.id}>
            <h2>{term.title}</h2>
            <div>
              <p>{term.explanation}</p>
              <a href={term.sourceUrl} target="_blank" rel="noreferrer">
                Ver fonte oficial <ArrowUpRight size={14} aria-hidden="true" />
              </a>
            </div>
          </article>
        ))}
        {additionalTerms.map((term) => (
          <article className="editorial-definition" key={term.title}>
            <h2>{term.title}</h2>
            <div>
              <p>{term.explanation}</p>
              <a href={glossarySource} target="_blank" rel="noreferrer">
                Consultar glossário do Senado <ArrowUpRight size={14} aria-hidden="true" />
              </a>
            </div>
          </article>
        ))}
      </section>

      <p className="editorial-glossary-footer">
        As definições são explicações resumidas. Para acompanhar uma proposta específica, consulte
        também a documentação original no Congresso ou a página de{' '}
        <Link href="/projetos">Projetos e votações</Link>.
      </p>
    </main>
  );
}
