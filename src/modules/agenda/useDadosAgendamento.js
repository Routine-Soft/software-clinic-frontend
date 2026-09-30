import { useProfissionais } from '@/modules/profissional/profissional.hooks';
import { useEspecialidades } from '@/modules/especialidade/especialidade.hooks';
import { useSalas } from '@/modules/sala/sala.hooks';
import { useServicos } from '@/modules/servico/servico.hooks';
import { useConvenios } from '@/modules/convenio/convenio.hooks';
import { useEmpresas } from '@/modules/empresa/empresa.hooks';
import { usePacientes } from '@/modules/paciente/paciente.hooks';
import { createPaciente } from '@/modules/paciente/paciente.api';

// Tudo o que os formulários de agendamento precisam para preencher seus campos.
export function useDadosAgendamento() {
  const { profissionais, loading: carregandoProfissionais } = useProfissionais();
  const { especialidades } = useEspecialidades();
  const { salas, loading: carregandoSalas } = useSalas();
  const { servicos, loading: carregandoServicos } = useServicos();
  const { convenios } = useConvenios();
  const { empresas } = useEmpresas();
  const { pacientes, refreshPacientes } = usePacientes();

  async function criarPaciente(dados) {
    const response = await createPaciente(dados);
    await refreshPacientes();
    return response.data;
  }

  // O agendamento exige profissional, serviço e sala (o paciente dá para criar na hora, no próprio formulário).
  const carregando = carregandoProfissionais || carregandoSalas || carregandoServicos;
  const faltando = carregando ? [] : [
    profissionais.length === 0 && 'um profissional',
    servicos.length === 0 && 'um serviço',
    salas.length === 0 && 'uma sala',
  ].filter(Boolean);

  return { profissionais, especialidades, salas, servicos, convenios, empresas, pacientes, criarPaciente, faltando };
}
