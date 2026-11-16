import PLANOS_ES from '@/i18n/es/planos';

// Recursos digitados um por linha no cadastro do plano.
export function recursosDoTexto(texto) {
  return String(texto ?? '').split('\n').map((r) => r.trim()).filter(Boolean);
}

// Descrição e recursos do plano no idioma da tela (o inglês é cadastrado à parte; sem ele, vale o português).
// No espanhol, os textos conhecidos passam pela tabela de es/planos.js.
export function planoNoIdioma(plano, idioma) {
  if (idioma === 'es') {
    const es = (texto) => PLANOS_ES[texto] ?? texto;
    return { ...plano, descricao: plano.descricao && es(plano.descricao), recursos: (plano.recursos ?? []).map(es) };
  }
  if (idioma !== 'en') return plano;
  return {
    ...plano,
    descricao: plano.descricaoEn || plano.descricao,
    recursos: plano.recursosEn?.length ? plano.recursosEn : plano.recursos,
  };
}

// Planos do Brasil em reais; os de fora do Brasil em dólar (preço próprio, não convertido).
export function formatarPrecoPlano(preco, locale, moeda = 'BRL') {
  const casas = Number.isInteger(Number(preco)) ? 0 : 2;
  return Number(preco).toLocaleString(locale, { style: 'currency', currency: moeda === 'USD' ? 'USD' : 'BRL', minimumFractionDigits: casas, maximumFractionDigits: casas });
}
