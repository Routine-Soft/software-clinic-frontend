import { useState } from 'react';
import { useAssinatura } from '../assinatura.hooks';
import './assinatura.css';

const STATUS = {
  trial: {
    rotulo: 'Período de teste',
    badge: 'info',
    pulsa: true,
    mensagem: 'Você está aproveitando o teste gratuito. Assine para continuar usando o sistema depois que ele terminar.',
  },
  pendente: {
    rotulo: 'Pagamento pendente',
    badge: 'warning',
    pulsa: true,
    mensagem: 'Estamos aguardando a confirmação do seu pagamento. Isso costuma levar alguns minutos.',
  },
  ativa: {
    rotulo: 'Ativa',
    badge: 'success',
    pulsa: true,
    mensagem: 'Tudo certo com a sua assinatura.',
  },
  inadimplente: {
    rotulo: 'Inadimplente',
    badge: 'danger',
    pulsa: false,
    mensagem: 'Não conseguimos processar o último pagamento. Regularize sua assinatura para evitar bloqueios.',
  },
  cancelada: {
    rotulo: 'Cancelada',
    badge: 'muted',
    pulsa: false,
    mensagem: 'Esta assinatura foi cancelada. Assine novamente para voltar a usar todos os recursos.',
  },
  expirada: {
    rotulo: 'Expirada',
    badge: 'muted',
    pulsa: false,
    mensagem: 'O período de teste terminou. Assine um plano para continuar usando o sistema.',
  },
};

const STATUS_QUE_PODEM_ASSINAR = ['trial', 'inadimplente', 'cancelada', 'expirada'];
const DIA_EM_MS = 24 * 60 * 60 * 1000;

function formatarData(data) {
  return new Date(data).toLocaleDateString('pt-BR');
}

function formatarPreco(preco) {
  return preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function calcularTrial(assinatura) {
  const inicio = new Date(assinatura.dataInicio).getTime();
  const fim = new Date(assinatura.dataFimTrial).getTime();
  const agora = Date.now();
  const total = Math.max(fim - inicio, 1);
  const percentual = Math.min(100, Math.max(0, ((agora - inicio) / total) * 100));
  const diasRestantes = Math.max(0, Math.ceil((fim - agora) / DIA_EM_MS));
  return { percentual: Math.round(percentual), diasRestantes };
}

function rotuloDiasRestantes(dias) {
  if (dias === 0) return 'Termina hoje';
  if (dias === 1) return 'Falta 1 dia';
  return `Faltam ${dias} dias`;
}

function IconeAssinatura() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <path d="M2 10h20M6 15h4" />
    </svg>
  );
}

