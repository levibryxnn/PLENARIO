import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, ChevronDown, FileText, Layers3, Shield } from 'lucide-react';
import { legislativeTerms } from '@/content/legislative-terms';

export const metadata: Metadata = {
  title: 'Projetos e votações',
  description:
    'Entenda proposições, PL, PLP e PEC, com explicações e links para fontes legislativas oficiais.',
};

const icons = [FileText, Layers3, Layers3, Shield];

export default function ProjetosPage() {
  return (
    <main id="conteudo" className="page editorial-page">
      <nav className="editorial-breadcrumb" aria-label="Você está aqui">
        <Link href="/">Início</Link>
        <span aria-hidden="true">›</span>
        <span aria-current="page">Projetos e votações</span>
      </nav>

      <header className="editorial-heading">
        <h1>Projetos e votações</h1>
        <p>
          Acompanhe os tipos de proposição, entenda como funcionam e consulte as informações
          disponíveis no Congresso.
        </p>
      </header>

      <section className="legislative-records" aria-label="Tipos de proposição">
        {legislativeTerms.map((term, index) => {
          const Icon = icons[index] ?? FileText;
          return (
            <details className="legislative-record" key={term.id}>
              <summary className="legislative-record__summary">
                <span className="legislative-record__icon" aria-hidden="true">
                  <Icon size={30} strokeWidth={1.8} />
                </span>
                <span className="legislative-record__title">{term.title}</span>
                <span className="legislative-record__short">{term.short}</span>
                <ChevronDown className="legislative-record__arrow" size={20} aria-hidden="true" />
              </summary>
              <div className="legislative-record__body">
                <p>{term.explanation}</p>
                <p>
                  <strong>Exemplo prático:</strong> {term.example}
                </p>
                <a href={term.sourceUrl} target="_blank" rel="noreferrer">
                  Ver fonte oficial: {term.sourceLabel}
                  <ArrowUpRight size={15} aria-hidden="true" />
                </a>
              </div>
            </details>
          );
        })}
      </section>

      <aside className="editorial-bottom-note" aria-label="Limites da cobertura">
        <h2>Proposta apresentada não é lei aprovada.</h2>
        <p>
          O PLENÁRIO exibe propostas importadas nos perfis em que há fonte disponível. Votos nominais
          e o andamento completo de todas as proposições ainda não fazem parte da cobertura. Não
          interpretamos uma lacuna como ausência de atividade.
        </p>
        <div className="editorial-note-links">
          <Link href="/#explorar">Explorar políticos</Link>
          <Link href="/glossario">Abrir glossário</Link>
          <a
            href="https://www.camara.leg.br/busca-portal/proposicoes/pesquisa-avancada"
            target="_blank"
            rel="noreferrer"
          >
            Pesquisar na Câmara <ArrowUpRight size={15} aria-hidden="true" />
          </a>
        </div>
      </aside>
    </main>
  );
}
