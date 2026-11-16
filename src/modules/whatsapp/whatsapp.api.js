import httpClient from '@/services/httpClient';

// WhatsApp da clínica (lembretes de consulta pelo número dela).
export async function getWhatsapp() {
  return httpClient.get('/whatsapp');
}

// Começa ou continua a conexão: devolve o QR Code enquanto o celular não lê.
export async function conectarWhatsapp() {
  return httpClient.post('/whatsapp/conectar', {});
}

export async function desconectarWhatsapp() {
  return httpClient.post('/whatsapp/desconectar', {});
}

export async function atualizarWhatsapp(dados) {
  return httpClient.patch('/whatsapp', dados);
}

export async function enviarTesteWhatsapp(telefone) {
  return httpClient.post('/whatsapp/teste', { telefone });
}
