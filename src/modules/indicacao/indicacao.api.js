import httpClient from '@/services/httpClient';

export async function getIndicacoes() {
  return await httpClient.get('/indicacoes');
}
