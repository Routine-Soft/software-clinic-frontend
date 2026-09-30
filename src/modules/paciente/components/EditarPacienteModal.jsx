import { useState } from 'react';
import Modal from '@/components/Modal/Modal';
import ModalForm from '@/components/Modal/ModalForm';
import { normalizarEmail } from '@/utils/email';

export default function EditarPacienteModal({ paciente, convenios, empresas, erro, onSave, onClose }) {
  const [formEdicao, setFormEdicao] = useState({
    nome: paciente.nome,
    telefone: paciente.telefone,
    email: paciente.email,
    cpf: paciente.cpf,
    dataNascimento: paciente.dataNascimento ? paciente.dataNascimento.substring(0, 10) : '',
    convenioId: paciente.convenioId?._id ?? paciente.convenioId ?? '',
    empresaId: paciente.empresaId?._id ?? paciente.empresaId ?? '',
  });

  function handleChangeEdicao(field, value) {
    setFormEdicao({ ...formEdicao, [field]: value });
  }

  function montarPayload() {
    return {
      ...formEdicao,
      convenioId: formEdicao.convenioId || null,
      empresaId: formEdicao.empresaId || null,
    };
  }

  return (
    <Modal title="Editar paciente" onClose={onClose}>
      {(fechar) => (
        <ModalForm erro={erro} fechar={fechar} onSubmit={() => onSave(paciente._id, montarPayload())}>
          <div className="field">
            <label className="field__label" htmlFor="editar-paciente-nome">Nome</label>
            <input
              id="editar-paciente-nome"
              className="input"
              type="text"
              value={formEdicao.nome}
              onChange={(e) => handleChangeEdicao('nome', e.target.value)}
              required
            />
          </div>

          <div className="modal-form__row">
            <div className="field">
              <label className="field__label" htmlFor="editar-paciente-telefone">Telefone</label>
              <input
                id="editar-paciente-telefone"
                className="input"
                type="text"
                value={formEdicao.telefone}
                onChange={(e) => handleChangeEdicao('telefone', e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label className="field__label" htmlFor="editar-paciente-email">Email</label>
              <input
                id="editar-paciente-email"
                className="input"
                type="email"
                value={formEdicao.email}
                onChange={(e) => handleChangeEdicao('email', normalizarEmail(e.target.value))}
                required
              />
            </div>
          </div>

          <div className="modal-form__row">
            <div className="field">
              <label className="field__label" htmlFor="editar-paciente-cpf">CPF</label>
              <input
                id="editar-paciente-cpf"
                className="input"
                type="text"
                value={formEdicao.cpf}
                onChange={(e) => handleChangeEdicao('cpf', e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label className="field__label" htmlFor="editar-paciente-nascimento">Data de Nascimento</label>
              <input
                id="editar-paciente-nascimento"
                className="input"
                type="date"
                value={formEdicao.dataNascimento}
                onChange={(e) => handleChangeEdicao('dataNascimento', e.target.value)}
                required
              />
            </div>
          </div>

          {(convenios.length > 0 || empresas.length > 0) && (
            <div className="modal-form__row">
              {convenios.length > 0 && (
                <div className="field">
                  <label className="field__label" htmlFor="editar-paciente-convenio">Convênio</label>
                  <select
                    id="editar-paciente-convenio"
                    className="input"
                    value={formEdicao.convenioId}
                    onChange={(e) => handleChangeEdicao('convenioId', e.target.value)}
                  >
                    <option value="">Particular</option>
                    {convenios.map((convenio) => (
                      <option key={convenio._id} value={convenio._id}>{convenio.nome}</option>
                    ))}
                  </select>
                </div>
              )}

              {empresas.length > 0 && (
                <div className="field">
                  <label className="field__label" htmlFor="editar-paciente-empresa">Empresa (funcionário)</label>
                  <select
                    id="editar-paciente-empresa"
                    className="input"
                    value={formEdicao.empresaId}
                    onChange={(e) => handleChangeEdicao('empresaId', e.target.value)}
                  >
                    <option value="">Nenhuma</option>
                    {empresas.map((empresa) => (
                      <option key={empresa._id} value={empresa._id}>{empresa.razaoSocial}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}
        </ModalForm>
      )}
    </Modal>
  );
}
