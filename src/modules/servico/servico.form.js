export function linhaConvenioVazia() {
  return { convenioId: '', preco: '', comissaoTipo: 'valor', comissao: '' };
}

export function formularioDoServico(servico = null) {
  return {
    nome: servico?.nome ?? '',
    tipo: servico?.tipo ?? 'consulta',
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
    qtdDias: form.tipo === 'pacote' ? Number(form.qtdDias) : null,
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
  const linhas = [{ ...form, rotulo: 'do particular' }, ...form.tabelaConvenios.map((l) => ({ ...l, rotulo: 'de um convênio' }))];
  if (form.tabelaConvenios.some((l) => !l.convenioId)) return 'Escolha o convênio de cada linha da tabela.';
  for (const l of linhas) {
    if (l.comissaoTipo === 'percentual' && Number(l.comissao) > 100) return `A comissão ${l.rotulo} não pode passar de 100%.`;
    if (l.comissaoTipo === 'valor' && Number(l.comissao) > Number(l.preco)) return `A comissão ${l.rotulo} não pode ser maior que o preço.`;
  }
  return null;
}
