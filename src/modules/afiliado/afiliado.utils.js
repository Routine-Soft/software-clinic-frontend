export const SITUACAO_COMISSAO = {
  aguardando: { rotulo: 'Aguardando o 1º pagamento', tom: 'warning' },
  carencia: { rotulo: 'Em carência', tom: 'info' },
  a_pagar: { rotulo: 'A receber', tom: 'success' },
  paga: { rotulo: 'Paga', tom: 'primary' },
};

export function mensagemConviteAfiliado(link) {
  return `Conhece a Sonelia? É um sistema para clínicas com agenda, prontuário eletrônico, pacientes, convênios e repasses dos profissionais, tudo em um lugar só. Dá para testar grátis, sem cartão: ${link}`;
}

export function dataBR(data) {
  return data ? new Date(data).toLocaleDateString('pt-BR') : '';
}

// Linha de detalhe de cada comissão: quando a clínica entrou e em que pé está o pagamento.
export function detalheComissao(c) {
  const partes = [`Cadastrou-se em ${dataBR(c.criadaEm)}`];
  if (c.situacao === 'carencia') partes.push(`liberada para pagamento em ${dataBR(c.disponivelEm)}`);
  if (c.situacao === 'a_pagar') partes.push(`liberada desde ${dataBR(c.disponivelEm)}`);
  if (c.situacao === 'paga') partes.push(`paga em ${dataBR(c.pagaEm)}`);
  return partes.join(' · ');
}
