import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAgendas } from '../agenda.hooks';
import { useProfissionais } from '@/modules/profissional/profissional.hooks';
import { filtrarPacientes } from '@/modules/paciente/paciente.utils';
import ProntuarioModal from '@/modules/prontuario/components/ProntuarioModal';
import { useAuthContext } from '@/hooks/useAuthContext';
import { printAgendamento } from '@/modules/print/print.api';
import { IconeMais, IconeBusca, IconeSetaEsq, IconeSetaDir } from '@/components/CrudCard/icones';
import {
  agruparPorDia,
  diasDoIntervalo,
  idDoProfissional,
  indiceDeCor,
  intervaloDaVisao,
  navegar,
  profissionalDoUsuario,
  paraISO,
  tituloDaVisao,
} from '../agenda.utils';
import AgendaMes from './AgendaMes';
import AgendaGradeTempo from './AgendaGradeTempo';
import NovoAgendamentoModal from './NovoAgendamentoModal';
import EditarAgendamentoModal from './EditarAgendamentoModal';
import '../agenda.css';

const VISOES = [
  ['dia', 'Dia'],
  ['semana', 'Semana'],
  ['mes', 'Mês'],
];

function visaoInicial(soCancelados) {
  if (soCancelados) return 'mes';
  return window.matchMedia?.('(max-width: 640px)').matches ? 'dia' : 'mes';
}

