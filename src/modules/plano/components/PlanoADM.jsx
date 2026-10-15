import { useState } from 'react';
import { usePlanos } from '../plano.hooks';
import EditarPlanoModal from './EditarPlanoModal';
import NovoPlanoModal from './NovoPlanoModal';
import { IconeMais } from '@/components/CrudCard/icones';
import { localeAtual, tr } from '@/i18n';

function formatarPreco(plano) {
  if (plano.tipo === 'gratis' && !plano.preco) return tr('Grátis');
  return plano.preco.toLocaleString(localeAtual(), { style: 'currency', currency: plano.moeda === 'USD' ? 'USD' : 'BRL' });
}

export default function PlanoADM() {
  const { planos, loading, error, successMessage, addPlano, editPlano, removePlano } = usePlanos();

  const [criandoPlano, setCriandoPlano] = useState(false);
  const [planoEditando, setPlanoEditando] = useState(null);

  async function handleSalvarCriacao(dados) {
    return await addPlano(dados);
  }

  function handleEdit(plano) {
    setPlanoEditando(plano);
  }

  async function handleSalvarEdicao(id, dados) {
    return await editPlano(id, dados);
  }

  async function handleToggleAtivo(plano) {
    await editPlano(plano._id, { ativo: !plano.ativo });
  }

  async function handleDelete(id) {
    await removePlano(id);
  }

  const algumModalAberto = criandoPlano || !!planoEditando;

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h2 className="page-title">{tr('Planos')}</h2>
          <p className="page-subtitle">{tr('Planos de assinatura oferecidos às clínicas')}</p>
        </div>
        <div className="page-header__acoes">
          {!loading && (
            <span className="badge badge--primary">
            {planos.length} {planos.length === 1 ? tr('plano') : tr('planos')}
          </span>
          )}
          <button type="button" className="btn btn--primary" onClick={() => setCriandoPlano(true)}>
            <IconeMais />
            {tr('Novo plano')}
          </button>
        </div>
      </header>

      {(successMessage || (error && !algumModalAberto)) && (
        <div className="alerts">
          {error && !algumModalAberto && <p className="alert alert--error" role="alert">{error.message}</p>}
          {successMessage && <p className="alert alert--success" role="status">{successMessage}</p>}
        </div>
      )}

      <section className="card table-wrap" aria-busy={loading}>
        <table className="table">
          <thead>
            <tr>
              <th>{tr('Plano')}</th>
              <th>{tr('Preço mensal')}</th>
              <th>{tr('Trial')}</th>
              <th>{tr('Status')}</th>
              <th>{tr('Ações')}</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [0, 1, 2].map((i) => (
                <tr key={i} style={{ '--i': i }}>
                  {[60, 40, 30, 45, 35].map((largura, coluna) => (
                    <td key={coluna}>
                      <div className="skeleton skeleton--line" style={{ width: `${largura}%` }} />
                    </td>
                  ))}
                </tr>
              ))
            ) : planos.length === 0 ? (
              <tr>
                <td className="table__empty" colSpan={5}>{tr('Nenhum plano cadastrado ainda.')}</td>
              </tr>
            ) : (
              planos.map((plano, index) => (
                <tr
                  key={plano._id}
                  style={{ '--i': index }}
                  className={[planoEditando?._id === plano._id && 'is-editing', !plano.ativo && 'is-inactive'].filter(Boolean).join(' ')}
                >
                  <td>
                    <div className="dim">
                      <strong>{plano.nome}</strong>{' '}
                      <span className={`badge ${plano.tipo === 'pago' ? 'badge--primary' : 'badge--info'}`}>
                        {plano.tipo === 'pago' ? tr('Pago') : tr('Teste grátis do cadastro')}
                      </span>
                      {plano.individual && <span className="badge badge--info">{tr('Individual')}</span>}
                      {plano.moeda === 'USD' && (
                        <span className={`badge ${plano.stripePriceId ? 'badge--success' : 'badge--warning'}`} title={plano.stripePriceId ?? tr('Ainda sem preço no Stripe: confira as chaves do Stripe e salve o plano de novo')}>
                          {plano.stripePriceId ? tr('Dólar · Stripe') : tr('Dólar · sem preço no Stripe')}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="table__num">
                    <span className="dim">{formatarPreco(plano)}</span>
                  </td>
                  <td className="nowrap">
                    <span className="dim">{plano.duracaoDiasTrial ? `${plano.duracaoDiasTrial} dias` : '—'}</span>
                  </td>
                  <td>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={plano.ativo}
                      aria-label={`${plano.ativo ? tr('Desativar') : tr('Ativar')} plano ${plano.nome}`}
                      className="switch"
                      onClick={() => handleToggleAtivo(plano)}
                    >
                      <span className="switch__track" />
                      {plano.ativo ? tr('Ativo') : tr('Inativo')}
                    </button>
                  </td>
                  <td>
                    <div className="table__actions">
                      <button className="btn btn--ghost btn--sm" onClick={() => handleEdit(plano)}>{tr('Editar')}</button>
                      <button className="btn btn--danger btn--sm" onClick={() => handleDelete(plano._id)}>{tr('Excluir')}</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>

      {planoEditando && (
        <EditarPlanoModal
          key={planoEditando._id}
          plano={planoEditando}
          erro={error}
          onSave={handleSalvarEdicao}
          onClose={() => setPlanoEditando(null)}
        />
      )}

      {criandoPlano && (
        <NovoPlanoModal
          erro={error}
          onSave={handleSalvarCriacao}
          onClose={() => setCriandoPlano(false)}
        />
      )}
    </div>
  );
}
