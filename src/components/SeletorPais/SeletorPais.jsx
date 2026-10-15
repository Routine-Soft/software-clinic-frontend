import { idiomaAtual } from '@/i18n';
import { listaDePaises } from '@/i18n/paises';

// Lista de países no idioma da tela, com Brasil e Estados Unidos no topo.
export default function SeletorPais({ id, value, onChange, required = false }) {
  return (
    <select id={id} className="input" value={value} onChange={(e) => onChange(e.target.value)} required={required}>
      {listaDePaises(idiomaAtual()).map((p) => <option key={p.codigo} value={p.codigo}>{p.nome}</option>)}
    </select>
  );
}
