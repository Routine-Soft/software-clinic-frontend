import { useState } from 'react';
import Modal from '@/components/Modal/Modal';
import ModalForm from '@/components/Modal/ModalForm';
import { recursosDoTexto } from '../plano.utils';
import { tr } from '@/i18n';

export default function EditarPlanoModal({ plano, erro, onSave, onClose }) {
  const [formEdicao, setFormEdicao] = useState({
    nome: plano.nome,
    tipo: plano.tipo,
    preco: plano.preco,
    duracaoDiasTrial: plano.duracaoDiasTrial ?? '',
    individual: plano.individual === true,
    descricao: plano.descricao ?? '',
    recursos: (plano.recursos ?? []).join('\n'),
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
      individual: formEdicao.tipo === 'pago' && formEdicao.individual,
      descricao: formEdicao.descricao.trim(),
      recursos: recursosDoTexto(formEdicao.recursos),
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
              <div className="field">
                <label className="field__label" htmlFor="editar-plano-recursos">{tr('O que o plano inclui (um por linha)')}</label>
                <textarea
                  id="editar-plano-recursos"
                  className="input textarea"
                  rows={7}
                  placeholder={tr('Agenda\nProntuário eletrônico\nConvênios')}
                  value={formEdicao.recursos}
                  onChange={(e) => handleChangeEdicao('recursos', e.target.value)}
                />
                <p className="field__hint">{tr('O que um plano tem e o outro não aparece em destaque na landing.')}</p>
              </div>
            </>
          )}

          {formEdicao.tipo === 'pago' && (
            <label className="check">
              <input
                type="checkbox"
                checked={formEdicao.individual}
                onChange={(e) => handleChangeEdicao('individual', e.target.checked)}
              />
              <span>{tr('Individual: só o dono da conta usa o sistema (um profissional, sem recepção)')}</span>
            </label>
          )}
        </ModalForm>
      )}
    </Modal>
  );
}
