import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { createUser } from '../user.api';
import { useAuthContext } from '@/hooks/useAuthContext';
import AuthLayout from './AuthLayout';
import BotaoGoogle from './BotaoGoogle';
import CampoAceiteTermos from './CampoAceiteTermos';
import { normalizarEmail } from '@/utils/email';
import { codigoIndicacaoGuardado, esquecerCodigoIndicacao, normalizarCodigo } from '@/modules/indicacao/indicacao.utils';
import CampoSenha from '@/components/CampoSenha/CampoSenha';
import SeletorPais from '@/components/SeletorPais/SeletorPais';
import { adivinharPais } from '@/i18n/paises';
import { useIdioma } from '@/i18n/useIdioma';

export default function RegistroClinica() {
  const navigate = useNavigate();
  const location = useLocation();
  const { entrarComGoogle } = useAuthContext();
  const { t } = useIdioma();

  // Conta do Google escolhida (aqui ou na tela de login): e-mail e senha saem do formulário.
  const [google, setGoogle] = useState(() => location.state?.google ?? null);
  const [form, setForm] = useState({
    nomeCompleto: location.state?.google?.nomeCompleto ?? '',
    email: '',
    password: '',
    telefone: '',
    nomeEmpresa: '',
    cnpj: '',
    codigoIndicacao: codigoIndicacaoGuardado(),
    aceitouTermos: false,
    pais: adivinharPais(),
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function handleChange(field, value) {
    setForm({ ...form, [field]: value });
  }

  async function handleGoogle(credential) {
    setError(null);
    try {
      const resultado = await entrarComGoogle(credential);
      if (!resultado.novoCadastro) {
        navigate('/home');
        return;
      }
      setGoogle({ credential, nomeCompleto: resultado.nomeCompleto, email: resultado.email });
      setForm((atual) => ({ ...atual, nomeCompleto: atual.nomeCompleto || resultado.nomeCompleto }));
    } catch (err) {
      setError(err);
    }
  }

  function usarOutroEmail() {
    setGoogle(null);
    setError(null);
    navigate('/registro', { replace: true, state: null });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (google) {
        const { nomeCompleto, telefone, nomeEmpresa, cnpj, codigoIndicacao, aceitouTermos, pais } = form;
        await entrarComGoogle(google.credential, { nomeCompleto, telefone, nomeEmpresa, cnpj, codigoIndicacao, aceitouTermos, pais });
        esquecerCodigoIndicacao();
        navigate('/home');
      } else {
        await createUser(form);
        esquecerCodigoIndicacao();
        navigate('/login');
      }
    } catch (err) {
      // O token do Google vale só alguns minutos: vencido, a pessoa escolhe a conta de novo.
      if (google && err.status === 401) {
        setGoogle(null);
        setError({ message: t('auth.registro.googleExpirou') });
      } else {
        setError(err);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout wide>
      <h2 className="auth-title">{t('auth.registro.titulo')}</h2>
      <p className="auth-subtitle">
        {google ? t('auth.registro.subtituloGoogle') : t('auth.registro.subtitulo')}
      </p>

      {!google && (
        <>
          <BotaoGoogle onCredencial={handleGoogle} />
          <div className="auth-divisor auth-divisor--topo"><span>{t('auth.registro.ouPreencha')}</span></div>
        </>
      )}

      <form className="auth-form auth-form--grid stagger" onSubmit={handleSubmit}>
        {error && <p className="alert alert--error" role="alert">{error.message}</p>}

        {google && (
          <div className="auth-google-conta">
            <span>{t('auth.registro.contaGoogle')} <strong>{google.email}</strong></span>
            <button type="button" className="link" onClick={usarOutroEmail}>{t('auth.registro.outroEmail')}</button>
          </div>
        )}

        <div className="field field--full">
          <label className="field__label" htmlFor="registro-nome">{t('auth.campos.nomeCompleto')}</label>
          <input
            id="registro-nome"
            className="input"
            type="text"
            value={form.nomeCompleto}
            onChange={(e) => handleChange('nomeCompleto', e.target.value)}
            required
          />
        </div>

        <div className="field">
          <label className="field__label" htmlFor="registro-clinica">{t('auth.campos.nomeClinica')}</label>
          <input
            id="registro-clinica"
            className="input"
            type="text"
            value={form.nomeEmpresa}
            onChange={(e) => handleChange('nomeEmpresa', e.target.value)}
            required
          />
        </div>

        <div className="field">
          <label className="field__label" htmlFor="registro-cnpj">{t('auth.campos.cnpj')}</label>
          <input
            id="registro-cnpj"
            className="input"
            type="text"
            value={form.cnpj}
            onChange={(e) => handleChange('cnpj', e.target.value)}
          />
        </div>

        <div className="field">
          <label className="field__label" htmlFor="registro-pais">{t('auth.campos.pais')}</label>
          <SeletorPais id="registro-pais" value={form.pais} onChange={(pais) => handleChange('pais', pais)} required />
        </div>

        <div className="field">
          <label className="field__label" htmlFor="registro-telefone">{t('auth.campos.telefone')}</label>
          <input
            id="registro-telefone"
            className="input"
            type="text"
            value={form.telefone}
            onChange={(e) => handleChange('telefone', e.target.value)}
            required
          />
        </div>

        {!google && (
          <>
            <div className="field">
              <label className="field__label" htmlFor="registro-email">{t('auth.campos.email')}</label>
              <input
                id="registro-email"
                className="input"
                type="email"
                value={form.email}
                onChange={(e) => handleChange('email', normalizarEmail(e.target.value))}
                required
              />
            </div>

            <div className="field field--full">
              <label className="field__label" htmlFor="registro-senha">{t('auth.campos.senha')}</label>
              <CampoSenha
                id="registro-senha"
                className="input"
                value={form.password}
                onChange={(e) => handleChange('password', e.target.value)}
                required
              />
            </div>
          </>
        )}

        <div className="field field--full">
          <label className="field__label" htmlFor="registro-indicacao">{t('auth.campos.codigoIndicacao')}</label>
          <input
            id="registro-indicacao"
            className="input"
            type="text"
            value={form.codigoIndicacao}
            onChange={(e) => handleChange('codigoIndicacao', normalizarCodigo(e.target.value))}
            placeholder={t('auth.campos.codigoIndicacaoDica')}
            maxLength={12}
            autoComplete="off"
          />
        </div>

        <CampoAceiteTermos marcado={form.aceitouTermos} onChange={(valor) => handleChange('aceitouTermos', valor)} rota="/termos" nome={t('auth.aceite.termosDeUso')} />

        <button className={`btn btn--primary${loading ? ' btn--loading' : ''}`} type="submit" disabled={loading}>
          {loading ? t('auth.registro.criando') : t('auth.registro.criar')}
        </button>
      </form>

      <p className="auth-footer">
        {t('auth.registro.jaTem')} <Link className="link" to="/login">{t('auth.registro.entrar')}</Link>
      </p>
    </AuthLayout>
  );
}
