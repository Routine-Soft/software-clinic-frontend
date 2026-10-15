import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { sincronizarAssinatura, sincronizarStripe } from '../assinatura.api';
import './assinatura.css';
import { localeAtual, tr } from '@/i18n';

const TENTATIVAS_MAXIMAS = 6;
const INTERVALO_MS = 4000;

const ICONES = {
  verificando: <path d="M21 12a9 9 0 1 1-6.22-8.56" />,
  ativa: <><circle cx="12" cy="12" r="10" /><path d="m8 12 3 3 5-6" /></>,
  pendente: <><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></>,
  problema: <><circle cx="12" cy="12" r="10" /><path d="M12 8v5M12 16.5h.01" /></>,
};

function formatarData(data) {
  return new Date(data).toLocaleDateString(localeAtual());
}

// Para onde o Mercado Pago (back_url) ou o Stripe (success_url, com ?stripe_session=) devolvem o cliente depois do
// checkout. Consulta o pagamento no backend; se ainda estiver pendente, tenta de novo algumas vezes.
export default function AssinaturaRetorno() {
  const sessaoStripe = new URLSearchParams(useLocation().search).get('stripe_session');
  const [assinatura, setAssinatura] = useState(null);
  const [verificando, setVerificando] = useState(true);
  const [erro, setErro] = useState(null);
  const [rodada, setRodada] = useState(0);

  useEffect(() => {
    let cancelado = false;
    let timer;

    async function verificar(tentativa) {
      try {
        const { data } = sessaoStripe ? await sincronizarStripe(sessaoStripe) : await sincronizarAssinatura();
        if (cancelado) return;
        setAssinatura(data);
        setErro(null);

        const aindaEsperando = data.status === 'pendente' || (sessaoStripe && data.status !== 'ativa');
        if (aindaEsperando && tentativa < TENTATIVAS_MAXIMAS) {
          timer = setTimeout(() => verificar(tentativa + 1), INTERVALO_MS);
        } else {
          setVerificando(false);
        }
      } catch (err) {
        if (cancelado) return;
        setErro(err);
        setVerificando(false);
      }
    }

    verificar(0);

    return () => {
      cancelado = true;
      clearTimeout(timer);
    };
  }, [rodada, sessaoStripe]);

  function verificarNovamente() {
    setErro(null);
    setVerificando(true);
    setRodada((atual) => atual + 1);
  }

  const status = assinatura?.status;
  const situacao = erro ? 'problema' : verificando ? 'verificando' : status === 'ativa' ? 'ativa' : status === 'pendente' ? 'pendente' : 'problema';

  const textos = {
    verificando: [tr('Confirmando seu pagamento...'), tr('Estamos conferindo com o Mercado Pago. Isso leva só alguns segundos.')],
    ativa: [tr('Assinatura ativa!'), assinatura?.proximaCobranca ? tr('Tudo certo. A próxima cobrança será em {p0}.', { p0: formatarData(assinatura.proximaCobranca) }) : tr('Tudo certo. Obrigado por assinar!')],
    pendente: [tr('Aguardando a confirmação'), tr('O Mercado Pago ainda não confirmou o pagamento. Assim que ele confirmar, sua assinatura será ativada. Você pode verificar de novo agora ou voltar mais tarde.')],
    problema: [erro ? tr('Não foi possível verificar') : tr('Pagamento não concluído'), erro ? erro.message : tr('O Mercado Pago não aprovou o pagamento, e nada foi cobrado. Você continua no plano gratuito e pode tentar de novo, no cartão ou por Pix.')],
  }[situacao];

  return (
    <div className="page page--narrow">
      <section className="card assinatura-retorno" data-situacao={situacao} aria-live="polite">
        <div className="assinatura-retorno__icone">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            {ICONES[situacao]}
          </svg>
        </div>

        <h2 className="assinatura-retorno__titulo">{textos[0]}</h2>
        <p className="assinatura-retorno__texto">{textos[1]}</p>

        <div className="assinatura-retorno__acoes">
          {situacao === 'ativa' && <Link to="/home" className="btn btn--primary">{tr('Ir para o início')}</Link>}
          {(situacao === 'pendente' || (situacao === 'problema' && erro)) && (
            <button type="button" className="btn btn--primary" onClick={verificarNovamente}>{tr('Verificar novamente')}</button>
          )}
          {situacao === 'problema' && !erro && <Link to="/assinaturas" className="btn btn--primary">{tr('Ver planos e tentar de novo')}</Link>}
          {situacao !== 'verificando' && <Link to="/assinatura" className="btn btn--ghost">{tr('Ver minha assinatura')}</Link>}
        </div>
      </section>
    </div>
  );
}
