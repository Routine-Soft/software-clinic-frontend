import { useMemo, useState } from 'react';
import { useAdmins } from '../clinica-admin.hooks';
import { formatarData, formatarPreco } from '@/modules/assinatura/assinatura.utils';
import { formatCnpj } from '@/modules/empresa/empresa.utils';
import { iniciais } from '@/utils/nome';
import EmailQuebravel from '@/components/EmailQuebravel';
import {
  IconeBusca,
  IconeMais,
  IconeLapis,
  IconeLixeira,
  IconeCheck,
  IconeX,
  IconeTrocar,
  IconeRelogioMais,
  IconeCadeado,
  IconeCadeadoAberto,
} from '@/components/CrudCard/icones';
import NovoAdminModal from './NovoAdminModal';
import EditarAdminModal from './EditarAdminModal';
import TrocarPlanoModal from './TrocarPlanoModal';
import './clinicas-adm.css';

const COBRANCA_ROTULO = { recorrente: 'Cartão', pix: 'Pix', manual: 'Manual' };

const STATUS_INFO = {
  trial: { rotulo: 'Teste', tom: 'info' },
  pendente: { rotulo: 'Pendente', tom: 'warning' },
  ativa: { rotulo: 'Ativa', tom: 'success' },
  inadimplente: { rotulo: 'Em atraso', tom: 'danger' },
  cancelada: { rotulo: 'Cancelada', tom: '' },
  expirada: { rotulo: 'Expirada', tom: '' },
};

