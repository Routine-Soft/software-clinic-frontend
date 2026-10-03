// Roteiro de anamnese neuropsicológica: [campo, rótulo, o que registrar].
export const CAMPOS_ANAMNESE = [
  ['gestacaoParto', 'Gestação e parto', 'Intercorrências na gestação, tipo de parto, prematuridade, peso ao nascer'],
  ['desenvolvimento', 'Desenvolvimento neuropsicomotor', 'Quando sentou, andou e falou; controle esfincteriano; marcos atrasados'],
  ['escolaridade', 'Escolaridade e vida acadêmica', 'Série/ano, desempenho, reprovações, dificuldades, relatos da escola'],
  ['historicoMedico', 'Histórico médico', 'Doenças, internações, cirurgias, traumatismos, exames de imagem e laudos anteriores'],
  ['medicamentos', 'Medicamentos em uso', 'Nome, dose e desde quando'],
  ['historicoFamiliar', 'Histórico familiar', 'Transtornos neurológicos ou psiquiátricos e dificuldades de aprendizagem na família'],
  ['aspectosEmocionais', 'Aspectos emocionais e comportamentais', 'Humor, ansiedade, irritabilidade, impulsividade, comportamentos repetitivos'],
  ['rotinaSono', 'Sono, alimentação e rotina', 'Qualidade do sono, apetite, uso de telas, atividades'],
  ['relacoesSociais', 'Relações sociais e familiares', 'Amizades, convivência familiar, interação social'],
];

// Domínios cognitivos usuais nas baterias neuropsicológicas.
export const DOMINIOS = [
  'Inteligência',
  'Atenção',
  'Memória',
  'Funções executivas',
  'Linguagem',
  'Habilidades visuoespaciais e visuoconstrutivas',
  'Velocidade de processamento',
  'Praxias e motricidade',
  'Aprendizagem e habilidades acadêmicas',
  'Cognição social',
  'Comportamento adaptativo',
  'Aspectos emocionais e comportamentais',
  'Rastreio cognitivo',
  'Outro',
];

// Faixas usuais por percentil (padrão Wechsler). Cada instrumento tem as suas: confira no manual.
export const CLASSIFICACOES = [
  ['Muito superior', 98],
  ['Superior', 91],
  ['Média superior', 75],
  ['Média', 25],
  ['Média inferior', 9],
  ['Limítrofe', 3],
  ['Deficitário', 0],
];

export function classificacaoSugerida(percentil) {
  if (percentil === '' || percentil === null || percentil === undefined) return '';
  const valor = Number(percentil);
  if (Number.isNaN(valor)) return '';
  return CLASSIFICACOES.find(([, minimo]) => valor >= minimo)?.[0] ?? '';
}

export const ABAS = [
  ['identificacao', 'Identificação e demanda'],
  ['anamnese', 'Anamnese'],
  ['sessoes', 'Sessões e procedimento'],
  ['testes', 'Testes e resultados'],
  ['conclusao', 'Análise e conclusão'],
  ['laudo', 'Laudo'],
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
  return avaliacao.finalizadaEm ? ['Finalizada', 'badge--success'] : ['Em andamento', 'badge--live'];
}
