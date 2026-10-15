// Código de quem indicou, guardado quando a pessoa chega pelo link. Fica salvo até a conta ser criada,
// mesmo que ela passe pela landing, pelo login ou pelo Google antes de chegar ao cadastro.
const CHAVE = 'codigo-indicacao';

export const STATUS_INDICACAO = {
  aguardando: { rotulo: 'Aguardando o 1º pagamento', tom: 'warning' },
  liberada: { rotulo: 'Desconto guardado', tom: 'success' },
  usada: { rotulo: 'Desconto usado', tom: 'info' },
};

export function normalizarCodigo(codigo = '') {
  return codigo.replace(/\s+/g, '').toUpperCase();
}

// Chamado no main.jsx: o link é sonelia.com.br/#/?indicacao=CODIGO (HashRouter: a busca fica depois do "#").
export function capturarCodigoIndicacao() {
  const busca = window.location.hash.split('?')[1];
  const codigo = normalizarCodigo(new URLSearchParams(busca).get('indicacao') ?? '');
  if (!codigo) return;
  try {
    localStorage.setItem(CHAVE, codigo);
  } catch {
    // armazenamento bloqueado: a pessoa ainda pode digitar o código no cadastro
  }
}

export function codigoIndicacaoGuardado() {
  try {
    return localStorage.getItem(CHAVE) ?? '';
  } catch {
    return '';
  }
}

export function esquecerCodigoIndicacao() {
  try {
    localStorage.removeItem(CHAVE);
  } catch {
    // nada a fazer
  }
}

export function linkDeIndicacao(codigo) {
  return `${window.location.origin}/#/?indicacao=${codigo}`;
}

// Mensagem pronta do botão "Enviar pelo WhatsApp" (a pessoa escolhe o contato no próprio WhatsApp).
export function linkWhatsappTexto(texto) {
  return `https://wa.me/?text=${encodeURIComponent(texto)}`;
}

export function mensagemConviteClinica(link) {
  return `Uso a Sonelia para organizar a agenda, os prontuários e os repasses da minha clínica, e recomendo! Crie sua conta pelo meu link e teste grátis: ${link}`;
}

export function formatarReais(valor) {
  return Number(valor ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 });
}