export default function AssinaturaStatus({ className = '' }) {
  const { assinatura, loading, error, iniciandoCheckout, iniciarCheckout, sincronizando, sincronizar, cancelando, cancelar, erroAcao } = useAssinatura();
  const [confirmandoCancelamento, setConfirmandoCancelamento] = useState(false);
  const classes = `card assinatura-card ${className}`.trim();

  if (loading) {
    return (
      <section className={classes} aria-busy="true" aria-label="Carregando assinatura">
        <div className="assinatura-card__head">
          <div className="skeleton assinatura-card__icon-skeleton" />
          <div className="assinatura-card__titulos">
            <div className="skeleton skeleton--line" style={{ width: '45%' }} />
            <div className="skeleton skeleton--line" style={{ width: '25%' }} />
          </div>
        </div>
        <div className="skeleton skeleton--line" style={{ width: '60%', height: 28 }} />
        <div className="skeleton skeleton--line" style={{ width: '90%' }} />
        <div className="skeleton skeleton--line" style={{ width: '100%', height: 44 }} />
      </section>
    );
  }

  if (error) {
    return (
      <section className={classes}>
        <p className="alert alert--error" role="alert">{error.message}</p>
      </section>
    );
  }

  if (!assinatura) {
    return (
      <section className={classes}>
        <p className="assinatura-card__vazio">Nenhuma assinatura encontrada.</p>
      </section>
    );
  }

  const status = STATUS[assinatura.status] ?? { rotulo: assinatura.status, badge: 'muted', pulsa: false, mensagem: '' };
  const podeAssinar = STATUS_QUE_PODEM_ASSINAR.includes(assinatura.status);
  const aguardandoPagamento = assinatura.status === 'pendente';
  const podeCancelar = ['ativa', 'inadimplente'].includes(assinatura.status);
  const acessoAte = assinatura.status === 'cancelada' && assinatura.acesso?.liberado ? assinatura.acesso.ate : null;
  const emTrial = assinatura.status === 'trial' && assinatura.dataFimTrial;
  const trial = emTrial ? calcularTrial(assinatura) : null;
  const preco = assinatura.planoId?.preco;

  return (
    <section className={classes} data-status={assinatura.status}>
      <header className="assinatura-card__head">
        <div className="assinatura-card__icon">
          <IconeAssinatura />
        </div>

        <div className="assinatura-card__titulos">
          <h3 className="assinatura-card__titulo">Minha assinatura</h3>
          <span className={`badge badge--${status.badge}${status.pulsa ? ' badge--live' : ''}`}>{status.rotulo}</span>
        </div>
      </header>

      <div className="assinatura-card__plano">
        <span className="assinatura-card__plano-rotulo">Plano</span>
        <p className="assinatura-card__plano-nome">
          {assinatura.planoId?.nome ?? '—'}
          {preco > 0 && <small>{formatarPreco(preco)} / mês</small>}
        </p>
      </div>

      {trial && (
        <div className="assinatura-card__trial">
          <div className="assinatura-card__trial-linha">
            <span>{rotuloDiasRestantes(trial.diasRestantes)}</span>
            <span>até {formatarData(assinatura.dataFimTrial)}</span>
          </div>
          <div
            className="assinatura-card__barra"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={trial.percentual}
            aria-label="Progresso do período de teste"
          >
            <span className="assinatura-card__barra-fill" style={{ '--pct': `${trial.percentual}%` }} />
          </div>
        </div>
      )}

      {(assinatura.dataInicio || acessoAte || (assinatura.status === 'ativa' && assinatura.proximaCobranca)) && (
        <dl className="assinatura-card__info">
          {assinatura.dataInicio && (
            <div>
              <dt>{assinatura.status === 'trial' ? 'Teste iniciado em' : 'Assinante desde'}</dt>
              <dd>{formatarData(assinatura.dataInicio)}</dd>
            </div>
          )}
          {acessoAte && (
            <div>
              <dt>Acesso liberado até</dt>
              <dd>{formatarData(acessoAte)}</dd>
            </div>
          )}
          {assinatura.status === 'ativa' && assinatura.proximaCobranca && (
            <div>
              <dt>Próxima cobrança</dt>
              <dd>{formatarData(assinatura.proximaCobranca)}</dd>
            </div>
          )}
        </dl>
      )}

      {acessoAte
        ? <p className="assinatura-card__mensagem">Assinatura cancelada. Você continua com acesso até {formatarData(acessoAte)}; depois disso, o sistema será bloqueado.</p>
        : status.mensagem && <p className="assinatura-card__mensagem">{status.mensagem}</p>}

      {erroAcao && <p className="alert alert--error" role="alert">{erroAcao.message}</p>}

      {aguardandoPagamento && (
        <div className="assinatura-card__acoes">
          <button
            type="button"
            className={`btn btn--primary btn--block assinatura-card__cta${sincronizando ? ' btn--loading' : ''}`}
            onClick={sincronizar}
            disabled={sincronizando}
          >
            {sincronizando ? 'Verificando...' : 'Já paguei — verificar agora'}
          </button>
          <button type="button" className="btn btn--ghost btn--block" onClick={iniciarCheckout} disabled={iniciandoCheckout}>
            {iniciandoCheckout ? 'Redirecionando...' : 'Refazer o pagamento'}
          </button>
        </div>
      )}

      {podeCancelar && (confirmandoCancelamento ? (
        <div className="assinatura-card__confirmar" role="alertdialog" aria-label="Confirmar cancelamento">
          <p>
            Cancelar a assinatura?
            {assinatura.proximaCobranca ? ` Você continua com acesso até ${formatarData(assinatura.proximaCobranca)}, e nenhuma nova cobrança será feita.` : ' Nenhuma nova cobrança será feita.'}
          </p>
          <div className="assinatura-card__acoes assinatura-card__acoes--linha">
            <button type="button" className="btn btn--ghost btn--sm" onClick={() => setConfirmandoCancelamento(false)} disabled={cancelando}>Manter assinatura</button>
            <button
              type="button"
              className={`btn btn--danger btn--sm${cancelando ? ' btn--loading' : ''}`}
              disabled={cancelando}
              onClick={async () => { if (await cancelar()) setConfirmandoCancelamento(false); }}
            >
              {cancelando ? 'Cancelando...' : 'Sim, cancelar'}
            </button>
          </div>
        </div>
      ) : (
        <button type="button" className="assinatura-card__cancelar" onClick={() => setConfirmandoCancelamento(true)}>
          Cancelar assinatura
        </button>
      ))}

      {podeAssinar && (
        <button
          type="button"
          className={`btn btn--primary btn--block assinatura-card__cta${iniciandoCheckout ? ' btn--loading' : ''}`}
          onClick={iniciarCheckout}
          disabled={iniciandoCheckout}
        >
          {iniciandoCheckout ? 'Redirecionando...' : 'Assinar plano pago'}
        </button>
      )}
    </section>
  );
}
