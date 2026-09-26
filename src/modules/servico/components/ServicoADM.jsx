import { useState } from 'react';
import { useServicos } from '../servico.hooks';
import EditarServicoModal from './EditarServicoModal';
import NovoServicoModal from './NovoServicoModal';
import { Icone, IconeMais, IconeLapis, IconeLixeira, IconeCheck, IconeX } from '@/components/CrudCard/icones';
import '@/components/CrudCard/CrudCard.css';

const IconeServicos = () => (
  <Icone>
    <path d="M12 11v4M14 13h-4" />
    <path d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2M18 6v14M6 6v14" />
    <rect width="20" height="14" x="2" y="6" rx="2" />
  </Icone>
);

const IconeConsulta = () => (
  <Icone>
    <path d="M11 2v2M5 2v2" />
    <path d="M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1" />
    <path d="M8 15a6 6 0 0 0 12 0v-3" />
    <circle cx="20" cy="10" r="2" />
  </Icone>
);

const IconePacote = () => (
  <Icone>
    <path d="m7.5 4.27 9 5.15" />
    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
    <path d="m3.3 7 8.7 5 8.7-5M12 22V12" />
  </Icone>
);

function formatarPreco(preco) {
  return preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function rotuloDias(qtdDias) {
  return qtdDias === 1 ? '1 dia' : `${qtdDias} dias`;
}

export default function ServicoADM({ className = '' }) {
  const { servicos, loading, error, successMessage, addServico, editServico, removeServico } = useServicos();

  const [servicoEditando, setServicoEditando] = useState(null);
  const [confirmandoId, setConfirmandoId] = useState(null);
  const [criandoServico, setCriandoServico] = useState(false);

  async function handleSalvarCriacao(dados) {
    return await addServico(dados);
  }

  function handleEdit(servico) {
    setConfirmandoId(null);
    setServicoEditando(servico);
  }

  async function handleSalvarEdicao(id, dados) {
    return await editServico(id, dados);
  }

  async function handleDelete(id) {
    setConfirmandoId(null);
    await removeServico(id);
  }

  const algumModalAberto = criandoServico || !!servicoEditando;

  return (
    <section className={`card crud-card ${className}`.trim()}>
      <header className="crud-card__head">
        <div className="crud-card__icon"><IconeServicos /></div>

        <div className="crud-card__titulos">
          <h3 className="crud-card__titulo">Serviços</h3>
          <p className="crud-card__subtitulo">Consultas e pacotes oferecidos pela clínica</p>
        </div>

        {!loading && (
          <span className="badge badge--primary">
            {servicos.length} {servicos.length === 1 ? 'serviço' : 'serviços'}
          </span>
        )}
        <button type="button" className="btn btn--primary btn--sm crud-card__novo-btn" onClick={() => setCriandoServico(true)} aria-label="Adicionar serviço">
          <IconeMais />
          <span className="crud-card__rotulo">Adicionar</span>
        </button>
      </header>

      {(successMessage || (error && !algumModalAberto)) && (
        <div className="alerts crud-card__alertas">
          {error && !algumModalAberto && <p className="alert alert--error" role="alert">{error.message}</p>}
          {successMessage && <p className="alert alert--success" role="status">{successMessage}</p>}
        </div>
      )}

      {loading ? (
        <ul className="crud-lista" aria-busy="true" aria-label="Carregando serviços">
          {[0, 1, 2].map((i) => (
            <li key={i} className="crud-item crud-item--skeleton" style={{ '--i': i }}>
              <div className="skeleton crud-item__icone-skeleton" />
              <div className="skeleton skeleton--line" style={{ width: `${60 - i * 10}%` }} />
            </li>
          ))}
        </ul>
      ) : servicos.length === 0 ? (
        <div className="crud-vazio">
          <IconeServicos />
          <p>Nenhum serviço cadastrado ainda.</p>
        </div>
      ) : (
        <ul className="crud-lista">
          {servicos.map((servico, index) => {
            const ehPacote = servico.tipo === 'pacote';
            return (
              <li
                key={servico._id}
                className={`crud-item${servicoEditando?._id === servico._id ? ' crud-item--editando' : ''}`}
                style={{ '--i': index }}
              >
                <div className="crud-item__icone">{ehPacote ? <IconePacote /> : <IconeConsulta />}</div>

                <div className="crud-item__info">
                  <span className="crud-item__nome" title={servico.nome}>{servico.nome}</span>
                  <span className="crud-item__meta">
                    <span className={`badge ${ehPacote ? 'badge--primary' : 'badge--info'}`}>{ehPacote ? 'Pacote' : 'Consulta'}</span>
                    {ehPacote && servico.qtdDias ? <span>{rotuloDias(servico.qtdDias)}</span> : null}
                  </span>
                </div>

                <span className="crud-item__valor">{formatarPreco(servico.preco)}</span>

                {confirmandoId === servico._id ? (
                  <div className="crud-item__confirmar">
                    <span>Excluir?</span>
                    <button type="button" className="icon-btn icon-btn--danger" aria-label={`Confirmar exclusão de ${servico.nome}`} onClick={() => handleDelete(servico._id)}>
                      <IconeCheck />
                    </button>
                    <button type="button" className="icon-btn" aria-label="Cancelar exclusão" onClick={() => setConfirmandoId(null)}>
                      <IconeX />
                    </button>
                  </div>
                ) : (
                  <div className="crud-item__acoes">
                    <button type="button" className="icon-btn" aria-label={`Editar ${servico.nome}`} title="Editar" onClick={() => handleEdit(servico)}>
                      <IconeLapis />
                    </button>
                    <button type="button" className="icon-btn icon-btn--danger" aria-label={`Excluir ${servico.nome}`} title="Excluir" onClick={() => setConfirmandoId(servico._id)}>
                      <IconeLixeira />
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {servicoEditando && (
        <EditarServicoModal
          key={servicoEditando._id}
          servico={servicoEditando}
          erro={error}
          onSave={handleSalvarEdicao}
          onClose={() => setServicoEditando(null)}
        />
      )}

      {criandoServico && (
        <NovoServicoModal
          erro={error}
          onSave={handleSalvarCriacao}
          onClose={() => setCriandoServico(false)}
        />
      )}
    </section>
  );
}
