import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import AuthLayout from './AuthLayout';
import { useRecuperarSenha } from '../user.hooks';
import CampoSenha from '@/components/CampoSenha/CampoSenha';

// Aberta pelo link do e-mail "Redefinir a sua senha" (#/redefinir-senha/<código>).
export default function RedefinirSenha() {
  const { codigo } = useParams();
  const { enviando, erro, sucesso, redefinir } = useRecuperarSenha();
  const [senha, setSenha] = useState('');
  const [confirmacao, setConfirmacao] = useState('');

  const naoConferem = confirmacao.length > 0 && senha !== confirmacao;

  function handleSubmit(e) {
    e.preventDefault();
    if (senha !== confirmacao) return;
    redefinir(codigo, senha);
  }

  return (
    <AuthLayout>
      <h2 className="auth-title">Criar senha nova</h2>
      <p className="auth-subtitle">Escolha uma senha com pelo menos 6 caracteres.</p>

      {sucesso ? (
        <div className="auth-form stagger">
          <p className="alert alert--success" role="status">{sucesso}</p>
          <Link className="btn btn--primary" to="/login">Ir para o login</Link>
        </div>
      ) : (
        <form className="auth-form stagger" onSubmit={handleSubmit}>
          {erro && (
            <p className="alert alert--error" role="alert">
              {erro.message} {erro.status === 400 && <Link className="link" to="/esqueci-senha">Pedir novo link</Link>}
            </p>
          )}

          <div className="field">
            <label className="field__label" htmlFor="nova-senha">Senha nova</label>
            <CampoSenha
              id="nova-senha"
              className="input"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              minLength={6}
              autoComplete="new-password"
              required
            />
          </div>

          <div className="field">
            <label className="field__label" htmlFor="nova-senha-confirmacao">Repita a senha nova</label>
            <CampoSenha
              id="nova-senha-confirmacao"
              className="input"
              value={confirmacao}
              onChange={(e) => setConfirmacao(e.target.value)}
              minLength={6}
              autoComplete="new-password"
              aria-invalid={naoConferem}
              required
            />
            {naoConferem && <p className="field__hint auth-erro-campo" role="alert">As senhas não conferem</p>}
          </div>

          <button className={`btn btn--primary${enviando ? ' btn--loading' : ''}`} type="submit" disabled={enviando || naoConferem}>
            {enviando ? 'Salvando...' : 'Salvar senha nova'}
          </button>
        </form>
      )}
    </AuthLayout>
  );
}
