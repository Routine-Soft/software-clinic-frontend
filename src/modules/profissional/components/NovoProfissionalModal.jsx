import { useState } from 'react';
import Modal from '@/components/Modal/Modal';
import ModalForm from '@/components/Modal/ModalForm';
import CampoUsuarioVinculado from './CampoUsuarioVinculado';
import { tr } from '@/i18n';

const FORM_CRIAR_INICIAL = { nome: '', tipoRegistro: '', numeroRegistro: '', especialidadeIds: [], usuarioId: '', exibirNaTv: true };

export default function NovoProfissionalModal({ especialidades, usuariosVinculaveis, loadingUsuarios, erro, onSave, onClose }) {
  const [formCriar, setFormCriar] = useState(FORM_CRIAR_INICIAL);

  function handleChangeCriar(field, value) {
    setFormCriar({ ...formCriar, [field]: value });
  }

  function toggleEspecialidade(id) {
    const jaTem = formCriar.especialidadeIds.includes(id);
    const especialidadeIds = jaTem
      ? formCriar.especialidadeIds.filter((e) => e !== id)
      : [...formCriar.especialidadeIds, id];
    setFormCriar({ ...formCriar, especialidadeIds });
  }

  function handleUsuarioChange(usuarioId) {
    const usuario = usuariosVinculaveis.find((u) => u._id === usuarioId);
    setFormCriar({ ...formCriar, usuarioId, nome: usuario ? usuario.nomeCompleto : formCriar.nome });
  }

  return (
    <Modal title={tr('Novo profissional')} onClose={onClose}>
      {(fechar) => (
        <ModalForm
          erro={erro}
          fechar={fechar}
          submitLabel={tr('Cadastrar profissional')}
          loadingLabel={tr('Cadastrando...')}
          submitDisabled={formCriar.especialidadeIds.length === 0}
          onSubmit={() => onSave({ ...formCriar, usuarioId: formCriar.usuarioId || null })}
        >
          <CampoUsuarioVinculado
            id="novo-profissional-usuario"
            usuarios={usuariosVinculaveis}
            valor={formCriar.usuarioId}
            onChange={handleUsuarioChange}
            loading={loadingUsuarios}
          />

          <div className="field">
            <label className="field__label" htmlFor="novo-profissional-nome">{tr('Nome')}</label>
            <input
              id="novo-profissional-nome"
              className="input"
              type="text"
              value={formCriar.nome}
              onChange={(e) => handleChangeCriar('nome', e.target.value)}
              disabled={!!formCriar.usuarioId}
              required
            />
          </div>

          <div className="modal-form__row">
            <div className="field">
              <label className="field__label" htmlFor="novo-profissional-tipo">{tr('Tipo de Registro')}</label>
              <input
                id="novo-profissional-tipo"
                className="input"
                type="text"
                value={formCriar.tipoRegistro}
                onChange={(e) => handleChangeCriar('tipoRegistro', e.target.value)}
                placeholder={tr('Ex: CRM, CRO, CREFITO')}
                required
              />
            </div>

            <div className="field">
              <label className="field__label" htmlFor="novo-profissional-numero">{tr('Número do Registro')}</label>
              <input
                id="novo-profissional-numero"
                className="input"
                type="text"
                value={formCriar.numeroRegistro}
                onChange={(e) => handleChangeCriar('numeroRegistro', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="field">
            <span className="field__label">{tr('Especialidades')}</span>
            {especialidades.length > 0 ? (
              <div className="check-list">
                {especialidades.map((especialidade) => (
                  <label key={especialidade._id} className="check">
                    <input
                      type="checkbox"
                      checked={formCriar.especialidadeIds.includes(especialidade._id)}
                      onChange={() => toggleEspecialidade(especialidade._id)}
                    />
                    {especialidade.nome}
                  </label>
                ))}
              </div>
            ) : (
              <p className="modal-form__hint">{tr('Nenhuma especialidade cadastrada ainda. Cadastre uma antes de criar um profissional.')}</p>
            )}
          </div>

          <label className="check">
            <input
              type="checkbox"
              checked={formCriar.exibirNaTv}
              onChange={(e) => handleChangeCriar('exibirNaTv', e.target.checked)}
            />
            {tr('Mostrar o nome do profissional na TV da sala de espera')}
          </label>
        </ModalForm>
      )}
    </Modal>
  );
}
