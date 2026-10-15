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
  IconeChave,
  IconeCadeado,
  IconeCadeadoAberto,
  IconeTelefone,
  IconeGrafico,
  IconeMensagem,
} from '@/components/CrudCard/icones';
import NovoAdminModal from './NovoAdminModal';
import EditarAdminModal from './EditarAdminModal';
import TrocarPlanoModal from './TrocarPlanoModal';
import RedefinirSenhaAdminModal from './RedefinirSenhaAdminModal';
import DetalhesClinicaModal from './DetalhesClinicaModal';
import { tempoDeCasa } from '../clinica-admin.utils';
import { linkWhatsapp } from '@/utils/whatsapp';
import './clinicas-adm.css';
import { idiomaAtual, tr } from '@/i18n';
import { nomeDoPais } from '@/i18n/paises';

const COBRANCA_ROTULO = { recorrente: tr('Cartão'), pix: tr('Pix'), manual: tr('Manual'), stripe: tr('Stripe') };

const STATUS_INFO = {
  trial: { rotulo: tr('Teste'), tom: 'info' },
  pendente: { rotulo: tr('Pendente'), tom: 'warning' },
  ativa: { rotulo: tr('Ativa'), tom: 'success' },
  inadimplente: { rotulo: tr('Em atraso'), tom: 'danger' },
  cancelada: { rotulo: tr('Cancelada'), tom: '' },
  expirada: { rotulo: tr('Expirada'), tom: '' },
};

