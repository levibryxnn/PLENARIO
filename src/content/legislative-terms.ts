/**
 * Educational terms sourced from the Brazilian Congress.
 * These are definitions, not a live database of proposals or votes.
 */
export const legislativeTerms = [
  {
    id: 'proposicao',
    title: 'Proposição',
    short: 'Nome geral das matérias que o Legislativo analisa.',
    explanation:
      'É toda matéria apresentada para apreciação de uma Casa legislativa ou de suas comissões. Inclui projetos, emendas, requerimentos e outras espécies.',
    example:
      'Um projeto de lei é uma proposição, mas nem toda proposição é um projeto de lei ou se transforma em norma.',
    sourceUrl: 'https://adm.senado.leg.br/vcb/vocab/?ark=ark%3A%2F99152%2Ft33ldjq2zvjw4m',
    sourceLabel: 'Senado Federal · Vocabulário Controlado',
  },
  {
    id: 'pl',
    title: 'PL · Projeto de Lei',
    short: 'Proposta para criar ou alterar uma lei.',
    explanation:
      'É uma proposta legislativa que pode resultar em lei ordinária. Sua apresentação não significa aprovação: é necessário percorrer as etapas de análise e votação aplicáveis.',
    example: 'Um PL pode estabelecer uma regra nacional sobre uma matéria de competência da União.',
    sourceUrl: 'https://www.camara.leg.br/entenda-o-processo-legislativo/',
    sourceLabel: 'Câmara dos Deputados · Processo legislativo',
  },
  {
    id: 'plp',
    title: 'PLP · Projeto de Lei Complementar',
    short: 'Trata de assuntos que a Constituição reservou a lei complementar.',
    explanation:
      'É um projeto para regular as matérias que a Constituição exige tratar por lei complementar. Sua aprovação requer maioria absoluta, conforme o artigo 69 da Constituição.',
    example:
      'A Constituição define quais assuntos precisam dessa espécie de lei; não se escolhe o formato apenas pelo tamanho da proposta.',
    sourceUrl: 'https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm',
    sourceLabel: 'Constituição Federal · Artigo 69',
  },
  {
    id: 'pec',
    title: 'PEC · Proposta de Emenda à Constituição',
    short: 'Proposta para mudar a Constituição.',
    explanation:
      'Pode alterar o texto constitucional dentro dos limites do artigo 60. Para aprovação, precisa do voto de três quintos dos membros de cada Casa do Congresso, em dois turnos.',
    example:
      'Mesmo apresentada por parlamentares, uma PEC não altera a Constituição antes de cumprir o processo previsto.',
    sourceUrl: 'https://www.camara.leg.br/entenda-o-processo-legislativo/',
    sourceLabel: 'Câmara dos Deputados · Tramitação de PEC',
  },
] as const;

export type LegislativeTerm = (typeof legislativeTerms)[number];
