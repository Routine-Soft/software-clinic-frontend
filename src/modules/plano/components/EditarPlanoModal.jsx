import { useState } from 'react';
import Modal from '@/components/Modal/Modal';
import ModalForm from '@/components/Modal/ModalForm';
import { tr } from '@/i18n';
import { NIVEIS_DO_PLANO } from '../plano.utils';

export default function EditarPlanoModal({ plano, erro, onSave, onClose }) {
  const [formEdicao, setFormEdicao] = useState({
    nome: plano.nome,
    tipo: plano.tipo,
    preco: plano.preco,
    duracaoDiasTrial: plano.duracaoDiasTrial ?? '',
    nivel: plano.nivel ?? 'pro',
    descricao: plano.descricao ?? '',
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
      nivel: formEdicao.nivel,
      descricao: formEdicao.descricao.trim(),
    };
  }

  return (
    <Modal title={tr('Editar plano')} onClose={onClose}>
      {(fechar) => (
        <ModalForm erro={erro} fechar={fechar} onSubmit={() => onSave(plano._id, montarPayload())}>
          <div className="field">
            <label className="field__label" htmlFor="editar-plano-nome">{tr('Nome')}</label>
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
              <label className="field__label" htmlFor="editar-plano-tipo">{tr('Tipo')}</label>
              <select id="editar-plano-tipo" className="input" value={formEdicao.tipo} disabled>
                <option value="gratis">{tr('Teste grátis (cadastro)')}</option>
                <option value="pago">{tr('Pago')}</option>
              </select>
            </div>

            {formEdicao.tipo === 'gratis' && (
              <div className="field">
                <label className="field__label" htmlFor="editar-plano-trial">{tr('Duração do trial (dias)')}</label>
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
            <label className="field__label" htmlFor="editar-plano-preco">{tr('Preço mensal')}</label>
            <div className="input-group">
              <span className="input-group__prefix">{plano.moeda === 'USD' ? 'US$' : 'R$'}</span>
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

          {formEdicao.tipo === 'pago' && (
            <>
              <div className="field">
                <label className="field__label" htmlFor="editar-plano-descricao">{tr('Descrição (aparece na landing)')}</label>
                <input
                  id="editar-plano-descricao"
                  className="input"
                  type="text"
                  maxLength={120}
                  placeholder={tr('Ex.: O plano para quem trabalha sozinho')}
                  value={formEdicao.descricao}
                  onChange={(e) => handleChangeEdicao('descricao', e.target.value)}
                />
              </div>
            </>
          )}

          {formEdicao.tipo === 'pago' && (
            <div className="field">
              <label className="field__label" htmlFor="editar-plano-nivel">{tr('Nível do plano')}</label>
              <select id="editar-plano-nivel" className="input" value={formEdicao.nivel} onChange={(e) => handleChangeEdicao('nivel', e.target.value)}>
                {NIVEIS_DO_PLANO.map(([valor, rotulo]) => <option key={valor} value={valor}>{rotulo}</option>)}
              </select>
              <p className="field__hint">{tr('Define os limites e os recursos (ver a página de preços).')}</p>
            </div>
          )}
        </ModalForm>
      )}
    </Modal>
  );
}
