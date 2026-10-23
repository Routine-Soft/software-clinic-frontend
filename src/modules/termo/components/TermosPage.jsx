import { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthContext } from '@/hooks/useAuthContext';
import Modal from '@/components/Modal/Modal';
import { iniciais } from '@/utils/nome';
import {
  Icone, IconeMais, IconeBusca, IconeLapis, IconeLixeira, IconeCheck, IconeX, IconeImpressora, IconeMensagem,
} from '@/components/CrudCard/icones';
import { useTermos } from '../termo.hooks';
import { filtrarTermos, formatarDataHora, pendente, situacaoDoTermo } from '../termo.utils';
import EnviarTermoModal from './EnviarTermoModal';
import ModeloTermoModal from './ModeloTermoModal';
import CompartilharTermo from './CompartilharTermo';
import '@/components/CrudCard/CrudCard.css';
import '../termo.css';
import { tr } from '@/i18n';

const IconeTermo = () => (
  <Icone>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6M8 13h8M8 17h4" />
    <path d="m15 18 1.5 1.5L20 16" />
  </Icone>
);

const FILTROS = [
  { valor: 'todos', rotulo: tr('Todos') },
  { valor: 'pendente', rotulo: tr('Aguardando') },
  { valor: 'assinado', rotulo: tr('Assinados') },
];

