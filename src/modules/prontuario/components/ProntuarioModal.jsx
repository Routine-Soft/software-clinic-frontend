import Modal from '@/components/Modal/Modal';
import { iniciais } from '@/utils/nome';
import ProntuarioPaciente from './ProntuarioPaciente';
import ResumoAgendamento from './ResumoAgendamento';
import SemAcessoProntuario from './SemAcessoProntuario';
import { useAcessoProntuario } from '../prontuario.hooks';

// Prontuário em janela: usado pela Agenda (ao clicar num agendamento) e pela lista de prontuários.
// O clique fora não fecha, porque o atendimento em andamento pode ter anotações ainda não salvas.
// Com `somenteAgendamento`, ou quando o login não pode abrir prontuários (recepção, super admin, login sem
// cadastro de profissional), mostra apenas o resumo do agendamento, sem nenhum dado clínico.
export default function ProntuarioModal({
  paciente,
  agendamento,
  somenteAgendamento = false,
  onEditarAgendamento,
  onCancelarAgendamento,
  onImprimirAgendamento,
  onMarcarRealizado,
  erroAgendamento,
  onClose,
}) {
  const acesso = useAcessoProntuario();
  const semAcesso = somenteAgendamento || (!acesso.carregando && !acesso.profissional);

  if (!somenteAgendamento && acesso.carregando) {
    return (
      <Modal title={agendamento ? 'Agendamento' : 'Prontuário'} onClose={onClose}>
        <div className="skeleton skeleton--bloco" />
      </Modal>
    );
  }

  if (semAcesso && !agendamento) {
    return (
      <Modal title="Prontuário" onClose={onClose}>
        <SemAcessoProntuario />
      </Modal>
    );
  }

  if (semAcesso) {
    return (
      <Modal title="Agendamento" onClose={onClose}>
        <div className="prontuario">
          <div className="pront-head">
            <div className="pront-head__avatar" aria-hidden="true">{iniciais(paciente.nome)}</div>
            <div className="pront-head__dados">
              <h3 className="pront-head__nome">{paciente.nome}</h3>
              <p className="pront-head__meta">{paciente.telefone && <span>{paciente.telefone}</span>}</p>
            </div>
          </div>
          <ResumoAgendamento
            agendamento={agendamento}
            onEditar={onEditarAgendamento}
            onCancelar={onCancelarAgendamento}
            onImprimir={onImprimirAgendamento}
            onMarcarRealizado={onMarcarRealizado}
            erro={erroAgendamento}
          />
        </div>
      </Modal>
    );
  }

  return (
    <Modal title="Prontuário" className="modal--prontuario" persistente onClose={onClose}>
      <ProntuarioPaciente
        paciente={paciente}
        profissional={acesso.profissional}
        agendamento={agendamento}
        onEditarAgendamento={onEditarAgendamento}
        onCancelarAgendamento={onCancelarAgendamento}
        onImprimirAgendamento={onImprimirAgendamento}
        onMarcarRealizado={onMarcarRealizado}
        erroAgendamento={erroAgendamento}
      />
    </Modal>
  );
}
