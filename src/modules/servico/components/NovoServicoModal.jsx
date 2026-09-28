import { useState } from 'react';
import Modal from '@/components/Modal/Modal';
import ModalForm from '@/components/Modal/ModalForm';
import { dicaComissao } from '../servico.utils';

const FORM_CRIAR_INICIAL = { nome: '', tipo: 'consulta', qtdDias: '', preco: '', comissao: '' };

export default function NovoServicoModal({ erro, onSave, onClose }) {
  const [formCriar, setFormCriar] = useState(FORM_CRIAR_INICIAL);

  function handleChangeCriar(field, value) {
    setFormCriar({ ...formCriar, [field]: value });
  }

  function montarPayload() {
    return {
      nome: formCriar.nome,
      tipo: formCriar.tipo,
      preco: Number(formCriar.preco),
      comissao: Number(formCriar.comissao) || 0,
      qtdDias: formCriar.tipo === 'pacote' ? Number(formCriar.qtdDias) : null,
    };
  }

  return (
    <Modal title="Novo serviço" onClose={onClose}>
      {(fechar) => (
        <ModalForm erro={erro} fechar={fechar} submitLabel="Cadastrar serviço" loadingLabel="Cadastrando..." onSubmit={() => onSave(montarPayload())}>
          <div className="field">
            <label className="field__label" htmlFor="novo-servico-nome">Nome</label>
            <input
              id="novo-servico-nome"
              className="input"
              type="text"
              value={formCriar.nome}
              onChange={(e) => handleChangeCriar('nome', e.target.value)}
              placeholder="Ex: Consulta de rotina, Pacote de fisioterapia"
              required
            />
          </div>

          <div className="modal-form__row">
            <div className="field">
              <label className="field__label" htmlFor="novo-servico-tipo">Tipo</label>
              <select
                id="novo-servico-tipo"
                className="input"
                value={formCriar.tipo}
                onChange={(e) => handleChangeCriar('tipo', e.target.value)}
              >
                <option value="consulta">Consulta</option>
                <option value="pacote">Pacote</option>
              </select>
            </div>

            {formCriar.tipo === 'pacote' && (
              <div className="field field--reveal">
                <label className="field__label" htmlFor="novo-servico-dias">Quantidade de dias</label>
                <input
                  id="novo-servico-dias"
                  className="input"
                  type="number"
                  min="1"
                  value={formCriar.qtdDias}
                  onChange={(e) => handleChangeCriar('qtdDias', e.target.value)}
                  required
                />
              </div>
            )}
          </div>

          <div className="modal-form__row">
            <div className="field">
              <label className="field__label" htmlFor="novo-servico-preco">Preço</label>
              <div className="input-group">
                <span className="input-group__prefix">R$</span>
                <input
                  id="novo-servico-preco"
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

            <div className="field">
              <label className="field__label" htmlFor="novo-servico-comissao">Comissão do profissional</label>
              <div className="input-group">
                <span className="input-group__prefix">R$</span>
                <input
                  id="novo-servico-comissao"
                  className="input"
                  type="number"
                  min="0"
                  max={formCriar.preco || undefined}
                  step="0.01"
                  value={formCriar.comissao}
                  onChange={(e) => handleChangeCriar('comissao', e.target.value)}
                  aria-describedby="novo-servico-comissao-dica"
                />
              </div>
            </div>
          </div>
          <p id="novo-servico-comissao-dica" className="field__hint">{dicaComissao(formCriar.preco, formCriar.comissao)}</p>
        </ModalForm>
      )}
    </Modal>
  );
}
