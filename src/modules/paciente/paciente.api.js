import httpClient from "@/services/httpClient";

export async function getAllPacientes() {
  const response = await httpClient.get('/pacientes');
  return response;
}

export async function getPacienteById(id) {
  const response = await httpClient.get(`/pacientes/${id}`);
  return response;
}

export async function createPaciente(newPaciente) {
  const response = await httpClient.post('/pacientes', newPaciente);
  return response;
}

export async function updatePaciente(id, pacienteData) {
  const response = await httpClient.patch(`/pacientes/${id}`, pacienteData);
  return response;
}

export async function deletePaciente(id) {
  const response = await httpClient.delete(`/pacientes/${id}`);
  return response;
}