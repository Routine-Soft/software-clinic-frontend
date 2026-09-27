import httpClient from "@/services/httpClient";

export async function getAssinaturaAtual() {
  const response = await httpClient.get('/assinaturas/atual');
  return response;
}

// Sem planoId, o backend mantém o plano pago que a assinatura já tem (usado no "refazer pagamento").
export async function iniciarCheckoutAssinatura(planoId) {
  const response = await httpClient.post('/assinaturas/checkout', { planoId });
  return response;
}

// Gera um Pix (QR Code + copia e cola) que vale um período de acesso do plano; não renova sozinho.
export async function gerarPix(planoId, documento) {
  const response = await httpClient.post('/assinaturas/pix', { planoId, documento });
  return response;
}

// Consulta o Mercado Pago e devolve o Pix mais recente e a assinatura atualizada.
export async function sincronizarPix() {
  const response = await httpClient.post('/assinaturas/pix/sincronizar');
  return response;
}

export async function sincronizarAssinatura() {
  const response = await httpClient.post('/assinaturas/sincronizar');
  return response;
}

export async function cancelarAssinatura() {
  const response = await httpClient.post('/assinaturas/cancelar');
  return response;
}
