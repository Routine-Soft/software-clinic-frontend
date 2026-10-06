import { useState } from 'react';
import { useAuthContext } from '@/hooks/useAuthContext';
import { usePlanos } from '@/modules/plano/plano.hooks';
import { useAssinatura } from '../assinatura.hooks';
import { formatarData, formatarPreco, avisarAssinaturaAtualizada } from '../assinatura.utils';
import PixModal from './PixModal';
import './assinatura.css';
import './assinaturas-planos.css';

// O rótulo diz o que o plano é para a clínica (o plano da assinatura atual ganha um selo com o estado dela).
const SELO_DO_PLANO_ATUAL = {
  trial: { texto: 'Plano atual', tom: 'info' },
  ativa: { texto: 'Plano atual', tom: 'success' },
  pendente: { texto: 'Aguardando pagamento', tom: 'warning' },
  inadimplente: { texto: 'Pagamento em atraso', tom: 'danger' },
  cancelada: { texto: 'Cancelado', tom: 'muted' },
  expirada: { texto: 'Teste encerrado', tom: 'muted' },
};

const ROTULO_DA_ASSINATURA = {
  trial: 'em período de teste',
  ativa: 'ativa',
  pendente: 'aguardando pagamento',
  inadimplente: 'com pagamento em atraso',
  cancelada: 'cancelada',
  expirada: 'com o teste encerrado',
};

// Gratuito primeiro, depois os pagos do mais barato ao mais caro.
function ordenarPlanos(planos) {
  return [...planos].sort((a, b) => {
    if (a.tipo !== b.tipo) return a.tipo === 'gratis' ? -1 : 1;
    return a.preco - b.preco;
  });
}

function textoDoBotaoCartao(plano, assinatura) {
  const status = assinatura.status;
  const ehAtual = assinatura.planoId?._id === plano._id;

  if (status === 'ativa' && assinatura.cobranca === 'pix') return ehAtual ? 'Passar para o cartão' : 'Indisponível';
  if (status === 'ativa') return ehAtual ? 'Plano atual' : 'Indisponível';
  if (ehAtual && status === 'pendente') return 'Refazer o pagamento';
  if (ehAtual && status === 'inadimplente') return 'Regularizar no cartão';
  return 'Assinar no cartão';
}

function IconePix() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m12 3 4.5 4.5L12 12 7.5 7.5zM3 12l4.5-4.5L12 12l-4.5 4.5zM12 12l4.5-4.5L21 12l-4.5 4.5zM12 12l4.5 4.5L12 21l-4.5-4.5z" />
    </svg>
  );
}

function IconeCheck() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function BeneficiosDoPlano({ plano }) {
  const itens = plano.tipo === 'gratis'
    ? [
        `Acesso completo por ${plano.duracaoDiasTrial ?? 3} dias`,
        'Sem cartão de crédito',
        'Depois do teste, é preciso assinar um plano pago',
      ]
    : [
        'Acesso completo ao sistema',
        'No cartão, renova sozinho todo mês',
        'No Pix, cada pagamento vale 30 dias',
        'Cancele quando quiser, sem multa',
        'Pagamento seguro pelo Mercado Pago',
      ];

  return (
    <ul className="plano-opcao__lista">
      {itens.map((item) => (
        <li key={item}>
          <IconeCheck />
          {item}
        </li>
      ))}
    </ul>
  );
}

