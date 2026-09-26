export const RISCOS = {
  alto: ['Alto', 'badge--danger'],
  medio: ['Médio', 'badge--warning'],
  baixo: ['Baixo', 'badge--success'],
};

function normalizar(texto = '') {
  return texto.toString().normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

export function riscoDe(avaliacao) {
  return avaliacao.classificacaoRisco ?? 'nenhum';
}

export function ordenarAvaliacoes(avaliacoes) {
  return [...avaliacoes].sort((a, b) => {
    const porData = (b.data ?? '').substring(0, 10).localeCompare((a.data ?? '').substring(0, 10));
    return porData !== 0 ? porData : (b.createdAt ?? '').localeCompare(a.createdAt ?? '');
  });
}

export function contarPorRisco(avaliacoes) {
  const contagem = { todas: avaliacoes.length, alto: 0, medio: 0, baixo: 0, nenhum: 0 };
  for (const avaliacao of avaliacoes) contagem[riscoDe(avaliacao)] += 1;
  return contagem;
}

export function filtrarAvaliacoes(avaliacoes, { busca = '', empresaId = '', risco = 'todas' }) {
  const termo = normalizar(busca.trim());

  return avaliacoes.filter((avaliacao) => {
    if (empresaId && (avaliacao.empresaId?._id ?? avaliacao.empresaId) !== empresaId) return false;
    if (risco !== 'todas' && riscoDe(avaliacao) !== risco) return false;
    if (!termo) return true;
    return [avaliacao.empresaId?.razaoSocial, avaliacao.pacienteId?.nome, avaliacao.profissionalId?.nome]
      .some((texto) => normalizar(texto).includes(termo));
  });
}
