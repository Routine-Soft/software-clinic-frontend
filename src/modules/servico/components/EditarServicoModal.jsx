import { useState } from 'react';
import Modal from '@/components/Modal/Modal';
import ModalForm from '@/components/Modal/ModalForm';

export default function EditarServicoModal({ servico, erro, onSave, onClose }) {
  const [formEdicao, setFormEdicao] = useState({
    nome: servico.nome,
    tipo: servico.tipo,
    qtdDias: servico.qtdDias ?? '',
    preco: servico.preco,
  });

  function handleChangeEdicao(field, value) {
    setFormEdicao({ ...formEdicao, [field]: value });
  }

  function montarPayload() {
    return {
      nome: formEdicao.nome,
      tipo: formEdicao.tipo,
      preco: Number(formEdicao.preco),
      qtdDias: formEdicao.tipo === 'pacote' ? Number(formEdicao.qtdDias) : null,
    };
  }

  return (
    <Modal title="Editar serviço" onClose={onClose}>
      {(fechar) => (
        <ModalForm erro={erro} fechar={fechar} onSubmit={() => onSave(servico._id, montarPayload())}>
          <div className="field">
            <label className="field__label" htmlFor="editar-servico-nome">Nome</label>
            <input
              id="editar-servico-nome"
              className="input"
              type="text"
              value={formEdicao.nome}
              onChange={(e) => handleChangeEdicao('nome', e.target.value)}
              placeholder="Ex: Consulta de rotina, Pacote de fisioterapia"
              required
            />
          </div>

          <div className="modal-form__row">
            <div className="field">
              <label className="field__label" htmlFor="editar-servico-tipo">Tipo</label>
              <select
                id="editar-servico-tipo"
                className="input"
                value={formEdicao.tipo}
                onChange={(e) => handleChangeEdicao('tipo', e.target.value)}
              >
                <option value="consulta">Consulta</option>
                <option value="pacote">Pacote</option>
              </select>
            </div>

            {formEdicao.tipo === 'pacote' && (
              <div className="field field--reveal">
                <label className="field__label" htmlFor="editar-servico-dias">Quantidade de dias</label>
                <input
                  id="editar-servico-dias"
                  className="input"
                  type="number"
                  min="1"
                  value={formEdicao.qtdDias}
                  onChange={(e) => handleChangeEdicao('qtdDias', e.target.value)}
                  required
                />
              </div>
            )}
          </div>

          <div className="field">
            <label className="field__label" htmlFor="editar-servico-preco">Preço</label>
            <div className="input-group">
              <span className="input-group__prefix">R$</span>
              <input
                id="editar-servico-preco"
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
