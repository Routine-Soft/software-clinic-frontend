import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUser } from '../user.api';
import AuthLayout from './AuthLayout';

export default function RegistroClinica() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nomeCompleto: '',
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

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await createUser(form);
      navigate('/login');
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout wide>
      <h2 className="auth-title">Criar conta</h2>
      <p className="auth-subtitle">Cadastre sua clínica para começar a usar o sistema</p>

      <form className="auth-form auth-form--grid stagger" onSubmit={handleSubmit}>
        {error && <p className="alert alert--error" role="alert">{error.message}</p>}

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