export default function AgendaCalendario() {
  const { user, hasRole } = useAuthContext();
  const podeVerProntuario = hasRole('admin') || hasRole('profissional') || hasRole('super_admin');
  const { profissionais } = useProfissionais();
  // ?status=cancelado (vindo do card "Agendamentos cancelados" da página inicial) mostra só os cancelados.
  const [parametros, setParametros] = useSearchParams();
  const soCancelados = parametros.get('status') === 'cancelado';

  const [agora, setAgora] = useState(() => new Date());
  const [visao, setVisao] = useState(() => visaoInicial(soCancelados));
  const [dataReferencia, setDataReferencia] = useState(() => new Date());
  // null = ainda não escolheu: o profissional abre na própria agenda; os demais, em todos os profissionais.
  const [profissionalEscolhido, setProfissionalEscolhido] = useState(null);
  const meuProfissional = user?.role === 'profissional' ? profissionalDoUsuario(profissionais, user) : null;
  const profissionalId = profissionalEscolhido ?? meuProfissional?._id ?? '';
  const [busca, setBusca] = useState('');
  const [mostrarCancelados, setMostrarCancelados] = useState(true);

  const [slotNovo, setSlotNovo] = useState(null);
  const [agendaEditando, setAgendaEditando] = useState(null);
  const [agendaDetalhes, setAgendaDetalhes] = useState(null);

  useEffect(() => {
    const intervalo = setInterval(() => setAgora(new Date()), 60000);
    return () => clearInterval(intervalo);
  }, []);

  const hoje = paraISO(agora);
  const intervalo = useMemo(() => intervaloDaVisao(visao, dataReferencia), [visao, dataReferencia]);
  const dias = useMemo(() => diasDoIntervalo(intervalo), [intervalo]);

  const { agendas, loading, error, successMessage, addAgenda, editAgenda, marcarRealizado, cancelAgenda, cancelGrupo } = useAgendas({
    profissionalId: profissionalId || undefined,
    dataInicio: paraISO(intervalo.inicio),
    dataFim: paraISO(intervalo.fim),
  });

  const idsProfissionais = useMemo(() => profissionais.map((p) => p._id).sort(), [profissionais]);
  const corDe = (id) => indiceDeCor(id, idsProfissionais);
  const corDoAgendamento = (agenda) => corDe(idDoProfissional(agenda));

  const agendasFiltradas = useMemo(() => {
    let lista = agendas;
    if (soCancelados) lista = lista.filter((a) => a.status === 'cancelado');
    else if (!mostrarCancelados) lista = lista.filter((a) => a.status !== 'cancelado');
    if (busca.trim()) {
      const ids = new Set(filtrarPacientes(lista.map((a) => a.pacienteId).filter(Boolean), busca).map((p) => p._id));
      lista = lista.filter((a) => ids.has(a.pacienteId?._id));
    }
    return lista;
  }, [agendas, mostrarCancelados, soCancelados, busca]);

  const porDia = useMemo(() => agruparPorDia(agendasFiltradas), [agendasFiltradas]);

  const legenda = useMemo(() => {
    const mapa = new Map();
    for (const agenda of agendas) {
      const id = idDoProfissional(agenda);
      if (id && !mapa.has(id)) mapa.set(id, agenda.profissionalId?.nome ?? 'Profissional');
    }
    return [...mapa.entries()].sort((a, b) => a[1].localeCompare(b[1], 'pt-BR'));
  }, [agendas]);

  const totalNoPeriodo = agendasFiltradas.filter((a) => a.status !== 'cancelado').length;
  const canceladosNoPeriodo = agendasFiltradas.filter((a) => a.status === 'cancelado').length;
  const noPeriodo = visao === 'dia' ? 'no dia' : visao === 'semana' ? 'na semana' : 'no mês';

  function alternarSoCancelados() {
    setParametros(soCancelados ? {} : { status: 'cancelado' }, { replace: true });
  }

  function irParaDia(dia) {
    setDataReferencia(dia);
    setVisao('dia');
  }

  function novoAgendamento(iso, horaInicio = '') {
    setSlotNovo({ data: iso, horaInicio, profissionalId });
  }

  async function handleCancelar(agenda) {
    if (agenda.grupoRecorrenciaId) {
      const cancelarTudo = window.confirm('Este agendamento faz parte de uma recorrência. Cancelar todos os horários do grupo?');
      if (cancelarTudo) return await cancelGrupo(agenda.grupoRecorrenciaId);
    }
    return await cancelAgenda(agenda._id);
  }

  // O profissional só marca os próprios atendimentos (o backend confere de novo); admin e recepção marcam qualquer um.
  function podeMarcarRealizado(agenda) {
    if (user?.role !== 'profissional') return true;
    return String(agenda.profissionalId?.usuarioId ?? '') === String(user?._id ?? user?.id ?? '');
  }

  async function handleRealizado(agenda, realizado) {
    const atualizada = await marcarRealizado(agenda._id, realizado);
    if (atualizada) setAgendaDetalhes(atualizada);
    return atualizada;
  }

  async function handleImprimir(agendaId) {
    try {
      await printAgendamento(agendaId);
    } catch (err) {
      console.error('Erro ao imprimir:', err);
    }
  }

  const algumModalAberto = !!slotNovo || !!agendaEditando;

  return (
    <div className="page agenda-page">
      <header className="page-header">
        <div>
          <h2 className="page-title">Agenda</h2>
          <p className="page-subtitle">Clique em um agendamento para abrir o prontuário do paciente</p>
        </div>
        <div className="page-header__acoes">
          {!loading && (soCancelados ? (
            <span className="badge badge--danger">
              {canceladosNoPeriodo} {canceladosNoPeriodo === 1 ? 'cancelado' : 'cancelados'} {noPeriodo}
            </span>
          ) : (
            <span className="badge badge--primary">
              {totalNoPeriodo} {totalNoPeriodo === 1 ? 'agendamento' : 'agendamentos'} {noPeriodo}
            </span>
          ))}
          <button type="button" className="btn btn--primary" onClick={() => novoAgendamento(paraISO(dataReferencia))}>
            <IconeMais />
            Novo agendamento
          </button>
        </div>
      </header>

      {(successMessage || (error && !algumModalAberto)) && (
        <div className="alerts">
          {error && !algumModalAberto && <p className="alert alert--error" role="alert">{error.message}</p>}
          {successMessage && <p className="alert alert--success" role="status">{successMessage}</p>}
        </div>
      )}

      <section className="card agenda-cal" aria-busy={loading}>
        <div className="agenda-toolbar">
          <div className="agenda-toolbar__nav">
            <button type="button" className="btn btn--ghost btn--sm" onClick={() => setDataReferencia(new Date())}>Hoje</button>
            <button type="button" className="icon-btn" aria-label="Período anterior" onClick={() => setDataReferencia(navegar(visao, dataReferencia, -1))}>
              <IconeSetaEsq />
            </button>
            <button type="button" className="icon-btn" aria-label="Próximo período" onClick={() => setDataReferencia(navegar(visao, dataReferencia, 1))}>
              <IconeSetaDir />
            </button>
            <h3 className="agenda-toolbar__titulo" aria-live="polite">{tituloDaVisao(visao, dataReferencia)}</h3>
          </div>

          <div className="agenda-visoes" role="group" aria-label="Modo de visualização">
            {VISOES.map(([chave, rotulo]) => (
              <button key={chave} type="button" className="agenda-visao" aria-pressed={visao === chave} onClick={() => setVisao(chave)}>
                {rotulo}
              </button>
            ))}
          </div>
        </div>

        <div className="agenda-filtros">
          <select className="input agenda-filtros__prof" value={profissionalId} onChange={(e) => setProfissionalEscolhido(e.target.value)} aria-label="Filtrar por profissional">
            <option value="">Todos os profissionais</option>
            {profissionais.map((p) => (
              <option key={p._id} value={p._id}>{p.nome}</option>
            ))}
          </select>

          <div className="search">
            <IconeBusca />
            <input className="input" type="search" value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar paciente" aria-label="Buscar paciente" />
          </div>

          {!soCancelados && (
            <button type="button" className="agenda-filtros__toggle" aria-pressed={mostrarCancelados} onClick={() => setMostrarCancelados(!mostrarCancelados)}>
              Cancelados
            </button>
          )}
          <button type="button" className="agenda-filtros__toggle agenda-filtros__toggle--perigo" aria-pressed={soCancelados} onClick={alternarSoCancelados}>
            Só cancelados
          </button>
        </div>

        {legenda.length > 0 && (
          <div className="agenda-legenda">
            <span className="agenda-legenda__titulo">Cor de cada profissional:</span>
            <ul className="agenda-legenda__lista" aria-label="Legenda de cores dos profissionais">
              {legenda.map(([id, nome]) => (
                <li key={id} className="agenda-legenda__item" data-cor={corDe(id)}>{nome}</li>
              ))}
            </ul>
            <span className="agenda-legenda__titulo agenda-legenda__nota">Nome riscado = cancelado</span>
          </div>
        )}

        {visao === 'mes' ? (
          <AgendaMes
            dataReferencia={dataReferencia}
            dias={dias}
            porDia={porDia}
            corDe={corDoAgendamento}
            hoje={hoje}
            onAbrir={setAgendaDetalhes}
            onNovoNoDia={novoAgendamento}
            onIrParaDia={irParaDia}
          />
        ) : (
          <AgendaGradeTempo
            dias={dias}
            porDia={porDia}
            corDe={corDoAgendamento}
            hoje={hoje}
            agora={agora}
            detalhado={visao === 'dia'}
            onAbrir={setAgendaDetalhes}
            onNovoEm={novoAgendamento}
            onIrParaDia={irParaDia}
          />
        )}

        {!loading && soCancelados && agendasFiltradas.length === 0 && (
          <p className="agenda-vazio">Nenhum agendamento cancelado {noPeriodo}.</p>
        )}

        {!loading && !soCancelados && visao === 'dia' && totalNoPeriodo === 0 && agendasFiltradas.length === 0 && (
          <p className="agenda-vazio">Nenhum agendamento neste dia. Clique no horário desejado para agendar.</p>
        )}
      </section>

      {slotNovo && (
        <NovoAgendamentoModal slotInicial={slotNovo} erro={error} onSave={addAgenda} onClose={() => setSlotNovo(null)} />
      )}

      {agendaEditando && (
        <EditarAgendamentoModal key={agendaEditando._id} agenda={agendaEditando} erro={error} onSave={editAgenda} onClose={() => setAgendaEditando(null)} />
      )}

      {agendaDetalhes && (
        <ProntuarioModal
          paciente={agendaDetalhes.pacienteId}
          agendamento={agendaDetalhes}
          somenteAgendamento={!podeVerProntuario}
          onEditarAgendamento={(agenda) => { setAgendaDetalhes(null); setAgendaEditando(agenda); }}
          onCancelarAgendamento={async (agenda) => { const cancelado = await handleCancelar(agenda); if (cancelado) setAgendaDetalhes(null); }}
          onImprimirAgendamento={(agenda) => handleImprimir(agenda._id)}
          onMarcarRealizado={podeMarcarRealizado(agendaDetalhes) ? handleRealizado : undefined}
          erroAgendamento={error}
          onClose={() => setAgendaDetalhes(null)}
        />
      )}
    </div>
  );
}
