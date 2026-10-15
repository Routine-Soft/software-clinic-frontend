import { useState } from 'react';
import Modal from '@/components/Modal/Modal';
import CampoServicoDoModulo from '@/modules/servico/components/CampoServicoDoModulo';
import ModalForm from '@/components/Modal/ModalForm';
import AvisoPreRequisito from '@/components/AvisoPreRequisito/AvisoPreRequisito';
import { tr } from '@/i18n';

export default function NovaAvaliacaoNr01Modal({ empresas, pacientes, profissionais, servicos = [], carregando = false, perguntasPadrao, hoje, erro, onSave, onClose }) {
  const faltando = carregando ? [] : [
    empresas.length === 0 && tr('uma empresa'),
    profissionais.length === 0 && tr('um profissional'),
  ].filter(Boolean);
  const soFaltaEmpresa = faltando.length === 1 && empresas.length === 0;
  const [formCriar, setFormCriar] = useState({
    empresaId: '',
    pacienteId: '',
    servicoId: '',
    profissionalId: '',
    data: hoje,
    respostas: perguntasPadrao,
    classificacaoRisco: '',
    recomendacoes: '',
  });

  function handleChangeCriar(field, value) {
    setFormCriar({ ...formCriar, [field]: value });
  }

  function handleItemChange(index, campo, value) {
    const respostas = [...formCriar.respostas];
    respostas[index] = { ...respostas[index], [campo]: value };
    setFormCriar({ ...formCriar, respostas });
  }

  function handleAddItem() {
    setFormCriar({ ...formCriar, respostas: [...formCriar.respostas, { pergunta: '', resposta: '' }] });
  }

  function handleRemoveItem(index) {
    setFormCriar({ ...formCriar, respostas: formCriar.respostas.filter((_, i) => i !== index) });
  }

  function montarPayload() {
    return {
      ...formCriar,
      pacienteId: formCriar.pacienteId || null,
      servicoId: formCriar.servicoId || null,
      classificacaoRisco: formCriar.classificacaoRisco || null,
      respostas: formCriar.respostas.filter((r) => r.pergunta.trim() !== ''),
    };
  }

  const pacientesDaEmpresa = formCriar.empresaId
    ? pacientes.filter((p) => (p.empresaId?._id ?? p.empresaId) === formCriar.empresaId)
    : pacientes;

  return (
    <Modal title={tr('Nova avaliação NR-01')} wide onClose={onClose}>
      {(fechar) => (
        <ModalForm erro={erro} fechar={fechar} submitLabel={tr('Cadastrar avaliação')} loadingLabel={tr('Cadastrando...')} submitDisabled={faltando.length > 0} onSubmit={() => onSave(montarPayload())}>
          <AvisoPreRequisito
            acao={tr('criar uma avaliação NR-01')}
            faltando={faltando}
            onde={soFaltaEmpresa ? tr('Feche esta janela e use o botão “Cadastrar empresa” desta tela.') : undefined}
          />

          <div className="modal-form__row">
            <div className="field">
              <label className="field__label" htmlFor="nova-nr01-empresa">{tr('Empresa')}</label>
              {empresas.length > 0 ? (
                <select
                  id="nova-nr01-empresa"
                  className="input"
                  value={formCriar.empresaId}
                  onChange={(e) => handleChangeCriar('empresaId', e.target.value)}
                  required
                >
                  <option value="">{tr('Selecione...')}</option>
                  {empresas.map((empresa) => (
                    <option key={empresa._id} value={empresa._id}>{empresa.razaoSocial}</option>
                  ))}
                </select>
              ) : (
                <p className="modal-form__hint">{tr('Nenhuma empresa cadastrada.')}</p>
              )}
            </div>

            <div className="field">
              <label className="field__label" htmlFor="nova-nr01-paciente">{tr('Funcionário (opcional)')}</label>
              <select
                id="nova-nr01-paciente"
                className="input"
                value={formCriar.pacienteId}
                onChange={(e) => handleChangeCriar('pacienteId', e.target.value)}
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
              <label className="field__label" htmlFor="nova-nr01-profissional">{tr('Profissional responsável')}</label>
              <select
                id="nova-nr01-profissional"
                className="input"
                value={formCriar.profissionalId}
                onChange={(e) => handleChangeCriar('profissionalId', e.target.value)}
                required
              >
                <option value="">{tr('Selecione...')}</option>
                {profissionais.map((profissional) => (
                  <option key={profissional._id} value={profissional._id}>{profissional.nome}</option>
                ))}
              </select>
            </div>

            <div className="field">
              <label className="field__label" htmlFor="nova-nr01-data">{tr('Data')}</label>
              <input
                id="nova-nr01-data"
                className="input"
                type="date"
                value={formCriar.data}
                onChange={(e) => handleChangeCriar('data', e.target.value)}
                required
              />
            </div>
          </div>

          <CampoServicoDoModulo
            id="nova-nr01-servico"
            modulo="nr01"
            servicos={servicos}
            value={formCriar.servicoId}
            onChange={(valor) => handleChangeCriar('servicoId', valor)}
          />

          <fieldset className="modal-form__section">
            <legend>{tr('Fatores de risco psicossocial avaliados')}</legend>
            {formCriar.respostas.map((item, index) => (
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
            <label className="field__label" htmlFor="nova-nr01-classificacao">{tr('Classificação geral de risco')}</label>
            <select
              id="nova-nr01-classificacao"
              className="input"
              value={formCriar.classificacaoRisco}
              onChange={(e) => handleChangeCriar('classificacaoRisco', e.target.value)}
            >
              <option value="">{tr('Não classificado')}</option>
              <option value="baixo">{tr('Baixo')}</option>
              <option value="medio">{tr('Médio')}</option>
              <option value="alto">{tr('Alto')}</option>
            </select>
          </div>

          <div className="field">
            <label className="field__label" htmlFor="nova-nr01-recomendacoes">{tr('Recomendações / plano de ação')}</label>
            <textarea
              id="nova-nr01-recomendacoes"
              className="input textarea"
              value={formCriar.recomendacoes}
              onChange={(e) => handleChangeCriar('recomendacoes', e.target.value)}
              rows={4}
            />
          </div>
        </ModalForm>
      )}
    </Modal>
  );
}
