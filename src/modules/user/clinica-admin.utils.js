// "12 dias", "3 meses", "1 ano e 2 meses": há quanto tempo a clínica é cliente.
export function tempoDeCasa(desde, agora = new Date()) {
  const inicio = new Date(desde);
  if (Number.isNaN(inicio.getTime())) return null;

  let meses = (agora.getFullYear() - inicio.getFullYear()) * 12 + (agora.getMonth() - inicio.getMonth());
  if (agora.getDate() < inicio.getDate()) meses -= 1;

  if (meses < 1) {
    // Dias de calendário (ontem = 1 dia), não blocos de 24 horas.
    const diaInicio = Date.UTC(inicio.getFullYear(), inicio.getMonth(), inicio.getDate());
    const diaAgora = Date.UTC(agora.getFullYear(), agora.getMonth(), agora.getDate());
    const dias = Math.max(0, Math.round((diaAgora - diaInicio) / 86400000));
    if (dias === 0) return 'hoje';
    return dias === 1 ? '1 dia' : `${dias} dias`;
  }

  const anos = Math.floor(meses / 12);
  const resto = meses % 12;
  const textoMeses = resto === 1 ? '1 mês' : `${resto} meses`;
  if (anos === 0) return textoMeses;
  const textoAnos = anos === 1 ? '1 ano' : `${anos} anos`;
  return resto ? `${textoAnos} e ${textoMeses}` : textoAnos;
}

export const ROTULO_METODO_PAGAMENTO = { pix: 'Pix', recorrente: 'Cartão' };
