// Link para conversar no WhatsApp com o número do cadastro (DDD + número, com ou sem o 55 do Brasil).
export function linkWhatsapp(telefone) {
  let digitos = String(telefone ?? '').replace(/\D/g, '').replace(/^0+/, '');
  if (digitos.length === 10 || digitos.length === 11) digitos = `55${digitos}`;
  return /^\d{12,13}$/.test(digitos) ? `https://wa.me/${digitos}` : null;
}
