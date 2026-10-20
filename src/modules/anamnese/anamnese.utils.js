import { tr } from '@/i18n';
import { calcularIdade } from '@/utils/date';
import { contatoDoPaciente } from '@/modules/paciente/paciente.utils';

// Formato da ficha (igual ao do servidor, anamnese/anamnese.ficha.js):
//   secoes: [{ id, titulo, descricao, perguntas: [{ id, tipo, rotulo, dica, opcoes, outro, auto }] }]
//   respostas: { [idDaPergunta]: texto | 'AAAA-MM-DD' | { marcadas, outro } | { valor, outro } }

export const TIPOS = [
  { valor: 'curto', rotulo: tr('Texto curto') },
  { valor: 'longo', rotulo: tr('Texto longo') },
  { valor: 'marcar', rotulo: tr('Caixas de marcar (várias)') },
  { valor: 'escolha', rotulo: tr('Escolha única') },
  { valor: 'data', rotulo: tr('Data') },
];

export const AUTOS = [
  { valor: '', rotulo: tr('Não preencher') },
  { valor: 'pacienteNome', rotulo: tr('Nome do paciente') },
  { valor: 'pacienteNascimento', rotulo: tr('Data de nascimento') },
  { valor: 'pacienteIdade', rotulo: tr('Idade') },
  { valor: 'pacienteContato', rotulo: tr('Telefone e e-mail') },
  { valor: 'profissionalNome', rotulo: tr('Nome do profissional') },
  { valor: 'hoje', rotulo: tr('Data de hoje') },
];

export const comOpcoes = (tipo) => tipo === 'marcar' || tipo === 'escolha';

export function respostaVazia(pergunta) {
  if (pergunta.tipo === 'marcar') return { marcadas: [], outro: '' };
  if (pergunta.tipo === 'escolha') return { valor: '', outro: '' };
  return '';
}

export function respondida(pergunta, valor) {
  if (!valor) return false;
  if (typeof valor === 'string') return !!valor.trim();
  return !!(valor.marcadas?.length || valor.valor || valor.outro?.trim());
}

export function contarRespondidas(secoes = [], respostas = {}) {
  const perguntas = secoes.flatMap((s) => s.perguntas ?? []);
  return { total: perguntas.length, respondidas: perguntas.filter((p) => respondida(p, respostas[p.id])).length };
}

function hojeISO() {
  const agora = new Date();
  return `${agora.getFullYear()}-${String(agora.getMonth() + 1).padStart(2, '0')}-${String(agora.getDate()).padStart(2, '0')}`;
}

function valorAutomatico(auto, { paciente, profissional }) {
  if (auto === 'pacienteNome') return paciente?.nome ?? '';
  if (auto === 'pacienteNascimento') return paciente?.dataNascimento ? String(paciente.dataNascimento).substring(0, 10) : '';
  if (auto === 'pacienteIdade') {
    const idade = calcularIdade(paciente?.dataNascimento);
    return idade === null ? '' : `${idade} ${idade === 1 ? tr('ano') : tr('anos')}`;
  }
  if (auto === 'pacienteContato') {
    if (!paciente) return '';
    const { telefone, email } = contatoDoPaciente(paciente);
    return [telefone, email].filter(Boolean).join(' · ');
  }
  if (auto === 'profissionalNome') return profissional?.nome ?? '';
  if (auto === 'hoje') return hojeISO();
  return '';
}

// Ficha aberta pela primeira vez: o que dá para saber sozinho (nome, idade, data de hoje) já vem preenchido.
// Só preenche o que ainda não foi respondido nem salvo.
export function preencherAutomaticos(secoes = [], respostas = {}, contexto = {}) {
  const resultado = { ...respostas };
  for (const pergunta of secoes.flatMap((s) => s.perguntas ?? [])) {
    if (pergunta.auto && !(pergunta.id in resultado)) {
      const valor = valorAutomatico(pergunta.auto, contexto);
      if (valor) resultado[pergunta.id] = valor;
    }
  }
  return resultado;
}

// ---------- Editor de modelos ----------
export function novoId(prefixo) {
  return `${prefixo}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

export function perguntaNova(tipo = 'longo') {
  return { id: novoId('p'), tipo, rotulo: '', dica: '', opcoes: [], outro: false, auto: null };
}

export function secaoNova() {
  return { id: novoId('s'), titulo: '', descricao: '', perguntas: [perguntaNova()] };
}

export function modeloVazio() {
  return { titulo: '', area: '', descricao: '', secoes: [secaoNova()] };
}

export function totalDePerguntas(secoes = []) {
  return secoes.reduce((total, s) => total + (s.perguntas?.length ?? 0), 0);
}

// Move um item de uma lista para cima (-1) ou para baixo (+1).
export function mover(lista, index, direcao) {
  const destino = index + direcao;
  if (destino < 0 || destino >= lista.length) return lista;
  const copia = [...lista];
  [copia[index], copia[destino]] = [copia[destino], copia[index]];
  return copia;
}
