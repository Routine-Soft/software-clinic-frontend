import { useState } from 'react';
import Modal from '@/components/Modal/Modal';
import ModalForm from '@/components/Modal/ModalForm';

export default function EditarProfissionalModal({ profissional, especialidades, usuariosProfissionais, erro, onSave, onClose }) {
  const [formEdicao, setFormEdicao] = useState({
    nome: profissional.usuarioId?.nomeCompleto ?? profissional.nome,
    tipoRegistro: profissional.tipoRegistro,
    numeroRegistro: profissional.numeroRegistro,
    especialidadeIds: (profissional.especialidadeIds ?? []).map((e) => e._id ?? e),
    usuarioId: profissional.usuarioId?._id ?? profissional.usuarioId ?? '',
  });

  function handleChangeEdicao(field, value) {
    setFormEdicao({ ...formEdicao, [field]: value });
  }

  function toggleEspecialidade(id) {
    const jaTem = formEdicao.especialidadeIds.includes(id);
    const especialidadeIds = jaTem
      ? formEdicao.especialidadeIds.filter((e) => e !== id)
      : [...formEdicao.especialidadeIds, id];
    setFormEdicao({ ...formEdicao, especialidadeIds });
  }

  function handleUsuarioChange(usuarioId) {
    const usuario = usuariosProfissionais.find((u) => u._id === usuarioId);
    setFormEdicao({ ...formEdicao, usuarioId, nome: usuario ? usuario.nomeCompleto : formEdicao.nome });
  }

  function montarPayload() {
    return { ...formEdicao, usuarioId: formEdicao.usuarioId || null };
  }

  return (
    <Modal title="Editar profissional" onClose={onClose}>
      {(fechar) => (
        <ModalForm
          erro={erro}
          fechar={fechar}
          onSubmit={() => onSave(profissional._id, montarPayload())}
          submitDisabled={formEdicao.especialidadeIds.length === 0}
        >
          {usuariosProfissionais.length > 0 && (
            <div className="field">
              <label className="field__label" htmlFor="editar-profissional-usuario">Usuário vinculado (opcional)</label>
              <select
                id="editar-profissional-usuario"
                className="input"
                value={formEdicao.usuarioId}
                onChange={(e) => handleUsuarioChange(e.target.value)}
              >
                <option value="">Nenhum</option>
                {usuariosProfissionais.map((usuario) => (
                  <option key={usuario._id} value={usuario._id}>{usuario.nomeCompleto} ({usuario.email})</option>
                ))}
              </select>
            </div>
          )}

          <div className="field">
            <label className="field__label" htmlFor="editar-profissional-nome">Nome</label>
            <input
              id="editar-profissional-nome"
              className="input"
              type="text"
              value={formEdicao.nome}
              onChange={(e) => handleChangeEdicao('nome', e.target.value)}
              disabled={!!formEdicao.usuarioId}
              required
            />
          </div>

          <div className="modal-form__row">
            <div className="field">
              <label className="field__label" htmlFor="editar-profissional-tipo">Tipo de Registro</label>
              <input
                id="editar-profissional-tipo"
                className="input"
                type="text"
                value={formEdicao.tipoRegistro}
                onChange={(e) => handleChangeEdicao('tipoRegistro', e.target.value)}
                placeholder="Ex: CRM, CRO, CREFITO"
                required
              />
            </div>

            <div className="field">
              <label className="field__label" htmlFor="editar-profissional-numero">Número do Registro</label>
              <input
                id="editar-profissional-numero"
                className="input"
                type="text"
                value={formEdicao.numeroRegistro}
                onChange={(e) => handleChangeEdicao('numeroRegistro', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="field">
            <span className="field__label">Especialidades</span>
            {especialidades.length > 0 ? (
              <div className="check-list">
                {especialidades.map((especialidade) => (
                  <label key={especialidade._id} className="check">
                    <input
                      type="checkbox"
                      checked={formEdicao.especialidadeIds.includes(especialidade._id)}
                      onChange={() => toggleEspecialidade(especialidade._id)}
                    />
                    {especialidade.nome}
                  </label>
                ))}
              </div>
            ) : (
              <p className="modal-form__hint">Nenhuma especialidade cadastrada ainda.</p>
            )}
          </div>
        </ModalForm>
      )}
    </Modal>
  );
}
