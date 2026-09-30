import { useMemo, useState } from 'react';
import Modal from '@/components/Modal/Modal';
import ModalForm from '@/components/Modal/ModalForm';
import PacientePicker from '@/modules/paciente/components/PacientePicker';
import AvisoPreRequisito from '@/components/AvisoPreRequisito/AvisoPreRequisito';
import './lista-espera.css';

const FORM_INICIAL = { especialidadeId: '', profissionalId: '', dataDesejada: '', observacao: '' };

export default function NovoItemEsperaModal({
  pacientes,
  convenios,
  empresas,
  especialidades,
  carregandoEspecialidades = false,
  profissionais,
  onCriarPaciente,
  erro,
  onSave,
  onClose,
}) {
  const [form, setForm] = useState(FORM_INICIAL);
  const [pacienteSelecionado, setPacienteSelecionado] = useState(null);
  const faltando = !carregandoEspecialidades && especialidades.length === 0 ? ['uma especialidade'] : [];

  const profissionaisFiltrados = useMemo(() => {
    if (!form.especialidadeId) return profissionais;
    return profissionais.filter((p) =>
      (p.especialidadeIds ?? []).some((e) => (e?._id ?? e) === form.especialidadeId)
    );
  }, [profissionais, form.especialidadeId]);

  function handleChange(field, value) {
    setForm({ ...form, [field]: value });
  }

  function montarPayload() {
    return {
      pacienteId: pacienteSelecionado._id,
      especialidadeId: form.especialidadeId,
      profissionalId: form.profissionalId || null,
      dataDesejada: form.dataDesejada || null,
      observacao: form.observacao || null,
    };
  }

  return (
    <Modal title="Adicionar à lista de espera" wide onClose={onClose}>
      {(fechar) => (
        <div className="modal-form">
          <AvisoPreRequisito acao="colocar alguém na lista de espera" faltando={faltando} />

          <PacientePicker
            pacientes={pacientes}
            convenios={convenios}
            empresas={empresas}
            valor={pacienteSelecionado}
            onChange={setPacienteSelecionado}
            onCriarPaciente={onCriarPaciente}
          />

          <ModalForm
            erro={erro}
            fechar={fechar}
            submitLabel="Adicionar à fila"
            loadingLabel="Adicionando..."
            submitDisabled={!pacienteSelecionado || faltando.length > 0}
            onSubmit={() => onSave(montarPayload())}
          >
            <div className="modal-form__row">
              <div className="field">
                <label className="field__label" htmlFor="novo-espera-especialidade">Especialidade</label>
                <select
                  id="novo-espera-especialidade"
                  className="input"
                  value={form.especialidadeId}
                  onChange={(e) => handleChange('especialidadeId', e.target.value)}
                  required
                >
                  <option value="">Selecione</option>
                  {especialidades.map((e) => (
                    <option key={e._id} value={e._id}>{e.nome}</option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label className="field__label" htmlFor="novo-espera-profissional">Profissional preferido</label>
                <select
                  id="novo-espera-profissional"
                  className="input"
                  value={form.profissionalId}
                  onChange={(e) => handleChange('profissionalId', e.target.value)}
                >
                  <option value="">Qualquer um</option>
                  {profissionaisFiltrados.map((p) => (
                    <option key={p._id} value={p._id}>{p.nome}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="field">
              <label className="field__label" htmlFor="novo-espera-data">Data desejada (opcional)</label>
              <input
                id="novo-espera-data"
                className="input"
                type="date"
                value={form.dataDesejada}
                onChange={(e) => handleChange('dataDesejada', e.target.value)}
              />
            </div>

            <div className="field">
              <label className="field__label" htmlFor="novo-espera-obs">Observação</label>
              <textarea
                id="novo-espera-obs"
                className="input textarea"
                value={form.observacao}
                onChange={(e) => handleChange('observacao', e.target.value)}
                rows={2}
              />
            </div>
          </ModalForm>
        </div>
      )}
    </Modal>
  );
}