function ListaTermos({ termos, loading, onCompartilhar, onCancelar }) {
  const [confirmandoId, setConfirmandoId] = useState(null);

  if (loading) {
    return (
      <ul className="crud-lista" aria-busy="true" aria-label={tr('Carregando termos')}>
        {[0, 1, 2].map((i) => (
          <li key={i} className="crud-item crud-item--skeleton" style={{ '--i': i }}>
            <div className="skeleton crud-item__icone-skeleton" />
            <div className="skeleton skeleton--line" style={{ width: `${65 - i * 10}%` }} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul className="crud-lista">
      {termos.map((termo, index) => {
        const situacao = situacaoDoTermo(termo);
        const nome = termo.pacienteId?.nome ?? tr('Paciente excluído');
        return (
          <li key={termo._id} className="crud-item" style={{ '--i': Math.min(index, 12) }}>
            <div className="crud-item__icone crud-item__icone--iniciais" aria-hidden="true">{iniciais(nome)}</div>
            <div className="crud-item__info">
              <span className="crud-item__nome" title={nome}>{nome}</span>
              <span className="crud-item__meta">
                <span className={`badge badge--${situacao.tom}`}>{situacao.rotulo}</span>
                <span className="termo-item__titulo">{termo.titulo}</span>
              </span>
              <span className="crud-item__sub">
                {termo.status === 'assinado'
                  ? tr('Assinado em {data} por {nome}', { data: formatarDataHora(termo.assinatura?.assinadoEm), nome: termo.assinatura?.nome })
                  : tr('Enviado em {data}', { data: formatarDataHora(termo.createdAt) })}
              </span>
            </div>

            {confirmandoId === termo._id ? (
              <div className="crud-item__confirmar">
                <span>{tr('Cancelar o link?')}</span>
                <button type="button" className="icon-btn icon-btn--danger" aria-label={tr('Confirmar cancelamento do termo de {nome}', { nome })} onClick={() => { setConfirmandoId(null); onCancelar(termo._id); }}>
                  <IconeCheck />
                </button>
                <button type="button" className="icon-btn" aria-label={tr('Manter o termo')} onClick={() => setConfirmandoId(null)}>
                  <IconeX />
                </button>
              </div>
            ) : (
              <div className="crud-item__acoes">
                {pendente(termo) && (
                  <button type="button" className="icon-btn" title={tr('Mandar o link')} aria-label={tr('Mandar o link do termo para {nome}', { nome })} onClick={() => onCompartilhar(termo)}>
                    <IconeMensagem />
                  </button>
                )}
                {termo.status === 'assinado' && (
                  <Link className="icon-btn" to={`/termos-consentimento/${termo._id}`} title={tr('Ver e imprimir')} aria-label={tr('Ver e imprimir o termo de {nome}', { nome })}>
                    <IconeImpressora />
                  </Link>
                )}
                {termo.status === 'pendente' && (
                  <button type="button" className="icon-btn icon-btn--danger" title={tr('Cancelar link')} aria-label={tr('Cancelar o termo de {nome}', { nome })} onClick={() => setConfirmandoId(termo._id)}>
                    <IconeX />
                  </button>
                )}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

function CartaoModelos({ modelos, loading, onNovo, onEditar, onExcluir }) {
  const [confirmandoId, setConfirmandoId] = useState(null);

  return (
    <section className="card crud-card">
      <header className="crud-card__head">
        <div className="crud-card__icon"><IconeTermo /></div>
        <div className="crud-card__titulos">
          <h3 className="crud-card__titulo">{tr('Modelos de termo')}</h3>
          <p className="crud-card__subtitulo">{tr('O texto base de cada termo da clínica')}</p>
        </div>
        <button type="button" className="btn btn--primary btn--sm crud-card__novo-btn" onClick={onNovo} aria-label={tr('Novo modelo')}>
          <IconeMais />
          <span className="crud-card__rotulo">{tr('Novo modelo')}</span>
        </button>
      </header>

      {loading ? (
        <ul className="crud-lista" aria-busy="true">
          {[0, 1].map((i) => (
            <li key={i} className="crud-item crud-item--skeleton" style={{ '--i': i }}>
              <div className="skeleton skeleton--line" style={{ width: `${70 - i * 15}%` }} />
            </li>
          ))}
        </ul>
      ) : modelos.length === 0 ? (
        <div className="crud-vazio">
          <IconeTermo />
          <p>{tr('Nenhum modelo de termo ainda.')}</p>
          <button type="button" className="btn btn--primary btn--sm" onClick={onNovo}>{tr('Criar modelo')}</button>
        </div>
      ) : (
        <ul className="crud-lista">
          {modelos.map((modelo, index) => (
            <li key={modelo._id} className="crud-item" style={{ '--i': index }}>
              <div className="crud-item__icone" aria-hidden="true"><IconeTermo /></div>
              <div className="crud-item__info">
                <span className="crud-item__nome" title={modelo.titulo}>{modelo.titulo}</span>
                <span className="crud-item__sub termo-modelo__previa">{modelo.texto.replace(/\s+/g, ' ').slice(0, 140)}</span>
              </div>
              {confirmandoId === modelo._id ? (
                <div className="crud-item__confirmar">
                  <span>{tr('Excluir?')}</span>
                  <button type="button" className="icon-btn icon-btn--danger" aria-label={tr('Confirmar exclusão de {nome}', { nome: modelo.titulo })} onClick={() => { setConfirmandoId(null); onExcluir(modelo._id); }}>
                    <IconeCheck />
                  </button>
                  <button type="button" className="icon-btn" aria-label={tr('Cancelar exclusão')} onClick={() => setConfirmandoId(null)}>
                    <IconeX />
                  </button>
                </div>
              ) : (
                <div className="crud-item__acoes">
                  <button type="button" className="icon-btn" title={tr('Editar')} aria-label={tr('Editar {nome}', { nome: modelo.titulo })} onClick={() => onEditar(modelo)}>
                    <IconeLapis />
                  </button>
                  <button type="button" className="icon-btn icon-btn--danger" title={tr('Excluir')} aria-label={tr('Excluir {nome}', { nome: modelo.titulo })} onClick={() => setConfirmandoId(modelo._id)}>
                    <IconeLixeira />
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

// Termos de consentimento (TCLE): envio do link ao paciente, acompanhamento e modelos da clínica.
export default function TermosPage() {
  const { user } = useAuthContext();
  const location = useLocation();
  const painel = useTermos();

  // Vindo da lista de pacientes ("Termos" na linha do paciente): já abre o envio com ele.
  const pacienteInicialId = location.state?.pacienteId ?? null;
  const [enviando, setEnviando] = useState(!!pacienteInicialId);
  const [compartilhando, setCompartilhando] = useState(null);
  const [editandoModelo, setEditandoModelo] = useState(null);
  const [busca, setBusca] = useState('');
  const [filtro, setFiltro] = useState('todos');

  const termosFiltrados = useMemo(() => filtrarTermos(painel.termos, { busca, status: filtro }), [painel.termos, busca, filtro]);
  const aguardando = painel.termos.filter(pendente).length;
  const algumModalAberto = enviando || !!editandoModelo;

  function abrirEnvio() {
    painel.limparAvisos();
    setEnviando(true);
  }

  function abrirModelo(modelo) {
    painel.limparAvisos();
    setEditandoModelo(modelo);
  }

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h2 className="page-title">{tr('Termos de consentimento')}</h2>
          <p className="page-subtitle">{tr('Mande o TCLE para o paciente ler e assinar pelo celular')}</p>
        </div>
        <div className="page-header__acoes">
          {!painel.loading && aguardando > 0 && (
            <span className="badge badge--warning">{aguardando === 1 ? tr('1 aguardando') : tr('{n} aguardando', { n: aguardando })}</span>
          )}
          <button type="button" className="btn btn--primary" onClick={abrirEnvio} disabled={painel.loading || painel.modelos.length === 0}>
            <IconeMais />
            {tr('Enviar termo')}
          </button>
        </div>
      </header>

      {(painel.successMessage || (painel.error && !algumModalAberto)) && (
        <div className="alerts">
          {painel.error && !algumModalAberto && <p className="alert alert--error" role="alert">{painel.error.message}</p>}
          {painel.successMessage && !algumModalAberto && <p className="alert alert--success" role="status">{painel.successMessage}</p>}
        </div>
      )}

      <div className="termos-grid">
        <section className="card crud-card">
          <header className="crud-card__head">
            <div className="crud-card__icon"><IconeMensagem /></div>
            <div className="crud-card__titulos">
              <h3 className="crud-card__titulo">{tr('Termos enviados')}</h3>
              <p className="crud-card__subtitulo">{tr('Acompanhe quem já assinou')}</p>
            </div>
            {!painel.loading && <span className="badge badge--primary">{painel.termos.length}</span>}
          </header>

          <div className="crud-card__barra termos-barra">
            <div className="search">
              <IconeBusca />
              <input className="input" type="search" value={busca} onChange={(e) => setBusca(e.target.value)} placeholder={tr('Buscar paciente ou termo')} aria-label={tr('Buscar termo')} />
            </div>
            <div className="termos-filtro" role="group" aria-label={tr('Filtrar termos')}>
              {FILTROS.map((f) => (
                <button key={f.valor} type="button" className={`termos-filtro__opcao${filtro === f.valor ? ' is-ativo' : ''}`} aria-pressed={filtro === f.valor} onClick={() => setFiltro(f.valor)}>
                  {f.rotulo}
                </button>
              ))}
            </div>
          </div>

          {!painel.loading && termosFiltrados.length === 0 ? (
            <div className="crud-vazio">
              <IconeTermo />
              <p>{painel.termos.length === 0 ? tr('Nenhum termo enviado ainda.') : tr('Nenhum termo encontrado com esse filtro.')}</p>
              {painel.termos.length === 0 && painel.modelos.length > 0 && (
                <button type="button" className="btn btn--primary btn--sm" onClick={abrirEnvio}>{tr('Enviar o primeiro termo')}</button>
              )}
            </div>
          ) : (
            <ListaTermos termos={termosFiltrados} loading={painel.loading} onCompartilhar={setCompartilhando} onCancelar={painel.cancelar} />
          )}
        </section>

        <CartaoModelos
          modelos={painel.modelos}
          loading={painel.loading}
          onNovo={() => abrirModelo({})}
          onEditar={abrirModelo}
          onExcluir={painel.removeModelo}
        />
      </div>

      <p className="termos-nota">
        {tr('A assinatura é eletrônica simples (Lei 14.063/2020): ficam guardados o desenho da assinatura, nome e CPF de quem assinou, data, hora, IP e aparelho, com um código que mostra que o texto não foi alterado. Os modelos de exemplo são um ponto de partida: revise com as regras do seu conselho profissional.')}
      </p>

      {enviando && (
        <EnviarTermoModal
          modelos={painel.modelos}
          pacienteInicialId={pacienteInicialId}
          erro={painel.error}
          onEnviar={painel.enviar}
          onClose={() => setEnviando(false)}
        />
      )}

      {editandoModelo && (
        <ModeloTermoModal
          modelo={editandoModelo._id ? editandoModelo : null}
          erro={painel.error}
          onSave={(dados) => (editandoModelo._id ? painel.editModelo(editandoModelo._id, dados) : painel.addModelo(dados))}
          onClose={() => setEditandoModelo(null)}
        />
      )}

      {compartilhando && (
        <Modal title={tr('Mandar o link do termo')} onClose={() => setCompartilhando(null)}>
          <div className="modal-form">
            <p className="modal-form__hint">
              {tr('{titulo} para {nome}. O link vale até {data}.', { titulo: compartilhando.titulo, nome: compartilhando.pacienteId?.nome, data: formatarDataHora(compartilhando.expiraEm) })}
            </p>
            <CompartilharTermo termo={compartilhando} clinica={user?.nomeEmpresa} />
          </div>
        </Modal>
      )}
    </div>
  );
}
