import { useState } from 'react';
import { useAuthContext } from '@/hooks/useAuthContext';
import { usePlanos } from '@/modules/plano/plano.hooks';
import { useAssinatura } from '../assinatura.hooks';
import { formatDataBR } from '@/utils/date';
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

function formatarPreco(preco) {
  return preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Gratuito primeiro, depois os pagos do mais barato ao mais caro.
function ordenarPlanos(planos) {
  return [...planos].sort((a, b) => {
    if (a.tipo !== b.tipo) return a.tipo === 'gratis' ? -1 : 1;
    return a.preco - b.preco;
  });
}

function textoDoBotao(plano, assinatura) {
  const status = assinatura.status;
  const ehAtual = assinatura.planoId?._id === plano._id;

  if (status === 'ativa') return ehAtual ? 'Plano atual' : 'Indisponível';
  if (ehAtual && status === 'pendente') return 'Refazer o pagamento';
  if (ehAtual && status === 'inadimplente') return 'Regularizar pagamento';
  return 'Assinar este plano';
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
        `Acesso completo por ${plano.duracaoDiasTrial ?? 15} dias`,
        'Sem cartão de crédito',
        'Depois do teste, é preciso assinar um plano pago',
      ]
    : [
        'Acesso completo ao sistema',
        'Cobrança mensal recorrente',
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
  const { assinatura, loading: carregandoAssinatura, error: erroAssinatura, iniciandoCheckout, iniciarCheckout, cancelando, cancelar, erroAcao } = useAssinatura();
  const [planoEscolhido, setPlanoEscolhido] = useState(null);
  const [confirmandoDesistencia, setConfirmandoDesistencia] = useState(false);

  const carregando = carregandoPlanos || carregandoAssinatura;
  const erro = erroPlanos || erroAssinatura;
  // Só quem administra a clínica contrata (o backend também exige isso); os demais só consultam.
  const podeContratar = user?.role === 'admin' || user?.role === 'super_admin';
  const planosAtivos = ordenarPlanos(planos.filter((plano) => plano.ativo));
  const assinaturaAtiva = assinatura?.status === 'ativa';

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
            Sua assinatura atual: <strong>{assinatura.planoId?.nome ?? '—'}</strong>, {ROTULO_DA_ASSINATURA[assinatura.status] ?? assinatura.status}
            {assinatura.acesso?.liberado && assinatura.status === 'cancelada' && assinatura.acesso.ate && ` (acesso até ${formatDataBR(assinatura.acesso.ate)})`}
            {assinatura.status === 'trial' && assinatura.dataFimTrial && ` (até ${formatDataBR(assinatura.dataFimTrial)})`}
            .
          </span>
        </p>
      )}

      {!podeContratar && !carregando && (
        <p className="alert alert--info" role="status">Só o administrador da clínica pode contratar ou trocar de plano.</p>
      )}

      {podeContratar && assinaturaAtiva && (
        <p className="alert alert--info" role="status">
          Para trocar de plano, cancele a assinatura atual em <strong>Minha assinatura</strong> e escolha o novo plano aqui.
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
            const desabilitado = iniciandoCheckout || (assinaturaAtiva && !gratuito);
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
                  <button
                    type="button"
                    className={`btn ${ehAtual && assinaturaAtiva ? 'btn--ghost' : 'btn--primary'} btn--block plano-opcao__cta${carregandoEste ? ' btn--loading' : ''}`}
                    onClick={() => escolher(plano)}
                    disabled={desabilitado}
                  >
                    {carregandoEste ? 'Redirecionando...' : textoDoBotao(plano, assinatura ?? {})}
                  </button>
                )}

                {podeContratar && ehAtual && assinatura.status === 'pendente' && (confirmandoDesistencia ? (
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
    </div>
  );
}
