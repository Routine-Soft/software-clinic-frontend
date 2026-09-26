import Modal from '@/components/Modal/Modal';
import { iniciais } from '@/utils/nome';
import ProntuarioPaciente from './ProntuarioPaciente';
import ResumoAgendamento from './ResumoAgendamento';

// Prontuário em janela: usado pela Agenda (ao clicar num agendamento) e pela lista de prontuários.
// O clique fora não fecha, porque o atendimento em andamento pode ter anotações ainda não salvas.
// Com `somenteAgendamento` (perfil sem acesso a prontuário, como a recepção) mostra apenas o
// resumo do agendamento, sem nenhum dado clínico.
export default function ProntuarioModal({
  paciente,
  agendamento,
  somenteAgendamento = false,
  onEditarAgendamento,
  onCancelarAgendamento,
  onImprimirAgendamento,
  onClose,
}) {
  if (somenteAgendamento && agendamento) {
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
          />
        </div>
      </Modal>
    );
  }

  return (
    <Modal title="Prontuário" className="modal--prontuario" persistente onClose={onClose}>
      <ProntuarioPaciente
        paciente={paciente}
        agendamento={agendamento}
        onEditarAgendamento={onEditarAgendamento}
        onCancelarAgendamento={onCancelarAgendamento}
        onImprimirAgendamento={onImprimirAgendamento}
      />
    </Modal>
  );
}
