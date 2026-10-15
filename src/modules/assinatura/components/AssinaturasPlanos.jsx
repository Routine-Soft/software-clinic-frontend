import { useState } from 'react';
import { useAuthContext } from '@/hooks/useAuthContext';
import { usePlanos } from '@/modules/plano/plano.hooks';
import { useAssinatura } from '../assinatura.hooks';
import { formatarData, formatarPreco, avisarAssinaturaAtualizada } from '../assinatura.utils';
import PixModal from './PixModal';
import { recursosExclusivos } from '@/modules/plano/plano.utils';
import AvisoDescontoIndicacao from '@/modules/indicacao/components/AvisoDescontoIndicacao';
import './assinatura.css';
import './assinaturas-planos.css';
import { tr } from '@/i18n';

// O rótulo diz o que o plano é para a clínica (o plano da assinatura atual ganha um selo com o estado dela).
const SELO_DO_PLANO_ATUAL = {
  trial: { texto: tr('Plano atual'), tom: 'info' },
  ativa: { texto: tr('Plano atual'), tom: 'success' },
  pendente: { texto: tr('Aguardando pagamento'), tom: 'warning' },
  inadimplente: { texto: tr('Pagamento em atraso'), tom: 'danger' },
  cancelada: { texto: tr('Cancelado'), tom: 'muted' },
  expirada: { texto: tr('Teste encerrado'), tom: 'muted' },
};

