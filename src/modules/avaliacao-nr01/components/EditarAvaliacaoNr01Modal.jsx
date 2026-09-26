import { useState } from 'react';
import Modal from '@/components/Modal/Modal';
import ModalForm from '@/components/Modal/ModalForm';

export default function EditarAvaliacaoNr01Modal({ avaliacao, empresas, pacientes, profissionais, perguntasPadrao, hoje, erro, onSave, onClose }) {
  const [formEdicao, setFormEdicao] = useState({
    empresaId: avaliacao.empresaId?._id ?? avaliacao.empresaId ?? '',
    pacienteId: avaliacao.pacienteId?._id ?? avaliacao.pacienteId ?? '',
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
      classificacaoRisco: formEdicao.classificacaoRisco || null,
      respostas: formEdicao.respostas.filter((r) => r.pergunta.trim() !== ''),
    };
  }

  const pacientesDaEmpresa = formEdicao.empresaId
    ? pacientes.filter((p) => (p.empresaId?._id ?? p.empresaId) === formEdicao.empresaId)
    : pacientes;

  return (
    <Modal title="Editar avaliação NR-01" wide onClose={onClose}>
      {(fechar) => (
        <ModalForm erro={erro} fechar={fechar} onSubmit={() => onSave(avaliacao._id, montarPayload())}>
          <div className="modal-form__row">
            <div className="field">
              <label className="field__label" htmlFor="editar-nr01-empresa">Empresa</label>
              <select
                id="editar-nr01-empresa"
                className="input"
                value={formEdicao.empresaId}
                onChange={(e) => handleChangeEdicao('empresaId', e.target.value)}
                required
              >
                <option value="">Selecione...</option>
                {empresas.map((empresa) => (
                  <option key={empresa._id} value={empresa._id}>{empresa.razaoSocial}</option>
                ))}
              </select>
            </div>

            <div className="field">
              <label className="field__label" htmlFor="editar-nr01-paciente">Funcionário (opcional)</label>
              <select
                id="editar-nr01-paciente"
                className="input"
                value={formEdicao.pacienteId}
                onChange={(e) => handleChangeEdicao('pacienteId', e.target.value)}
              >
                <option value="">Avaliação geral da empresa</option>
                {pacientesDaEmpresa.map((paciente) => (
                  <option key={paciente._id} value={paciente._id}>{paciente.nome}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="modal-form__row">
            <div className="field">
              <label className="field__label" htmlFor="editar-nr01-profissional">Profissional responsável</label>
              <select
                id="editar-nr01-profissional"
                className="input"
                value={formEdicao.profissionalId}
                onChange={(e) => handleChangeEdicao('profissionalId', e.target.value)}
                required
              >
                <option value="">Selecione...</option>
                {profissionais.map((profissional) => (
                  <option key={profissional._id} value={profissional._id}>{profissional.nome}</option>
                ))}
              </select>
            </div>

            <div className="field">
              <label className="field__label" htmlFor="editar-nr01-data">Data</label>
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

          <fieldset className="modal-form__section">
            <legend>Fatores de risco psicossocial avaliados</legend>
            {formEdicao.respostas.map((item, index) => (
              <div key={index} className="modal-form__pair">
                <input
                  className="input"
                  type="text"
                  value={item.pergunta}
                  onChange={(e) => handleItemChange(index, 'pergunta', e.target.value)}
                  placeholder="Fator de risco"
                  aria-label={`Fator de risco ${index + 1}`}
                />
                <input
                  className="input"
                  type="text"
                  value={item.resposta}
                  onChange={(e) => handleItemChange(index, 'resposta', e.target.value)}
                  placeholder="Observação (ex: alto)"
                  aria-label={`Observação do fator ${index + 1}`}
                />
                <button type="button" className="btn btn--danger btn--sm" onClick={() => handleRemoveItem(index)}>Remover</button>
              </div>
            ))}
            <div>
              <button type="button" className="btn btn--ghost btn--sm" onClick={handleAddItem}>+ Adicionar fator de risco</button>
            </div>
          </fieldset>

          <div className="field">
            <label className="field__label" htmlFor="editar-nr01-classificacao">Classificação geral de risco</label>
            <select
              id="editar-nr01-classificacao"
              className="input"
              value={formEdicao.classificacaoRisco}
              onChange={(e) => handleChangeEdicao('classificacaoRisco', e.target.value)}
            >
              <option value="">Não classificado</option>
              <option value="baixo">Baixo</option>
              <option value="medio">Médio</option>
              <option value="alto">Alto</option>
            </select>
          </div>

          <div className="field">
            <label className="field__label" htmlFor="editar-nr01-recomendacoes">Recomendações / plano de ação</label>
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
