import { tr } from '@/i18n';
// Para que a avaliação ofereça este serviço: null é atendimento comum (consulta ou sessões da agenda).
export const MODULOS_SERVICO = [
  ['', tr('Atendimento comum')],
  ['neuropsicologica', tr('Avaliação neuropsicológica')],
  ['nr01', tr('Avaliação NR-01')],
];

export const ROTULO_MODULO = Object.fromEntries(MODULOS_SERVICO.filter(([valor]) => valor));

// Modelos prontos do "Adicionar serviço": a clínica só confere e digita o preço.
export const MODELOS_SERVICO = [
  {
    chave: 'neuropsicologica',
    rotulo: tr('Avaliação neuropsicológica'),
    dados: { nome: tr('Avaliação neuropsicológica'), tipo: 'pacote', qtdDias: 8, modulo: 'neuropsicologica' },
    dica: tr('8 sessões sugeridas (anamnese, testagem e devolutiva). O preço é por sessão.'),
  },
  {
    chave: 'nr01',
    rotulo: tr('Avaliação NR-01'),
    dados: { nome: tr('Avaliação NR-01 (riscos psicossociais)'), tipo: 'consulta', qtdDias: '', modulo: 'nr01' },
    dica: tr('Avaliação de riscos psicossociais para empresas.'),
  },
];

export function linhaConvenioVazia() {
  return { convenioId: '', preco: '', comissaoTipo: 'valor', comissao: '' };
}

export function formularioDoServico(servico = null) {
  return {
    nome: servico?.nome ?? '',
    tipo: servico?.tipo ?? 'consulta',
    modulo: servico?.modulo ?? '',
    qtdDias: servico?.qtdDias ?? '',
    preco: servico?.preco ?? '',
    comissaoTipo: servico?.comissaoTipo ?? 'valor',
    comissao: servico?.comissao ?? '',
    tabelaConvenios: (servico?.tabelaConvenios ?? []).map((linha) => ({
      convenioId: String(linha.convenioId?._id ?? linha.convenioId ?? ''),
      preco: linha.preco ?? '',
      comissaoTipo: linha.comissaoTipo ?? 'valor',
      comissao: linha.comissao ?? '',
    })),
  };
}

export function montarPayloadServico(form) {
  return {
    nome: form.nome,
    tipo: form.tipo,
    modulo: form.modulo || null,
    qtdDias: form.tipo === 'pacote' ? Number(form.qtdDias) || null : null,
    preco: Number(form.preco),
    comissaoTipo: form.comissaoTipo,
    comissao: Number(form.comissao) || 0,
    tabelaConvenios: form.tabelaConvenios.map((linha) => ({
      convenioId: linha.convenioId,
      preco: linha.preco === '' ? '' : Number(linha.preco),
      comissaoTipo: linha.comissaoTipo,
      comissao: Number(linha.comissao) || 0,
    })),
  };
}

// O servidor recusaria estes casos; o formulário avisa antes de enviar.
export function problemaDoFormulario(form) {
  const linhas = [{ ...form, rotulo: tr('do preço padrão') }, ...form.tabelaConvenios.map((l) => ({ ...l, rotulo: tr('de um convênio') }))];
  if (form.tabelaConvenios.some((l) => !l.convenioId)) return tr('Escolha o convênio de cada linha da tabela.');
  for (const l of linhas) {
    if (l.comissaoTipo === 'percentual' && Number(l.comissao) > 100) return tr('O repasse {rotulo} não pode passar de 100%.', { rotulo: l.rotulo });
    if (l.comissaoTipo === 'valor' && Number(l.comissao) > Number(l.preco)) return tr('O repasse {rotulo} não pode ser maior que o preço.', { rotulo: l.rotulo });
  }
  return null;
}

const normalizarNome = (nome = '') => nome.normalize('NFD').replace(/[̀-ͯ]/g, '').trim().toLowerCase();

// Serviço já cadastrado com o mesmo nome (sem diferenciar acento e maiúscula), fora o que está sendo editado.
// O nome é único na clínica: consulta e sessões do mesmo serviço precisam de nomes diferentes.
export function servicoComMesmoNome(nome, servicos = [], idAtual = null) {
  const alvo = normalizarNome(nome);
  if (!alvo) return null;
  return servicos.find((s) => s._id !== idAtual && normalizarNome(s.nome) === alvo) ?? null;
}

// Nome sugerido para não repetir: "Psicologia – sessões" ou "Psicologia – consulta avulsa".
export function sugestaoDeNome(form, servicos = [], idAtual = null) {
  // Usa a grafia do serviço já cadastrado ("Psicologia"), mesmo que a pessoa tenha digitado "psicologia".
  const base = servicoComMesmoNome(form.nome, servicos, idAtual)?.nome.trim() ?? form.nome.trim();
  const complemento = form.tipo === 'pacote' ? tr('sessões') : tr('consulta avulsa');
  let sugestao = `${base} – ${complemento}`;
  for (let n = 2; servicoComMesmoNome(sugestao, servicos, idAtual); n += 1) sugestao = `${base} – ${complemento} ${n}`;
  return sugestao;
}
