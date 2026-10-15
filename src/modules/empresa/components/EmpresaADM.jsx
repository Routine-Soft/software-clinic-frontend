import { useState } from 'react';
import { useEmpresas } from '../empresa.hooks';
import { formatCnpj } from '../empresa.utils';
import EditarEmpresaModal from './EditarEmpresaModal';
import NovaEmpresaModal from './NovaEmpresaModal';
import { iniciais } from '@/utils/nome';
import { Icone, IconeMais, IconeLapis, IconeLixeira, IconeCheck, IconeX } from '@/components/CrudCard/icones';
import '@/components/CrudCard/CrudCard.css';
import { tr } from '@/i18n';

const IconeEmpresas = () => (
  <Icone>
    <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
    <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
    <path d="M10 6h4M10 10h4M10 14h4M10 18h4" />
  </Icone>
);

export default function EmpresaADM({ className = '' }) {
  const { empresas, loading, error, successMessage, addEmpresa, editEmpresa, removeEmpresa } = useEmpresas();

  const [criandoEmpresa, setCriandoEmpresa] = useState(false);
  const [empresaEditando, setEmpresaEditando] = useState(null);
  const [confirmandoId, setConfirmandoId] = useState(null);

  async function handleSalvarCriacao(dados) {
    return await addEmpresa(dados);
  }

  function handleEdit(empresa) {
    setConfirmandoId(null);
    setEmpresaEditando(empresa);
  }

  async function handleSalvarEdicao(id, dados) {
    return await editEmpresa(id, dados);
  }

  async function handleDelete(id) {
    setConfirmandoId(null);
    await removeEmpresa(id);
  }

  const algumModalAberto = criandoEmpresa || !!empresaEditando;

  return (
    <section className={`card crud-card ${className}`.trim()}>
      <header className="crud-card__head">
        <div className="crud-card__icon"><IconeEmpresas /></div>

        <div className="crud-card__titulos">
          <h3 className="crud-card__titulo">{tr('Empresas')}</h3>
          <p className="crud-card__subtitulo">{tr('Clientes pessoa jurídica (NR-01)')}</p>
        </div>

        {!loading && (
          <span className="badge badge--primary">
            {empresas.length} {empresas.length === 1 ? tr('empresa') : tr('empresas')}
          </span>
        )}
        <button type="button" className="btn btn--primary btn--sm crud-card__novo-btn" onClick={() => setCriandoEmpresa(true)} aria-label={tr('Adicionar empresa')}>
          <IconeMais />
          <span className="crud-card__rotulo">{tr('Adicionar')}</span>
        </button>
      </header>

      {(successMessage || (error && !algumModalAberto)) && (
        <div className="alerts crud-card__alertas">
          {error && !algumModalAberto && <p className="alert alert--error" role="alert">{error.message}</p>}
          {successMessage && <p className="alert alert--success" role="status">{successMessage}</p>}
        </div>
      )}

      {loading ? (
        <ul className="crud-lista" aria-busy="true" aria-label={tr('Carregando empresas')}>
          {[0, 1, 2].map((i) => (
            <li key={i} className="crud-item crud-item--skeleton" style={{ '--i': i }}>
              <div className="skeleton crud-item__icone-skeleton" />
              <div className="skeleton skeleton--line" style={{ width: `${60 - i * 10}%` }} />
            </li>
          ))}
        </ul>
      ) : empresas.length === 0 ? (
        <div className="crud-vazio">
          <IconeEmpresas />
          <p>{tr('Nenhuma empresa cadastrada ainda.')}</p>
        </div>
      ) : (
        <ul className="crud-lista">
          {empresas.map((empresa, index) => {
            const contato = [empresa.telefone, empresa.email].filter(Boolean).join(' · ');
            const mostraFantasia = empresa.nomeFantasia && empresa.nomeFantasia !== empresa.razaoSocial;
            return (
              <li
                key={empresa._id}
                className={`crud-item${empresaEditando?._id === empresa._id ? ' crud-item--editando' : ''}`}
                style={{ '--i': index }}
              >
                <div className="crud-item__icone crud-item__icone--iniciais" aria-hidden="true">{iniciais(empresa.nomeFantasia || empresa.razaoSocial)}</div>

                <div className="crud-item__info">
                  <span className="crud-item__nome" title={empresa.razaoSocial}>{empresa.razaoSocial}</span>
                  {mostraFantasia && <span className="crud-item__sub" title={empresa.nomeFantasia}>{empresa.nomeFantasia}</span>}
                  <span className="crud-item__meta">
                    <span className="badge badge--info">{formatCnpj(empresa.cnpj)}</span>
                    {empresa.setor && <span className="badge badge--primary">{empresa.setor}</span>}
                  </span>
                  {contato && <span className="crud-item__sub" title={contato}>{contato}</span>}
                  {empresa.endereco && <span className="crud-item__sub" title={empresa.endereco}>{empresa.endereco}</span>}
                </div>

                {confirmandoId === empresa._id ? (
                  <div className="crud-item__confirmar">
                    <span>{tr('Excluir?')}</span>
                    <button type="button" className="icon-btn icon-btn--danger" aria-label={tr('Confirmar exclusão de {razaoSocial}', { razaoSocial: empresa.razaoSocial })} onClick={() => handleDelete(empresa._id)}>
                      <IconeCheck />
                    </button>
                    <button type="button" className="icon-btn" aria-label={tr('Cancelar exclusão')} onClick={() => setConfirmandoId(null)}>
                      <IconeX />
                    </button>
                  </div>
                ) : (
                  <div className="crud-item__acoes">
                    <button type="button" className="icon-btn" aria-label={`Editar ${empresa.razaoSocial}`} title={tr('Editar')} onClick={() => handleEdit(empresa)}>
                      <IconeLapis />
                    </button>
                    <button type="button" className="icon-btn icon-btn--danger" aria-label={`Excluir ${empresa.razaoSocial}`} title={tr('Excluir')} onClick={() => setConfirmandoId(empresa._id)}>
                      <IconeLixeira />
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {empresaEditando && (
        <EditarEmpresaModal
          key={empresaEditando._id}
          empresa={empresaEditando}
          erro={error}
          onSave={handleSalvarEdicao}
          onClose={() => setEmpresaEditando(null)}
        />
      )}

      {criandoEmpresa && (
        <NovaEmpresaModal
          erro={error}
          onSave={handleSalvarCriacao}
          onClose={() => setCriandoEmpresa(false)}
        />
      )}
    </section>
  );
}
