import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthContext } from "@/hooks/useAuthContext";
import AuthLayout from "./AuthLayout";
import BotaoGoogle from "./BotaoGoogle";

export default function User() {
  const { isAuthenticated, loading, error, login, entrarComGoogle } = useAuthContext();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home');
    }
  }, [isAuthenticated, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/home');
    } catch (err) {
      console.error('Erro ao fazer login:', err);
    }
  }

  // E-mail do Google sem conta: segue para o cadastro, que só pede os dados da clínica.
  async function handleGoogle(credential) {
    try {
      const resultado = await entrarComGoogle(credential);
      if (resultado.novoCadastro) {
        navigate('/registro', { state: { google: { credential, nomeCompleto: resultado.nomeCompleto, email: resultado.email } } });
      } else {
        navigate('/home');
      }
    } catch (err) {
      console.error('Erro ao entrar com o Google:', err);
    }
  }

  return (
    <AuthLayout>
      <h2 className="auth-title">Login</h2>
      <p className="auth-subtitle">Entre com suas credenciais para acessar o sistema</p>

      <form className="auth-form stagger" onSubmit={handleSubmit}>
        {error && <p className="alert alert--error" role="alert">{error.message}</p>}

        <div className="field">
          <label className="field__label" htmlFor="login-email">E-mail</label>
          <input
            id="login-email"
            className="input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            required
          />
        </div>

        <div className="field">
          <label className="field__label" htmlFor="login-password">Senha</label>
          <input
            id="login-password"
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>

        <button className={`btn btn--primary${loading ? ' btn--loading' : ''}`} type="submit" disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <div className="auth-divisor"><span>ou</span></div>
      <BotaoGoogle onCredencial={handleGoogle} />

      <p className="auth-footer">
        Ainda não tem uma conta? <Link className="link" to="/registro">Criar conta</Link>
      </p>
    </AuthLayout>
  );
}