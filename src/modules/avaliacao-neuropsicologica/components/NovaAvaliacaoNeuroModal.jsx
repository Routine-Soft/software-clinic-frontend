import { useState } from 'react';
import Modal from '@/components/Modal/Modal';
import ModalForm from '@/components/Modal/ModalForm';
import AvisoPreRequisito from '@/components/AvisoPreRequisito/AvisoPreRequisito';
import CampoServicoDoModulo from '@/modules/servico/components/CampoServicoDoModulo';
import { ordenarPacientes } from '@/modules/paciente/paciente.utils';
import { tr } from '@/i18n';

// Abre a avaliação com a identificação; o restante é preenchido no editor, ao longo das sessões.
export default function NovaAvaliacaoNeuroModal({ pacientes, servicos, carregando, erro, onSave, onClose }) {
  const [form, setForm] = useState({ pacienteId: '', servicoId: '', solicitante: '', finalidade: '' });
  const set = (campo, valor) => setForm((atual) => ({ ...atual, [campo]: valor }));
  const faltando = !carregando && pacientes.length === 0 ? [tr('um paciente')] : [];

  return (
    <Modal title={tr('Nova avaliação neuropsicológica')} onClose={onClose}>
      {(fechar) => (
        <ModalForm
          erro={erro}
          fechar={fechar}
          submitLabel={tr('Iniciar avaliação')}
          loadingLabel={tr('Iniciando...')}
          submitDisabled={faltando.length > 0}
          onSubmit={() => onSave({ ...form, servicoId: form.servicoId || null })}
        >
          <AvisoPreRequisito acao={tr('iniciar uma avaliação')} faltando={faltando} />

          <div className="field">
            <label className="field__label" htmlFor="neuro-nova-paciente">{tr('Paciente avaliado')}</label>
            <select id="neuro-nova-paciente" className="input" value={form.pacienteId} onChange={(e) => set('pacienteId', e.target.value)} required>
              <option value="">{tr('Selecione...')}</option>
              {ordenarPacientes(pacientes).map((p) => <option key={p._id} value={p._id}>{p.nome}</option>)}
            </select>
          </div>

          <CampoServicoDoModulo
            id="neuro-nova-servico"
            modulo="neuropsicologica"
            servicos={servicos}
            value={form.servicoId}
            onChange={(valor) => set('servicoId', valor)}
          />

          <div className="field">
            <label className="field__label" htmlFor="neuro-nova-solicitante">{tr('Solicitante')}</label>
            <input id="neuro-nova-solicitante" className="input" value={form.solicitante} onChange={(e) => set('solicitante', e.target.value)} placeholder={tr('Ex: o próprio paciente, a família, a escola, o neurologista Dr. Fulano')} />
          </div>

          <div className="field">
            <label className="field__label" htmlFor="neuro-nova-finalidade">{tr('Finalidade')}</label>
            <input id="neuro-nova-finalidade" className="input" value={form.finalidade} onChange={(e) => set('finalidade', e.target.value)} placeholder={tr('Ex: investigação de TDAH, avaliação de queixa de memória')} />
          </div>

          <p className="modal-form__hint">{tr('A avaliação fica em seu nome. Anamnese, sessões, testes e conclusão você preenche em seguida.')}</p>
        </ModalForm>
      )}
    </Modal>
  );
}
