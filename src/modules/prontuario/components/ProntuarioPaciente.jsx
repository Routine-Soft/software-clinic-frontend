import { useMemo, useState } from 'react';
import { useConvenios } from '@/modules/convenio/convenio.hooks';
import { useEspecialidades } from '@/modules/especialidade/especialidade.hooks';
import { formatDataBR } from '@/utils/date';
import { iniciais } from '@/utils/nome';
import { IconeMais, IconeImpressora, IconeAlerta } from '@/components/CrudCard/icones';
import { useProntuarios } from '../prontuario.hooks';
import { CAMPOS_PERFIL_CLINICO, perfilClinicoDoPaciente, atendimentoEmAndamento, ehDoProfissional, formatDataInstanteBR, textoDeAcesso } from '../prontuario.utils';
import AtendimentoAtivo from './AtendimentoAtivo';
import HistoricoJornada from './HistoricoJornada';
import ResumoAgendamento from './ResumoAgendamento';
import AcessoAtendimento, { EscolhaEspecialidades } from './AcessoAtendimento';
import { contatoDoPaciente, rotuloDoResponsavel, textoIdadeCompleta } from '@/modules/paciente/paciente.utils';
import '../prontuario.css';
import SeloTeste from '@/modules/paciente/components/SeloTeste';
import { useAnamnesesDoPaciente } from '@/modules/anamnese/anamnese.hooks';
import AnamnesesDoPaciente from '@/modules/anamnese/components/AnamnesesDoPaciente';
import { tr } from '@/i18n';

const ABAS = [
  ['anamnese', tr('Anamnese')],
  ['perfil', tr('Perfil clínico')],
];

