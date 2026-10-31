import { useState } from 'react';
import { useConfirmacoes } from '@/modules/agenda/confirmacoes.context';
import { definirConfirmacaoAtendimento } from '../user.api';
import { tr } from '@/i18n';

const OPCOES = [
  {
    modo: 'automatica',
    titulo: tr('O profissional finaliza e já conta como atendido'),
    texto: tr('Bom para quem não tem recepção. O repasse é gerado assim que o profissional finaliza o atendimento.'),
  },
  {
    modo: 'recepcao',
    titulo: tr('A recepção ou a administração confirma'),
    texto: tr('Mais controle. O atendimento só conta, e o repasse só é gerado, depois que a recepção ou a administração confirma. O profissional não confirma o próprio atendimento.'),
  },
];

// Cada clínica escolhe como trabalhar. Só o administrador muda.
export default function ConfirmacaoAtendimentoCard() {
  const { modo, recarregar } = useConfirmacoes();
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState(null);
  const [aviso, setAviso] = useState(null);

  async function escolher(novo) {
    if (novo === modo) return;
    setSalvando(true);
    setErro(null);
    setAviso(null);
    try {
      const response = await definirConfirmacaoAtendimento(novo);
      setAviso(response.message);
      recarregar();
    } catch (err) {
      setErro(err);
    } finally {
      setSalvando(false);
    }
  }

  return (
    <section className="card conta-confirmacao" aria-labelledby="conta-confirmacao-titulo">
      <div>
        <h3 id="conta-confirmacao-titulo" className="conta-confirmacao__titulo">{tr('Quem confirma os atendimentos')}</h3>
        <p className="conta-confirmacao__sub">{tr('Escolha como sua clínica prefere trabalhar. Dá para trocar quando quiser.')}</p>
      </div>
      {erro && <p className="alert alert--error" role="alert">{erro.message}</p>}
      {aviso && <p className="alert alert--success" role="status">{aviso}</p>}
      {modo === null ? (
        <div className="skeleton skeleton--line" style={{ width: '100%', height: 70 }} />
      ) : (
        <div className="conta-confirmacao__opcoes" role="radiogroup" aria-labelledby="conta-confirmacao-titulo">
          {OPCOES.map((opcao) => (
            <label key={opcao.modo} className={`conta-confirmacao__opcao${modo === opcao.modo ? ' is-ativa' : ''}`}>
              <input type="radio" name="confirmacao-atendimento" checked={modo === opcao.modo} disabled={salvando} onChange={() => escolher(opcao.modo)} />
              <span>
                <strong>{opcao.titulo}</strong>
                <small>{opcao.texto}</small>
              </span>
            </label>
          ))}
        </div>
      )}
    </section>
  );
}
