import { useState } from 'react';
import { useParams } from 'react-router-dom';
import AuthLayout from '@/modules/user/components/AuthLayout';
import { useTermoPublico } from '../termo.hooks';
import { mascararCpf } from '../termo.utils';
import TermoDocumento from './TermoDocumento';
import QuadroAssinatura from './QuadroAssinatura';
import { IconeImpressora } from '@/components/CrudCard/icones';
import '../termo.css';
import { tr } from '@/i18n';

function FormularioAssinatura({ termo, assinando, erro, onAssinar }) {
  const { paciente, pedeCpf } = termo;
  const responsaveis = paciente.responsaveis ?? [];
  const [relacao, setRelacao] = useState('paciente');
  const [nome, setNome] = useState(paciente.nome ?? '');
  const [documento, setDocumento] = useState(pedeCpf ? mascararCpf(paciente.cpf ?? '') : (paciente.cpf ?? ''));
  const [imagem, setImagem] = useState(null);
  const [aceite, setAceite] = useState(false);

  // Ao trocar quem assina, sugere os dados do paciente ou do (primeiro) responsável cadastrado.
  function escolherRelacao(valor) {
    setRelacao(valor);
    const origem = valor === 'paciente' ? { nome: paciente.nome, cpf: paciente.cpf } : responsaveis[0] ?? { nome: '', cpf: '' };
    setNome(origem.nome ?? '');
    setDocumento(pedeCpf ? mascararCpf(origem.cpf ?? '') : (origem.cpf ?? ''));
  }

  const pronto = nome.trim().length >= 3 && documento.trim() && imagem && aceite;

  function enviar(e) {
    e.preventDefault();
    if (!pronto) return;
    onAssinar({ relacao, nome, documento, imagem, aceite });
  }

  return (
    <form className="assinar-form" onSubmit={enviar}>
      <h2 className="assinar-form__titulo">{tr('Assinatura')}</h2>

      <fieldset className="assinar-form__quem">
        <legend className="field__label">{tr('Quem está assinando?')}</legend>
        <div className="check-list">
          <label className="check">
            <input type="radio" name="relacao" checked={relacao === 'paciente'} onChange={() => escolherRelacao('paciente')} />
            {tr('Sou o(a) paciente')}
          </label>
          <label className="check">
            <input type="radio" name="relacao" checked={relacao === 'responsavel'} onChange={() => escolherRelacao('responsavel')} />
            {tr('Sou o(a) responsável legal')}
          </label>
        </div>
      </fieldset>

      <div className="assinar-form__linha">
        <div className="field">
          <label className="field__label" htmlFor="assinar-nome">{tr('Nome completo')}</label>
          <input id="assinar-nome" className="input" value={nome} onChange={(e) => setNome(e.target.value)} autoComplete="name" required />
        </div>
        <div className="field">
          <label className="field__label" htmlFor="assinar-documento">{pedeCpf ? tr('CPF') : tr('Documento de identidade')}</label>
          <input
            id="assinar-documento"
            className="input"
            value={documento}
            onChange={(e) => setDocumento(pedeCpf ? mascararCpf(e.target.value) : e.target.value)}
            inputMode={pedeCpf ? 'numeric' : 'text'}
            required
          />
        </div>
      </div>

      <div className="field">
        <span className="field__label">{tr('Desenhe sua assinatura')}</span>
        <QuadroAssinatura onChange={setImagem} desabilitado={assinando} />
      </div>

      <label className="check assinar-form__aceite">
        <input type="checkbox" checked={aceite} onChange={(e) => setAceite(e.target.checked)} />
        {tr('Li o termo acima, entendi e concordo de forma livre e esclarecida.')}
      </label>

      {erro && <p className="alert alert--error" role="alert">{erro.message}</p>}

      <button type="submit" className={`btn btn--primary btn--block${assinando ? ' btn--loading' : ''}`} disabled={!pronto || assinando}>
        {assinando ? tr('Assinando...') : tr('Assinar termo')}
      </button>
      <p className="assinar-form__dica">
        {tr('Ao assinar, ficam registrados a data, a hora, o endereço de internet (IP) e o aparelho usado.')}
      </p>
    </form>
  );
}

// Página aberta pelo paciente (#/assinar/:token), sem login.
export default function AssinarTermo() {
  const { token } = useParams();
  const { termo, loading, error, assinando, erroAssinatura, assinar } = useTermoPublico(token);

  return (
    <AuthLayout wide>
      <div className="assinar">
        {loading ? (
          <div className="assinar__carregando" aria-busy="true" aria-label={tr('Carregando termo')}>
            <div className="skeleton skeleton--line" style={{ width: '40%' }} />
            <div className="skeleton skeleton--line" style={{ width: '90%' }} />
            <div className="skeleton skeleton--line" style={{ width: '85%' }} />
            <div className="skeleton skeleton--line" style={{ width: '70%' }} />
          </div>
        ) : error ? (
          <p className="alert alert--error" role="alert">{error.message}</p>
        ) : (
          <>
            {termo.status === 'assinado' && (
              <div className="assinar__feito no-print">
                <p className="alert alert--success" role="status">{tr('Termo assinado. Obrigado! Você pode guardar uma cópia.')}</p>
                <button type="button" className="btn btn--ghost btn--sm" onClick={() => window.print()}>
                  <IconeImpressora />
                  {tr('Imprimir ou salvar em PDF')}
                </button>
              </div>
            )}
            {termo.status === 'vencido' && (
              <p className="alert alert--warning" role="alert">{tr('Este link venceu. Peça um novo à clínica.')}</p>
            )}

            <TermoDocumento termo={termo} clinica={termo.clinica} />

            {termo.status === 'pendente' && (
              <FormularioAssinatura termo={termo} assinando={assinando} erro={erroAssinatura} onAssinar={assinar} />
            )}
          </>
        )}
      </div>
    </AuthLayout>
  );
}
