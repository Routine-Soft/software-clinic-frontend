import { useState } from 'react';
import Modal from '@/components/Modal/Modal';
import ModalForm from '@/components/Modal/ModalForm';

export default function EditarPlanoModal({ plano, erro, onSave, onClose }) {
  const [formEdicao, setFormEdicao] = useState({
    nome: plano.nome,
    tipo: plano.tipo,
    preco: plano.preco,
    duracaoDiasTrial: plano.duracaoDiasTrial ?? '',
  });

  function handleChangeEdicao(field, value) {
    setFormEdicao({ ...formEdicao, [field]: value });
  }

  function montarPayload() {
    return {
      nome: formEdicao.nome,
      tipo: formEdicao.tipo,
      preco: Number(formEdicao.preco) || 0,
      duracaoDiasTrial: formEdicao.tipo === 'gratis' ? Number(formEdicao.duracaoDiasTrial) || null : null,
    };
  }

  return (
    <Modal title="Editar plano" onClose={onClose}>
      {(fechar) => (
        <ModalForm erro={erro} fechar={fechar} onSubmit={() => onSave(plano._id, montarPayload())}>
          <div className="field">
            <label className="field__label" htmlFor="editar-plano-nome">Nome</label>
            <input
              id="editar-plano-nome"
              className="input"
              type="text"
              value={formEdicao.nome}
              onChange={(e) => handleChangeEdicao('nome', e.target.value)}
              required
            />
          </div>

          <div className="modal-form__row">
            <div className="field">
              <label className="field__label" htmlFor="editar-plano-tipo">Tipo</label>
              <select id="editar-plano-tipo" className="input" value={formEdicao.tipo} disabled>
                <option value="gratis">Gratuito</option>
                <option value="pago">Pago</option>
              </select>
            </div>

            {formEdicao.tipo === 'gratis' && (
              <div className="field">
                <label className="field__label" htmlFor="editar-plano-trial">Duração do trial (dias)</label>
                <input
                  id="editar-plano-trial"
                  className="input"
                  type="number"
                  min="1"
                  value={formEdicao.duracaoDiasTrial}
                  onChange={(e) => handleChangeEdicao('duracaoDiasTrial', e.target.value)}
                  required
                />
              </div>
            )}
          </div>

          <div className="field">
            <label className="field__label" htmlFor="editar-plano-preco">Preço mensal</label>
            <div className="input-group">
              <span className="input-group__prefix">R$</span>
              <input
                id="editar-plano-preco"
                className="input"
                type="number"
                min="0"
                step="0.01"
                value={formEdicao.preco}
                onChange={(e) => handleChangeEdicao('preco', e.target.value)}
                required
              />
            </div>
          </div>
        </ModalForm>
      )}
    </Modal>
  );
}
