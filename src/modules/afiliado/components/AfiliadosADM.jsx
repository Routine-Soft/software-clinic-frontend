import { Fragment, useMemo, useState } from 'react';
import { useAfiliadosAdm } from '../afiliado.hooks';
import { SITUACAO_COMISSAO, dataBR, detalheComissao } from '../afiliado.utils';
import { formatarReais } from '@/modules/indicacao/indicacao.utils';
import { iniciais } from '@/utils/nome';
import { linkWhatsapp } from '@/utils/whatsapp';
import { formatarDocumento } from '@/utils/documento';
import EmailQuebravel from '@/components/EmailQuebravel';
import { IconeBusca, IconeCheck, IconeX, IconeCadeado, IconeCadeadoAberto, IconeTelefone, IconeGrafico, IconeLixeira } from '@/components/CrudCard/icones';
import { ROTULO_FUNCAO } from '@/modules/user/user.constants';
import '@/modules/user/components/clinicas-adm.css';
import './afiliado.css';
import { tr } from '@/i18n';

export default function AfiliadosADM() {
  const { afiliados, loading, error, successMessage, registrarPagamento, definirAtivo, excluir } = useAfiliadosAdm();
  const [busca, setBusca] = useState('');
  const [confirmando, setConfirmando] = useState(null);
  const [aberto, setAberto] = useState(null);
  const [pixCopiado, setPixCopiado] = useState(null);

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return afiliados;
    return afiliados.filter((a) => [a.nomeCompleto, a.email, a.codigoAfiliado].some((v) => v?.toLowerCase().includes(termo)));
  }, [afiliados, busca]);

  const totalAPagar = afiliados.reduce((soma, a) => soma + a.totais.aPagar, 0);

  async function copiarPix(afiliado) {
    try {
      await navigator.clipboard.writeText(afiliado.chavePix);
      setPixCopiado(afiliado._id);
      setTimeout(() => setPixCopiado(null), 2000);
    } catch {
      // sem permissão: a chave continua visível para copiar à mão
    }
  }

  async function confirmar(afiliado) {
    if (confirmando.acao === 'pagar') await registrarPagamento(afiliado._id);
    else if (confirmando.acao === 'excluir') await excluir(afiliado._id);
    else await definirAtivo(afiliado._id, false);
    setConfirmando(null);
  }

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h2 className="page-title">{tr('Afiliados')}</h2>
          <p className="page-subtitle">{tr('Quem divulga a Sonelia e as comissões de cada um')}</p>
        </div>
        <div className="page-header__acoes">
          {!loading && <span className="badge badge--primary">{afiliados.length === 1 ? '1 afiliado' : `${afiliados.length} afiliados`}</span>}
          {!loading && totalAPagar > 0 && <span className="badge badge--success">{tr('{p0} a pagar', { p0: formatarReais(totalAPagar) })}</span>}
        </div>
      </header>

      {(successMessage || error) && (
        <div className="alerts">
          {error && <p className="alert alert--error" role="alert">{error.message}</p>}
          {successMessage && <p className="alert alert--success" role="status">{successMessage}</p>}
        </div>
      )}

      <section className="card table-wrap">
        <div className="clinicas-toolbar">
          <div className="search">
            <IconeBusca />
            <input className="input" type="search" value={busca} onChange={(e) => setBusca(e.target.value)} placeholder={tr('Nome, e-mail ou código')} aria-label={tr('Buscar afiliado')} />
          </div>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>{tr('Afiliado')}</th>
              <th>{tr('Contato')}</th>
              <th>{tr('Receber em')}</th>
              <th>{tr('Comissões')}</th>
              <th>{tr('Ações')}</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [0, 1, 2].map((i) => (
                <tr key={i}>
                  {[70, 55, 45, 40, 35].map((largura, coluna) => (
                    <td key={coluna}><div className="skeleton skeleton--line" style={{ width: `${largura}%` }} /></td>
                  ))}
                </tr>
              ))
            ) : filtrados.length === 0 ? (
              <tr>
                <td className="table__empty" colSpan={5}>
                  {busca ? tr('Nenhum afiliado encontrado para essa busca.') : tr('Nenhum afiliado ainda. Divulgue a página "Seja afiliado" (sonelia.com.br/#/afiliados).')}
                </td>
              </tr>
            ) : (
              filtrados.map((afiliado, index) => {
                const ativo = afiliado.afiliadoAtivo !== false;
                const { totais } = afiliado;
                return (
                  <Fragment key={afiliado._id}>
                    <tr style={{ '--i': Math.min(index, 12) }}>
                      <td>
                        <div className="clinica-pessoa">
                          <div className="clinica-pessoa__avatar" aria-hidden="true">{iniciais(afiliado.nomeCompleto)}</div>
                          <div className="clinica-pessoa__dados">
                            <span className="clinica-pessoa__nome">{afiliado.nomeCompleto}</span>
                            <span className="clinica-pessoa__sub">
                              {afiliado.role === 'afiliado' ? tr('Só afiliado') : `${ROTULO_FUNCAO[afiliado.role] ?? afiliado.role} · ${afiliado.nomeEmpresa}`}
                            </span>
                            <span className="clinica-pessoa__sub">{tr('Código')} <strong>{afiliado.codigoAfiliado}</strong> {tr('· desde {p0}', { p0: dataBR(afiliado.afiliadoDesde) })}</span>
                            {!ativo && <span className="badge badge--danger">{tr('Desativado')}</span>}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="clinica-contato">
                          <span><EmailQuebravel email={afiliado.email} /></span>
                          {linkWhatsapp(afiliado.telefone) ? (
                            <a className="clinica-whats" href={linkWhatsapp(afiliado.telefone)} target="_blank" rel="noopener noreferrer" title={tr('Abrir conversa no WhatsApp')}>
                              <IconeTelefone />
                              {afiliado.telefone}
                            </a>
                          ) : <span>{afiliado.telefone}</span>}
                        </div>
                      </td>
                      <td>
                        <div className="afiliado-pix">
                          <button type="button" className="afiliado-pix__chave" title={tr('Copiar chave Pix')} onClick={() => copiarPix(afiliado)}>
                            {pixCopiado === afiliado._id ? tr('Copiado!') : afiliado.chavePix}
                          </button>
                          <span className="clinica-pessoa__sub">{afiliado.documento?.length === 14 ? 'CNPJ' : 'CPF'} {formatarDocumento(afiliado.documento ?? '')}</span>
                        </div>
                      </td>
                      <td>
                        <div className="afiliado-comissoes">
                          <span>{afiliado.indicacoes.length} {afiliado.indicacoes.length === 1 ? tr('clínica') : tr('clínicas')}{totais.aguardando > 0 && tr(' ({aguardando} sem pagar)', { aguardando: totais.aguardando })}</span>
                          <span className="afiliado-comissoes__pagar">{tr('A pagar: {p0}', { p0: formatarReais(totais.aPagar) })}</span>
                          {totais.emCarencia > 0 && <span>{tr('Em carência: {p0}', { p0: formatarReais(totais.emCarencia) })}</span>}
                          <span>{tr('Pago: {p0}', { p0: formatarReais(totais.recebido) })}</span>
                        </div>
                      </td>
                      <td>
                        {confirmando?.id === afiliado._id ? (
                          <div className="clinica-confirmar">
                            <span>
                              {confirmando.acao === 'pagar' && tr('Já mandou {p0}?', { p0: formatarReais(totais.aPagar) })}
                              {confirmando.acao === 'desativar' && tr('Desativar?')}
                              {confirmando.acao === 'excluir' && (afiliado.role === 'afiliado' ? tr('Excluir do banco?') : tr('Tirar do programa?'))}
                            </span>
                            <button type="button" className="icon-btn icon-btn--danger" aria-label={tr('Confirmar')} onClick={() => confirmar(afiliado)}><IconeCheck /></button>
                            <button type="button" className="icon-btn" aria-label={tr('Cancelar')} onClick={() => setConfirmando(null)}><IconeX /></button>
                          </div>
                        ) : (
                          <div className="afiliado-acoes">
                            {totais.aPagar > 0 && (
                              <button type="button" className="btn btn--primary btn--sm" onClick={() => setConfirmando({ id: afiliado._id, acao: 'pagar' })}>
                                {tr('Marcar {p0} como pago', { p0: formatarReais(totais.aPagar) })}
                              </button>
                            )}
                            <div className="table__actions">
                              <button type="button" className="icon-btn" title={tr('Ver comissões')} aria-label={tr('Ver comissões de {nomeCompleto}', { nomeCompleto: afiliado.nomeCompleto })} aria-expanded={aberto === afiliado._id} onClick={() => setAberto(aberto === afiliado._id ? null : afiliado._id)}>
                                <IconeGrafico />
                              </button>
                              {ativo ? (
                                <button type="button" className="icon-btn" title={tr('Desativar (o código deixa de valer)')} aria-label={`Desativar ${afiliado.nomeCompleto}`} onClick={() => setConfirmando({ id: afiliado._id, acao: 'desativar' })}>
                                  <IconeCadeado />
                                </button>
                              ) : (
                                <button type="button" className="icon-btn" title={tr('Reativar')} aria-label={`Reativar ${afiliado.nomeCompleto}`} onClick={() => definirAtivo(afiliado._id, true)}>
                                  <IconeCadeadoAberto />
                                </button>
                              )}
                              <button
                                type="button"
                                className="icon-btn icon-btn--danger"
                                title={afiliado.role === 'afiliado' ? tr('Excluir do banco de dados') : tr('Tirar do programa (a conta na clínica continua)')}
                                aria-label={`Excluir ${afiliado.nomeCompleto}`}
                                onClick={() => setConfirmando({ id: afiliado._id, acao: 'excluir' })}
                              >
                                <IconeLixeira />
                              </button>
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                    {aberto === afiliado._id && (
                      <tr className="afiliado-detalhe">
                        <td colSpan={5}>
                          {afiliado.indicacoes.length === 0 ? (
                            <p className="clinica-pessoa__sub">{tr('Nenhuma clínica cadastrada pelo link deste afiliado ainda.')}</p>
                          ) : (
                            <ul className="afiliado-detalhe__lista">
                              {afiliado.indicacoes.map((c) => (
                                <li key={c.id}>
                                  <span><strong>{c.clinica}</strong> · {detalheComissao(c)}</span>
                                  <span className={`badge badge--${SITUACAO_COMISSAO[c.situacao].tom}`}>{SITUACAO_COMISSAO[c.situacao].rotulo}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </section>

      <p className="afiliado-termos">
        {tr('Cada clínica que pagar a primeira mensalidade gera uma comissão de 50% do valor do plano, liberada no 8º dia (depois do prazo de desistência do cliente). Mande o Pix e depois clique em "Marcar como pago". Se o pagamento da clínica for devolvido antes disso, a comissão é cancelada sozinha. Excluir apaga as comissões do afiliado (inclusive as não pagas). Quem tem conta só de afiliado é apagado do banco; quem trabalha numa clínica que usa a Sonelia só sai do programa e continua com o acesso da clínica.')}
      </p>
    </div>
  );
}
