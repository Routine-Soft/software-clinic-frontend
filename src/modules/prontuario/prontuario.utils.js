export const SINAIS_VITAIS_INICIAL = { peso: '', altura: '', pressaoArterial: '', frequenciaCardiaca: '', temperatura: '' };

export const CAMPOS_ATENDIMENTO_INICIAL = {
  queixaPrincipal: '',
  historicoAtual: '',
  exameObjetivo: '',
  avaliacao: '',
  cid10: '',
  conduta: '',
  informacoes: '',
  sinaisVitais: SINAIS_VITAIS_INICIAL,
  anexos: [],
  proximoRetorno: '',
};

export const CAMPOS_TEXTO = [
  ['queixaPrincipal', 'Queixa principal', 2],
  ['historicoAtual', 'Histórico atual (anamnese)', 4],
  ['exameObjetivo', 'Exame objetivo', 3],
  ['avaliacao', 'Avaliação', 3],
  ['conduta', 'Conduta', 3],
  ['informacoes', 'Informações', 4],
];

export const CAMPOS_PERFIL_CLINICO = [
  ['alergias', 'Alergias', 2],
  ['antecedentesClinicos', 'Antecedentes clínicos', 2],
  ['antecedentesCirurgicos', 'Antecedentes cirúrgicos', 2],
  ['antecedentesFamiliares', 'Antecedentes familiares', 2],
  ['habitos', 'Hábitos', 2],
  ['medicamentosEmUso', 'Medicamentos em uso', 2],
];

export const CAMPOS_TEXTO_LABEL = Object.fromEntries(CAMPOS_TEXTO.map(([campo, label]) => [campo, label]));

export const TIPOS_ANEXO = [
  ['exame', 'Exame'],
  ['foto', 'Foto'],
  ['laudo', 'Laudo'],
  ['outro', 'Outro'],
];

export function perfilClinicoDoPaciente(paciente) {
  return Object.fromEntries(CAMPOS_PERFIL_CLINICO.map(([campo]) => [campo, paciente[campo] ?? '']));
}

export function camposDoProntuario(prontuario) {
  return {
    queixaPrincipal: prontuario.queixaPrincipal ?? '',
    historicoAtual: prontuario.historicoAtual ?? '',
    exameObjetivo: prontuario.exameObjetivo ?? '',
    avaliacao: prontuario.avaliacao ?? '',
    cid10: prontuario.cid10 ?? '',
    conduta: prontuario.conduta ?? '',
    informacoes: prontuario.informacoes ?? '',
    sinaisVitais: {
      peso: prontuario.sinaisVitais?.peso ?? '',
      altura: prontuario.sinaisVitais?.altura ?? '',
      pressaoArterial: prontuario.sinaisVitais?.pressaoArterial ?? '',
      frequenciaCardiaca: prontuario.sinaisVitais?.frequenciaCardiaca ?? '',
      temperatura: prontuario.sinaisVitais?.temperatura ?? '',
    },
    anexos: prontuario.anexos ?? [],
    proximoRetorno: prontuario.proximoRetorno ? prontuario.proximoRetorno.substring(0, 10) : '',
  };
}

function numeroOuNulo(valor) {
  return valor === '' || valor === null || valor === undefined ? null : Number(valor);
}

export function prepararPayload(valores) {
  const sinaisPreenchidos = Object.values(valores.sinaisVitais).some((v) => v !== '' && v !== null && v !== undefined);

  return {
    ...valores,
    cid10: valores.cid10 || null,
    proximoRetorno: valores.proximoRetorno || null,
    sinaisVitais: sinaisPreenchidos
      ? {
          peso: numeroOuNulo(valores.sinaisVitais.peso),
          altura: numeroOuNulo(valores.sinaisVitais.altura),
          pressaoArterial: valores.sinaisVitais.pressaoArterial || null,
          frequenciaCardiaca: numeroOuNulo(valores.sinaisVitais.frequenciaCardiaca),
          temperatura: numeroOuNulo(valores.sinaisVitais.temperatura),
        }
      : null,
  };
}

export function sinaisVitaisEmLista(sinais) {
  if (!sinais) return [];
  return [
    sinais.peso != null && ['Peso', `${sinais.peso} kg`],
    sinais.altura != null && ['Altura', `${sinais.altura} m`],
    sinais.pressaoArterial && ['PA', sinais.pressaoArterial],
    sinais.frequenciaCardiaca != null && ['FC', `${sinais.frequenciaCardiaca} bpm`],
    sinais.temperatura != null && ['Temp.', `${sinais.temperatura} °C`],
  ].filter(Boolean);
}

export function formatDuracao(inicio, fim) {
  const minutos = Math.round((new Date(fim) - new Date(inicio)) / 60000);
  return `${minutos} min`;
}

// Instantes (createdAt, atendimentoIniciadoEm...) são timestamps reais, então `new Date` é seguro aqui.
// Só datas "puras" (nascimento, próximo retorno) precisam de formatDataBR.
export function formatDataHoraBR(iso) {
  if (!iso) return null;
  return new Date(iso).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function formatDataInstanteBR(iso) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString('pt-BR');
}

export function formatHoraBR(iso) {
  if (!iso) return null;
  return new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

export function atendimentoEmAndamento(prontuario) {
  return !!prontuario.atendimentoIniciadoEm && !prontuario.atendimentoFinalizadoEm;
}

export function idDoPaciente(prontuario) {
  return prontuario.pacienteId?._id ?? prontuario.pacienteId;
}

// O atendimento foi registrado pelo profissional logado (só o autor edita, finaliza e acrescenta adendos).
export function ehDoProfissional(prontuario, profissionalId) {
  return !!profissionalId && (prontuario.profissionalId?._id ?? prontuario.profissionalId) === profissionalId;
}
