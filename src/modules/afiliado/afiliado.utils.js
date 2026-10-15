import { localeAtual, tr } from '@/i18n';

export const SITUACAO_COMISSAO = {
  aguardando: { rotulo: tr('Aguardando o 1º pagamento'), tom: 'warning' },
  carencia: { rotulo: tr('Em carência'), tom: 'info' },
  a_pagar: { rotulo: tr('A receber'), tom: 'success' },
  paga: { rotulo: tr('Paga'), tom: 'primary' },
};

export function mensagemConviteAfiliado(link) {
  return tr('Conhece a Sonelia? É um sistema para clínicas com agenda, prontuário eletrônico, pacientes, convênios e repasses dos profissionais, tudo em um lugar só. Dá para testar grátis, sem cartão: {link}', { link });
}

export function dataBR(data) {
  return data ? new Date(data).toLocaleDateString(localeAtual()) : '';
}

// Linha de detalhe de cada comissão: quando a clínica entrou e em que pé está o pagamento.
export function detalheComissao(c) {
  const partes = [tr('Cadastrou-se em {p0}', { p0: dataBR(c.criadaEm) })];
  if (c.situacao === 'carencia') partes.push(tr('liberada para pagamento em {p0}', { p0: dataBR(c.disponivelEm) }));
  if (c.situacao === 'a_pagar') partes.push(tr('liberada desde {p0}', { p0: dataBR(c.disponivelEm) }));
  if (c.situacao === 'paga') partes.push(tr('paga em {p0}', { p0: dataBR(c.pagaEm) }));
  return partes.join(' · ');
}
