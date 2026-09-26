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
  const { profissionais } = useProfissionais();
  const { especialidades } = useEspecialidades();
  const { salas } = useSalas();
  const { servicos } = useServicos();
  const { convenios } = useConvenios();
  const { empresas } = useEmpresas();
  const { pacientes, refreshPacientes } = usePacientes();

  async function criarPaciente(dados) {
    const response = await createPaciente(dados);
    await refreshPacientes();
    return response.data;
  }

  return { profissionais, especialidades, salas, servicos, convenios, empresas, pacientes, criarPaciente };
}
