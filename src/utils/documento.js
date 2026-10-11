// CPF (000.000.000-00) ou CNPJ (00.000.000/0000-00) a partir dos dígitos salvos no banco.
export function formatarDocumento(doc = '') {
  if (doc.length === 11) return doc.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  if (doc.length === 14) return doc.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  return doc;
}