const ROTULO_DA_ASSINATURA = {
  trial: tr('em período de teste'),
  ativa: 'ativa',
  pendente: tr('aguardando pagamento'),
  inadimplente: tr('com pagamento em atraso'),
  cancelada: 'cancelada',
  expirada: tr('com o teste encerrado'),
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

  if (status === 'ativa' && assinatura.cobranca === 'pix') return ehAtual ? tr('Passar para o cartão') : tr('Indisponível');
  if (status === 'ativa') return ehAtual ? tr('Plano atual') : tr('Indisponível');
  if (ehAtual && status === 'pendente') return tr('Refazer o pagamento');
  if (ehAtual && status === 'inadimplente') return tr('Regularizar no cartão');
  return tr('Assinar no cartão');
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

// O que o plano inclui vem do cadastro de Planos (o que só ele tem fica em destaque), mais como o pagamento funciona.
function BeneficiosDoPlano({ plano, planos, stripe }) {
  const exclusivos = recursosExclusivos(plano, planos);
  const recursos = plano.recursos?.length
    ? plano.recursos
    : [tr('Acesso completo ao sistema'), plano.individual ? tr('Para quem atende sozinho: só você usa o sistema') : tr('Profissionais, recepção e usuários sem limite')];
  const itens = [
    ...recursos.map((texto) => ({ texto, destaque: exclusivos.has(texto) })),
    ...(stripe
      ? [tr('Cartão de crédito internacional, em dólar'), tr('No cartão, renova sozinho todo mês'), tr('Cancele quando quiser, sem multa')]
      : [tr('No cartão, renova sozinho todo mês'), tr('No Pix, cada pagamento vale 30 dias'), tr('Cancele quando quiser, sem multa')]
    ).map((texto) => ({ texto, pagamento: true })),
  ];

  return (
    <>
      {plano.descricao && <p className="plano-opcao__descricao">{plano.descricao}</p>}
      <ul className="plano-opcao__lista">
        {itens.map((item) => (
          <li key={item.texto} className={item.destaque ? 'plano-opcao__exclusivo' : item.pagamento ? 'plano-opcao__pagamento' : undefined}>
            <IconeCheck />
            {item.texto}
          </li>
        ))}
      </ul>
    </>
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
  // O plano gratuito é só o teste de 7 dias do cadastro: não aparece para escolher, só os pagos.
  // Só os planos da moeda da clínica: Brasil em reais (Mercado Pago), fora do Brasil em dólar (Stripe).
  const moedaDaClinica = assinatura?.moeda ?? 'BRL';
  const pagaPeloStripe = assinatura?.gateway === 'stripe';
  const planosAtivos = ordenarPlanos(planos.filter((plano) => plano.ativo && plano.tipo !== 'gratis' && (plano.moeda ?? 'BRL') === moedaDaClinica));
  const emTeste = assinatura?.status === 'trial';
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
          <h2 className="page-title">{tr('Assinaturas')}</h2>
          <p className="page-subtitle">{tr('Compare os planos e escolha o melhor para a sua clínica')}</p>
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
            {tr('Sua assinatura atual:')} <strong>{assinatura.planoId?.nome ? tr(assinatura.planoId.nome) : '—'}</strong>, {ativaPorPix ? tr('ativa por Pix') : (ROTULO_DA_ASSINATURA[assinatura.status] ?? assinatura.status)}
            {assinatura.acesso?.liberado && ['cancelada', 'ativa'].includes(assinatura.status) && assinatura.acesso.ate && tr(' (acesso até {p0})', { p0: formatarData(assinatura.acesso.ate) })}
            {assinatura.status === 'trial' && assinatura.dataFimTrial && tr(' (até {p0})', { p0: formatarData(assinatura.dataFimTrial) })}
            .
          </span>
        </p>
      )}

      {!podeContratar && !carregando && (
        <p className="alert alert--info" role="status">{tr('Só o administrador e a recepção da clínica podem pagar ou trocar de plano.')}</p>
      )}

      {podeContratar && ativaNoCartao && (
        <p className="alert alert--info" role="status">
          {pagaPeloStripe
            ? tr('Para trocar de plano ou de cartão, use "Gerenciar assinatura" em Minha assinatura.')
            : <>{tr('Para trocar de plano, cancele a assinatura atual em')} <strong>{tr('Minha assinatura')}</strong> {tr('e escolha o novo plano aqui.')}</>}
        </p>
      )}

      {podeContratar && ativaPorPix && (
        <p className="alert alert--info" role="status">
          {tr('Seu período pago por Pix vai até')} <strong>{formatarData(assinatura.proximaCobranca)}</strong>{tr('. Você pode renovar por Pix a qualquer momento ou passar o plano atual para o cartão: a primeira cobrança no cartão só acontece em')} {formatarData(assinatura.proximaCobranca)}{tr(', quando o Pix acaba. Para trocar de plano, aguarde o fim do período.')}
        </p>
      )}

      {podeContratar && aguardandoCartao && (
        <p className="alert alert--info" role="status">
          {tr('Há um pagamento no cartão aguardando confirmação. Para pagar por Pix, conclua ou desista dele primeiro.')}
        </p>
      )}

      {podeContratar && emTeste && (
        <p className="alert alert--info" role="status">
          {pagaPeloStripe
            ? tr('Você está no teste grátis, com tudo liberado e sem cartão{p0}. Para continuar depois, escolha um dos planos e pague no cartão de crédito.', { p0: assinatura.dataFimTrial && tr(' até {p0}', { p0: formatarData(assinatura.dataFimTrial) }) })
            : tr('Você está no teste grátis, com tudo liberado e sem cartão{p0}. Para continuar depois, escolha um dos planos e pague no cartão ou no Pix.', { p0: assinatura.dataFimTrial && tr(' até {p0}', { p0: formatarData(assinatura.dataFimTrial) }) })}
        </p>
      )}

      {podeCancelar && !pagaPeloStripe && <AvisoDescontoIndicacao />}

      {erroAcao && <p className="alert alert--error" role="alert">{erroAcao.message}</p>}

      {carregando ? (
        <div className="assinaturas__grade" aria-busy="true" aria-label={tr('Carregando planos')}>
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
          <p>{tr('Nenhum plano disponível no momento.')}</p>
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
                  <h3 className="plano-opcao__nome">{tr(plano.nome)}</h3>
                  {selo && <span className={`badge badge--${selo.tom}`}>{selo.texto}</span>}
                </header>

                <p className="plano-opcao__preco">
                  {gratuito && !plano.preco ? (
                    <>
                      <strong>{tr('Grátis')}</strong>
                      <span>{plano.duracaoDiasTrial ? tr('por {duracaoDiasTrial} dias', { duracaoDiasTrial: plano.duracaoDiasTrial }) : ''}</span>
                    </>
                  ) : (
                    <>
                      <strong>{formatarPreco(plano.preco, plano.moeda)}</strong>
                      <span>{tr('/ mês')}</span>
                    </>
                  )}
                </p>

                <BeneficiosDoPlano plano={plano} planos={planosAtivos} stripe={pagaPeloStripe} />

                {!gratuito && podeContratar && (
                  <div className="plano-opcao__acoes">
                    <button
                      type="button"
                      className={`btn ${ehAtual && assinaturaAtiva ? 'btn--ghost' : 'btn--primary'} btn--block plano-opcao__cta${carregandoEste ? ' btn--loading' : ''}`}
                      onClick={() => escolher(plano)}
                      disabled={cartaoDesabilitado}
                    >
                      {carregandoEste ? tr('Redirecionando...') : textoDoBotaoCartao(plano, assinatura ?? {})}
                    </button>
                    {!pagaPeloStripe && (
                      <button
                        type="button"
                        className={`btn ${renovando ? 'btn--primary' : 'btn--ghost'} btn--block plano-opcao__pix`}
                        onClick={() => setPix({ plano, renovacao: renovando })}
                        disabled={pixDesabilitado}
                      >
                        <IconePix />
                        {renovando ? tr('Renovar por Pix') : tr('Pagar com Pix')}
                      </button>
                    )}
                  </div>
                )}

                {podeCancelar && ehAtual && assinatura.status === 'pendente' && (confirmandoDesistencia ? (
                  <div className="assinatura-card__confirmar" role="alertdialog" aria-label={tr('Confirmar desistência')}>
                    <p>{tr('Desistir da assinatura? O pagamento pendente é cancelado e você volta ao teste grátis.')}</p>
                    <div className="assinatura-card__acoes assinatura-card__acoes--linha">
                      <button type="button" className="btn btn--ghost btn--sm" onClick={() => setConfirmandoDesistencia(false)} disabled={cancelando}>
                        {tr('Continuar aguardando')}
                      </button>
                      <button
                        type="button"
                        className={`btn btn--danger btn--sm${cancelando ? ' btn--loading' : ''}`}
                        disabled={cancelando}
                        onClick={async () => { if (await cancelar()) setConfirmandoDesistencia(false); }}
                      >
                        {cancelando ? tr('Desistindo...') : tr('Sim, desistir')}
                      </button>
                    </div>
                  </div>
                ) : (
                  <button type="button" className="assinatura-card__cancelar" onClick={() => setConfirmandoDesistencia(true)}>
                    {tr('Desistir e voltar ao teste grátis')}
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
