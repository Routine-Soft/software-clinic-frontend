// Datas "puras" (dia do agendamento) são tratadas como texto YYYY-MM-DD ou como Date local
// montado pelos componentes (ano, mês, dia), nunca via `new Date(iso)`, para não deslocar o dia por fuso.

const pad = (n) => String(n).padStart(2, '0');

export const NOMES_DIAS_CURTOS = ['dom.', 'seg.', 'ter.', 'qua.', 'qui.', 'sex.', 'sáb.'];
export const NUMERO_DE_CORES = 8;

export function paraISO(data) {
  return `${data.getFullYear()}-${pad(data.getMonth() + 1)}-${pad(data.getDate())}`;
}

export function deISO(iso) {
  const [ano, mes, dia] = iso.substring(0, 10).split('-').map(Number);
  return new Date(ano, mes - 1, dia);
}

export function somarDias(data, dias) {
  const nova = new Date(data.getFullYear(), data.getMonth(), data.getDate());
  nova.setDate(nova.getDate() + dias);
  return nova;
}

export function inicioDaSemana(data) {
  return somarDias(data, -data.getDay());
}

export function mesmoDia(a, b) {
  return paraISO(a) === paraISO(b);
}

export function intervaloDaVisao(visao, data) {
  if (visao === 'dia') return { inicio: data, fim: data };
  if (visao === 'semana') {
    const inicio = inicioDaSemana(data);
    return { inicio, fim: somarDias(inicio, 6) };
  }
  const primeiro = new Date(data.getFullYear(), data.getMonth(), 1);
  const ultimo = new Date(data.getFullYear(), data.getMonth() + 1, 0);
  return { inicio: inicioDaSemana(primeiro), fim: somarDias(ultimo, 6 - ultimo.getDay()) };
}

export function diasDoIntervalo({ inicio, fim }) {
  const dias = [];
  for (let dia = inicio; dia <= fim; dia = somarDias(dia, 1)) dias.push(dia);
  return dias;
}

export function navegar(visao, data, direcao) {
  if (visao === 'dia') return somarDias(data, direcao);
  if (visao === 'semana') return somarDias(data, 7 * direcao);
  // Mês: vai para o dia 1 para não "pular" meses curtos (31/01 + 1 mês).
  return new Date(data.getFullYear(), data.getMonth() + direcao, 1);
}

function capitalizar(texto) {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

export function tituloDaVisao(visao, data) {
  if (visao === 'mes') return capitalizar(data.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }));
  if (visao === 'dia') return capitalizar(data.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }));

  const { inicio, fim } = intervaloDaVisao('semana', data);
  if (inicio.getMonth() === fim.getMonth()) {
    return `${inicio.getDate()} – ${fim.getDate()} de ${fim.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}`;
  }
  const curto = (d) => d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' }).replace('.', '');
  return `${curto(inicio)} – ${curto(fim)} de ${fim.getFullYear()}`;
}

export function minutosDoHorario(horario = '00:00') {
  const [h, m] = horario.split(':').map(Number);
  return h * 60 + (m || 0);
}

export function horarioDosMinutos(minutos) {
  return `${pad(Math.floor(minutos / 60))}:${pad(minutos % 60)}`;
}

export function diaDoAgendamento(agenda) {
  return agenda.data.substring(0, 10);
}

export function agruparPorDia(agendas) {
  const mapa = new Map();
  for (const agenda of agendas) {
    const chave = diaDoAgendamento(agenda);
    if (!mapa.has(chave)) mapa.set(chave, []);
    mapa.get(chave).push(agenda);
  }
  for (const lista of mapa.values()) lista.sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));
  return mapa;
}

// Distribui agendamentos que se sobrepõem em colunas lado a lado, como o Google Agenda.
// Cada grupo de eventos encadeados divide a largura igualmente entre as colunas que usa.
export function posicionarEventos(agendas) {
  const itens = agendas
    .map((agenda) => {
      const inicio = minutosDoHorario(agenda.horaInicio);
      const fim = Math.max(minutosDoHorario(agenda.horaFim), inicio + 15);
      return { agenda, inicio, fim, coluna: 0, colunas: 1 };
    })
    .sort((a, b) => a.inicio - b.inicio || a.fim - b.fim);

  let grupo = [];
  let fimDoGrupo = -1;

  function fecharGrupo() {
    const colunas = grupo.reduce((max, item) => Math.max(max, item.coluna + 1), 1);
    for (const item of grupo) item.colunas = colunas;
    grupo = [];
  }

  for (const item of itens) {
    if (grupo.length > 0 && item.inicio >= fimDoGrupo) {
      fecharGrupo();
      fimDoGrupo = -1;
    }

    const ocupadas = new Set(grupo.filter((outro) => outro.fim > item.inicio).map((outro) => outro.coluna));
    let coluna = 0;
    while (ocupadas.has(coluna)) coluna += 1;
    item.coluna = coluna;

    grupo.push(item);
    fimDoGrupo = Math.max(fimDoGrupo, item.fim);
  }
  fecharGrupo();

  return itens;
}

export function indiceDeCor(profissionalId, idsOrdenados) {
  const posicao = idsOrdenados.indexOf(profissionalId);
  return (posicao === -1 ? 0 : posicao) % NUMERO_DE_CORES;
}

export function idDoProfissional(agenda) {
  return agenda.profissionalId?._id ?? agenda.profissionalId ?? '';
}

export const STATUS_AGENDA = {
  aguardando: 'Aguardando',
  realizado: 'Realizado',
  cancelado: 'Cancelado',
};

export function tituloDoAgendamento(agenda) {
  return [
    `${agenda.horaInicio} – ${agenda.horaFim}`,
    agenda.pacienteId?.nome,
    agenda.profissionalId?.nome,
    agenda.servicoId?.nome,
    agenda.status === 'cancelado' ? 'Cancelado' : null,
  ].filter(Boolean).join(' · ');
}

// O que cada bloco do calendário mostra. As visões de mês/semana/dia recebem isso por prop, então servem
// também para outras agendas (ex.: reuniões), cada uma com a sua função de descrever.
export function descreverAgendamento(agenda, detalhado = false) {
  return {
    nome: `${agenda.pacienteId?.nome ?? 'Paciente'}${agenda.pacienteId?.teste ? ' (teste)' : ''}`,
    sub: agenda.profissionalId?.nome ?? null,
    extra: [agenda.servicoId?.nome, detalhado ? agenda.salaId?.nome : null].filter(Boolean).join(' · '),
    titulo: tituloDoAgendamento(agenda),
  };
}

// Agendamento do profissional ligado ao login (o profissional da agenda vem populado com usuarioId).
export function ehDoUsuario(agenda, usuario) {
  const id = String(usuario?._id ?? usuario?.id ?? '');
  return !!id && String(agenda.profissionalId?.usuarioId ?? '') === id;
}

// Cadastro de profissional ligado ao login, se houver.
export function profissionalDoUsuario(profissionais, usuario) {
  const id = String(usuario?._id ?? usuario?.id ?? '');
  return id ? profissionais.find((p) => String(p.usuarioId?._id ?? p.usuarioId ?? '') === id) ?? null : null;
}
