import { pagaOPlano } from '../agenda.utils';
import { useState } from 'react';
import Modal from '@/components/Modal/Modal';
import ModalForm from '@/components/Modal/ModalForm';
import PacientePicker from '@/modules/paciente/components/PacientePicker';
import { useDadosAgendamento } from '../useDadosAgendamento';
import { DIAS_SEMANA, formularioNovo, horarioInvalido, montarPayload, comPrecoDaTabela, comFormaInicial, comTotalDasSessoes } from '../agendamento.form';
import { regraDoServico } from '@/modules/servico/servico.utils';
import AgendamentoCampos from './AgendamentoCampos';
import FormaPagamentoCampos from './FormaPagamentoCampos';
import AvisoPreRequisito from '@/components/AvisoPreRequisito/AvisoPreRequisito';
import '../agenda.css';
import { idsQueAcompanham } from '@/modules/paciente/paciente.utils';
import { IconeSetaEsq } from '@/components/CrudCard/icones';
import { localeAtual, tr } from '@/i18n';

// Duas etapas, para a forma de pagamento não ser esquecida: "Agendar" leva à etapa de pagamento, que confirma.
export default function NovoAgendamentoModal({ slotInicial, erro, onSave, onClose }) {
  const dados = useDadosAgendamento();
  const [etapa, setEtapa] = useState('dados');
  const [form, setForm] = useState(() => formularioNovo(slotInicial));
  const [paciente, setPaciente] = useState(null);
  const [repetir, setRepetir] = useState(false);
  const [quantidades, setQuantidades] = useState({});
  const [diasSemana, setDiasSemana] = useState([]);
  const [repetirAte, setRepetirAte] = useState('');

  // Paciente com convênio no cadastro já traz esse convênio (e o preço dele), se ainda não foi escolhido outro.
  // Paciente acompanhado por um só profissional já traz esse profissional, se ainda não foi escolhido outro.
  function escolherPaciente(novo) {
    setPaciente(novo);
    const queAcompanham = idsQueAcompanham(novo).filter((pid) => dados.profissionais.some((p) => p._id === pid));
    if (queAcompanham.length === 1) {
      setForm((atual) => (atual.profissionalId ? atual : { ...atual, profissionalId: queAcompanham[0], especialidadeId: '' }));
    }
    const convenioDoPaciente = String(novo?.convenioId?._id ?? novo?.convenioId ?? '');
    if (convenioDoPaciente) {
      setForm((atual) => (atual.convenioId ? atual : comPrecoDaTabela({ ...atual, convenioId: convenioDoPaciente }, dados.servicos)));
    }
  }

  function alternarDia(valor) {
    setDiasSemana((atual) => (atual.includes(valor) ? atual.filter((d) => d !== valor) : [...atual, valor]));
  }

  // Serviço por sessões: a quantidade vem da receita de cada paciente. Mais de uma gera a série sozinha.
  const servico = dados.servicos.find((s) => s._id === form.servicoId);
  const porSessoes = servico?.tipo === 'pacote';
  const quantidade = quantidades[form.servicoId] ?? String(servico?.qtdDias ?? 1);
  const quantidadeValida = Number.isInteger(Number(quantidade)) && Number(quantidade) >= 1 && Number(quantidade) <= 200;
  const sessoes = porSessoes && quantidadeValida && Number(quantidade) > 1 ? Number(quantidade) : null;
  const emSerie = porSessoes ? !!sessoes : repetir;
  const convenio = dados.convenios.find((c) => c._id === form.convenioId);
  const plano = pagaOPlano(convenio) ? convenio : null;

  function payload() {
    const base = montarPayload(form, paciente, !!plano);
    return emSerie ? { ...base, repetir: { diasSemana, dataFim: repetirAte, sessoes: sessoes ?? undefined } } : base;
  }

  const recorrenciaIncompleta = (porSessoes && !quantidadeValida) || (emSerie && (diasSemana.length === 0 || (!sessoes && !repetirAte)));

  function irParaPagamento() {
    setForm((atual) => comFormaInicial(sessoes ? comTotalDasSessoes(atual, dados.servicos, sessoes) : atual));
    setEtapa('pagamento');
    return false;
  }

  if (etapa === 'pagamento') {
    return (
      <Modal key="pagamento" title={tr('Forma de pagamento')} wide persistente onClose={onClose}>
        {(fechar) => (
          <ModalForm
            erro={erro}
            fechar={fechar}
            submitLabel={emSerie ? tr('Confirmar série') : tr('Confirmar agendamento')}
            loadingLabel={tr('Agendando...')}
            onSubmit={() => onSave(payload())}
          >
            <p className="pagamento-etapa">
              <span className="badge badge--primary">{tr('Etapa 2 de 2')}</span>
              <span>{[paciente?.nome, form.data && new Date(`${form.data}T12:00:00`).toLocaleDateString(localeAtual()), form.horaInicio].filter(Boolean).join(' · ')}</span>
            </p>

            <FormaPagamentoCampos form={form} setForm={setForm} sessoes={sessoes} precoSessao={sessoes ? regraDoServico(servico, form.convenioId).preco : null} plano={plano} />

            <button type="button" className="btn btn--ghost btn--sm pagamento-voltar" onClick={() => setEtapa('dados')}>
              <IconeSetaEsq />
              {tr('Voltar para os dados do agendamento')}
            </button>
          </ModalForm>
        )}
      </Modal>
    );
  }

  return (
    <Modal key="dados" title={tr('Novo agendamento')} wide onClose={onClose}>
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
            submitLabel={repetir ? tr('Agendar série') : tr('Agendar')}
            loadingLabel={tr('Agendando...')}
            submitDisabled={!paciente || horarioInvalido(form) || recorrenciaIncompleta || dados.faltando.length > 0}
            onSubmit={irParaPagamento}
          >
            <AgendamentoCampos form={form} setForm={setForm} paciente={paciente} {...dados} />

            <fieldset className="modal-form__section">
              <legend>{tr('Recorrência')}</legend>

              {porSessoes ? (
                <>
                  <div className="field pagamento-modo__parcelas">
                    <label className="field__label" htmlFor="agendamento-sessoes">{tr('Quantas sessões?')}</label>
                    <input id="agendamento-sessoes" className="input" type="number" min="1" max="200" value={quantidade} onChange={(e) => setQuantidades((atual) => ({ ...atual, [form.servicoId]: e.target.value }))} />
                  </div>
                  {sessoes && <p className="modal-form__hint">{tr('Escolha os dias da semana. As {n} sessões serão criadas a partir da data acima.', { n: sessoes })}</p>}
                </>
              ) : (
                <label className="check agendamento-repetir">
                  <input type="checkbox" checked={repetir} onChange={(e) => setRepetir(e.target.checked)} />
                  <span>{tr('Repetir este agendamento')}</span>
                </label>
              )}

              {emSerie && (
                <div className="agendamento-recorrencia">
                  <div className="agendamento-dias" role="group" aria-label={tr('Dias da semana')}>
                    {DIAS_SEMANA.map((dia) => (
                      <label key={dia.valor} className="check">
                        <input type="checkbox" checked={diasSemana.includes(dia.valor)} onChange={() => alternarDia(dia.valor)} />
                        <span>{dia.label}</span>
                      </label>
                    ))}
                  </div>

                  {!sessoes && <div className="field">
                    <label className="field__label" htmlFor="agendamento-repetir-ate">{tr('Repetir até')}</label>
                    <input id="agendamento-repetir-ate" className="input" type="date" value={repetirAte} min={form.data} onChange={(e) => setRepetirAte(e.target.value)} required />
                  </div>}
                </div>
              )}
            </fieldset>
          </ModalForm>
        </div>
      )}
    </Modal>
  );
}
