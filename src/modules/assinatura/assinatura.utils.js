// Vencimentos de assinatura são instantes no tempo (não datas puras): a data exibida segue o fuso do navegador.
export function formatarData(instante) {
  return new Date(instante).toLocaleDateString('pt-BR');
}

export function formatarPreco(preco) {
  return preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function somenteDigitos(valor) {
  return String(valor ?? '').replace(/\D/g, '');
}

// Máscara de CPF (até 11 dígitos) ou CNPJ (até 14) enquanto a pessoa digita.
export function formatarDocumento(valor) {
  const d = somenteDigitos(valor).slice(0, 14);
  if (d.length <= 11) {
    return d
      .replace(/^(\d{3})(\d)/, '$1.$2')
      .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1-$2');
  }
  return d
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2');
}

export function documentoCompleto(valor) {
  return [11, 14].includes(somenteDigitos(valor).length);
}

// "mm:ss" para a contagem regressiva do QR Code.
export function formatarContagem(ms) {
  const total = Math.max(0, Math.floor(ms / 1000));
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}

const DIAS_DE_AVISO = 7;

// Dia do calendário (AAAA-MM-DD) no horário de Brasília, para contar dias inteiros até o vencimento.
function diaEmBrasilia(instante) {
  return new Date(instante).toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' });
}

function diaEMes(instante) {
  return new Date(instante).toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo', day: '2-digit', month: '2-digit' });
}

// Barra de vencimento, a partir de 7 dias antes, para quem precisa agir: quem paga por Pix (o cartão renova
// sozinho) e quem está no teste grátis. Devolve null quando não há o que avisar; senão o tom (info, warning,
// danger), o texto e o rótulo do botão.
export function avisoDeVencimento(assinatura, agora = new Date()) {
  const porPix = assinatura?.status === 'ativa' && assinatura.cobranca === 'pix';
  const emTeste = assinatura?.status === 'trial';
  const vencimento = porPix ? assinatura.proximaCobranca : emTeste ? assinatura.dataFimTrial : null;
  if (!vencimento || new Date(vencimento) <= agora) return null;

  const dias = Math.round((Date.parse(diaEmBrasilia(vencimento)) - Date.parse(diaEmBrasilia(agora))) / 86400000);
  if (dias > DIAS_DE_AVISO) return null;

  const data = diaEMes(vencimento);
  const [oQue, verbo, acao, botao] = porPix
    ? ['Seu plano', 'vence', 'Pague', 'Pagar']
    : ['Seu teste grátis', 'termina', 'Assine um plano', 'Assinar'];
  const tom = dias <= 0 ? 'danger' : dias <= 3 ? 'warning' : 'info';

  if (dias <= 0) return { tom, dias, botao, texto: `${oQue} ${verbo} hoje. ${acao} para não perder o acesso.` };
  if (dias === 1) return { tom, dias, botao, texto: `${oQue} ${verbo} amanhã (${data}).` };
  return { tom, dias, botao, texto: `${oQue} ${verbo} em ${dias} dias (${data}).` };
}

// Avisa as outras partes da tela (como a barra de vencimento) que a assinatura mudou, ex.: Pix acabou de ser pago.
export function avisarAssinaturaAtualizada(assinatura) {
  window.dispatchEvent(new CustomEvent('assinatura:atualizada', { detail: assinatura }));
}
