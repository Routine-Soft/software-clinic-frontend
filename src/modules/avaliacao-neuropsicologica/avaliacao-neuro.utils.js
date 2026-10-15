import { tr } from '@/i18n';
// Roteiro de anamnese neuropsicológica: [campo, rótulo, o que registrar].
export const CAMPOS_ANAMNESE = [
  ['gestacaoParto', tr('Gestação e parto'), tr('Intercorrências na gestação, tipo de parto, prematuridade, peso ao nascer')],
  ['desenvolvimento', tr('Desenvolvimento neuropsicomotor'), 'Quando sentou, andou e falou; controle esfincteriano; marcos atrasados'],
  ['escolaridade', tr('Escolaridade e vida acadêmica'), tr('Série/ano, desempenho, reprovações, dificuldades, relatos da escola')],
  ['historicoMedico', tr('Histórico médico'), tr('Doenças, internações, cirurgias, traumatismos, exames de imagem e laudos anteriores')],
  ['medicamentos', tr('Medicamentos em uso'), tr('Nome, dose e desde quando')],
  ['historicoFamiliar', tr('Histórico familiar'), tr('Transtornos neurológicos ou psiquiátricos e dificuldades de aprendizagem na família')],
  ['aspectosEmocionais', tr('Aspectos emocionais e comportamentais'), tr('Humor, ansiedade, irritabilidade, impulsividade, comportamentos repetitivos')],
  ['rotinaSono', tr('Sono, alimentação e rotina'), tr('Qualidade do sono, apetite, uso de telas, atividades')],
  ['relacoesSociais', tr('Relações sociais e familiares'), tr('Amizades, convivência familiar, interação social')],
];

// Domínios cognitivos usuais nas baterias neuropsicológicas.
export const DOMINIOS = [
  tr('Inteligência'),
  tr('Atenção'),
  tr('Memória'),
  tr('Funções executivas'),
  tr('Linguagem'),
  tr('Habilidades visuoespaciais e visuoconstrutivas'),
  tr('Velocidade de processamento'),
  tr('Praxias e motricidade'),
  tr('Aprendizagem e habilidades acadêmicas'),
  tr('Cognição social'),
  tr('Comportamento adaptativo'),
  tr('Aspectos emocionais e comportamentais'),
  tr('Rastreio cognitivo'),
  tr('Outro'),
];

// Faixas usuais por percentil (padrão Wechsler). Cada instrumento tem as suas: confira no manual.
export const CLASSIFICACOES = [
  [tr('Muito superior'), 98],
  [tr('Superior'), 91],
  [tr('Média superior'), 75],
  [tr('Média'), 25],
  [tr('Média inferior'), 9],
  [tr('Limítrofe'), 3],
  [tr('Deficitário'), 0],
];

export function classificacaoSugerida(percentil) {
  if (percentil === '' || percentil === null || percentil === undefined) return '';
  const valor = Number(percentil);
  if (Number.isNaN(valor)) return '';
  return CLASSIFICACOES.find(([, minimo]) => valor >= minimo)?.[0] ?? '';
}

export const ABAS = [
  ['identificacao', tr('Identificação e demanda')],
  ['anamnese', tr('Anamnese')],
  ['sessoes', tr('Sessões e procedimento')],
  ['testes', tr('Testes e resultados')],
  ['conclusao', tr('Análise e conclusão')],
  ['laudo', tr('Laudo')],
];

export function sessaoVazia() {
  return { data: '', duracaoMin: '', descricao: '' };
}

export function instrumentoVazio() {
  return { nome: '', dominio: '', escoreBruto: '', escorePadrao: '', percentil: '', classificacao: '', observacao: '' };
}

const dataISO = (valor) => (valor ? String(valor).substring(0, 10) : '');

// Do servidor para o formulário (datas como AAAA-MM-DD, números como texto editável).
export function formularioDaAvaliacao(avaliacao) {
  return {
    servicoId: avaliacao.servicoId?._id ?? avaliacao.servicoId ?? '',
    solicitante: avaliacao.solicitante ?? '',
    finalidade: avaliacao.finalidade ?? '',
    demanda: avaliacao.demanda ?? '',
    informantes: avaliacao.informantes ?? '',
    anamnese: Object.fromEntries(CAMPOS_ANAMNESE.map(([campo]) => [campo, avaliacao.anamnese?.[campo] ?? ''])),
    procedimento: avaliacao.procedimento ?? '',
    sessoes: (avaliacao.sessoes ?? []).map((s) => ({ data: dataISO(s.data), duracaoMin: s.duracaoMin ?? '', descricao: s.descricao ?? '' })),
    instrumentos: (avaliacao.instrumentos ?? []).map((i) => ({ ...instrumentoVazio(), ...i, percentil: i.percentil ?? '' })),
    analise: avaliacao.analise ?? '',
    hipoteseDiagnostica: avaliacao.hipoteseDiagnostica ?? '',
    cid: avaliacao.cid ?? '',
    conclusao: avaliacao.conclusao ?? '',
    encaminhamentos: avaliacao.encaminhamentos ?? '',
    referencias: avaliacao.referencias ?? '',
    devolutivaEm: dataISO(avaliacao.devolutivaEm),
    devolutivaObservacoes: avaliacao.devolutivaObservacoes ?? '',
  };
}

export function resumoDasSessoes(sessoes) {
  const datas = sessoes.map((s) => s.data).filter(Boolean).sort();
  const minutos = sessoes.reduce((total, s) => total + (Number(s.duracaoMin) || 0), 0);
  return { quantidade: sessoes.length, primeira: datas[0] ?? null, ultima: datas[datas.length - 1] ?? null, minutos };
}

export function situacaoDa(avaliacao) {
  return avaliacao.finalizadaEm ? [tr('Finalizada'), 'badge--success'] : [tr('Em andamento'), 'badge--live'];
}
