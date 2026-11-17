import PLANOS_ES from '@/i18n/es/planos';
import { tr } from '@/i18n';

// Descrição do plano no idioma da tela. Os planos em real são cadastrados em português e os em dólar em inglês;
// no espanhol, as frases conhecidas passam pela tabela de es/planos.js.
export function planoNoIdioma(plano, idioma) {
  if (idioma !== 'es' || !plano.descricao) return plano;
  return { ...plano, descricao: PLANOS_ES[plano.descricao] ?? plano.descricao };
}

// Planos do Brasil em reais; os de fora do Brasil em dólar (preço próprio, não convertido).
export function formatarPrecoPlano(preco, locale, moeda = 'BRL') {
  const casas = Number.isInteger(Number(preco)) ? 0 : 2;
  return Number(preco).toLocaleString(locale, { style: 'currency', currency: moeda === 'USD' ? 'USD' : 'BRL', minimumFractionDigits: casas, maximumFractionDigits: casas });
}

// Níveis do plano pago (mesmos do backend, plano.limites.js): definem limites e recursos.
export const NOME_DO_NIVEL = { basic: 'Basic', pro: 'Pro', rede: 'Rede' };
export const NIVEIS_DO_PLANO = [
  ['basic', tr('Basic: até 2 profissionais, pacientes sem limite e recepção, sem repasses')],
  ['pro', tr('Pro: até 20 profissionais')],
  ['rede', tr('Rede: até 100 profissionais')],
];
