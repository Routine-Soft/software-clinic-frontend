import { useState } from 'react';
import Modal from '@/components/Modal/Modal';
import ModalForm from '@/components/Modal/ModalForm';
import PacientePicker from '@/modules/paciente/components/PacientePicker';
import { useAuthContext } from '@/hooks/useAuthContext';
import { useDadosEnvio } from '../termo.hooks';
import CompartilharTermo from './CompartilharTermo';
import { tr } from '@/i18n';

// Escolhe paciente, modelo e profissional e cria o termo. Depois, mostra como mandar o link.
export default function EnviarTermoModal({ modelos, pacienteInicialId, erro, onEnviar, onClose }) {
  const { user } = useAuthContext();
  const dados = useDadosEnvio();
  const [pacienteEscolhido, setPacienteEscolhido] = useState(null);
  const [modeloId, setModeloId] = useState(modelos.length === 1 ? modelos[0]._id : '');
  const [profissionalEscolhido, setProfissionalEscolhido] = useState(null);
  const [criado, setCriado] = useState(null);

  // Vindo da lista de pacientes, já começa com o paciente escolhido (até a pessoa trocar).
  const paciente = pacienteEscolhido === null
    ? dados.pacientes.find((p) => p._id === pacienteInicialId) ?? null
    : pacienteEscolhido || null;
  // O profissional logado já vem marcado como responsável pelo termo.
  const profissionalId = profissionalEscolhido ?? (dados.profissionais.find((p) => String(p.usuarioId ?? '') === String(user?._id ?? user?.id ?? ''))?._id ?? '');

  async function enviar() {
    const termo = await onEnviar({ pacienteId: paciente._id, modeloId, profissionalId: profissionalId || null });
    if (termo) setCriado(termo);
    return false;
  }

  return (
    <Modal title={criado ? tr('Termo pronto para assinar') : tr('Enviar termo de consentimento')} onClose={onClose} wide>
      {(fechar) => criado ? (
        <div className="modal-form">
          <p className="alert alert--success" role="status">
            {tr('O termo "{titulo}" foi criado para {nome}. Agora mande o link para a assinatura:', { titulo: criado.titulo, nome: criado.pacienteId?.nome })}
          </p>
          <CompartilharTermo termo={criado} clinica={user?.nomeEmpresa} />
          <div className="modal__footer">
            <button type="button" className="btn btn--primary" onClick={fechar}>{tr('Concluir')}</button>
          </div>
        </div>
      ) : (
        <>
          <PacientePicker
            pacientes={dados.pacientes}
            convenios={dados.convenios}
            empresas={dados.empresas}
            valor={paciente}
            onChange={(p) => setPacienteEscolhido(p ?? false)}
            onCriarPaciente={dados.criarPaciente}
          />

          <ModalForm
            erro={erro}
            fechar={fechar}
            submitLabel={tr('Criar link de assinatura')}
            loadingLabel={tr('Criando...')}
            submitDisabled={!paciente || !modeloId}
            onSubmit={enviar}
          >
            <div className="modal-form__row">
              <div className="field">
                <label className="field__label" htmlFor="enviar-modelo">{tr('Termo')}</label>
                <select id="enviar-modelo" className="input" value={modeloId} onChange={(e) => setModeloId(e.target.value)} required>
                  <option value="">{tr('Escolha o termo')}</option>
                  {modelos.map((m) => <option key={m._id} value={m._id}>{m.titulo}</option>)}
                </select>
              </div>
              <div className="field">
                <label className="field__label" htmlFor="enviar-profissional">{tr('Profissional (opcional)')}</label>
                <select id="enviar-profissional" className="input" value={profissionalId} onChange={(e) => setProfissionalEscolhido(e.target.value)}>
                  <option value="">{tr('Nenhum')}</option>
                  {dados.profissionais.map((p) => <option key={p._id} value={p._id}>{p.nome}</option>)}
                </select>
              </div>
            </div>
            <p className="modal-form__hint">{tr('O texto é preenchido com os dados do paciente e do profissional. O link vale por 30 dias.')}</p>
          </ModalForm>
        </>
      )}
    </Modal>
  );
}
