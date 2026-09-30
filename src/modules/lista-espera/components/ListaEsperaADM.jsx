import { useMemo, useState } from 'react';
import { usePacientes } from '@/modules/paciente/paciente.hooks';
import { createPaciente } from '@/modules/paciente/paciente.api';
import { useConvenios } from '@/modules/convenio/convenio.hooks';
import { useEmpresas } from '@/modules/empresa/empresa.hooks';
import { useEspecialidades } from '@/modules/especialidade/especialidade.hooks';
import { useProfissionais } from '@/modules/profissional/profissional.hooks';
import { useListaEspera } from '../lista-espera.hooks';
import { formatDataBR } from '@/utils/date';
import { Icone, IconeMais, IconeLixeira, IconeCheck, IconeX } from '@/components/CrudCard/icones';
import NovoItemEsperaModal from './NovoItemEsperaModal';
import '@/components/CrudCard/CrudCard.css';
import './lista-espera.css';

const STATUS = {
  aguardando: { rotulo: 'Aguardando', badge: 'warning' },
  chamado: { rotulo: 'Chamado', badge: 'info' },
  atendido: { rotulo: 'Atendido', badge: 'success' },
};

const ORDEM_STATUS = { chamado: 0, aguardando: 1, atendido: 2 };

const IconeFila = () => (
  <Icone>
    <path d="M10 2h4M12 14v-4" />
    <circle cx="12" cy="14" r="8" />
  </Icone>
);
const IconeSino = () => (
  <Icone>
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </Icone>
);
const IconeVoltar = () => (
  <Icone>
    <path d="M3 7v6h6" />
    <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
  </Icone>
);

function tempoDesde(iso) {
  const minutos = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (minutos < 1) return 'agora';
  if (minutos < 60) return `há ${minutos} min`;
  const horas = Math.floor(minutos / 60);
  if (horas < 24) return `há ${horas} h`;
  const dias = Math.floor(horas / 24);
  return `há ${dias} ${dias === 1 ? 'dia' : 'dias'}`;
}

