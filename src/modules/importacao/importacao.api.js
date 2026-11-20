import httpClient from '@/services/httpClient';

// Uma parte das linhas da planilha (até 500). Resposta: { importados, ignorados, erros, avisos }.
export async function importarLinhas(tipo, linhas) {
  return await httpClient.post(`/importacao/${tipo}`, { linhas });
}