export default function ClinicasADM() {
  const [busca, setBusca] = useState('');
  const { admins, loading, error, successMessage, addAdmin, editAdmin, removeAdmin, trocarPlano, estenderTeste, definirRevogacao } = useAdmins(busca);

  const [criando, setCriando] = useState(false);
  const [editando, setEditando] = useState(null);
  const [trocandoPlanoDe, setTrocandoPlanoDe] = useState(null);
  const [confirmando, setConfirmando] = useState(null); // { id, acao: 'excluir' | 'revogar' }

  const resumoContagem = useMemo(() => `${admins.length} ${admins.length === 1 ? 'clínica' : 'clínicas'}`, [admins.length]);
  const algumModalAberto = criando || !!editando || !!trocandoPlanoDe;

  function fecharConfirmacao() {
    setConfirmando(null);
  }

  async function handleExcluir(id) {
    await removeAdmin(id);
    fecharConfirmacao();
  }

  async function handleRevogar(id, revogado) {
    await definirRevogacao(id, revogado);
    fecharConfirmacao();
  }

  async function handleEstenderTeste(id) {
    await estenderTeste(id);
  }

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h2 className="page-title">Clínicas</h2>
          <p className="page-subtitle">Clínicas cadastradas na plataforma: edite dados, troque o plano ou revogue o acesso</p>
        </div>
        <div className="page-header__acoes">
          {!loading && <span className="badge badge--primary">{resumoContagem}</span>}
          <button type="button" className="btn btn--primary" onClick={() => setCriando(true)}>
            <IconeMais />
            Nova clínica
          </button>
        </div>
      </header>

      {(successMessage || (error && !algumModalAberto)) && (
        <div className="alerts">
          {error && !algumModalAberto && <p className="alert alert--error" role="alert">{error.message}</p>}
          {successMessage && <p className="alert alert--success" role="status">{successMessage}</p>}
        </div>
      )}

      <section className="card table-wrap">
        <div className="clinicas-toolbar">
          <div className="search">
            <IconeBusca />
            <input
              className="input"
              type="search"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Nome, e-mail ou clínica"
              aria-label="Buscar clínica"
            />
          </div>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>Clínica</th>
              <th>Contato</th>
              <th>Plano</th>
              <th>Situação</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [0, 1, 2].map((i) => (
                <tr key={i} style={{ '--i': i }}>
                  {[70, 55, 40, 35, 45].map((largura, coluna) => (
                    <td key={coluna}>
                      <div className="skeleton skeleton--line" style={{ width: `${largura}%` }} />
                    </td>
                  ))}
                </tr>
              ))
            ) : admins.length === 0 ? (
              <tr>
                <td className="table__empty" colSpan={5}>
                  {busca ? 'Nenhuma clínica encontrada para essa busca.' : 'Nenhuma clínica cadastrada ainda.'}
                </td>
              </tr>
            ) : (
              admins.map((admin, index) => {
                const assinatura = admin.assinatura;
                const status = assinatura ? (STATUS_INFO[assinatura.status] ?? { rotulo: assinatura.status, tom: '' }) : null;
                const revogado = !!assinatura?.acessoRevogado;
                const bloqueado = assinatura && !assinatura.acesso?.liberado;
                const podeEstenderTeste = assinatura && assinatura.status !== 'ativa'
                  && !(assinatura.status === 'cancelada' && assinatura.acesso?.liberado);

                return (
                  <tr key={admin._id} style={{ '--i': Math.min(index, 12) }}>
                    <td>
                      <div className="clinica-pessoa">
                        <div className="clinica-pessoa__avatar" aria-hidden="true">{iniciais(admin.nomeCompleto)}</div>
                        <div className="clinica-pessoa__dados">
                          <span className="clinica-pessoa__nome" title={admin.nomeCompleto}>{admin.nomeEmpresa}</span>
                          <span className="clinica-pessoa__sub" title={admin.nomeCompleto}>{admin.nomeCompleto}</span>
                          {admin.cnpj && <span className="clinica-pessoa__sub">{formatCnpj(admin.cnpj)}</span>}
                          <span className="clinica-pessoa__sub">Cliente desde {formatarData(admin.createdAt)}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="clinica-contato">
                        <span><EmailQuebravel email={admin.email} /></span>
                        <span>{admin.telefone}</span>
                      </div>
                    </td>
                    <td>
                      {assinatura?.planoId ? (
                        <div className="clinica-plano">
                          <span>{assinatura.planoId.nome}</span>
                          <span className="clinica-plano__preco">
                            {assinatura.planoId.preco > 0
                              ? `${formatarPreco(assinatura.planoId.preco)} · ${COBRANCA_ROTULO[assinatura.cobranca] ?? assinatura.cobranca}`
                              : 'Grátis'}
                          </span>
                        </div>
                      ) : (
                        <span className="clinica-pessoa__sub">Sem assinatura</span>
                      )}
                    </td>
                    <td>
                      <div className="clinica-situacao">
                        <span className="badge-linha">
                          {revogado && <span className="badge badge--danger">Acesso revogado</span>}
                          {!revogado && bloqueado && <span className="badge badge--danger">Bloqueada</span>}
                          {status && (!revogado) && (
                            <span className={`badge${status.tom ? ` badge--${status.tom}` : ''}`}>{status.rotulo}</span>
                          )}
                        </span>
                        {assinatura?.acesso?.ate && (
                          <span className="clinica-situacao__ate">
                            {assinatura.acesso.liberado ? 'Acesso até' : 'Venceu em'} {formatarData(assinatura.acesso.ate)}
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      {confirmando?.id === admin._id ? (
                        <div className="clinica-confirmar">
                          <span>{confirmando.acao === 'excluir' ? 'Apagar clínica?' : 'Revogar acesso?'}</span>
                          <button
                            type="button"
                            className="icon-btn icon-btn--danger"
                            aria-label="Confirmar"
                            title={confirmando.acao === 'excluir'
                              ? 'Remove o administrador e o registro de assinatura. Pacientes, agenda e demais dados da clínica não são apagados.'
                              : 'Bloqueia o acesso de toda a clínica até você restabelecer'}
                            onClick={() => (confirmando.acao === 'excluir' ? handleExcluir(admin._id) : handleRevogar(admin._id, true))}
                          >
                            <IconeCheck />
                          </button>
                          <button type="button" className="icon-btn" aria-label="Cancelar" onClick={fecharConfirmacao}>
                            <IconeX />
                          </button>
                        </div>
                      ) : (
                        <div className="table__actions">
                          <button type="button" className="icon-btn" title="Editar" aria-label={`Editar ${admin.nomeEmpresa}`} onClick={() => setEditando(admin)}>
                            <IconeLapis />
                          </button>
                          <button type="button" className="icon-btn" title="Trocar plano" aria-label={`Trocar plano de ${admin.nomeEmpresa}`} onClick={() => setTrocandoPlanoDe(admin)}>
                            <IconeTrocar />
                          </button>
                          {podeEstenderTeste && (
                            <button
                              type="button"
                              className="icon-btn"
                              title="Estender teste em +3 dias"
                              aria-label={`Estender teste de ${admin.nomeEmpresa} em mais 3 dias`}
                              onClick={() => handleEstenderTeste(admin._id)}
                            >
                              <IconeRelogioMais />
                            </button>
                          )}
                          {revogado ? (
                            <button type="button" className="icon-btn" title="Restabelecer acesso" aria-label={`Restabelecer acesso de ${admin.nomeEmpresa}`} onClick={() => handleRevogar(admin._id, false)}>
                              <IconeCadeadoAberto />
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="icon-btn"
                              title="Revogar acesso"
                              aria-label={`Revogar acesso de ${admin.nomeEmpresa}`}
                              onClick={() => setConfirmando({ id: admin._id, acao: 'revogar' })}
                            >
                              <IconeCadeado />
                            </button>
                          )}
                          <button
                            type="button"
                            className="icon-btn icon-btn--danger"
                            title="Excluir"
                            aria-label={`Excluir ${admin.nomeEmpresa}`}
                            onClick={() => setConfirmando({ id: admin._id, acao: 'excluir' })}
                          >
                            <IconeLixeira />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </section>

      <p className="page-subtitle">
        Excluir uma clínica remove o administrador e o registro de assinatura; pacientes, agenda e os demais dados dela permanecem no banco.
      </p>

      {criando && (
        <NovoAdminModal
          erro={error}
          onSave={addAdmin}
          onClose={() => setCriando(false)}
        />
      )}

      {editando && (
        <EditarAdminModal
          key={editando._id}
          admin={editando}
          erro={error}
          onSave={editAdmin}
          onClose={() => setEditando(null)}
        />
      )}

      {trocandoPlanoDe && (
        <TrocarPlanoModal
          key={trocandoPlanoDe._id}
          admin={trocandoPlanoDe}
          erro={error}
          onSave={trocarPlano}
          onClose={() => setTrocandoPlanoDe(null)}
        />
      )}
    </div>
  );
}