export default function ListaEsperaADM({ className = '' }) {
  const { pacientes, refreshPacientes } = usePacientes();
  const { convenios } = useConvenios();
  const { empresas } = useEmpresas();
  const { especialidades, loading: carregandoEspecialidades } = useEspecialidades();
  const { profissionais } = useProfissionais();

  const [filtroEspecialidade, setFiltroEspecialidade] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('');
  const { itens, loading, error, successMessage, addItem, editItem, removeItem } = useListaEspera({
    especialidadeId: filtroEspecialidade || undefined,
  });

  const [criandoItem, setCriandoItem] = useState(false);
  const [confirmandoId, setConfirmandoId] = useState(null);

  const contagens = useMemo(() => {
    const total = { aguardando: 0, chamado: 0, atendido: 0 };
    itens.forEach((item) => { total[item.status] += 1; });
    return total;
  }, [itens]);

  const posicoes = useMemo(
    () => new Map(itens.filter((i) => i.status === 'aguardando').map((item, index) => [item._id, index + 1])),
    [itens]
  );

  const itensVisiveis = useMemo(() => {
    const filtrados = filtroStatus ? itens.filter((i) => i.status === filtroStatus) : itens;
    return [...filtrados].sort((a, b) => ORDEM_STATUS[a.status] - ORDEM_STATUS[b.status]);
  }, [itens, filtroStatus]);

  async function handleCriarPaciente(dados) {
    const response = await createPaciente(dados);
    await refreshPacientes();
    return response.data;
  }

  async function handleSalvarCriacao(dados) {
    return await addItem(dados);
  }

  async function handleStatusChange(id, status) {
    await editItem(id, { status });
  }

  async function handleDelete(id) {
    setConfirmandoId(null);
    await removeItem(id);
  }

  return (
    <section className={`card crud-card ${className}`.trim()}>
      <header className="crud-card__head">
        <div className="crud-card__icon"><IconeFila /></div>

        <div className="crud-card__titulos">
          <h3 className="crud-card__titulo">Lista de espera</h3>
          <p className="crud-card__subtitulo">Pacientes aguardando atendimento</p>
        </div>

        {!loading && (
          <span className="badge badge--warning badge--live">
            {contagens.aguardando} na fila
          </span>
        )}
      </header>

      {(successMessage || (error && !criandoItem)) && (
        <div className="alerts crud-card__alertas">
          {error && !criandoItem && <p className="alert alert--error" role="alert">{error.message}</p>}
          {successMessage && <p className="alert alert--success" role="status">{successMessage}</p>}
        </div>
      )}

      <div className="crud-card__barra">
        <select
          className="input espera-select"
          value={filtroEspecialidade}
          onChange={(e) => setFiltroEspecialidade(e.target.value)}
          aria-label="Filtrar por especialidade"
        >
          <option value="">Todas as especialidades</option>
          {especialidades.map((e) => (
            <option key={e._id} value={e._id}>{e.nome}</option>
          ))}
        </select>

        <button type="button" className="btn btn--primary" onClick={() => setCriandoItem(true)}>
          <IconeMais />
          Adicionar
        </button>
      </div>

      <div className="espera-abas" role="group" aria-label="Filtrar por status">
        {[['', 'Todos', itens.length], ['aguardando', 'Aguardando', contagens.aguardando], ['chamado', 'Chamados', contagens.chamado], ['atendido', 'Atendidos', contagens.atendido]].map(([valor, rotulo, total]) => (
          <button
            key={valor || 'todos'}
            type="button"
            className="espera-aba"
            aria-pressed={filtroStatus === valor}
            onClick={() => setFiltroStatus(valor)}
          >
            {rotulo}
            <span className="espera-aba__total">{loading ? '–' : total}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <ul className="crud-lista" aria-busy="true" aria-label="Carregando lista de espera">
          {[0, 1, 2].map((i) => (
            <li key={i} className="crud-item crud-item--skeleton" style={{ '--i': i }}>
              <div className="skeleton crud-item__icone-skeleton" />
              <div className="skeleton skeleton--line" style={{ width: `${60 - i * 10}%` }} />
            </li>
          ))}
        </ul>
      ) : itensVisiveis.length === 0 ? (
        <div className="crud-vazio">
          <IconeFila />
          <p>{itens.length === 0 ? 'Ninguém na lista de espera.' : 'Nenhum paciente com esse status.'}</p>
        </div>
      ) : (
        <ul className="crud-lista">
          {itensVisiveis.map((item, index) => {
            const status = STATUS[item.status];
            return (
              <li key={item._id} className="crud-item espera-item" data-status={item.status} style={{ '--i': Math.min(index, 12) }}>
                <div className="crud-item__icone espera-item__marca" aria-hidden="true">
                  {item.status === 'aguardando' ? <span>{posicoes.get(item._id)}º</span> : item.status === 'chamado' ? <IconeSino /> : <IconeCheck />}
                </div>

                <div className="crud-item__info">
                  <span className="crud-item__nome" title={item.pacienteId?.nome}>{item.pacienteId?.nome ?? '—'}</span>
                  <span className="crud-item__meta">
                    <span className={`badge badge--${status.badge}${item.status !== 'atendido' ? ' badge--live' : ''}`}>{status.rotulo}</span>
                    <span className="badge badge--primary">{item.especialidadeId?.nome}</span>
                  </span>
                  <span className="crud-item__sub">
                    {item.profissionalId?.nome ?? 'Qualquer profissional'}
                    {item.dataDesejada && ` · desejada ${formatDataBR(item.dataDesejada)}`}
                    {item.status !== 'atendido' && ` · ${tempoDesde(item.createdAt)}`}
                  </span>
                  {item.observacao && <span className="espera-item__obs" title={item.observacao}>{item.observacao}</span>}
                </div>

                {confirmandoId === item._id ? (
                  <div className="crud-item__confirmar">
                    <span>Remover?</span>
                    <button type="button" className="icon-btn icon-btn--danger" aria-label={`Confirmar remoção de ${item.pacienteId?.nome}`} onClick={() => handleDelete(item._id)}>
                      <IconeCheck />
                    </button>
                    <button type="button" className="icon-btn" aria-label="Cancelar remoção" onClick={() => setConfirmandoId(null)}>
                      <IconeX />
                    </button>
                  </div>
                ) : (
                  <div className="espera-item__acoes">
                    {item.status === 'aguardando' && (
                      <button type="button" className="btn btn--primary btn--sm" onClick={() => handleStatusChange(item._id, 'chamado')}>Chamar</button>
                    )}
                    {item.status === 'chamado' && (
                      <button type="button" className="btn btn--primary btn--sm" onClick={() => handleStatusChange(item._id, 'atendido')}>Atendido</button>
                    )}
                    {item.status !== 'aguardando' && (
                      <button type="button" className="icon-btn" aria-label={`Voltar ${item.pacienteId?.nome} para a fila`} title="Voltar para a fila" onClick={() => handleStatusChange(item._id, 'aguardando')}>
                        <IconeVoltar />
                      </button>
                    )}
                    <button type="button" className="icon-btn icon-btn--danger" aria-label={`Remover ${item.pacienteId?.nome}`} title="Remover" onClick={() => setConfirmandoId(item._id)}>
                      <IconeLixeira />
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {criandoItem && (
        <NovoItemEsperaModal
          pacientes={pacientes}
          convenios={convenios}
          empresas={empresas}
          especialidades={especialidades}
          carregandoEspecialidades={carregandoEspecialidades}
          profissionais={profissionais}
          onCriarPaciente={handleCriarPaciente}
          erro={error}
          onSave={handleSalvarCriacao}
          onClose={() => setCriandoItem(false)}
        />
      )}
    </section>
  );
}
