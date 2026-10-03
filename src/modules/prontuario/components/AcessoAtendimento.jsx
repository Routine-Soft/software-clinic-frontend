import { useState } from 'react';
import { textoDeAcesso } from '../prontuario.utils';

const idDe = (esp) => String(esp?._id ?? esp);

// Checkboxes das especialidades da clínica. Nada marcado = só o autor lê.
export function EscolhaEspecialidades({ id, especialidades, selecionadas, onChange }) {
  function alternar(espId) {
    onChange(selecionadas.includes(espId) ? selecionadas.filter((s) => s !== espId) : [...selecionadas, espId]);
  }

  if (especialidades.length === 0) {
    return <p className="field__hint">Nenhuma especialidade cadastrada na clínica. Só você poderá ler.</p>;
  }

  return (
    <div className="pront-acesso__opcoes" role="group" aria-labelledby={`${id}-rotulo`}>
      {especialidades.map((esp) => (
        <label key={esp._id} className="pront-acesso__opcao">
          <input type="checkbox" checked={selecionadas.includes(esp._id)} onChange={() => alternar(esp._id)} />
          <span>{esp.nome}</span>
        </label>
      ))}
    </div>
  );
}

// "Quem pode ler" de um atendimento já registrado. O autor muda a qualquer momento, inclusive depois de finalizar.
export default function AcessoAtendimento({ prontuario, especialidades, souAutor, onSalvar }) {
  const atuais = (prontuario.compartilhadoCom ?? []).map(idDe);
  const [editando, setEditando] = useState(false);
  const [selecionadas, setSelecionadas] = useState(atuais);
  const [salvando, setSalvando] = useState(false);

  const nomes = (prontuario.compartilhadoCom ?? []).map((esp) => esp?.nome ?? especialidades.find((e) => e._id === idDe(esp))?.nome).filter(Boolean);
  const mudou = selecionadas.length !== atuais.length || selecionadas.some((s) => !atuais.includes(s));
  const id = `acesso-${prontuario._id}`;

  async function salvar() {
    setSalvando(true);
    const salvo = await onSalvar(prontuario._id, selecionadas);
    setSalvando(false);
    if (salvo) setEditando(false);
  }

  if (!editando) {
    return (
      <div className="pront-acesso pront-no-print">
        <span className="pront-acesso__resumo"><strong>Quem pode ler:</strong> {textoDeAcesso(nomes)}</span>
        {souAutor && (
          <button type="button" className="link pront-acesso__alterar" onClick={() => { setSelecionadas(atuais); setEditando(true); }}>
            Alterar
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="pront-acesso pront-acesso--editando pront-no-print">
      <span className="field__label" id={`${id}-rotulo`}>Quem mais pode ler este atendimento</span>
      <EscolhaEspecialidades id={id} especialidades={especialidades} selecionadas={selecionadas} onChange={setSelecionadas} />
      <p className="field__hint">Qualquer profissional da clínica com uma das especialidades marcadas poderá ler. Só você edita.</p>
      <div className="pront-rodape">
        <button type="button" className="btn btn--ghost btn--sm" onClick={() => setEditando(false)}>Cancelar</button>
        <button type="button" className={`btn btn--primary btn--sm${salvando ? ' btn--loading' : ''}`} disabled={salvando || !mudou} onClick={salvar}>
          {salvando ? 'Salvando...' : 'Salvar acesso'}
        </button>
      </div>
    </div>
  );
}
