import { useLocation } from 'react-router-dom';
import { tr } from '@/i18n';
import { planoQueLibera, usePlano } from '../plano.contexto';

// Telas de recursos pagos e o recurso de cada uma. Sem o recurso, a tela abre só para consultar o que já foi salvo.
const RECURSO_DA_ROTA = [
  ['/anamneses', 'anamnese'],
  ['/termos-consentimento', 'termo'],
  ['/convenios', 'convenio'],
  ['/avaliacoes-nr01', 'avaliacoes'],
  ['/avaliacoes-neuropsicologicas', 'avaliacoes'],
  ['/empresas', 'empresas'],
  ['/reunioes', 'reunioes'],
  ['/whatsapp', 'whatsapp'],
  ['/repasses', 'repasse'],
  ['/meus-repasses', 'repasse'],
  ['/usuarios', 'equipe'],
];

// Faixa no topo da tela de um recurso que o plano da clínica não tem.
export default function AvisoPlano() {
  const { pathname } = useLocation();
  const { tem, nivel, abrirBloqueio } = usePlano();
  const recurso = RECURSO_DA_ROTA.find(([rota]) => pathname === rota || pathname.startsWith(`${rota}/`))?.[1];
  if (!recurso || tem(recurso)) return null;

  const plano = planoQueLibera(recurso, nivel);
  return (
    <div className="aviso-plano" role="status">
      <p className="aviso-plano__texto">
        <strong>{tr('Recurso do plano {plano}.', { plano })}</strong>{' '}
        {tr('Você pode consultar o que já foi registrado. Para criar ou editar, assine o plano.')}
      </p>
      <button type="button" className="btn btn--primary btn--sm" onClick={() => abrirBloqueio(recurso, 'aviso-tela')}>
        {tr('Liberar este recurso')}
      </button>
    </div>
  );
}
