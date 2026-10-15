// Recursos que este plano tem e algum outro plano pago não tem: aparecem em destaque ("o que muda" entre os planos).
export function recursosExclusivos(plano, planos) {
  const outros = planos.filter((p) => p._id !== plano._id && p.tipo !== 'gratis');
  if (!outros.length) return new Set();
  return new Set((plano.recursos ?? []).filter((r) => outros.some((o) => !(o.recursos ?? []).includes(r))));
}

// Recursos digitados um por linha no cadastro do plano.
export function recursosDoTexto(texto) {
  return String(texto ?? '').split('\n').map((r) => r.trim()).filter(Boolean);
}

// Descrição e recursos do plano no idioma da tela (o inglês é cadastrado à parte; sem ele, vale o português).
export function planoNoIdioma(plano, idioma) {
  if (idioma !== 'en') return plano;
  return {
    ...plano,
    descricao: plano.descricaoEn || plano.descricao,
    recursos: plano.recursosEn?.length ? plano.recursosEn : plano.recursos,
  };
}
