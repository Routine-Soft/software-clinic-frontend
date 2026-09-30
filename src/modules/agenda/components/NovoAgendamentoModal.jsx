import { useState } from 'react';
import Modal from '@/components/Modal/Modal';
import ModalForm from '@/components/Modal/ModalForm';
import PacientePicker from '@/modules/paciente/components/PacientePicker';
import { useDadosAgendamento } from '../useDadosAgendamento';
import { DIAS_SEMANA, formularioNovo, horarioInvalido, montarPayload, comPrecoDaTabela } from '../agendamento.form';
import AgendamentoCampos from './AgendamentoCampos';
import AvisoPreRequisito from '@/components/AvisoPreRequisito/AvisoPreRequisito';
import '../agenda.css';

export default function NovoAgendamentoModal({ slotInicial, erro, onSave, onClose }) {
  const dados = useDadosAgendamento();
  const [form, setForm] = useState(() => formularioNovo(slotInicial));
  const [paciente, setPaciente] = useState(null);
  const [repetir, setRepetir] = useState(false);
  const [diasSemana, setDiasSemana] = useState([]);
  const [repetirAte, setRepetirAte] = useState('');

  // Paciente com convênio no cadastro já traz esse convênio (e o preço dele), se ainda não foi escolhido outro.
  function escolherPaciente(novo) {
    setPaciente(novo);
    const convenioDoPaciente = String(novo?.convenioId?._id ?? novo?.convenioId ?? '');
    if (convenioDoPaciente) {
      setForm((atual) => (atual.convenioId ? atual : comPrecoDaTabela({ ...atual, convenioId: convenioDoPaciente }, dados.servicos)));
    }
  }

  function alternarDia(valor) {
    setDiasSemana((atual) => (atual.includes(valor) ? atual.filter((d) => d !== valor) : [...atual, valor]));
  }

  function payload() {
    const base = montarPayload(form, paciente);
    return repetir ? { ...base, repetir: { diasSemana, dataFim: repetirAte } } : base;
  }

  const recorrenciaIncompleta = repetir && (diasSemana.length === 0 || !repetirAte);

  return (
    <Modal title="Novo agendamento" wide onClose={onClose}>
      {(fechar) => (
        <div className="modal-form">
          <AvisoPreRequisito acao="agendar" faltando={dados.faltando} />

          <PacientePicker
            pacientes={dados.pacientes}
            convenios={dados.convenios}
            empresas={dados.empresas}
            valor={paciente}
            onChange={escolherPaciente}
            onCriarPaciente={dados.criarPaciente}
          />

          <ModalForm
            erro={erro}
            fechar={fechar}
            submitLabel={repetir ? 'Agendar série' : 'Agendar'}
            loadingLabel="Agendando..."
            submitDisabled={!paciente || horarioInvalido(form) || recorrenciaIncompleta || dados.faltando.length > 0}
            onSubmit={() => onSave(payload())}
          >
            <AgendamentoCampos form={form} setForm={setForm} {...dados} />

            <fieldset className="modal-form__section">
              <legend>Recorrência</legend>

              <label className="check agendamento-repetir">
                <input type="checkbox" checked={repetir} onChange={(e) => setRepetir(e.target.checked)} />
                <span>Repetir este agendamento</span>
              </label>

              {repetir && (
                <div className="agendamento-recorrencia">
                  <div className="agendamento-dias" role="group" aria-label="Dias da semana">
                    {DIAS_SEMANA.map((dia) => (
                      <label key={dia.valor} className="check">
                        <input type="checkbox" checked={diasSemana.includes(dia.valor)} onChange={() => alternarDia(dia.valor)} />
                        <span>{dia.label}</span>
                      </label>
                    ))}
                  </div>

                  <div className="field">
                    <label className="field__label" htmlFor="agendamento-repetir-ate">Repetir até</label>
                    <input id="agendamento-repetir-ate" className="input" type="date" value={repetirAte} min={form.data} onChange={(e) => setRepetirAte(e.target.value)} required />
                  </div>
                </div>
              )}
            </fieldset>
          </ModalForm>
        </div>
      )}
    </Modal>
  );
}
