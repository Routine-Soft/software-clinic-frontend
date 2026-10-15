import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuthContext } from "@/hooks/useAuthContext";
import AuthLayout from "./AuthLayout";
import BotaoGoogle from "./BotaoGoogle";
import { normalizarEmail } from "@/utils/email";
import CampoSenha from '@/components/CampoSenha/CampoSenha';
import { useIdioma } from '@/i18n/useIdioma';
import { tr } from '@/i18n';

export default function User() {
  const { isAuthenticated, loading, error, login, entrarComGoogle } = useAuthContext();
  const navigate = useNavigate();
  // Quem veio de outra página (ex.: "Seja afiliado") volta para ela depois de entrar.
  const voltarPara = useLocation().state?.voltarPara ?? '/home';

  const { t } = useIdioma();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate(voltarPara);
    }
  }, [isAuthenticated, navigate, voltarPara]);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await login(email, password);
      navigate(voltarPara);
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
        navigate(voltarPara);
      }
    } catch (err) {
      console.error('Erro ao entrar com o Google:', err);
    }
  }

  return (
    <AuthLayout>
      <h2 className="auth-title">{t('auth.login.titulo')}</h2>
      <p className="auth-subtitle">{t('auth.login.subtitulo')}</p>

      <form className="auth-form stagger" onSubmit={handleSubmit}>
        {error && <p className="alert alert--error" role="alert">{error.message}</p>}

        <div className="field">
          <label className="field__label" htmlFor="login-email">{t('auth.campos.email')}</label>
          <input
            id="login-email"
            className="input"
            type="email"
            value={email}
            onChange={(e) => setEmail(normalizarEmail(e.target.value))}
            placeholder={tr('seu@email.com')}
            required
          />
        </div>

        <div className="field">
          <label className="field__label" htmlFor="login-password">{t('auth.campos.senha')}</label>
          <CampoSenha
            id="login-password"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
          <Link className="link auth-esqueci" to="/esqueci-senha">{t('auth.login.esqueceu')}</Link>
        </div>

        <button className={`btn btn--primary${loading ? ' btn--loading' : ''}`} type="submit" disabled={loading}>
          {loading ? t('auth.login.entrando') : t('auth.login.entrar')}
        </button>
      </form>

      <div className="auth-divisor"><span>{t('auth.divisor')}</span></div>
      <BotaoGoogle onCredencial={handleGoogle} />

      <p className="auth-footer">
        {t('auth.login.semConta')} <Link className="link" to="/registro">{t('auth.login.criarConta')}</Link>
      </p>
    </AuthLayout>
  );
}