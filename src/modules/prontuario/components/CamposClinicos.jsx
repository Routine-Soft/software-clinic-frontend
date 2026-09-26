import { useId } from 'react';
import { IconeMais, IconeX } from '@/components/CrudCard/icones';
import { CAMPOS_TEXTO, TIPOS_ANEXO } from '../prontuario.utils';

export default function CamposClinicos({ valores, onChange }) {
  const id = useId();

  function set(campo, valor) {
    onChange({ ...valores, [campo]: valor });
  }

  function setSinalVital(campo, valor) {
    onChange({ ...valores, sinaisVitais: { ...valores.sinaisVitais, [campo]: valor } });
  }

  function adicionarAnexo() {
    onChange({ ...valores, anexos: [...valores.anexos, { nome: '', url: '', tipo: 'outro' }] });
  }

  function atualizarAnexo(index, campo, valor) {
    const anexos = [...valores.anexos];
    anexos[index] = { ...anexos[index], [campo]: valor };
    onChange({ ...valores, anexos });
  }

  function removerAnexo(index) {
    onChange({ ...valores, anexos: valores.anexos.filter((_, i) => i !== index) });
  }

  return (
    <div className="pront-campos">
      {CAMPOS_TEXTO.map(([campo, label, linhas]) => (
        <div className="field" key={campo}>
          <label className="field__label" htmlFor={`${id}-${campo}`}>{label}</label>
          <textarea
            id={`${id}-${campo}`}
            className="input textarea"
            value={valores[campo]}
            onChange={(e) => set(campo, e.target.value)}
            rows={linhas}
          />
        </div>
      ))}

      <div className="pront-grid">
        <div className="field">
          <label className="field__label" htmlFor={`${id}-cid10`}>CID-10</label>
          <input id={`${id}-cid10`} className="input" type="text" value={valores.cid10} onChange={(e) => set('cid10', e.target.value)} placeholder="Ex: J45.0" />
        </div>

        <div className="field">
          <label className="field__label" htmlFor={`${id}-retorno`}>Próximo retorno</label>
          <input id={`${id}-retorno`} className="input" type="date" value={valores.proximoRetorno} onChange={(e) => set('proximoRetorno', e.target.value)} />
        </div>
      </div>

      <fieldset className="pront-section">
        <legend>Sinais vitais</legend>

        <div className="pront-grid pront-grid--sinais">
          <div className="field">
            <label className="field__label" htmlFor={`${id}-peso`}>Peso (kg)</label>
            <input id={`${id}-peso`} className="input" type="number" step="0.1" value={valores.sinaisVitais.peso} onChange={(e) => setSinalVital('peso', e.target.value)} />
          </div>

          <div className="field">
            <label className="field__label" htmlFor={`${id}-altura`}>Altura (m)</label>
            <input id={`${id}-altura`} className="input" type="number" step="0.01" value={valores.sinaisVitais.altura} onChange={(e) => setSinalVital('altura', e.target.value)} />
          </div>

          <div className="field">
            <label className="field__label" htmlFor={`${id}-pa`}>Pressão arterial</label>
            <input
              id={`${id}-pa`}
              className="input"
              type="text"
              placeholder="Ex: 120/80"
              value={valores.sinaisVitais.pressaoArterial}
              onChange={(e) => setSinalVital('pressaoArterial', e.target.value)}
            />
          </div>

          <div className="field">
            <label className="field__label" htmlFor={`${id}-fc`}>Freq. cardíaca (bpm)</label>
            <input
              id={`${id}-fc`}
              className="input"
              type="number"
              value={valores.sinaisVitais.frequenciaCardiaca}
              onChange={(e) => setSinalVital('frequenciaCardiaca', e.target.value)}
            />
          </div>

          <div className="field">
            <label className="field__label" htmlFor={`${id}-temp`}>Temperatura (°C)</label>
            <input id={`${id}-temp`} className="input" type="number" step="0.1" value={valores.sinaisVitais.temperatura} onChange={(e) => setSinalVital('temperatura', e.target.value)} />
          </div>
        </div>
      </fieldset>

      <fieldset className="pront-section">
        <legend>Anexos</legend>

        {valores.anexos.length === 0 && <p className="pront-section__vazio">Nenhum anexo. Informe o link de exames, fotos ou laudos.</p>}

        {valores.anexos.map((anexo, index) => (
          <div className="pront-anexo-form" key={index}>
            <input className="input" type="text" placeholder="Nome" aria-label={`Nome do anexo ${index + 1}`} value={anexo.nome} onChange={(e) => atualizarAnexo(index, 'nome', e.target.value)} />
            <input className="input" type="text" placeholder="URL" aria-label={`URL do anexo ${index + 1}`} value={anexo.url} onChange={(e) => atualizarAnexo(index, 'url', e.target.value)} />
            <select className="input" aria-label={`Tipo do anexo ${index + 1}`} value={anexo.tipo} onChange={(e) => atualizarAnexo(index, 'tipo', e.target.value)}>
              {TIPOS_ANEXO.map(([valor, rotulo]) => (
                <option key={valor} value={valor}>{rotulo}</option>
              ))}
            </select>
            <button type="button" className="icon-btn icon-btn--danger" aria-label={`Remover anexo ${index + 1}`} onClick={() => removerAnexo(index)}>
              <IconeX />
            </button>
          </div>
        ))}

        <button type="button" className="btn btn--ghost btn--sm pront-section__add" onClick={adicionarAnexo}>
          <IconeMais />
          Adicionar anexo
        </button>
      </fieldset>
    </div>
  );
}
