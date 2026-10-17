import { calcularIdade } from '@/utils/date';
import { tr } from '@/i18n';

function normalizar(texto = '') {
  return texto.toString().normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

function apenasDigitos(texto = '') {
  return texto.toString().replace(/\D/g, '');
}

export function ordenarPacientes(pacientes) {
  return [...pacientes].sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
}

export function filtrarPacientes(pacientes, termo) {
  const busca = normalizar(termo.trim());
  if (!busca) return pacientes;
  const buscaDigitos = apenasDigitos(busca);

  // Também encontra a criança pelo nome ou telefone do responsável.
  return pacientes.filter((paciente) => {
    const responsaveis = paciente.responsaveis ?? [];
    return normalizar(paciente.nome).includes(busca) ||
      normalizar(paciente.email).includes(busca) ||
      responsaveis.some((r) => normalizar(r.nome).includes(busca)) ||
      (buscaDigitos !== '' && [paciente.cpf, paciente.telefone, ...responsaveis.flatMap((r) => [r.telefone, r.cpf])].some((valor) => apenasDigitos(valor).includes(buscaDigitos)));
  });
}

const MAIORIDADE = 18;

export const PARENTESCOS = [tr('Mãe'), tr('Pai'), tr('Avó'), tr('Avô'), tr('Tia'), tr('Tio'), tr('Irmã'), tr('Irmão'), tr('Tutor(a) legal'), tr('Outro')];

export const RESPONSAVEL_VAZIO = { nome: '', parentesco: '', cpf: '', telefone: '', email: '' };

// Data de nascimento "AAAA-MM-DD" (do formulário ou do backend). Sem data, não é menor.
export function ehMenorDeIdade(dataNascimento) {
  const idade = calcularIdade(dataNascimento);
  return idade !== null && idade >= 0 && idade < MAIORIDADE;
}

export function rotuloDoResponsavel(responsavel) {
  return responsavel.parentesco ? `${responsavel.nome} (${responsavel.parentesco})` : responsavel.nome;
}

// Contato para falar com o paciente: o dele ou, se não tiver (criança), o do primeiro responsável que tiver.
export function contatoDoPaciente(paciente) {
  const responsaveis = paciente.responsaveis ?? [];
  return {
    telefone: paciente.telefone || responsaveis.find((r) => r.telefone)?.telefone || '',
    email: paciente.email || responsaveis.find((r) => r.email)?.email || '',
  };
}

// CPF para mostrar nas listas: o do paciente ou, se ele não tiver (criança), o do primeiro responsável que tiver.
export function cpfDoPaciente(paciente) {
  if (paciente.cpf) return `CPF ${paciente.cpf}`;
  const doResponsavel = (paciente.responsaveis ?? []).find((r) => r.cpf)?.cpf;
  return doResponsavel ? tr('CPF do responsável {doResponsavel}', { doResponsavel }) : tr('Sem CPF');
}

// Como o nome aparece na TV da sala de espera (igual a nomeParaTv do backend, em chamada.utils.js).
export const OPCOES_NOME_NA_TV = [
  ['completo', tr('Mostrar o nome completo')],
  ['oculto', tr('Não mostrar o nome (só a sala)')],
];

// "abreviado" e "primeiro" eram opções de uma versão anterior: hoje a TV mostra o nome completo.
export function opcaoNomeNaTv(valor) {
  return valor === 'oculto' ? 'oculto' : 'completo';
}

const PARTICULAS = new Set(['da', 'das', 'de', 'do', 'dos', 'e']);

export function nomeParaTv(nome, modo = 'abreviado') {
  const partes = String(nome ?? '').trim().split(/\s+/).filter(Boolean);
  if (!partes.length || modo === 'oculto') return null;
  if (modo === 'completo') return partes.join(' ');
  if (modo === 'primeiro' || partes.length === 1) return partes[0];
  const sobrenome = [...partes.slice(1)].reverse().find((p) => !PARTICULAS.has(p.toLowerCase()));
  return sobrenome ? `${partes[0]} ${sobrenome[0].toUpperCase()}.` : partes[0];
}

// ---------- Profissionais que acompanham o paciente ----------
const idDe = (valor) => String(valor?._id ?? valor ?? '');

// Quem acompanha hoje (sem data de saída). Profissional excluído do cadastro some da lista.
export function acompanhamentosAtivos(paciente) {
  return (paciente?.acompanhamentos ?? []).filter((a) => !a.ate && a.profissionalId);
}

export function acompanhamentosEncerrados(paciente) {
  return (paciente?.acompanhamentos ?? [])
    .filter((a) => a.ate && a.profissionalId)
    .sort((a, b) => new Date(b.ate) - new Date(a.ate));
}

export function idsQueAcompanham(paciente) {
  return acompanhamentosAtivos(paciente).map((a) => idDe(a.profissionalId));
}

// Nomes de quem acompanha. O cadastro pode vir só com o id do profissional (ex.: o paciente de um agendamento):
// aí o nome vem da lista de profissionais, quando ela for passada.
export function nomesQueAcompanham(paciente, profissionais = []) {
  return acompanhamentosAtivos(paciente)
    .map((a) => a.profissionalId?.nome ?? profissionais.find((p) => p._id === idDe(a.profissionalId))?.nome)
    .filter(Boolean);
}
