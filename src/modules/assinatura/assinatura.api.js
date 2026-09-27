import httpClient from "@/services/httpClient";

export async function getAssinaturaAtual() {
  const response = await httpClient.get('/assinaturas/atual');
  return response;
}

export async function iniciarCheckoutAssinatura() {
  const response = await httpClient.post('/assinaturas/checkout');
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
