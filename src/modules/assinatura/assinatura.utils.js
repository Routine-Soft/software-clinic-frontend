import { localeAtual, tr } from '@/i18n';

// Vencimentos de assinatura são instantes no tempo (não datas puras): a data exibida segue o fuso do navegador.
export function formatarData(instante) {
  return new Date(instante).toLocaleDateString(localeAtual());
}

// Planos do Brasil em reais; os de fora do Brasil (Stripe) em dólar.
export function formatarPreco(preco, moeda = 'BRL') {
  return Number(preco ?? 0).toLocaleString(localeAtual(), { style: 'currency', currency: moeda === 'USD' ? 'USD' : 'BRL' });
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
const DIAS_DA_JANELA = 2;

// Dia do calendário (AAAA-MM-DD) no horário de Brasília, para contar dias inteiros até o vencimento.
function diaEmBrasilia(instante) {
  return new Date(instante).toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' });
}

function diaEMes(instante) {
  return new Date(instante).toLocaleDateString(localeAtual(), { timeZone: 'America/Sao_Paulo', day: '2-digit', month: '2-digit' });
}

function diaCompleto(instante) {
  return new Date(instante).toLocaleDateString(localeAtual(), { timeZone: 'America/Sao_Paulo' });
}

function diasAte(instante, agora) {
  return Math.round((Date.parse(diaEmBrasilia(instante)) - Date.parse(diaEmBrasilia(agora))) / 86400000);
}

// Em atraso (Pix vencido ou cartão recusado), ainda dentro da tolerância. O Pix vira "em atraso" na hora do
// vencimento, mas para a pessoa o dia do vencimento ainda é "vence hoje".
function avisoDeAtraso(assinatura, agora) {
  const limite = assinatura.acesso?.ate;
  if (!limite) return null;

  const botao = tr('Regularizar');
  if (assinatura.cobranca === 'pix' && assinatura.proximaCobranca && diasAte(assinatura.proximaCobranca, agora) === 0) {
    return { tom: 'danger', dias: 0, botao, etapa: 'hoje', data: diaCompleto(assinatura.proximaCobranca), texto: tr('Sua mensalidade vence hoje. Pague para manter o acesso em dia.') };
  }
  const data = diaCompleto(limite);
  return { tom: 'danger', dias: -1, botao, etapa: 'atraso', data, texto: tr('Sua mensalidade está em atraso. Regularize até {data} para não perder o acesso.', { data }) };
}

// Barra de vencimento, a partir de 7 dias antes, para quem precisa agir: quem paga por Pix (o cartão renova
// sozinho), quem está no teste grátis e quem está em atraso. Devolve null quando não há o que avisar; senão o tom
// (info, warning, danger), o texto, o rótulo do botão e, nos dias da janela de aviso, a etapa (antes, hoje, atraso).
export function avisoDeVencimento(assinatura, agora = new Date()) {
  if (assinatura?.acesso?.liberado === false) return null;
  if (assinatura?.status === 'inadimplente') return avisoDeAtraso(assinatura, agora);

  const porPix = assinatura?.status === 'ativa' && assinatura.cobranca === 'pix';
  const emTeste = assinatura?.status === 'trial';
  const vencimento = porPix ? assinatura.proximaCobranca : emTeste ? assinatura.dataFimTrial : null;
  if (!vencimento || new Date(vencimento) <= agora) return null;

  const dias = diasAte(vencimento, agora);
  if (dias > DIAS_DE_AVISO) return null;

  const data = diaEMes(vencimento);
  const [oQue, verbo, acao, botao] = porPix
    ? [tr('Seu plano'), tr('vence'), tr('Pague'), tr('Pagar')]
    : [tr('Seu teste grátis'), tr('termina'), tr('Assine um plano'), tr('Assinar')];
  const tom = dias <= 0 ? 'danger' : dias <= 3 ? 'warning' : 'info';
  // A janela de aviso é só da mensalidade: dois dias antes, e de novo no dia.
  const etapa = !porPix || dias > DIAS_DA_JANELA ? null : dias <= 0 ? 'hoje' : 'antes';
  const base = { tom, dias, botao, etapa, data: diaCompleto(vencimento) };

  // O teste acabando não tira o sistema: a clínica segue no plano Grátis, sem os recursos pagos.
  if (dias <= 0 && emTeste) return { ...base, texto: tr('Seu teste grátis termina hoje. Depois, a clínica segue no plano Grátis: assine para manter o prontuário, a equipe e o resto.') };
  if (dias <= 0) return { ...base, texto: tr('{oQue} {verbo} hoje. {acao} para não perder o acesso.', { oQue, verbo, acao }) };
  if (dias === 1) return { ...base, texto: tr('{oQue} {verbo} amanhã ({data}).', { oQue, verbo, data }) };
  return { ...base, texto: tr('{oQue} {verbo} em {dias} dias ({data}).', { oQue, verbo, dias, data }) };
}

// Título e texto da janela de aviso de cada etapa.
export function textoDaJanela({ etapa, data }) {
  if (etapa === 'antes') {
    return { titulo: tr('Sua mensalidade vai vencer'), textos: [tr('Sua mensalidade vence no dia {data}. Faça o pagamento até essa data para continuar usando o sistema sem interrupção.', { data })] };
  }
  if (etapa === 'hoje') {
    return { titulo: tr('Sua mensalidade vence hoje'), textos: [tr('Sua mensalidade vence hoje, dia {data}. Faça o pagamento para manter tudo em dia.', { data })] };
  }
  return {
    titulo: tr('Mensalidade em atraso'),
    textos: [
      tr('Sua mensalidade está em atraso. Pedimos que regularize o pagamento assim que puder.'),
      tr('O sistema continua liberado por até 3 dias de atraso, até {data}. Depois disso, o acesso fica bloqueado até a regularização.', { data }),
    ],
  };
}

// Avisos que, uma vez fechados, só voltam no dia seguinte. Guardado só neste navegador.
export function vistoHoje(chave) {
  try {
    return localStorage.getItem(chave) === diaEmBrasilia(new Date());
  } catch {
    return false;
  }
}

export function marcarVistoHoje(chave) {
  try {
    localStorage.setItem(chave, diaEmBrasilia(new Date()));
  } catch {
    // Sem armazenamento (navegação privada): vale só até recarregar a página.
  }
}

// Avisa as outras partes da tela (como a barra de vencimento) que a assinatura mudou, ex.: Pix acabou de ser pago.
export function avisarAssinaturaAtualizada(assinatura) {
  window.dispatchEvent(new CustomEvent('assinatura:atualizada', { detail: assinatura }));
}
