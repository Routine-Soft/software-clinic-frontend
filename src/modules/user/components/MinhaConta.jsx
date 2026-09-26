import { useState } from 'react';
import { useMinhaConta } from '../user.hooks';
import { useAuthContext } from '@/hooks/useAuthContext';
import { ROTULO_FUNCAO } from '../user.constants';
import AssinaturaStatus from '@/modules/assinatura/components/AssinaturaStatus';
import EditarMinhaContaModal from './EditarMinhaContaModal';
import AlterarSenhaModal from './AlterarSenhaModal';
import { iniciais } from '@/utils/nome';
import './user.css';
import './minha-conta.css';

export default function MinhaConta() {
  const { perfil, loading, error, successMessage, salvarPerfil, alterarSenha } = useMinhaConta();
  const { hasRole } = useAuthContext();

  const [editandoDados, setEditandoDados] = useState(false);
  const [alterandoSenha, setAlterandoSenha] = useState(false);

  const ehAdmin = hasRole('admin') || hasRole('super_admin');
  const algumModalAberto = editandoDados || alterandoSenha;

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h2 className="page-title">Minha conta</h2>
          <p className="page-subtitle">
            {ehAdmin ? 'Gerencie seus dados, sua senha e a assinatura da clínica' : 'Gerencie seus dados e sua senha'}
          </p>
        </div>
      </header>

      {(successMessage || (error && !algumModalAberto)) && (
        <div className="alerts">
          {error && !algumModalAberto && <p className="alert alert--error" role="alert">{error.message}</p>}
          {successMessage && <p className="alert alert--success" role="status">{successMessage}</p>}
        </div>
      )}

      <div className={`conta-grid${ehAdmin ? '' : ' conta-grid--single'}`}>
        {loading ? (
          <section className="card conta-perfil" aria-busy="true" aria-label="Carregando seus dados">
            <div className="conta-perfil__head">
              <div className="skeleton conta-perfil__avatar-skeleton" />
              <div className="conta-perfil__quem">
                <div className="skeleton skeleton--line" style={{ width: '60%', height: 20 }} />
                <div className="skeleton skeleton--line" style={{ width: '80%' }} />
              </div>
            </div>
            <div className="skeleton skeleton--line" style={{ width: '100%', height: 70 }} />
            <div className="skeleton skeleton--line" style={{ width: '50%', height: 40 }} />
          </section>
        ) : perfil ? (
          <section className="card conta-perfil">
            <div className="conta-perfil__head">
              <div className="avatar avatar--lg" data-role={perfil.role} aria-hidden="true">{iniciais(perfil.nomeCompleto)}</div>

              <div className="conta-perfil__quem">
                <h3 className="conta-perfil__nome">{perfil.nomeCompleto}</h3>
                <p className="conta-perfil__email">{perfil.email}</p>
                <span className={`badge badge--${perfil.role}`}>{ROTULO_FUNCAO[perfil.role] ?? perfil.role}</span>
              </div>
            </div>

            <dl className="conta-detalhes">
              <div>
                <dt>Telefone</dt>
                <dd>{perfil.telefone}</dd>
              </div>
              <div>
                <dt>Membro desde</dt>
                <dd>{new Date(perfil.createdAt).toLocaleDateString('pt-BR')}</dd>
              </div>
              <div>
                <dt>Clínica</dt>
                <dd>{perfil.nomeEmpresa || '—'}</dd>
              </div>
              {ehAdmin && (
                <div>
                  <dt>CNPJ</dt>
                  <dd>{perfil.cnpj || '—'}</dd>
                </div>
              )}
            </dl>

            <div className="conta-perfil__acoes">
              <button type="button" className="btn btn--primary" onClick={() => setEditandoDados(true)}>Editar dados</button>
              <button type="button" className="btn btn--ghost" onClick={() => setAlterandoSenha(true)}>Alterar senha</button>
            </div>
          </section>
        ) : (
          <section className="card conta-perfil">
            <p className="alert alert--error" role="alert">{error?.message ?? 'Não foi possível carregar seus dados.'}</p>
          </section>
        )}

        {ehAdmin && <AssinaturaStatus />}
      </div>

      {editandoDados && perfil && (
        <EditarMinhaContaModal
          perfil={perfil}
          ehAdmin={ehAdmin}
          erro={error}
          onSave={salvarPerfil}
          onClose={() => setEditandoDados(false)}
        />
      )}

      {alterandoSenha && (
        <AlterarSenhaModal
          erro={error}
          onSave={alterarSenha}
          onClose={() => setAlterandoSenha(false)}
        />
      )}
    </div>
  );
}
