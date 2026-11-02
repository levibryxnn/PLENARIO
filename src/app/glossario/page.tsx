import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Glossário político',
  description: 'Termos comuns da política brasileira explicados de forma direta e contextualizada.',
};

const terms = [
  {
    id: 'proposicao',
    name: 'Proposição',
    description:
      'Nome geral para matérias apresentadas ao Legislativo, como projetos, emendas e requerimentos. Nem toda proposição cria uma lei.',
  },
  {
    id: 'pl',
    name: 'PL · Projeto de Lei',
    description:
      'Proposta de criação ou alteração de uma lei ordinária. Antes de produzir efeitos, precisa cumprir a tramitação e os requisitos constitucionais aplicáveis.',
  },
  {
    id: 'plp',
    name: 'PLP · Projeto de Lei Complementar',
    description:
      'Proposta que trata de matéria reservada pela Constituição à lei complementar. Sua aprovação exige maioria absoluta dos membros da Casa legislativa.',
  },
  {
    id: 'pec',
    name: 'PEC · Proposta de Emenda à Constituição',
    description:
      'Proposta para alterar a Constituição. Exige aprovação em dois turnos, por três quintos dos membros, na Câmara e no Senado. Não passa por sanção presidencial.',
  },
  {
    id: 'emenda',
    name: 'Emenda',
    description:
      'Sugestão formal para acrescentar, retirar ou modificar parte de um texto em análise legislativa.',
  },
  {
    id: 'parecer',
    name: 'Parecer',
    description:
      'Análise ou manifestação de relator ou comissão sobre determinada matéria. O parecer não equivale necessariamente à aprovação definitiva.',
  },
  {
    id: 'quorum',
    name: 'Quórum',
    description:
      'Número mínimo de membros ou votos exigido para determinada deliberação, conforme a regra aplicável.',
  },
  {
    id: 'votacao-nominal',
    name: 'Votação nominal',
    description:
      'Votação em que o voto de cada parlamentar é registrado individualmente. Nem toda votação é nominal.',
  },
  {
    id: 'sancao',
    name: 'Sanção',
    description:
      'Concordância do chefe do Executivo com um projeto de lei aprovado pelo Legislativo, nas hipóteses em que há sanção.',
  },
  {
    id: 'veto',
    name: 'Veto',
    description:
      'Recusa total ou parcial do chefe do Executivo a um projeto aprovado, pelos motivos permitidos pela Constituição. Pode ser apreciado pelo Legislativo.',
  },
];

export default function GlossarioPage() {
  return (
    <main id="conteudo" className="page prose-page">
      <nav className="back-link" aria-label="Localização">
        <Link href="/">Início</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">Glossário</span>
      </nav>
      <header className="pl-projects-heading">
        <p className="eyebrow">PARA ENTENDER A POLÍTICA</p>
        <h1>Glossário</h1>
        <p>
          Palavras que aparecem nos projetos e nas votações, explicadas de maneira simples.
          Consulte sempre o contexto e a fonte do documento original.
        </p>
      </header>
      <div className="pl-definition-list">
        {terms.map((term) => (
          <section id={term.id} className="pl-definition" key={term.id}>
            <h2>{term.name}</h2>
            <p>{term.description}</p>
          </section>
        ))}
      </div>
      <section className="pl-detail-section" aria-labelledby="fonte-glossario">
        <h2 id="fonte-glossario">Onde conferir as regras?</h2>
        <p>
          A Constituição Federal estabelece diversas regras sobre elaboração de leis, votação e
          competências. O procedimento também depende dos regimentos de cada Casa.
        </p>
        <p>
          <a
            className="text-link"
            href="https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm"
            target="_blank"
            rel="noreferrer"
          >
            Consultar a Constituição Federal
          </a>
        </p>
      </section>
    </main>
  );
}
