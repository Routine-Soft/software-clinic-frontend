import { Link } from 'react-router-dom';
import { ROTULO_FUNCAO } from '@/modules/user/user.constants';
import { tr } from '@/i18n';

// Login do profissional: com ele vinculado, o profissional marca os próprios atendimentos e vê os próprios repasses.
export default function CampoUsuarioVinculado({ id, usuarios, valor, onChange, loading }) {
  const semOpcoes = !loading && usuarios.length === 0;

  return (
    <div className="field">
      <label className="field__label" htmlFor={id}>{tr('Usuário vinculado (login do profissional)')}</label>
      <select id={id} className="input" value={valor} onChange={(e) => onChange(e.target.value)} disabled={loading || (semOpcoes && !valor)}>
        <option value="">{loading ? tr('Carregando usuários...') : tr('Nenhum')}</option>
        {usuarios.map((usuario) => (
          <option key={usuario._id} value={usuario._id}>
            {usuario.nomeCompleto} · {ROTULO_FUNCAO[usuario.role] ?? usuario.role} ({usuario.email})
          </option>
        ))}
      </select>
      <p className="modal-form__hint">
        {semOpcoes ? (
          <>
            {tr('Não há usuário disponível para vincular. Crie um em')} <Link to="/usuarios">{tr('Usuários')}</Link> {tr('com a função Profissional e depois volte aqui.')}
          </>
        ) : (
          tr('Opcional. Com o login vinculado, o profissional marca os próprios atendimentos e vê os repasses dele.')
        )}
      </p>
    </div>
  );
}
