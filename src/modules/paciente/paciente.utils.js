import { calcularIdade } from '@/utils/date';

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
      (buscaDigitos !== '' && [paciente.cpf, paciente.telefone, ...responsaveis.map((r) => r.telefone)].some((valor) => apenasDigitos(valor).includes(buscaDigitos)));
  });
}

const MAIORIDADE = 18;

export const PARENTESCOS = ['Mãe', 'Pai', 'Avó', 'Avô', 'Tia', 'Tio', 'Irmã', 'Irmão', 'Tutor(a) legal', 'Outro'];

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