// `profissional` é o cadastro de profissional do login (quem abre a ficha já passou pela checagem de acesso).
// Profissional, convênio e "quem pode ler" ficam numa faixa pequena no topo; o atendimento em andamento
// aparece logo abaixo dela, e o histórico vai para o card da jornada, ao lado da ficha.
export default function ProntuarioPaciente({ paciente, profissional, agendamento = null, onEditarAgendamento, onCancelarAgendamento, onImprimirAgendamento, onMarcarRealizado, onAtendimentoFinalizado, erroAgendamento }) {
  const { convenios } = useConvenios();
  const { especialidades } = useEspecialidades();
  const {
    prontuarios, perfilClinico, loading, error, successMessage,
    addProntuario, editProntuario, addAdendo, compartilhar, salvarPerfil, finalizarProntuario,
  } = useProntuarios(paciente._id);
  const anamneses = useAnamnesesDoPaciente(paciente._id);

  const [aba, setAba] = useState('anamnese');
  // compartilhadoCom começa vazio: só o autor lê até ele marcar outras especialidades.
  const [novoAtendimento, setNovoAtendimento] = useState(() => ({
    compartilhadoCom: [],
    convenioId: agendamento ? (agendamento.convenioId?._id ?? '') : (paciente.convenioId?._id ?? paciente.convenioId ?? ''),
  }));
  const [iniciando, setIniciando] = useState(false);

  // O perfil clínico vem do servidor só para quem atende o paciente; null enquanto carrega ou sem acesso.
  const perfilSalvo = useMemo(() => (perfilClinico ? perfilClinicoDoPaciente(perfilClinico) : null), [perfilClinico]);
  const [perfilEditado, setPerfilEditado] = useState(null);
  const perfilForm = perfilEditado ?? perfilSalvo ?? perfilClinicoDoPaciente({});
  const [salvandoPerfil, setSalvandoPerfil] = useState(false);
  const [avisoPerfil, setAvisoPerfil] = useState(null);

  // Só o próprio atendimento em andamento abre para edição; o de outro profissional aparece no histórico.
  const atendimentoAtivo = useMemo(
    () => prontuarios.find((p) => atendimentoEmAndamento(p) && ehDoProfissional(p, profissional._id)),
    [prontuarios, profissional._id]
  );
  const historico = useMemo(() => prontuarios.filter((p) => p._id !== atendimentoAtivo?._id), [prontuarios, atendimentoAtivo]);
  const primeiraConsulta = prontuarios.length > 0 ? prontuarios[prontuarios.length - 1].createdAt : null;

  const idade = textoIdadeCompleta(paciente.dataNascimento);
  const nomesAcessoNovo = novoAtendimento.compartilhadoCom.map((id) => especialidades.find((e) => e._id === id)?.nome).filter(Boolean);
  const perfilAlterado = !!perfilSalvo && CAMPOS_PERFIL_CLINICO.some(([campo]) => perfilForm[campo] !== perfilSalvo[campo]);
  // Com alergia registrada ela sobe para o banner de aviso; sem, aparece no resumo como qualquer outro campo.
  const camposResumo = perfilSalvo?.alergias ? CAMPOS_PERFIL_CLINICO.filter(([campo]) => campo !== 'alergias') : CAMPOS_PERFIL_CLINICO;

  async function handleIniciar() {
    setIniciando(true);
    await addProntuario({
      pacienteId: paciente._id,
      compartilhadoCom: novoAtendimento.compartilhadoCom,
      convenioId: novoAtendimento.convenioId || null,
      agendamentoId: agendamento?._id ?? null,
    });
    setIniciando(false);
  }

  async function handleFinalizar(id, payload) {
    const finalizado = await finalizarProntuario(id, payload);
    if (!finalizado) return;
    // Finalizar já conta a consulta como realizada (e gera o repasse): a agenda mostra isso na hora.
    if (agendamento) onAtendimentoFinalizado?.(agendamento);
  }

  async function handleSalvarPerfil(e) {
    e.preventDefault();
    setSalvandoPerfil(true);
    setAvisoPerfil(null);
    try {
      await salvarPerfil(perfilForm);
      setPerfilEditado(null);
      setAvisoPerfil({ tipo: 'success', texto: tr('Perfil clínico salvo.') });
    } catch (err) {
      setAvisoPerfil({ tipo: 'error', texto: err.message || tr('Não foi possível salvar o perfil clínico.') });
    } finally {
      setSalvandoPerfil(false);
    }
  }

  const contagens = { anamnese: anamneses.anamneses.length };

  return (
    <div className="pront-layout">
      <div className="prontuario">
        <header className="pront-head">
          <div className="pront-head__avatar" aria-hidden="true">{iniciais(paciente.nome)}</div>

          <div className="pront-head__dados">
            <h3 className="pront-head__nome">{paciente.nome}</h3>
            <p className="pront-head__meta">
              {[
                formatDataBR(paciente.dataNascimento) && `${formatDataBR(paciente.dataNascimento)}${idade ? ` (${idade})` : ''}`,
                contatoDoPaciente(paciente).telefone,
                contatoDoPaciente(paciente).email,
              ].filter(Boolean).map((item) => <span key={item}>{item}</span>)}
            </p>
            {paciente.responsaveis?.length > 0 && (
              <p className="pront-head__meta">
                {paciente.responsaveis.map((r) => (
                  <span key={r.nome}>{tr('Responsável: {p0}', { p0: [rotuloDoResponsavel(r), r.telefone].filter(Boolean).join(' · ') })}</span>
                ))}
              </p>
            )}
            <div className="pront-head__selos">
              <SeloTeste paciente={paciente} />
              <span className={`badge${paciente.convenioId?.nome ? ' badge--info' : ''}`}>{paciente.convenioId?.nome ?? tr('Sem convênio')}</span>
              {paciente.empresaId?.razaoSocial && <span className="badge badge--primary">{paciente.empresaId.razaoSocial}</span>}
              <span className="badge">{tr('Primeira consulta: {p0}', { p0: formatDataInstanteBR(primeiraConsulta) ?? tr('nenhuma ainda') })}</span>
            </div>
          </div>

          <div className="pront-head__acoes pront-no-print">
            <button type="button" className="btn btn--ghost btn--sm" onClick={() => window.print()}>
              <IconeImpressora />
              {tr('Imprimir')}
            </button>
            {!loading && !atendimentoAtivo && (
              <button
                type="button"
                className={`btn btn--primary btn--sm${iniciando ? ' btn--loading' : ''}`}
                disabled={iniciando}
                title={agendamento ? tr('O atendimento ficará vinculado a este agendamento.') : tr('O atendimento fica registrado em seu nome, e só você poderá alterá-lo até finalizar.')}
                onClick={handleIniciar}
              >
                <IconeMais />
                {iniciando ? tr('Iniciando...') : tr('Iniciar atendimento')}
              </button>
            )}
          </div>
        </header>

        <div className="pront-config pront-no-print">
          <span className="pront-config__item">
            <span className="pront-config__rotulo">{tr('Profissional')}</span>
            <strong>{atendimentoAtivo?.profissionalId?.nome ?? profissional.nome}</strong>
          </span>

          {atendimentoAtivo ? (
            <>
              <span className="pront-config__item">
                <span className="pront-config__rotulo">{tr('Convênio')}</span>
                <strong>{atendimentoAtivo.convenioId?.nome ?? tr('Particular')}</strong>
              </span>
              <AcessoAtendimento
                key={(atendimentoAtivo.compartilhadoCom ?? []).map((e) => e?._id ?? e).join()}
                prontuario={atendimentoAtivo}
                especialidades={especialidades}
                souAutor
                onSalvar={compartilhar}
              />
            </>
          ) : (
            <>
              <label className="pront-config__item">
                <span className="pront-config__rotulo">{tr('Convênio')}</span>
                <select
                  className="input pront-config__select"
                  value={novoAtendimento.convenioId}
                  onChange={(e) => setNovoAtendimento({ ...novoAtendimento, convenioId: e.target.value })}
                >
                  <option value="">{tr('Não informado')}</option>
                  {convenios.map((c) => (
                    <option key={c._id} value={c._id}>{c.nome}</option>
                  ))}
                </select>
              </label>

              <details className="pront-config__acesso">
                <summary className="pront-config__item">
                  <span className="pront-config__rotulo" id="pront-novo-acesso-rotulo">{tr('Quem pode ler')}</span>
                  <strong>{textoDeAcesso(nomesAcessoNovo)}</strong>
                </summary>
                <div className="pront-config__painel">
                  <EscolhaEspecialidades
                    id="pront-novo-acesso"
                    especialidades={especialidades}
                    selecionadas={novoAtendimento.compartilhadoCom}
                    onChange={(ids) => setNovoAtendimento({ ...novoAtendimento, compartilhadoCom: ids })}
                  />
                  <p className="field__hint">
                    {tr('Nada marcado: só você lê. Marcando uma especialidade, qualquer profissional dela na clínica poderá ler. Dá para mudar depois.')}
                  </p>
                </div>
              </details>
            </>
          )}
        </div>

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

        {perfilSalvo?.alergias && (
          <div className="pront-alergia" role="note">
            <IconeAlerta />
            <p><strong>{tr('Alergias:')}</strong> {perfilSalvo.alergias}</p>
          </div>
        )}

        {perfilSalvo && (
          <dl className="pront-resumo">
            {camposResumo.map(([campo, rotulo]) => (
              <div key={campo} className={perfilSalvo[campo] ? undefined : 'is-vazio'}>
                <dt>{rotulo}</dt>
                <dd>{perfilSalvo[campo] || tr('Nenhum registrado')}</dd>
              </div>
            ))}
          </dl>
        )}

        {atendimentoAtivo && (
          <AtendimentoAtivo
            key={atendimentoAtivo._id}
            atendimento={atendimentoAtivo}
            onSalvarRascunho={editProntuario}
            onFinalizar={handleFinalizar}
          />
        )}

        <div className="pront-abas pront-no-print" role="tablist" aria-label={tr('Seções do prontuário')}>
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
          {aba === 'anamnese' && (
            <AnamnesesDoPaciente paciente={paciente} profissional={profissional} especialidades={especialidades} dados={anamneses} />
          )}

          {aba === 'perfil' && !loading && !perfilSalvo && (
            <p className="pront-vazio">
              {tr('O perfil clínico aparece para quem atende o paciente. Inicie um atendimento para consultá-lo e atualizá-lo.')}
            </p>
          )}

          {aba === 'perfil' && perfilSalvo && (
            <form className="pront-perfil" onSubmit={handleSalvarPerfil}>
              <p className="pront-perfil__intro">{tr('Esses dados valem para todos os atendimentos deste paciente, não apenas para o atual.')}</p>

              <div className="pront-grid">
                {CAMPOS_PERFIL_CLINICO.map(([campo, rotulo, linhas]) => (
                  <div className="field" key={campo}>
                    <label className="field__label" htmlFor={`pront-perfil-${campo}`}>{rotulo}</label>
                    <textarea
                      id={`pront-perfil-${campo}`}
                      className="input textarea"
                      rows={linhas}
                      value={perfilForm[campo]}
                      onChange={(e) => { setPerfilEditado({ ...perfilForm, [campo]: e.target.value }); setAvisoPerfil(null); }}
                    />
                  </div>
                ))}
              </div>

              {avisoPerfil && (
                <p className={`alert alert--${avisoPerfil.tipo}`} role={avisoPerfil.tipo === 'error' ? 'alert' : 'status'}>{avisoPerfil.texto}</p>
              )}

              <div className="pront-rodape pront-no-print">
                <button type="submit" className={`btn btn--primary${salvandoPerfil ? ' btn--loading' : ''}`} disabled={salvandoPerfil || !perfilAlterado}>
                  {salvandoPerfil ? tr('Salvando...') : tr('Salvar perfil clínico')}
                </button>
              </div>
            </form>
          )}
        </section>
      </div>

      <HistoricoJornada
        paciente={paciente}
        historico={historico}
        loading={loading}
        profissional={profissional}
        especialidades={especialidades}
        agendamento={agendamento}
        podeIniciar={!atendimentoAtivo && !iniciando}
        onIniciar={handleIniciar}
        onCompartilhar={compartilhar}
        onAdendo={addAdendo}
      />
    </div>
  );
}
