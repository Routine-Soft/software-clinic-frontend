import { localeAtual, tr } from '@/i18n';
import { linkWhatsapp } from '@/utils/whatsapp';
import { contatoDoPaciente } from '@/modules/paciente/paciente.utils';

// Link que o paciente abre para ler e assinar (HashRouter: a rota fica depois do "#").
export function linkDoTermo(token) {
  return `${window.location.origin}${window.location.pathname}#/assinar/${token}`;
}

export function mensagemDoTermo(termo, clinica) {
  const nome = termo.pacienteId?.nome?.split(' ')[0] ?? '';
  return tr('Olá, {nome}! A {clinica} enviou o termo "{titulo}" para você ler e assinar: {link}', {
    nome,
    clinica: clinica || tr('clínica'),
    titulo: termo.titulo,
    link: linkDoTermo(termo.token),
  });
}

// WhatsApp do paciente (ou do responsável, para criança) já com a mensagem e o link.
export function whatsappDoTermo(termo, clinica) {
  const base = termo.pacienteId ? linkWhatsapp(contatoDoPaciente(termo.pacienteId).telefone) : null;
  return base ? `${base}?text=${encodeURIComponent(mensagemDoTermo(termo, clinica))}` : null;
}

export function situacaoDoTermo(termo) {
  if (termo.status === 'assinado') return { rotulo: tr('Assinado'), tom: 'success' };
  if (termo.status === 'cancelado') return { rotulo: tr('Cancelado'), tom: 'danger' };
  if (termo.status === 'vencido' || new Date(termo.expiraEm) < new Date()) return { rotulo: tr('Link vencido'), tom: 'warning' };
  return { rotulo: tr('Aguardando assinatura'), tom: 'warning' };
}

export function pendente(termo) {
  return termo.status === 'pendente' && new Date(termo.expiraEm) >= new Date();
}

export function formatarDataHora(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleString(localeAtual(), { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function formatarCpf(valor = '') {
  const d = String(valor).replace(/\D/g, '');
  return d.length === 11 ? d.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4') : String(valor);
}

// Máscara do CPF enquanto digita.
export function mascararCpf(valor = '') {
  const d = String(valor).replace(/\D/g, '').slice(0, 11);
  return d
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

export function filtrarTermos(termos, { busca = '', status = 'todos' } = {}) {
  const alvo = busca.trim().toLocaleLowerCase();
  return termos.filter((termo) => {
    if (status === 'pendente' && !pendente(termo)) return false;
    if (status === 'assinado' && termo.status !== 'assinado') return false;
    if (!alvo) return true;
    return `${termo.pacienteId?.nome ?? ''} ${termo.titulo}`.toLocaleLowerCase().includes(alvo);
  });
}

// Marcadores que o texto do modelo aceita, com o que cada um vira.
export const MARCADORES = [
  { chave: 'paciente', descricao: tr('nome do paciente') },
  { chave: 'cpf', descricao: tr('CPF do paciente') },
  { chave: 'dataNascimento', descricao: tr('data de nascimento') },
  { chave: 'responsavel', descricao: tr('nome do responsável') },
  { chave: 'representadoPor', descricao: tr('", representado(a) pelo(a) responsável legal ..." (só se tiver responsável)') },
  { chave: 'profissional', descricao: tr('nome do profissional') },
  { chave: 'registro', descricao: tr('registro do profissional, ex.: (CRP 05/1234)') },
  { chave: 'clinica', descricao: tr('nome da clínica') },
  { chave: 'data', descricao: tr('data do envio (dd/mm/aaaa)') },
  { chave: 'dataExtenso', descricao: tr('data por extenso') },
];
