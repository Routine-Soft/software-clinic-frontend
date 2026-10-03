import { useState } from 'react';
import Modal from '@/components/Modal/Modal';
import ModalForm from '@/components/Modal/ModalForm';
import ServicoCampos from './ServicoCampos';
import { formularioDoServico, montarPayloadServico, problemaDoFormulario, MODELOS_SERVICO } from '../servico.form';

// `modeloInicial` abre já preenchido (ex.: vindo do aviso da tela de avaliação).
export default function NovoServicoModal({ convenios, erro, onSave, onClose, modeloInicial = null }) {
  const [form, setForm] = useState(() => ({ ...formularioDoServico(), ...(MODELOS_SERVICO.find((m) => m.chave === modeloInicial)?.dados ?? {}) }));
  const [modelo, setModelo] = useState(modeloInicial);
  const dicaModelo = MODELOS_SERVICO.find((m) => m.chave === modelo)?.dica;

  function usarModelo(chave) {
    const escolhido = MODELOS_SERVICO.find((m) => m.chave === chave);
    setModelo(chave);
    setForm((atual) => ({ ...atual, ...escolhido.dados }));
  }
  const problema = problemaDoFormulario(form);

  return (
    <Modal title="Novo serviço" wide onClose={onClose}>
      {(fechar) => (
        <ModalForm
          erro={erro}
          fechar={fechar}
          submitLabel="Cadastrar serviço"
          loadingLabel="Cadastrando..."
          submitDisabled={!!problema}
          onSubmit={() => onSave(montarPayloadServico(form))}
        >
          <div className="servico-modelos">
            <span className="field__label">Começar de um modelo</span>
            <div className="servico-modelos__lista">
              {MODELOS_SERVICO.map((m) => (
                <button key={m.chave} type="button" className="btn btn--ghost btn--sm" aria-pressed={modelo === m.chave} onClick={() => usarModelo(m.chave)}>
                  {m.rotulo}
                </button>
              ))}
            </div>
            {dicaModelo && <p className="field__hint">{dicaModelo} Só falta o preço.</p>}
          </div>

          <ServicoCampos form={form} setForm={setForm} convenios={convenios} />
          {problema && <p className="modal-form__hint modal-form__hint--erro">{problema}</p>}
        </ModalForm>
      )}
    </Modal>
  );
}
