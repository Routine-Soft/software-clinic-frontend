import { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from './AuthLayout';
import { useRecuperarSenha } from '../user.hooks';
import { normalizarEmail } from '@/utils/email';
import { useIdioma } from '@/i18n/useIdioma';
import { tr } from '@/i18n';

export default function EsqueciSenha() {
  const { enviando, erro, sucesso, pedirLink } = useRecuperarSenha();
  const { t } = useIdioma();
  const [email, setEmail] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    pedirLink(email);
  }

  return (
    <AuthLayout>
      <h2 className="auth-title">{t('auth.esqueci.titulo')}</h2>
      <p className="auth-subtitle">{t('auth.esqueci.subtitulo')}</p>

      {sucesso ? (
        <div className="auth-form stagger">
          <p className="alert alert--success" role="status">{sucesso}</p>
          <div className="auth-ajuda" role="note">
            <p>{t('auth.esqueci.dicaPrazo')}</p>
          </div>
          <Link className="btn btn--primary" to="/login">{t('auth.esqueci.voltarLogin')}</Link>
        </div>
      ) : (
        <form className="auth-form stagger" onSubmit={handleSubmit}>
          {erro && <p className="alert alert--error" role="alert">{erro.message}</p>}

          <div className="field">
            <label className="field__label" htmlFor="esqueci-email">{t('auth.campos.email')}</label>
            <input
              id="esqueci-email"
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(normalizarEmail(e.target.value))}
              placeholder={tr('seu@email.com')}
              autoComplete="email"
              required
            />
          </div>

          <button className={`btn btn--primary${enviando ? ' btn--loading' : ''}`} type="submit" disabled={enviando}>
            {enviando ? t('auth.esqueci.enviando') : t('auth.esqueci.enviar')}
          </button>

          <div className="auth-ajuda" role="note">
            <p>
              <strong>{t('auth.esqueci.google')}</strong> {t('auth.esqueci.googleDica')}
              <strong> {t('auth.esqueci.googleCaminho')}</strong>{t('auth.esqueci.googleFim')}
            </p>
          </div>
        </form>
      )}

      <p className="auth-footer">
        {t('auth.esqueci.lembrou')} <Link className="link" to="/login">{t('auth.esqueci.entrar')}</Link>
      </p>
    </AuthLayout>
  );
}
