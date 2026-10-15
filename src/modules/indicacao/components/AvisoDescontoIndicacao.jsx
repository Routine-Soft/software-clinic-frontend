import { Link } from 'react-router-dom';
import { useIndicacoes } from '../indicacao.hooks';
import { formatarReais } from '../indicacao.utils';
import { tr } from '@/i18n';

// Na tela de planos: lembra a dona da clínica do desconto de indicação guardado (os descontos se somam).
export default function AvisoDescontoIndicacao() {
  const { resumo } = useIndicacoes();
  if (!resumo?.descontoGuardado) return null;

  return (
    <p className="alert alert--success" role="status">
      {tr('Você tem')} <strong>{formatarReais(resumo.descontoGuardado)}</strong> {tr('de desconto por indicação. Ele entra no próximo pagamento (até o valor da mensalidade; o que sobrar fica para os meses seguintes): no Pix o valor já vem menor ou sai de graça; no cartão, o desconto volta para o cartão logo depois da cobrança.')} <Link className="link" to="/indique">{tr('Ver indicações')}</Link>
    </p>
  );
}
