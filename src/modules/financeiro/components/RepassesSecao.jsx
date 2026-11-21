import { useState } from 'react';
import { useComissoesClinica } from '@/modules/comissao/comissao.hooks';
import PendentesComissaoModal from '@/modules/comissao/components/PendentesComissaoModal';
import { planoQueLibera, usePlano } from '@/modules/plano/plano.contexto';
import { IconeCadeado, IconeCheck, IconeX } from '@/components/CrudCard/icones';
import { iniciais } from '@/utils/nome';
import { formatarData } from '@/modules/assinatura/assinatura.utils';
import { dinheiro } from '../financeiro.utils';
import { tr } from '@/i18n';

const plural = (n, um, varios) => (n === 1 ? um : varios.replace('{n}', n));

function Repasses({ onPago }) {
  const { resumo, pagamentos, loading, error, successMessage, pagar } = useComissoesClinica();
  const [confirmandoId, setConfirmandoId] = useState(null);
  const [pagandoId, setPagandoId] = useState(null);
  const [detalhesDe, setDetalhesDe] = useState(null);
  const totalPendente = resumo.reduce((soma, linha) => soma + linha.pendente.total, 0);

  async function handlePagar(profissionalId) {
    setPagandoId(profissionalId);
    const pago = await pagar(profissionalId);
    setPagandoId(null);
    setConfirmandoId(null);
    if (pago) onPago();
  }

  return (
    <>
      <header className="financeiro-bloco__cab">
        <h3 id="fin-repasses" className="financeiro-bloco__titulo">{tr('Repasses aos profissionais')}</h3>
        <span className="financeiro-bloco__total" title={tr('Soma de todos os repasses pendentes')}>{tr('{p0} a pagar', { p0: dinheiro(totalPendente) })}</span>
      </header>

      {error && <p className="alert alert--error" role="alert">{error.message}</p>}
      {successMessage && <p className="alert alert--success" role="status">{successMessage}</p>}

      {loading ? (
        <div className="financeiro-carregando" aria-busy="true">
          {[75, 60, 68].map((l) => <div key={l} className="skeleton skeleton--line" style={{ width: `${l}%` }} />)}
        </div>
      ) : resumo.length === 0 ? (
        <p className="financeiro-nota">{tr('Nenhum profissional cadastrado ainda.')}</p>
      ) : (
        <ul className="repasse-lista">
          {resumo.map(({ profissional, pendente }) => {
            const temPendente = pendente.total > 0;
            return (
              <li key={profissional._id} className="repasse-item">
                <span className="repasse-item__avatar" aria-hidden="true">{iniciais(profissional.nome)}</span>
                <div className="repasse-item__info">
                  <span className="repasse-item__nome">{profissional.nome}</span>
                  <span className="repasse-item__sub">
                    {temPendente ? plural(pendente.quantidade, tr('1 atendimento'), tr('{n} atendimentos')) : tr('Nada pendente')}
                  </span>
                </div>
                <strong className="repasse-item__valor">{dinheiro(pendente.total)}</strong>
                {confirmandoId === profissional._id ? (
                  <div className="repasse-item__acoes">
                    <span>{tr('Pagar {p0}?', { p0: dinheiro(pendente.total) })}</span>
                    <button type="button" className="icon-btn" disabled={pagandoId === profissional._id} aria-label={tr('Confirmar pagamento de {p0} para {nome}', { p0: dinheiro(pendente.total), nome: profissional.nome })} onClick={() => handlePagar(profissional._id)}>
                      <IconeCheck />
                    </button>
                    <button type="button" className="icon-btn" aria-label={tr('Cancelar')} onClick={() => setConfirmandoId(null)}><IconeX /></button>
                  </div>
                ) : (
                  <div className="repasse-item__acoes">
                    <button type="button" className="btn btn--ghost btn--sm" disabled={!temPendente} onClick={() => setDetalhesDe(profissional)}>{tr('Ver')}</button>
                    <button type="button" className="btn btn--primary btn--sm" disabled={!temPendente} onClick={() => setConfirmandoId(profissional._id)}>{tr('Pagar')}</button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {pagamentos.length > 0 && (
        <details className="repasse-historico">
          <summary>{tr('Últimos pagamentos de repasse')}</summary>
          <ul>
            {pagamentos.slice(0, 10).map((p) => (
              <li key={p._id}>
                <span>
                  {formatarData(p.pagoEm)} · {p.profissional?.nome ?? tr('Profissional removido')}
                  {p.pagoPor ? tr(' · pago por {pagoPor}', { pagoPor: p.pagoPor }) : ''}
                </span>
                <strong>{dinheiro(p.valor)}</strong>
              </li>
            ))}
          </ul>
        </details>
      )}

      <p className="financeiro-nota">
        {tr('O repasse nasce quando o atendimento é realizado, com a regra do serviço naquele momento. Pagar quita de uma vez tudo o que está pendente para o profissional.')}
      </p>

      {detalhesDe && <PendentesComissaoModal key={detalhesDe._id} profissional={detalhesDe} onClose={() => setDetalhesDe(null)} />}
    </>
  );
}

// Repasses: recurso do plano Pro. Nos outros planos, o cartão mostra o cadeado e abre a janela de assinar.
export default function RepassesSecao({ onPago }) {
  const { tem, nivel, carregando, abrirBloqueio } = usePlano();

  return (
    <section className="card financeiro-bloco" aria-labelledby="fin-repasses">
      {carregando ? null : tem('repasse') ? (
        <Repasses onPago={onPago} />
      ) : (
        <>
          <header className="financeiro-bloco__cab">
            <h3 id="fin-repasses" className="financeiro-bloco__titulo">{tr('Repasses aos profissionais')}</h3>
          </header>
          <div className="financeiro-vazio">
            <span className="financeiro-vazio__icone" aria-hidden="true"><IconeCadeado /></span>
            <p>{tr('Calcule e pague o repasse de cada profissional pelos atendimentos realizados. Disponível no plano {p0}.', { p0: planoQueLibera('repasse', nivel) })}</p>
            <button type="button" className="btn btn--primary btn--sm" onClick={() => abrirBloqueio('repasse', 'financeiro')}>{tr('Conhecer o plano {p0}', { p0: planoQueLibera('repasse', nivel) })}</button>
          </div>
        </>
      )}
    </section>
  );
}
