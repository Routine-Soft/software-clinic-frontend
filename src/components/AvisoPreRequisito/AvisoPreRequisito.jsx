import { Link } from 'react-router-dom';
import { useAuthContext } from '@/hooks/useAuthContext';

function juntar(itens) {
  if (itens.length <= 1) return itens.join('');
  return `${itens.slice(0, -1).join(', ')} e ${itens[itens.length - 1]}`;
}

// Avisa que algo precisa ser cadastrado antes (o servidor recusaria o cadastro sem isso).
// `faltando`: o que falta, já com artigo ("uma sala", "um profissional"). `onde`: texto próprio no lugar do link padrão.
export default function AvisoPreRequisito({ acao, faltando, onde }) {
  const { hasRole } = useAuthContext();
  if (!faltando.length) return null;

  return (
    <div className="alert alert--warning" role="alert">
      <strong>Antes de {acao}, cadastre {juntar(faltando)}.</strong>{' '}
      {onde ?? (hasRole('admin') || hasRole('recepcao')
        ? <>Isso é feito no <Link to="/dashboard-admin">Dashboard admin</Link>.</>
        : 'Peça ao administrador da clínica para fazer esse cadastro.')}
    </div>
  );
}
