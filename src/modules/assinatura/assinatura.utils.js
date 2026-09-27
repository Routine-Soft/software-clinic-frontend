// Vencimentos de assinatura são instantes no tempo (não datas puras): a data exibida segue o fuso do navegador.
export function formatarData(instante) {
  return new Date(instante).toLocaleDateString('pt-BR');
}

export function formatarPreco(preco) {
  return preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function somenteDigitos(valor) {
  return String(valor ?? '').replace(/\D/g, '');
}

// Máscara de CPF (até 11 dígitos) ou CNPJ (até 14) enquanto a pessoa digita.
export function formatarDocumento(valor) {
  const d = somenteDigitos(valor).slice(0, 14);
  if (d.length <= 11) {
    return d
      .replace(/^(\d{3})(\d)/, '$1.$2')
      .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1-$2');
  }
  return d
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2');
}

export function documentoCompleto(valor) {
  return [11, 14].includes(somenteDigitos(valor).length);
}

// "mm:ss" para a contagem regressiva do QR Code.
export function formatarContagem(ms) {
  const total = Math.max(0, Math.floor(ms / 1000));
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}
