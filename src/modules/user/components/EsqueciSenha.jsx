import { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from './AuthLayout';
import { useRecuperarSenha } from '../user.hooks';
import { normalizarEmail } from '@/utils/email';

export default function EsqueciSenha() {
  const { enviando, erro, sucesso, pedirLink } = useRecuperarSenha();
  const [email, setEmail] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    pedirLink(email);
  }

  return (
    <AuthLayout>
      <h2 className="auth-title">Esqueceu a senha?</h2>
      <p className="auth-subtitle">Informe o e-mail da sua conta. Vamos mandar um link para você criar uma senha nova.</p>

      {sucesso ? (
        <div className="auth-form stagger">
          <p className="alert alert--success" role="status">{sucesso}</p>
          <div className="auth-ajuda" role="note">
            <p>O link vale por 1 hora. Não chegou? Olhe a caixa de spam ou de promoções e confira se digitou o e-mail certo.</p>
          </div>
          <Link className="btn btn--primary" to="/login">Voltar para o login</Link>
        </div>
      ) : (
        <form className="auth-form stagger" onSubmit={handleSubmit}>
          {erro && <p className="alert alert--error" role="alert">{erro.message}</p>}

          <div className="field">
            <label className="field__label" htmlFor="esqueci-email">E-mail</label>
            <input
              id="esqueci-email"
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(normalizarEmail(e.target.value))}
              placeholder="seu@email.com"
              autoComplete="email"
              required
            />
          </div>

          <button className={`btn btn--primary${enviando ? ' btn--loading' : ''}`} type="submit" disabled={enviando}>
            {enviando ? 'Enviando...' : 'Enviar link'}
          </button>

          <div className="auth-ajuda" role="note">
            <p>
              <strong>Entra com o Google?</strong> Use &quot;Continuar com o Google&quot; na tela de login. Depois, em
              <strong> Minha conta → Alterar senha</strong>, dá para criar uma senha sem precisar da antiga.
            </p>
          </div>
        </form>
      )}

      <p className="auth-footer">
        Lembrou a senha? <Link className="link" to="/login">Entrar</Link>
      </p>
    </AuthLayout>
  );
}
