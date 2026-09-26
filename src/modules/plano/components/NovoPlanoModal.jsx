import { useState } from 'react';
import Modal from '@/components/Modal/Modal';
import ModalForm from '@/components/Modal/ModalForm';

const FORM_CRIAR_INICIAL = { nome: '', tipo: 'gratis', preco: '', duracaoDiasTrial: '' };

export default function NovoPlanoModal({ erro, onSave, onClose }) {
  const [formCriar, setFormCriar] = useState(FORM_CRIAR_INICIAL);

  function handleChangeCriar(field, value) {
    setFormCriar({ ...formCriar, [field]: value });
  }

  function montarPayload() {
    return {
      nome: formCriar.nome,
      tipo: formCriar.tipo,
      preco: Number(formCriar.preco) || 0,
      duracaoDiasTrial: formCriar.tipo === 'gratis' ? Number(formCriar.duracaoDiasTrial) || null : null,
    };
  }

  return (
    <Modal title="Novo plano" onClose={onClose}>
      {(fechar) => (
        <ModalForm erro={erro} fechar={fechar} submitLabel="Cadastrar plano" loadingLabel="Cadastrando..." onSubmit={() => onSave(montarPayload())}>
          <div className="field">
            <label className="field__label" htmlFor="novo-plano-nome">Nome</label>
            <input
              id="novo-plano-nome"
              className="input"
              type="text"
              value={formCriar.nome}
              onChange={(e) => handleChangeCriar('nome', e.target.value)}
              required
            />
          </div>

          <div className="modal-form__row">
            <div className="field">
              <label className="field__label" htmlFor="novo-plano-tipo">Tipo</label>
              <select id="novo-plano-tipo" className="input" value={formCriar.tipo} onChange={(e) => handleChangeCriar('tipo', e.target.value)}>
                <option value="gratis">Gratuito</option>
                <option value="pago">Pago</option>
              </select>
            </div>

            {formCriar.tipo === 'gratis' && (
              <div className="field field--reveal">
                <label className="field__label" htmlFor="novo-plano-trial">Duração do trial (dias)</label>
                <input
                  id="novo-plano-trial"
                  className="input"
                  type="number"
                  min="1"
                  value={formCriar.duracaoDiasTrial}
                  onChange={(e) => handleChangeCriar('duracaoDiasTrial', e.target.value)}
                  required
                />
              </div>
            )}
          </div>

          <div className="field">
            <label className="field__label" htmlFor="novo-plano-preco">Preço mensal</label>
            <div className="input-group">
              <span className="input-group__prefix">R$</span>
              <input
                id="novo-plano-preco"
                className="input"
                type="number"
                min="0"
                step="0.01"
                value={formCriar.preco}
                onChange={(e) => handleChangeCriar('preco', e.target.value)}
                required
              />
            </div>
          </div>
        </ModalForm>
      )}
    </Modal>
  );
}
