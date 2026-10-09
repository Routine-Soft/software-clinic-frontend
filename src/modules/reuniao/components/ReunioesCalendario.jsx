import { useEffect, useMemo, useState } from 'react';
import { IconeMais, IconeBusca, IconeSetaEsq, IconeSetaDir } from '@/components/CrudCard/icones';
import { agruparPorDia, diasDoIntervalo, intervaloDaVisao, navegar, paraISO, tituloDaVisao } from '@/modules/agenda/agenda.utils';
import AgendaMes from '@/modules/agenda/components/AgendaMes';
import AgendaGradeTempo from '@/modules/agenda/components/AgendaGradeTempo';
import { useReunioes } from '../reuniao.hooks';
import { COR_REUNIAO, descreverReuniao, filtrarReunioes } from '../reuniao.utils';
import ReuniaoFormModal from './ReuniaoFormModal';
import ReuniaoDetalhesModal from './ReuniaoDetalhesModal';
import '@/modules/agenda/agenda.css';
import './reuniao.css';

const VISOES = [
  ['dia', 'Dia'],
  ['semana', 'Semana'],
  ['mes', 'Mês'],
];

const corDaReuniao = () => COR_REUNIAO;

// Agenda separada para reuniões internas (ex.: a dona conversando com um cliente antes de ele contratar).
// Mesmo calendário da Agenda, sem paciente, profissional, serviço nem valor. Só admin e recepção acessam.
export default function ReunioesCalendario() {
  const [agora, setAgora] = useState(() => new Date());
  const [visao, setVisao] = useState(() => (window.matchMedia?.('(max-width: 640px)').matches ? 'dia' : 'mes'));
  const [dataReferencia, setDataReferencia] = useState(() => new Date());
  const [busca, setBusca] = useState('');
  const [mostrarCanceladas, setMostrarCanceladas] = useState(true);

  const [slotNovo, setSlotNovo] = useState(null);
  const [reuniaoEditando, setReuniaoEditando] = useState(null);
  const [reuniaoAberta, setReuniaoAberta] = useState(null);

  useEffect(() => {
    const intervalo = setInterval(() => setAgora(new Date()), 60000);
    return () => clearInterval(intervalo);
  }, []);

  const hoje = paraISO(agora);
  const intervalo = useMemo(() => intervaloDaVisao(visao, dataReferencia), [visao, dataReferencia]);
  const dias = useMemo(() => diasDoIntervalo(intervalo), [intervalo]);

  const { reunioes, loading, error, successMessage, addReuniao, editReuniao, mudarStatus, removeReuniao } = useReunioes({
    dataInicio: paraISO(intervalo.inicio),
    dataFim: paraISO(intervalo.fim),
  });

  const filtradas = useMemo(() => {
    const lista = mostrarCanceladas ? reunioes : reunioes.filter((r) => r.status !== 'cancelado');
    return filtrarReunioes(lista, busca);
  }, [reunioes, mostrarCanceladas, busca]);

  const porDia = useMemo(() => agruparPorDia(filtradas), [filtradas]);

  const totalNoPeriodo = filtradas.filter((r) => r.status !== 'cancelado').length;
  const noPeriodo = visao === 'dia' ? 'no dia' : visao === 'semana' ? 'na semana' : 'no mês';

  function irParaDia(dia) {
    setDataReferencia(dia);
    setVisao('dia');
  }

  function novaReuniao(iso, horaInicio = '') {
    setSlotNovo({ data: iso, horaInicio });
  }

  async function handleMudarStatus(reuniao, status) {
    const atualizada = await mudarStatus(reuniao._id, status);
    if (atualizada) setReuniaoAberta(atualizada);
    return atualizada;
  }

  async function handleExcluir(reuniao) {
    const ok = await removeReuniao(reuniao._id);
    if (ok) setReuniaoAberta(null);
    return ok;
  }

  const algumModalAberto = !!slotNovo || !!reuniaoEditando || !!reuniaoAberta;

  return (
    <div className="page agenda-page">
      <header className="page-header">
        <div>
          <h2 className="page-title">Reuniões</h2>
          <p className="page-subtitle">Reuniões internas, como conversas com clientes antes de contratar. Os profissionais não veem.</p>
        </div>
        <div className="page-header__acoes">
          {!loading && (
            <span className="badge badge--primary">
              {totalNoPeriodo} {totalNoPeriodo === 1 ? 'reunião' : 'reuniões'} {noPeriodo}
            </span>
          )}
          <button type="button" className="btn btn--primary" onClick={() => novaReuniao(paraISO(dataReferencia))}>
            <IconeMais />
            Nova reunião
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
          <div className="search">
            <IconeBusca />
            <input className="input" type="search" value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar por nome, telefone ou assunto" aria-label="Buscar reunião" />
          </div>

          <button type="button" className="agenda-filtros__toggle" aria-pressed={mostrarCanceladas} onClick={() => setMostrarCanceladas(!mostrarCanceladas)}>
            Canceladas
          </button>
        </div>

        {visao === 'mes' ? (
          <AgendaMes
            dataReferencia={dataReferencia}
            dias={dias}
            porDia={porDia}
            corDe={corDaReuniao}
            descrever={descreverReuniao}
            hoje={hoje}
            onAbrir={setReuniaoAberta}
            onNovoNoDia={novaReuniao}
            onIrParaDia={irParaDia}
          />
        ) : (
          <AgendaGradeTempo
            dias={dias}
            porDia={porDia}
            corDe={corDaReuniao}
            descrever={descreverReuniao}
            hoje={hoje}
            agora={agora}
            detalhado={visao === 'dia'}
            onAbrir={setReuniaoAberta}
            onNovoEm={novaReuniao}
            onIrParaDia={irParaDia}
          />
        )}

        {!loading && visao === 'dia' && filtradas.length === 0 && (
          <p className="agenda-vazio">Nenhuma reunião neste dia. Clique no horário desejado para agendar.</p>
        )}
      </section>

      {slotNovo && (
        <ReuniaoFormModal slotInicial={slotNovo} erro={error} onSave={addReuniao} onClose={() => setSlotNovo(null)} />
      )}

      {reuniaoEditando && (
        <ReuniaoFormModal
          key={reuniaoEditando._id}
          reuniao={reuniaoEditando}
          erro={error}
          onSave={(dados) => editReuniao(reuniaoEditando._id, dados)}
          onClose={() => setReuniaoEditando(null)}
        />
      )}

      {reuniaoAberta && (
        <ReuniaoDetalhesModal
          key={`${reuniaoAberta._id}-${reuniaoAberta.status}`}
          reuniao={reuniaoAberta}
          erro={error}
          onEditar={(reuniao) => { setReuniaoAberta(null); setReuniaoEditando(reuniao); }}
          onMudarStatus={handleMudarStatus}
          onExcluir={handleExcluir}
          onClose={() => setReuniaoAberta(null)}
        />
      )}
    </div>
  );
}
