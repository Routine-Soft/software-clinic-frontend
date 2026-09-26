function normalizar(texto = '') {
  return texto.toString().normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

function apenasDigitos(texto = '') {
  return texto.toString().replace(/\D/g, '');
}

export function ordenarPacientes(pacientes) {
  return [...pacientes].sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
}

export function filtrarPacientes(pacientes, termo) {
  const busca = normalizar(termo.trim());
  if (!busca) return pacientes;
  const buscaDigitos = apenasDigitos(busca);

  return pacientes.filter((paciente) =>
    normalizar(paciente.nome).includes(busca) ||
    normalizar(paciente.email).includes(busca) ||
    (buscaDigitos !== '' && (apenasDigitos(paciente.cpf).includes(buscaDigitos) || apenasDigitos(paciente.telefone).includes(buscaDigitos)))
  );
}
