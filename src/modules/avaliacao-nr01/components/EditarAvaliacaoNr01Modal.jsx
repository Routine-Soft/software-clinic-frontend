import { useState } from 'react';
import Modal from '@/components/Modal/Modal';
import CampoServicoDoModulo from '@/modules/servico/components/CampoServicoDoModulo';
import ModalForm from '@/components/Modal/ModalForm';
import { tr } from '@/i18n';

export default function EditarAvaliacaoNr01Modal({ avaliacao, empresas, pacientes, profissionais, servicos = [], perguntasPadrao, hoje, erro, onSave, onClose }) {
  const [formEdicao, setFormEdicao] = useState({
    empresaId: avaliacao.empresaId?._id ?? avaliacao.empresaId ?? '',
    pacienteId: avaliacao.pacienteId?._id ?? avaliacao.pacienteId ?? '',
    servicoId: avaliacao.servicoId?._id ?? avaliacao.servicoId ?? '',
    profissionalId: avaliacao.profissionalId?._id ?? avaliacao.profissionalId ?? '',
    data: avaliacao.data ? avaliacao.data.substring(0, 10) : hoje,
    respostas: avaliacao.respostas?.length ? avaliacao.respostas : perguntasPadrao,
    classificacaoRisco: avaliacao.classificacaoRisco || '',
    recomendacoes: avaliacao.recomendacoes || '',
  });

  function handleChangeEdicao(field, value) {
    setFormEdicao({ ...formEdicao, [field]: value });
  }

  function handleItemChange(index, campo, value) {
    const respostas = [...formEdicao.respostas];
    respostas[index] = { ...respostas[index], [campo]: value };
    setFormEdicao({ ...formEdicao, respostas });
  }

  function handleAddItem() {
    setFormEdicao({ ...formEdicao, respostas: [...formEdicao.respostas, { pergunta: '', resposta: '' }] });
  }

  function handleRemoveItem(index) {
    setFormEdicao({ ...formEdicao, respostas: formEdicao.respostas.filter((_, i) => i !== index) });
  }

  function montarPayload() {
    return {
      ...formEdicao,
      pacienteId: formEdicao.pacienteId || null,
      servicoId: formEdicao.servicoId || null,
      classificacaoRisco: formEdicao.classificacaoRisco || null,
      respostas: formEdicao.respostas.filter((r) => r.pergunta.trim() !== ''),
    };
  }

  const pacientesDaEmpresa = formEdicao.empresaId
    ? pacientes.filter((p) => (p.empresaId?._id ?? p.empresaId) === formEdicao.empresaId)
    : pacientes;

  return (
    <Modal title={tr('Editar avaliação NR-01')} wide onClose={onClose}>
      {(fechar) => (
        <ModalForm erro={erro} fechar={fechar} onSubmit={() => onSave(avaliacao._id, montarPayload())}>
          <div className="modal-form__row">
            <div className="field">
              <label className="field__label" htmlFor="editar-nr01-empresa">{tr('Empresa')}</label>
              <select
                id="editar-nr01-empresa"
                className="input"
                value={formEdicao.empresaId}
                onChange={(e) => handleChangeEdicao('empresaId', e.target.value)}
                required
              >
                <option value="">{tr('Selecione...')}</option>
                {empresas.map((empresa) => (
                  <option key={empresa._id} value={empresa._id}>{empresa.razaoSocial}</option>
                ))}
              </select>
            </div>

            <div className="field">
              <label className="field__label" htmlFor="editar-nr01-paciente">{tr('Funcionário (opcional)')}</label>
              <select
                id="editar-nr01-paciente"
                className="input"
                value={formEdicao.pacienteId}
                onChange={(e) => handleChangeEdicao('pacienteId', e.target.value)}
              >
                <option value="">{tr('Avaliação geral da empresa')}</option>
                {pacientesDaEmpresa.map((paciente) => (
                  <option key={paciente._id} value={paciente._id}>{paciente.nome}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="modal-form__row">
            <div className="field">
              <label className="field__label" htmlFor="editar-nr01-profissional">{tr('Profissional responsável')}</label>
              <select
                id="editar-nr01-profissional"
                className="input"
                value={formEdicao.profissionalId}
                onChange={(e) => handleChangeEdicao('profissionalId', e.target.value)}
                required
              >
                <option value="">{tr('Selecione...')}</option>
                {profissionais.map((profissional) => (
                  <option key={profissional._id} value={profissional._id}>{profissional.nome}</option>
                ))}
              </select>
            </div>

            <div className="field">
              <label className="field__label" htmlFor="editar-nr01-data">{tr('Data')}</label>
              <input
                id="editar-nr01-data"
                className="input"
                type="date"
                value={formEdicao.data}
                onChange={(e) => handleChangeEdicao('data', e.target.value)}
                required
              />
            </div>
          </div>

          <CampoServicoDoModulo
            id="editar-nr01-servico"
            modulo="nr01"
            servicos={servicos}
            value={formEdicao.servicoId}
            onChange={(valor) => handleChangeEdicao('servicoId', valor)}
          />

          <fieldset className="modal-form__section">
            <legend>{tr('Fatores de risco psicossocial avaliados')}</legend>
            {formEdicao.respostas.map((item, index) => (
              <div key={index} className="modal-form__pair">
                <input
                  className="input"
                  type="text"
                  value={item.pergunta}
                  onChange={(e) => handleItemChange(index, 'pergunta', e.target.value)}
                  placeholder={tr('Fator de risco')}
                  aria-label={tr('Fator de risco {p0}', { p0: index + 1 })}
                />
                <input
                  className="input"
                  type="text"
                  value={item.resposta}
                  onChange={(e) => handleItemChange(index, 'resposta', e.target.value)}
                  placeholder={tr('Observação (ex: alto)')}
                  aria-label={tr('Observação do fator {p0}', { p0: index + 1 })}
                />
                <button type="button" className="btn btn--danger btn--sm" onClick={() => handleRemoveItem(index)}>{tr('Remover')}</button>
              </div>
            ))}
            <div>
              <button type="button" className="btn btn--ghost btn--sm" onClick={handleAddItem}>{tr('+ Adicionar fator de risco')}</button>
            </div>
          </fieldset>

          <div className="field">
            <label className="field__label" htmlFor="editar-nr01-classificacao">{tr('Classificação geral de risco')}</label>
            <select
              id="editar-nr01-classificacao"
              className="input"
              value={formEdicao.classificacaoRisco}
              onChange={(e) => handleChangeEdicao('classificacaoRisco', e.target.value)}
            >
              <option value="">{tr('Não classificado')}</option>
              <option value="baixo">{tr('Baixo')}</option>
              <option value="medio">{tr('Médio')}</option>
              <option value="alto">{tr('Alto')}</option>
            </select>
          </div>

          <div className="field">
            <label className="field__label" htmlFor="editar-nr01-recomendacoes">{tr('Recomendações / plano de ação')}</label>
            <textarea
              id="editar-nr01-recomendacoes"
              className="input textarea"
              value={formEdicao.recomendacoes}
              onChange={(e) => handleChangeEdicao('recomendacoes', e.target.value)}
              rows={4}
            />
          </div>
        </ModalForm>
      )}
    </Modal>
  );
}