export default function ClinicasADM() {
  const [busca, setBusca] = useState('');
  const { admins, loading, error, successMessage, addAdmin, editAdmin, removeAdmin, trocarPlano, estenderTeste, definirRevogacao, redefinirSenha, definirLembretesWhatsapp } = useAdmins(busca);

  const [criando, setCriando] = useState(false);
  const [editando, setEditando] = useState(null);
  const [trocandoPlanoDe, setTrocandoPlanoDe] = useState(null);
  const [redefinindoSenhaDe, setRedefinindoSenhaDe] = useState(null);
  const [detalhesDe, setDetalhesDe] = useState(null);
  const [confirmando, setConfirmando] = useState(null); // { id, acao: 'excluir' | 'revogar' }

  const resumoContagem = useMemo(() => `${admins.length} ${admins.length === 1 ? tr('clínica') : tr('clínicas')}`, [admins.length]);
  const algumModalAberto = criando || !!editando || !!trocandoPlanoDe || !!redefinindoSenhaDe;

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
          <h2 className="page-title">{tr('Clínicas')}</h2>
          <p className="page-subtitle">{tr('Clínicas cadastradas na plataforma: edite dados, troque o plano ou revogue o acesso')}</p>
        </div>
        <div className="page-header__acoes">
          {!loading && <span className="badge badge--primary">{resumoContagem}</span>}
          <button type="button" className="btn btn--primary" onClick={() => setCriando(true)}>
            <IconeMais />
            {tr('Nova clínica')}
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
              placeholder={tr('Nome, e-mail ou clínica')}
              aria-label={tr('Buscar clínica')}
            />
          </div>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>{tr('Clínica')}</th>
              <th>{tr('Contato')}</th>
              <th>{tr('Plano')}</th>
              <th>{tr('Situação')}</th>
              <th>{tr('Ações')}</th>
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
                  {busca ? tr('Nenhuma clínica encontrada para essa busca.') : tr('Nenhuma clínica cadastrada ainda.')}
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
                          <span className="clinica-pessoa__nome" title={admin.nomeCompleto}>
                            {admin.nomeEmpresa}
                            {admin.pais && admin.pais !== 'BR' && <span className="badge badge--info clinica-pais" title={nomeDoPais(admin.pais, idiomaAtual())}>{admin.pais}</span>}
                          </span>
                          <span className="clinica-pessoa__sub" title={admin.nomeCompleto}>{admin.nomeCompleto}</span>
                          {admin.cnpj && <span className="clinica-pessoa__sub">{formatCnpj(admin.cnpj)}</span>}
                          <span className="clinica-pessoa__sub" title={`Desde ${formatarData(admin.createdAt)}`}>
                            {tr('Cliente {p0} ({p1})', { p0: tempoDeCasa(admin.createdAt) === 'hoje' ? tr('desde hoje') : tr('há {p0}', { p0: tempoDeCasa(admin.createdAt) }), p1: formatarData(admin.createdAt) })}
                          </span>
                          {admin.estatisticas && (
                            <span className="clinica-uso">
                              {[
                                ['usuarios', tr('usuário'), tr('usuários')],
                                ['profissionais', 'profissional', 'profissionais'],
                                ['pacientes', 'paciente', 'pacientes'],
                                ['empresas', 'empresa', 'empresas'],
                              ].map(([campo, singular, plural]) => (
                                <span key={campo}><strong>{admin.estatisticas[campo]}</strong> {admin.estatisticas[campo] === 1 ? singular : plural}</span>
                              ))}
                              <span>
                                {tr('Agenda:')} <strong>{admin.estatisticas.agendamentos.abertos}</strong> {tr('em aberto,')}{' '}
                                <strong>{admin.estatisticas.agendamentos.realizados}</strong> {admin.estatisticas.agendamentos.realizados === 1 ? tr('realizado') : tr('realizados')},{' '}
                                <strong>{admin.estatisticas.agendamentos.cancelados}</strong> {admin.estatisticas.agendamentos.cancelados === 1 ? tr('cancelado') : tr('cancelados')}
                              </span>
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="clinica-contato">
                        <span><EmailQuebravel email={admin.email} /></span>
                        {linkWhatsapp(admin.telefone) ? (
                          <a className="clinica-whats" href={linkWhatsapp(admin.telefone)} target="_blank" rel="noopener noreferrer" title={tr('Abrir conversa no WhatsApp')}>
                            <IconeTelefone />
                            {admin.telefone}
                          </a>
                        ) : (
                          <span>{admin.telefone}</span>
                        )}
                      </div>
                    </td>
                    <td>
                      {assinatura?.planoId ? (
                        <div className="clinica-plano">
                          <span>{tr(assinatura.planoId.nome)}</span>
                          <span className="clinica-plano__preco">
                            {assinatura.planoId.preco > 0
                              ? `${formatarPreco(assinatura.planoId.preco, assinatura.planoId.moeda)} · ${COBRANCA_ROTULO[assinatura.cobranca] ?? assinatura.cobranca}`
                              : tr('Grátis')}
                          </span>
                        </div>
                      ) : (
                        <span className="clinica-pessoa__sub">{tr('Sem assinatura')}</span>
                      )}
                      {admin.estatisticas && (
                        <span className="clinica-plano__pago">{tr('Total pago: {p0}', { p0: formatarPreco(admin.estatisticas.totalPago, admin.estatisticas.moedaPaga) })}</span>
                      )}
                    </td>
                    <td>
                      <div className="clinica-situacao">
                        <span className="badge-linha">
                          {revogado && <span className="badge badge--danger">{tr('Acesso revogado')}</span>}
                          {!revogado && bloqueado && <span className="badge badge--danger">{tr('Bloqueada')}</span>}
                          {status && (!revogado) && (
                            <span className={`badge${status.tom ? ` badge--${status.tom}` : ''}`}>{status.rotulo}</span>
                          )}
                          {admin.lembretesWhatsapp && <span className="badge badge--success">{tr('WhatsApp')}</span>}
                        </span>
                        {assinatura?.acesso?.ate && (
                          <span className="clinica-situacao__ate">
                            {assinatura.acesso.liberado ? tr('Acesso até') : tr('Venceu em')} {formatarData(assinatura.acesso.ate)}
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      {confirmando?.id === admin._id ? (
                        <div className="clinica-confirmar">
                          <span>{confirmando.acao === 'excluir' ? tr('Apagar clínica?') : tr('Revogar acesso?')}</span>
                          <button
                            type="button"
                            className="icon-btn icon-btn--danger"
                            aria-label={tr('Confirmar')}
                            title={confirmando.acao === 'excluir'
                              ? tr('Remove o administrador e o registro de assinatura. Pacientes, agenda e demais dados da clínica não são apagados.')
                              : tr('Bloqueia o acesso de toda a clínica até você restabelecer')}
                            onClick={() => (confirmando.acao === 'excluir' ? handleExcluir(admin._id) : handleRevogar(admin._id, true))}
                          >
                            <IconeCheck />
                          </button>
                          <button type="button" className="icon-btn" aria-label={tr('Cancelar')} onClick={fecharConfirmacao}>
                            <IconeX />
                          </button>
                        </div>
                      ) : (
                        <div className="table__actions clinica-acoes">
                          <button type="button" className="icon-btn" title={tr('Detalhes e pagamentos')} aria-label={tr('Detalhes e pagamentos de {nomeEmpresa}', { nomeEmpresa: admin.nomeEmpresa })} onClick={() => setDetalhesDe(admin)}>
                            <IconeGrafico />
                          </button>
                          <button type="button" className="icon-btn" title={tr('Editar')} aria-label={`Editar ${admin.nomeEmpresa}`} onClick={() => setEditando(admin)}>
                            <IconeLapis />
                          </button>
                          <button type="button" className="icon-btn" title={tr('Trocar plano')} aria-label={tr('Trocar plano de {nomeEmpresa}', { nomeEmpresa: admin.nomeEmpresa })} onClick={() => setTrocandoPlanoDe(admin)}>
                            <IconeTrocar />
                          </button>
                          <button
                            type="button"
                            className={`icon-btn${admin.lembretesWhatsapp ? ' icon-btn--ativo' : ''}`}
                            aria-pressed={!!admin.lembretesWhatsapp}
                            title={admin.lembretesWhatsapp ? tr('Lembretes pelo WhatsApp ligados (clique para desligar)') : tr('Ligar lembretes pelo WhatsApp')}
                            aria-label={tr('Lembretes pelo WhatsApp de {nomeEmpresa}', { nomeEmpresa: admin.nomeEmpresa })}
                            onClick={() => definirLembretesWhatsapp(admin._id, !admin.lembretesWhatsapp)}
                          >
                            <IconeMensagem />
                          </button>
                          <button type="button" className="icon-btn" title={tr('Redefinir senha')} aria-label={tr('Redefinir senha de {nomeEmpresa}', { nomeEmpresa: admin.nomeEmpresa })} onClick={() => setRedefinindoSenhaDe(admin)}>
                            <IconeChave />
                          </button>
                          {podeEstenderTeste && (
                            <button
                              type="button"
                              className="icon-btn"
                              title={tr('Estender teste em +3 dias')}
                              aria-label={tr('Estender teste de {nomeEmpresa} em mais 3 dias', { nomeEmpresa: admin.nomeEmpresa })}
                              onClick={() => handleEstenderTeste(admin._id)}
                            >
                              <IconeRelogioMais />
                            </button>
                          )}
                          {revogado ? (
                            <button type="button" className="icon-btn" title={tr('Restabelecer acesso')} aria-label={tr('Restabelecer acesso de {nomeEmpresa}', { nomeEmpresa: admin.nomeEmpresa })} onClick={() => handleRevogar(admin._id, false)}>
                              <IconeCadeadoAberto />
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="icon-btn"
                              title={tr('Revogar acesso')}
                              aria-label={tr('Revogar acesso de {nomeEmpresa}', { nomeEmpresa: admin.nomeEmpresa })}
                              onClick={() => setConfirmando({ id: admin._id, acao: 'revogar' })}
                            >
                              <IconeCadeado />
                            </button>
                          )}
                          <button
                            type="button"
                            className="icon-btn icon-btn--danger"
                            title={tr('Excluir')}
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
        {tr('Excluir uma clínica remove o administrador e o registro de assinatura; pacientes, agenda e os demais dados dela permanecem no banco.')}
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

      {redefinindoSenhaDe && (
        <RedefinirSenhaAdminModal
          key={redefinindoSenhaDe._id}
          admin={redefinindoSenhaDe}
          erro={error}
          onSave={redefinirSenha}
          onClose={() => setRedefinindoSenhaDe(null)}
        />
      )}

      {detalhesDe && (
        <DetalhesClinicaModal key={detalhesDe._id} admin={detalhesDe} onClose={() => setDetalhesDe(null)} />
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
