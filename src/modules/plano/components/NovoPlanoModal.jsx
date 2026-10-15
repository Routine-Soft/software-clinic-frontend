import { useState } from 'react';
import Modal from '@/components/Modal/Modal';
import ModalForm from '@/components/Modal/ModalForm';
import { recursosDoTexto } from '../plano.utils';

const FORM_CRIAR_INICIAL = { nome: '', tipo: 'gratis', preco: '', duracaoDiasTrial: '', individual: false, descricao: '', recursos: '' };

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
      individual: formCriar.tipo === 'pago' && formCriar.individual,
      descricao: formCriar.descricao.trim(),
      recursos: recursosDoTexto(formCriar.recursos),
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
                <option value="gratis">Teste grátis (cadastro)</option>
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

          {formCriar.tipo === 'pago' && (
            <>
              <div className="field">
                <label className="field__label" htmlFor="novo-plano-descricao">Descrição (aparece na landing)</label>
                <input
                  id="novo-plano-descricao"
                  className="input"
                  type="text"
                  maxLength={120}
                  placeholder="Ex.: O plano para quem trabalha sozinho"
                  value={formCriar.descricao}
                  onChange={(e) => handleChangeCriar('descricao', e.target.value)}
                />
              </div>
              <div className="field">
                <label className="field__label" htmlFor="novo-plano-recursos">O que o plano inclui (um por linha)</label>
                <textarea
                  id="novo-plano-recursos"
                  className="input textarea"
                  rows={7}
                  placeholder={'Agenda\nProntuário eletrônico\nConvênios'}
                  value={formCriar.recursos}
                  onChange={(e) => handleChangeCriar('recursos', e.target.value)}
                />
                <p className="field__hint">O que um plano tem e o outro não aparece em destaque na landing.</p>
              </div>
            </>
          )}

          {formCriar.tipo === 'pago' && (
            <label className="check">
              <input
                type="checkbox"
                checked={formCriar.individual}
                onChange={(e) => handleChangeCriar('individual', e.target.checked)}
              />
              <span>Individual: só o dono da conta usa o sistema (um profissional, sem recepção)</span>
            </label>
          )}
        </ModalForm>
      )}
    </Modal>
  );
}
