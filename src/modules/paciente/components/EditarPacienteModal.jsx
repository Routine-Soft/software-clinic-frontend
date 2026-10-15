import { useState } from 'react';
import Modal from '@/components/Modal/Modal';
import ModalForm from '@/components/Modal/ModalForm';
import { normalizarEmail } from '@/utils/email';
import CamposResponsaveis from './CamposResponsaveis';
import CampoNomeNaTv from './CampoNomeNaTv';
import { ehMenorDeIdade, opcaoNomeNaTv } from '../paciente.utils';
import CampoAceitaWhatsapp from './CampoAceitaWhatsapp';
import { tr } from '@/i18n';

export default function EditarPacienteModal({ paciente, convenios, empresas, erro, onSave, onClose }) {
  const [formEdicao, setFormEdicao] = useState({
    nome: paciente.nome,
    telefone: paciente.telefone,
    email: paciente.email,
    cpf: paciente.cpf,
    dataNascimento: paciente.dataNascimento ? paciente.dataNascimento.substring(0, 10) : '',
    convenioId: paciente.convenioId?._id ?? paciente.convenioId ?? '',
    empresaId: paciente.empresaId?._id ?? paciente.empresaId ?? '',
    responsaveis: paciente.responsaveis ?? [],
    nomeNaTv: opcaoNomeNaTv(paciente.nomeNaTv),
    aceitaWhatsapp: !!paciente.aceitaWhatsapp,
  });

  const menor = ehMenorDeIdade(formEdicao.dataNascimento);

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
    <Modal title={tr('Editar paciente')} onClose={onClose}>
      {(fechar) => (
        <ModalForm erro={erro} fechar={fechar} onSubmit={() => onSave(paciente._id, montarPayload())}>
          <div className="field">
            <label className="field__label" htmlFor="editar-paciente-nome">{tr('Nome')}</label>
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
              <label className="field__label" htmlFor="editar-paciente-telefone">{tr('Telefone{p0}', { p0: menor && tr(' (opcional)') })}</label>
              <input
                id="editar-paciente-telefone"
                className="input"
                type="text"
                value={formEdicao.telefone}
                onChange={(e) => handleChangeEdicao('telefone', e.target.value)}
                required={!menor}
              />
            </div>

            <div className="field">
              <label className="field__label" htmlFor="editar-paciente-email">{tr('Email{p0}', { p0: menor && tr(' (opcional)') })}</label>
              <input
                id="editar-paciente-email"
                className="input"
                type="email"
                value={formEdicao.email}
                onChange={(e) => handleChangeEdicao('email', normalizarEmail(e.target.value))}
                required={!menor}
              />
            </div>
          </div>

          <div className="modal-form__row">
            <div className="field">
              <label className="field__label" htmlFor="editar-paciente-cpf">{tr('CPF (opcional)')}</label>
              <input
                id="editar-paciente-cpf"
                className="input"
                type="text"
                value={formEdicao.cpf}
                onChange={(e) => handleChangeEdicao('cpf', e.target.value)}
              />
            </div>

            <div className="field">
              <label className="field__label" htmlFor="editar-paciente-nascimento">{tr('Data de Nascimento')}</label>
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

          <CamposResponsaveis responsaveis={formEdicao.responsaveis} menor={menor} onChange={(lista) => handleChangeEdicao('responsaveis', lista)} />

          {(convenios.length > 0 || empresas.length > 0) && (
            <div className="modal-form__row">
              {convenios.length > 0 && (
                <div className="field">
                  <label className="field__label" htmlFor="editar-paciente-convenio">{tr('Convênio')}</label>
                  <select
                    id="editar-paciente-convenio"
                    className="input"
                    value={formEdicao.convenioId}
                    onChange={(e) => handleChangeEdicao('convenioId', e.target.value)}
                  >
                    <option value="">{tr('Nenhum')}</option>
                    {convenios.map((convenio) => (
                      <option key={convenio._id} value={convenio._id}>{convenio.nome}</option>
                    ))}
                  </select>
                </div>
              )}

              {empresas.length > 0 && (
                <div className="field">
                  <label className="field__label" htmlFor="editar-paciente-empresa">{tr('Empresa (funcionário)')}</label>
                  <select
                    id="editar-paciente-empresa"
                    className="input"
                    value={formEdicao.empresaId}
                    onChange={(e) => handleChangeEdicao('empresaId', e.target.value)}
                  >
                    <option value="">{tr('Nenhuma')}</option>
                    {empresas.map((empresa) => (
                      <option key={empresa._id} value={empresa._id}>{empresa.razaoSocial}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}

          <CampoNomeNaTv nome={formEdicao.nome} valor={formEdicao.nomeNaTv} onChange={(valor) => handleChangeEdicao('nomeNaTv', valor)} />

          <CampoAceitaWhatsapp valor={formEdicao.aceitaWhatsapp} onChange={(valor) => handleChangeEdicao('aceitaWhatsapp', valor)} />
        </ModalForm>
      )}
    </Modal>
  );
}
