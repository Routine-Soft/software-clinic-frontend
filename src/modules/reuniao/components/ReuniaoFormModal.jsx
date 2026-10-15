import { useId, useState } from 'react';
import Modal from '@/components/Modal/Modal';
import ModalForm from '@/components/Modal/ModalForm';
import { horarioInvalido, somarMinutos } from '@/modules/agenda/agendamento.form';
import { DURACAO_PADRAO_REUNIAO, formularioDaReuniao, formularioNovaReuniao } from '../reuniao.utils';

// Criar (com `slotInicial`) ou editar (com `reuniao`). Só o essencial: com quem, quando e um assunto.
export default function ReuniaoFormModal({ reuniao, slotInicial, erro, onSave, onClose }) {
  const id = useId();
  const [form, setForm] = useState(() => (reuniao ? formularioDaReuniao(reuniao) : formularioNovaReuniao(slotInicial)));

  function set(campo, valor) {
    setForm((atual) => ({ ...atual, [campo]: valor }));
  }

  function handleHoraInicio(valor) {
    setForm((atual) => ({ ...atual, horaInicio: valor, horaFim: somarMinutos(valor, DURACAO_PADRAO_REUNIAO) }));
  }

  return (
    <Modal title={reuniao ? 'Editar reunião' : 'Nova reunião'} onClose={onClose}>
      {(fechar) => (
        <ModalForm
          erro={erro}
          fechar={fechar}
          submitLabel={reuniao ? 'Salvar alterações' : 'Agendar reunião'}
          loadingLabel={reuniao ? 'Salvando...' : 'Agendando...'}
          submitDisabled={horarioInvalido(form)}
          onSubmit={() => onSave(form)}
        >
          <div className="field">
            <label className="field__label" htmlFor={`${id}-nome`}>Com quem</label>
            <input id={`${id}-nome`} className="input" type="text" value={form.nome} onChange={(e) => set('nome', e.target.value)} placeholder="Nome do cliente" required />
          </div>

          <div className="field">
            <label className="field__label" htmlFor={`${id}-telefone`}>Telefone (opcional)</label>
            <input id={`${id}-telefone`} className="input" type="tel" value={form.telefone} onChange={(e) => set('telefone', e.target.value)} placeholder="(21) 99999-9999" />
          </div>

          <div className="agendamento-quando">
            <div className="field">
              <label className="field__label" htmlFor={`${id}-data`}>Data</label>
              <input id={`${id}-data`} className="input" type="date" value={form.data} onChange={(e) => set('data', e.target.value)} required />
            </div>

            <div className="field">
              <label className="field__label" htmlFor={`${id}-inicio`}>Início</label>
              <input id={`${id}-inicio`} className="input" type="time" value={form.horaInicio} onChange={(e) => handleHoraInicio(e.target.value)} required />
            </div>

            <div className="field">
              <label className="field__label" htmlFor={`${id}-fim`}>Fim</label>
              <input id={`${id}-fim`} className="input" type="time" value={form.horaFim} onChange={(e) => set('horaFim', e.target.value)} required />
            </div>
          </div>
          {horarioInvalido(form) && <p className="modal-form__hint modal-form__hint--erro">O horário final precisa ser depois do inicial.</p>}

          <div className="field">
            <label className="field__label" htmlFor={`${id}-obs`}>Assunto / observações (opcional)</label>
            <textarea id={`${id}-obs`} className="textarea" rows={3} value={form.observacoes} onChange={(e) => set('observacoes', e.target.value)} placeholder="Ex.: conhecer o espaço e os pacotes" />
          </div>
        </ModalForm>
      )}
    </Modal>
  );
}
