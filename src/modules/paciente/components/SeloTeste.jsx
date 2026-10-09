export default function SeloTeste({ paciente }) {
  if (!paciente?.teste) return null;
  return <span className="badge badge--warning" title="Paciente de teste: pode ser excluído com tudo">Teste</span>;
}
