import httpClient from "@/services/httpClient";

export async function printAgendamento(agendaId) {
  const response = await httpClient.post(`/print/agendamento/${agendaId}`);
  return response;
}