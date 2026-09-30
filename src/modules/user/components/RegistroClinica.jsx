import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { createUser } from '../user.api';
import { useAuthContext } from '@/hooks/useAuthContext';
import AuthLayout from './AuthLayout';
import BotaoGoogle from './BotaoGoogle';

export default function RegistroClinica() {
  const navigate = useNavigate();
  const location = useLocation();
  const { entrarComGoogle } = useAuthContext();

  // Conta do Google escolhida (aqui ou na tela de login): e-mail e senha saem do formulário.
  const [google, setGoogle] = useState(() => location.state?.google ?? null);
  const [form, setForm] = useState({
    nomeCompleto: location.state?.google?.nomeCompleto ?? '',
    email: '',
    password: '',
    telefone: '',
    nomeEmpresa: '',
    cnpj: '',
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
        const { nomeCompleto, telefone, nomeEmpresa, cnpj } = form;
        await entrarComGoogle(google.credential, { nomeCompleto, telefone, nomeEmpresa, cnpj });
        navigate('/home');
      } else {
        await createUser(form);
        navigate('/login');
      }
    } catch (err) {
      // O token do Google vale só alguns minutos: vencido, a pessoa escolhe a conta de novo.
      if (google && err.status === 401) {
        setGoogle(null);
        setError({ message: 'O login com o Google expirou. Clique em "Continuar com o Google" de novo; os dados preenchidos foram mantidos.' });
      } else {
        setError(err);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout wide>
      <h2 className="auth-title">Criar conta</h2>
      <p className="auth-subtitle">
        {google ? 'Falta pouco: informe os dados da sua clínica' : 'Cadastre sua clínica para começar a usar o sistema'}
      </p>

      {!google && (
        <>
          <BotaoGoogle onCredencial={handleGoogle} />
          <div className="auth-divisor auth-divisor--topo"><span>ou preencha seus dados</span></div>
        </>
      )}

      <form className="auth-form auth-form--grid stagger" onSubmit={handleSubmit}>
        {error && <p className="alert alert--error" role="alert">{error.message}</p>}

        {google && (
          <div className="auth-google-conta">
            <span>Conta Google: <strong>{google.email}</strong></span>
            <button type="button" className="link" onClick={usarOutroEmail}>Usar outro e-mail</button>
          </div>
        )}

        <div className="field field--full">
          <label className="field__label" htmlFor="registro-nome">Nome completo</label>
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
          <label className="field__label" htmlFor="registro-clinica">Nome da clínica</label>
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
          <label className="field__label" htmlFor="registro-cnpj">CNPJ (opcional)</label>
          <input
            id="registro-cnpj"
            className="input"
            type="text"
            value={form.cnpj}
            onChange={(e) => handleChange('cnpj', e.target.value)}
          />
        </div>

        <div className="field">
          <label className="field__label" htmlFor="registro-telefone">Telefone</label>
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
              <label className="field__label" htmlFor="registro-email">E-mail</label>
              <input
                id="registro-email"
                className="input"
                type="email"
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                required
              />
            </div>

            <div className="field field--full">
              <label className="field__label" htmlFor="registro-senha">Senha</label>
              <input
                id="registro-senha"
                className="input"
                type="password"
                value={form.password}
                onChange={(e) => handleChange('password', e.target.value)}
                required
              />
            </div>
          </>
        )}

        <button className={`btn btn--primary${loading ? ' btn--loading' : ''}`} type="submit" disabled={loading}>
          {loading ? 'Criando...' : 'Criar conta'}
        </button>
      </form>

      <p className="auth-footer">
        Já tem uma conta? <Link className="link" to="/login">Entrar</Link>
      </p>
    </AuthLayout>
  );
}