export default function AssinaturasPlanos() {
  const { user } = useAuthContext();
  const { planos, loading: carregandoPlanos, error: erroPlanos } = usePlanos();
  const { assinatura, loading: carregandoAssinatura, error: erroAssinatura, iniciandoCheckout, iniciarCheckout, cancelando, cancelar, erroAcao, atualizarAssinatura } = useAssinatura();
  const [planoEscolhido, setPlanoEscolhido] = useState(null);
  const [pix, setPix] = useState(null);
  const [confirmandoDesistencia, setConfirmandoDesistencia] = useState(false);

  const carregando = carregandoPlanos || carregandoAssinatura;
  const erro = erroPlanos || erroAssinatura;
  // Admin e recepção (secretaria) pagam; só o admin desiste ou cancela. O backend exige o mesmo.
  const podeContratar = ['admin', 'super_admin', 'recepcao'].includes(user?.role);
  const podeCancelar = user?.role === 'admin' || user?.role === 'super_admin';
  const planosAtivos = ordenarPlanos(planos.filter((plano) => plano.ativo));
  const assinaturaAtiva = assinatura?.status === 'ativa';
  // Pix é pago período a período e não renova sozinho; o cartão renova todo mês no Mercado Pago.
  const ativaPorPix = assinaturaAtiva && assinatura.cobranca === 'pix';
  const ativaNoCartao = assinaturaAtiva && !ativaPorPix;
  const aguardandoCartao = assinatura?.status === 'pendente';

  function escolher(plano) {
    setPlanoEscolhido(plano._id);
    iniciarCheckout(plano._id);
  }

  return (
    <div className="page assinaturas">
      <header className="page-header">
        <div>
          <h2 className="page-title">Assinaturas</h2>
          <p className="page-subtitle">Compare os planos e escolha o melhor para a sua clínica</p>
        </div>
      </header>

      {erro && (
        <div className="alerts">
          <p className="alert alert--error" role="alert">{erro.message}</p>
        </div>
      )}

      {assinatura && (
        <p className="assinaturas__resumo" data-status={assinatura.status}>
          <span>
            Sua assinatura atual: <strong>{assinatura.planoId?.nome ?? '—'}</strong>, {ativaPorPix ? 'ativa por Pix' : (ROTULO_DA_ASSINATURA[assinatura.status] ?? assinatura.status)}
            {assinatura.acesso?.liberado && ['cancelada', 'ativa'].includes(assinatura.status) && assinatura.acesso.ate && ` (acesso até ${formatarData(assinatura.acesso.ate)})`}
            {assinatura.status === 'trial' && assinatura.dataFimTrial && ` (até ${formatarData(assinatura.dataFimTrial)})`}
            .
          </span>
        </p>
      )}

      {!podeContratar && !carregando && (
        <p className="alert alert--info" role="status">Só o administrador e a recepção da clínica podem pagar ou trocar de plano.</p>
      )}

      {podeContratar && ativaNoCartao && (
        <p className="alert alert--info" role="status">
          Para trocar de plano, cancele a assinatura atual em <strong>Minha assinatura</strong> e escolha o novo plano aqui.
        </p>
      )}

      {podeContratar && ativaPorPix && (
        <p className="alert alert--info" role="status">
          Seu período pago por Pix vai até <strong>{formatarData(assinatura.proximaCobranca)}</strong>. Você pode renovar por Pix a qualquer momento
          ou passar o plano atual para o cartão: a primeira cobrança no cartão só acontece em {formatarData(assinatura.proximaCobranca)}, quando o Pix acaba.
          Para trocar de plano, aguarde o fim do período.
        </p>
      )}

      {podeContratar && aguardandoCartao && (
        <p className="alert alert--info" role="status">
          Há um pagamento no cartão aguardando confirmação. Para pagar por Pix, conclua ou desista dele primeiro.
        </p>
      )}

      {erroAcao && <p className="alert alert--error" role="alert">{erroAcao.message}</p>}

      {carregando ? (
        <div className="assinaturas__grade" aria-busy="true" aria-label="Carregando planos">
          {[0, 1, 2].map((i) => (
            <div key={i} className="card plano-opcao" style={{ '--i': i }}>
              <div className="skeleton skeleton--line" style={{ width: '50%' }} />
              <div className="skeleton skeleton--line" style={{ width: '70%', height: 36 }} />
              <div className="skeleton skeleton--line" style={{ width: '90%' }} />
              <div className="skeleton skeleton--line" style={{ width: '100%', height: 44 }} />
            </div>
          ))}
        </div>
      ) : planosAtivos.length === 0 ? (
        <div className="crud-vazio">
          <p>Nenhum plano disponível no momento.</p>
        </div>
      ) : (
        <div className="assinaturas__grade">
          {planosAtivos.map((plano, index) => {
            const gratuito = plano.tipo === 'gratis';
            const ehAtual = assinatura?.planoId?._id === plano._id;
            const selo = ehAtual ? SELO_DO_PLANO_ATUAL[assinatura.status] : null;
            // Quem paga por Pix pode passar o plano atual para o cartão (cobrança só depois do período pago).
            const cartaoDesabilitado = iniciandoCheckout || (assinaturaAtiva && !(ativaPorPix && ehAtual));
            const pixDesabilitado = iniciandoCheckout || ativaNoCartao || aguardandoCartao || (ativaPorPix && !ehAtual);
            const renovando = ativaPorPix && ehAtual;
            const carregandoEste = iniciandoCheckout && planoEscolhido === plano._id;

            return (
              <article
                key={plano._id}
                className="card plano-opcao"
                data-atual={ehAtual || undefined}
                data-tipo={plano.tipo}
                style={{ '--i': index }}
              >
                <header className="plano-opcao__topo">
                  <h3 className="plano-opcao__nome">{plano.nome}</h3>
                  {selo && <span className={`badge badge--${selo.tom}`}>{selo.texto}</span>}
                </header>

                <p className="plano-opcao__preco">
                  {gratuito && !plano.preco ? (
                    <>
                      <strong>Grátis</strong>
                      <span>{plano.duracaoDiasTrial ? `por ${plano.duracaoDiasTrial} dias` : ''}</span>
                    </>
                  ) : (
                    <>
                      <strong>{formatarPreco(plano.preco)}</strong>
                      <span>/ mês</span>
                    </>
                  )}
                </p>

                <BeneficiosDoPlano plano={plano} />

                {!gratuito && podeContratar && (
                  <div className="plano-opcao__acoes">
                    <button
                      type="button"
                      className={`btn ${ehAtual && assinaturaAtiva ? 'btn--ghost' : 'btn--primary'} btn--block plano-opcao__cta${carregandoEste ? ' btn--loading' : ''}`}
                      onClick={() => escolher(plano)}
                      disabled={cartaoDesabilitado}
                    >
                      {carregandoEste ? 'Redirecionando...' : textoDoBotaoCartao(plano, assinatura ?? {})}
                    </button>
                    <button
                      type="button"
                      className={`btn ${renovando ? 'btn--primary' : 'btn--ghost'} btn--block plano-opcao__pix`}
                      onClick={() => setPix({ plano, renovacao: renovando })}
                      disabled={pixDesabilitado}
                    >
                      <IconePix />
                      {renovando ? 'Renovar por Pix' : 'Pagar com Pix'}
                    </button>
                  </div>
                )}

                {podeCancelar && ehAtual && assinatura.status === 'pendente' && (confirmandoDesistencia ? (
                  <div className="assinatura-card__confirmar" role="alertdialog" aria-label="Confirmar desistência">
                    <p>Desistir da assinatura? O pagamento pendente é cancelado e você volta ao plano gratuito.</p>
                    <div className="assinatura-card__acoes assinatura-card__acoes--linha">
                      <button type="button" className="btn btn--ghost btn--sm" onClick={() => setConfirmandoDesistencia(false)} disabled={cancelando}>
                        Continuar aguardando
                      </button>
                      <button
                        type="button"
                        className={`btn btn--danger btn--sm${cancelando ? ' btn--loading' : ''}`}
                        disabled={cancelando}
                        onClick={async () => { if (await cancelar()) setConfirmandoDesistencia(false); }}
                      >
                        {cancelando ? 'Desistindo...' : 'Sim, desistir'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <button type="button" className="assinatura-card__cancelar" onClick={() => setConfirmandoDesistencia(true)}>
                    Desistir e voltar ao gratuito
                  </button>
                ))}
              </article>
            );
          })}
        </div>
      )}

      {pix && (
        <PixModal
          plano={pix.plano}
          renovacao={pix.renovacao}
          onPago={(atualizada) => { atualizarAssinatura(atualizada); avisarAssinaturaAtualizada(atualizada); }}
          onClose={() => setPix(null)}
        />
      )}
    </div>
  );
}
