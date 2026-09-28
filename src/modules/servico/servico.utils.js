export function formatarPreco(valor) {
  return Number(valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Texto de apoio do campo de comissão: mostra na hora quanto fica para a clínica.
export function dicaComissao(preco, comissao) {
  const valorPreco = Number(preco) || 0;
  const valorComissao = Number(comissao) || 0;
  if (valorComissao > valorPreco) return 'A comissão não pode ser maior que o preço.';
  if (valorComissao === 0) return 'Valor em reais pago ao profissional por atendimento realizado. Deixe em branco se não houver comissão.';
  return `Por atendimento: ${formatarPreco(valorComissao)} para o profissional e ${formatarPreco(valorPreco - valorComissao)} para a clínica.`;
}
