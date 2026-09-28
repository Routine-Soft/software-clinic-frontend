import { useMemo, useState } from 'react';
import { useProfissionais } from '@/modules/profissional/profissional.hooks';
import { useConvenios } from '@/modules/convenio/convenio.hooks';
import { updatePaciente } from '@/modules/paciente/paciente.api';
import { formatDataBR, calcularIdade } from '@/utils/date';
import { iniciais } from '@/utils/nome';
import { IconeMais, IconeImpressora, IconeAlerta } from '@/components/CrudCard/icones';
import { useProntuarios } from '../prontuario.hooks';
import { CAMPOS_PERFIL_CLINICO, perfilClinicoDoPaciente, atendimentoEmAndamento, formatDataInstanteBR } from '../prontuario.utils';
import AtendimentoAtivo from './AtendimentoAtivo';
import EvolucaoItem from './EvolucaoItem';
import ResumoAgendamento from './ResumoAgendamento';
import '../prontuario.css';

const ABAS = [
  ['atendimento', 'Atendimento'],
  ['historico', 'Histórico'],
  ['perfil', 'Perfil clínico'],
];

export default function ProntuarioPaciente({ paciente, agendamento = null, onEditarAgendamento, onCancelarAgendamento, onImprimirAgendamento, onMarcarRealizado, erroAgendamento }) {
  const { profissionais } = useProfissionais();
  const { convenios } = useConvenios();
  const { prontuarios, loading, error, successMessage, addProntuario, editProntuario, removeProntuario, finalizarProntuario } =
    useProntuarios(paciente._id);

  const [aba, setAba] = useState('atendimento');
  const [novoAtendimento, setNovoAtendimento] = useState(() => ({
    profissionalId: agendamento?.profissionalId?._id ?? '',
    convenioId: agendamento ? (agendamento.convenioId?._id ?? '') : (paciente.convenioId?._id ?? paciente.convenioId ?? ''),
  }));
  const [iniciando, setIniciando] = useState(false);

  const [perfilSalvo, setPerfilSalvo] = useState(() => perfilClinicoDoPaciente(paciente));
  const [perfilForm, setPerfilForm] = useState(() => perfilClinicoDoPaciente(paciente));
  const [salvandoPerfil, setSalvandoPerfil] = useState(false);
  const [avisoPerfil, setAvisoPerfil] = useState(null);

  const atendimentoAtivo = useMemo(() => prontuarios.find(atendimentoEmAndamento), [prontuarios]);
  const historico = useMemo(() => prontuarios.filter((p) => p._id !== atendimentoAtivo?._id), [prontuarios, atendimentoAtivo]);
  const primeiraConsulta = prontuarios.length > 0 ? prontuarios[prontuarios.length - 1].createdAt : null;

  const idade = calcularIdade(paciente.dataNascimento);
  const perfilAlterado = CAMPOS_PERFIL_CLINICO.some(([campo]) => perfilForm[campo] !== perfilSalvo[campo]);
  // Com alergia registrada ela sobe para o banner de aviso; sem, aparece no resumo como qualquer outro campo.
  const camposResumo = perfilSalvo.alergias ? CAMPOS_PERFIL_CLINICO.filter(([campo]) => campo !== 'alergias') : CAMPOS_PERFIL_CLINICO;

  async function handleIniciar() {
    await addProntuario({
      pacienteId: paciente._id,
      profissionalId: novoAtendimento.profissionalId,
      convenioId: novoAtendimento.convenioId || null,
      agendamentoId: agendamento?._id ?? null,
    });
  }

  async function handleFinalizar(id, payload) {
    const finalizado = await finalizarProntuario(id, payload);
    if (finalizado) setAba('historico');
  }

  async function handleSalvarPerfil(e) {
    e.preventDefault();
    setSalvandoPerfil(true);
    setAvisoPerfil(null);
    try {
      await updatePaciente(paciente._id, perfilForm);
      setPerfilSalvo(perfilForm);
      setAvisoPerfil({ tipo: 'success', texto: 'Perfil clínico salvo.' });
    } catch (err) {
      setAvisoPerfil({ tipo: 'error', texto: err.message || 'Não foi possível salvar o perfil clínico.' });
    } finally {
      setSalvandoPerfil(false);
    }
  }

  const contagens = { historico: historico.length };

  return (
    <div className="prontuario">
      <header className="pront-head">
        <div className="pront-head__avatar" aria-hidden="true">{iniciais(paciente.nome)}</div>

        <div className="pront-head__dados">
          <h3 className="pront-head__nome">{paciente.nome}</h3>
          <p className="pront-head__meta">
            {[
              formatDataBR(paciente.dataNascimento) && `${formatDataBR(paciente.dataNascimento)}${idade !== null ? ` (${idade} ${idade === 1 ? 'ano' : 'anos'})` : ''}`,
              paciente.telefone,
              paciente.email,
            ].filter(Boolean).map((item) => <span key={item}>{item}</span>)}
          </p>
          <div className="pront-head__selos">
            <span className={`badge${paciente.convenioId?.nome ? ' badge--info' : ''}`}>{paciente.convenioId?.nome ?? 'Particular'}</span>
            {paciente.empresaId?.razaoSocial && <span className="badge badge--primary">{paciente.empresaId.razaoSocial}</span>}
            <span className="badge">Primeira consulta: {formatDataInstanteBR(primeiraConsulta) ?? 'nenhuma ainda'}</span>
          </div>
        </div>

        <button type="button" className="btn btn--ghost btn--sm pront-head__imprimir pront-no-print" onClick={() => window.print()}>
          <IconeImpressora />
          Imprimir
        </button>
      </header>

      {agendamento && (
        <ResumoAgendamento
          agendamento={agendamento}
          onEditar={onEditarAgendamento}
          onCancelar={onCancelarAgendamento}
          onImprimir={onImprimirAgendamento}
          onMarcarRealizado={onMarcarRealizado}
          erro={erroAgendamento}
        />
      )}

      {perfilSalvo.alergias && (
        <div className="pront-alergia" role="note">
          <IconeAlerta />
          <p><strong>Alergias:</strong> {perfilSalvo.alergias}</p>
        </div>
      )}

      <dl className="pront-resumo">
        {camposResumo.map(([campo, rotulo]) => (
          <div key={campo} className={perfilSalvo[campo] ? undefined : 'is-vazio'}>
            <dt>{rotulo}</dt>
            <dd>{perfilSalvo[campo] || 'Nenhum registrado'}</dd>
          </div>
        ))}
      </dl>

      <div className="pront-abas pront-no-print" role="tablist" aria-label="Seções do prontuário">
        {ABAS.map(([chave, rotulo]) => (
          <button
            key={chave}
            type="button"
            role="tab"
            id={`pront-aba-${chave}`}
            aria-selected={aba === chave}
            aria-controls="pront-painel"
            className="pront-aba"
            data-autofocus={aba === chave ? '' : undefined}
            onClick={() => setAba(chave)}
          >
            {rotulo}
            {contagens[chave] > 0 && <span className="pront-aba__contagem">{contagens[chave]}</span>}
            {chave === 'atendimento' && atendimentoAtivo && <span className="pront-aba__ponto" aria-label="Em andamento" />}
          </button>
        ))}
      </div>

      {(error || successMessage) && (
        <div className="pront-avisos" aria-live="polite">
          {error && <p className="alert alert--error" role="alert">{error.message}</p>}
          {successMessage && <p className="alert alert--success" role="status">{successMessage}</p>}
        </div>
      )}

      <section className="pront-painel" id="pront-painel" role="tabpanel" aria-labelledby={`pront-aba-${aba}`}>
        {aba === 'atendimento' && (
          loading ? (
            <div className="skeleton skeleton--bloco" />
          ) : atendimentoAtivo ? (
            <AtendimentoAtivo
              key={atendimentoAtivo._id}
              atendimento={atendimentoAtivo}
              onSalvarRascunho={editProntuario}
              onFinalizar={handleFinalizar}
            />
          ) : (
            <div className="pront-novo">
              <div className="pront-novo__intro">
                <h4>Iniciar novo atendimento</h4>
                <p>
                  {agendamento
                    ? 'O atendimento ficará vinculado a este agendamento.'
                    : 'Escolha o profissional para abrir um novo registro de atendimento.'}
                </p>
              </div>

              <div className="pront-grid">
                <div className="field">
                  <label className="field__label" htmlFor="pront-novo-profissional">Profissional</label>
                  <select
                    id="pront-novo-profissional"
                    className="input"
                    value={novoAtendimento.profissionalId}
                    onChange={(e) => setNovoAtendimento({ ...novoAtendimento, profissionalId: e.target.value })}
                    required
                  >
                    <option value="">Selecione</option>
                    {profissionais.map((p) => (
                      <option key={p._id} value={p._id}>{p.nome}</option>
                    ))}
                  </select>
                </div>

                <div className="field">
                  <label className="field__label" htmlFor="pront-novo-convenio">Convênio</label>
                  <select
                    id="pront-novo-convenio"
                    className="input"
                    value={novoAtendimento.convenioId}
                    onChange={(e) => setNovoAtendimento({ ...novoAtendimento, convenioId: e.target.value })}
                  >
                    <option value="">Particular</option>
                    {convenios.map((c) => (
                      <option key={c._id} value={c._id}>{c.nome}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pront-rodape pront-no-print">
                <button
                  type="button"
                  className={`btn btn--primary${iniciando ? ' btn--loading' : ''}`}
                  disabled={!novoAtendimento.profissionalId || iniciando}
                  onClick={async () => { setIniciando(true); await handleIniciar(); setIniciando(false); }}
                >
                  <IconeMais />
                  {iniciando ? 'Iniciando...' : 'Iniciar atendimento'}
                </button>
              </div>
            </div>
          )
        )}

        {aba === 'historico' && (
          loading ? (
            <div className="skeleton skeleton--bloco" />
          ) : historico.length === 0 ? (
            <p className="pront-vazio">Nenhum atendimento registrado ainda.</p>
          ) : (
            <ol className="pront-timeline">
              {historico.map((prontuario) => (
                <EvolucaoItem
                  key={prontuario._id}
                  prontuario={prontuario}
                  destaque={!!agendamento && prontuario.agendamentoId === agendamento._id}
                  onEditar={editProntuario}
                  onExcluir={removeProntuario}
                />
              ))}
            </ol>
          )
        )}

        {aba === 'perfil' && (
          <form className="pront-perfil" onSubmit={handleSalvarPerfil}>
            <p className="pront-perfil__intro">Esses dados valem para todos os atendimentos deste paciente, não apenas para o atual.</p>

            <div className="pront-grid">
              {CAMPOS_PERFIL_CLINICO.map(([campo, rotulo, linhas]) => (
                <div className="field" key={campo}>
                  <label className="field__label" htmlFor={`pront-perfil-${campo}`}>{rotulo}</label>
                  <textarea
                    id={`pront-perfil-${campo}`}
                    className="input textarea"
                    rows={linhas}
                    value={perfilForm[campo]}
                    onChange={(e) => { setPerfilForm({ ...perfilForm, [campo]: e.target.value }); setAvisoPerfil(null); }}
                  />
                </div>
              ))}
            </div>

            {avisoPerfil && (
              <p className={`alert alert--${avisoPerfil.tipo}`} role={avisoPerfil.tipo === 'error' ? 'alert' : 'status'}>{avisoPerfil.texto}</p>
            )}

            <div className="pront-rodape pront-no-print">
              <button type="submit" className={`btn btn--primary${salvandoPerfil ? ' btn--loading' : ''}`} disabled={salvandoPerfil || !perfilAlterado}>
                {salvandoPerfil ? 'Salvando...' : 'Salvar perfil clínico'}
              </button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
}
