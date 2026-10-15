import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/hooks/useAuthContext';
import CampoAceiteTermos from '@/modules/user/components/CampoAceiteTermos';
import { normalizarEmail } from '@/utils/email';
import { criarAfiliado, ativarAfiliado } from '../afiliado.api';
import '@/modules/user/components/user.css';
import './afiliado.css';
import CampoSenha from '@/components/CampoSenha/CampoSenha';
import { tr } from '@/i18n';

// Três situações: visitante (cria a conta de afiliado), já usa a Sonelia (ativa na própria conta,
// com o mesmo e-mail) ou já é afiliado (vai para o painel).
export default function CadastroAfiliado() {
  const navigate = useNavigate();
  const { isAuthenticated, user, login, atualizarUsuarioLogado } = useAuthContext();
  const [form, setForm] = useState({ nomeCompleto: '', email: '', telefone: '', documento: '', chavePix: '', password: '', aceitouTermos: false });
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
      if (isAuthenticated) {
        const { data } = await ativarAfiliado({ documento: form.documento, chavePix: form.chavePix, aceitouTermos: form.aceitouTermos });
        atualizarUsuarioLogado({ afiliadoDesde: data.afiliadoDesde, codigoAfiliado: data.codigoAfiliado });
      } else {
        await criarAfiliado(form);
        await login(form.email, form.password);
      }
      navigate('/afiliado');
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  if (isAuthenticated && user?.afiliadoDesde) {
    return (
      <section className="card afiliado-cadastro afiliado-cadastro--pronto">
        <p>{tr('Você já é afiliado da Sonelia.')}</p>
        <Link className="btn btn--primary" to="/afiliado">{tr('Abrir o painel do afiliado')}</Link>
      </section>
    );
  }

  return (
    <section className="card afiliado-cadastro">
      {isAuthenticated ? (
        <p className="alert alert--info" role="status">
          {tr('Você está ativando o programa na sua conta')} <strong>{user?.email}</strong>. {tr('Continua usando a Sonelia normalmente e ganha um painel de afiliado.')}
          {['admin', 'super_admin'].includes(user?.role) && tr(' Dica: o seu "Indique e ganhe" (desconto na mensalidade) continua valendo, com outro link.')}
        </p>
      ) : (
        <p className="afiliado-cadastro__ja-tem">
          {tr('Já usa a Sonelia (recepção, profissional ou clínica)?')}{' '}
          <Link className="link" to="/login" state={{ voltarPara: '/afiliados' }}>{tr('Entre e ative com o mesmo e-mail')}</Link>
        </p>
      )}

      <form className="auth-form auth-form--grid" onSubmit={handleSubmit}>
        {error && <p className="alert alert--error" role="alert">{error.message}</p>}

        {!isAuthenticated && (
          <>
            <div className="field field--full">
              <label className="field__label" htmlFor="afiliado-nome">{tr('Nome completo')}</label>
              <input id="afiliado-nome" className="input" type="text" value={form.nomeCompleto} onChange={(e) => handleChange('nomeCompleto', e.target.value)} required />
            </div>

            <div className="field">
              <label className="field__label" htmlFor="afiliado-email">{tr('E-mail')}</label>
              <input id="afiliado-email" className="input" type="email" value={form.email} onChange={(e) => handleChange('email', normalizarEmail(e.target.value))} required />
            </div>

            <div className="field">
              <label className="field__label" htmlFor="afiliado-telefone">{tr('WhatsApp')}</label>
              <input id="afiliado-telefone" className="input" type="tel" value={form.telefone} onChange={(e) => handleChange('telefone', e.target.value)} required />
            </div>
          </>
        )}

        <div className="field">
          <label className="field__label" htmlFor="afiliado-documento">{tr('CPF ou CNPJ')}</label>
          <input id="afiliado-documento" className="input" type="text" inputMode="numeric" value={form.documento} onChange={(e) => handleChange('documento', e.target.value)} required />
        </div>

        <div className="field">
          <label className="field__label" htmlFor="afiliado-pix">{tr('Chave Pix (para receber)')}</label>
          <input id="afiliado-pix" className="input" type="text" value={form.chavePix} onChange={(e) => handleChange('chavePix', e.target.value)} required />
        </div>

        {!isAuthenticated && (
          <div className="field field--full">
            <label className="field__label" htmlFor="afiliado-senha">{tr('Senha')}</label>
            <CampoSenha id="afiliado-senha" className="input" minLength={6} value={form.password} onChange={(e) => handleChange('password', e.target.value)} required />
          </div>
        )}

        <CampoAceiteTermos marcado={form.aceitouTermos} onChange={(valor) => handleChange('aceitouTermos', valor)} rota="/termos-afiliado" nome={tr('Termos do afiliado')} />

        <button className={`btn btn--primary${loading ? ' btn--loading' : ''}`} type="submit" disabled={loading}>
          {loading ? tr('Salvando...') : isAuthenticated ? tr('Ativar como afiliado') : tr('Criar conta de afiliado')}
        </button>
      </form>
    </section>
  );
}
