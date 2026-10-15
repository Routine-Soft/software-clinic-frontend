import { tr } from '@/i18n';
export default function SeloTeste({ paciente }) {
  if (!paciente?.teste) return null;
  return <span className="badge badge--warning" title={tr('Paciente de teste: pode ser excluído com tudo')}>{tr('Teste')}</span>;
}
