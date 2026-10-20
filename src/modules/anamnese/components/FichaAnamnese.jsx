import { formatDataBR } from '@/utils/date';
import { respondida, respostaVazia } from '../anamnese.utils';
import '../anamnese.css';
import { tr } from '@/i18n';

function Pergunta({ pergunta, valor, onChange, idCampo }) {
  const atual = valor ?? respostaVazia(pergunta);

  if (pergunta.tipo === 'marcar' || pergunta.tipo === 'escolha') {
    const multipla = pergunta.tipo === 'marcar';
    const marcada = (opcao) => (multipla ? atual.marcadas?.includes(opcao) : atual.valor === opcao);
    function alternar(opcao) {
      if (multipla) {
        const marcadas = marcada(opcao) ? atual.marcadas.filter((o) => o !== opcao) : [...(atual.marcadas ?? []), opcao];
        onChange({ ...atual, marcadas });
      } else {
        onChange({ ...atual, valor: atual.valor === opcao ? '' : opcao });
      }
    }
    return (
      <fieldset className="ficha-pergunta ficha-pergunta--opcoes">
        <legend className="field__label">{pergunta.rotulo}</legend>
        {pergunta.dica && <p className="field__hint">{pergunta.dica}</p>}
        <div className="check-list">
          {pergunta.opcoes.map((opcao) => (
            <label key={opcao} className="check">
              <input type={multipla ? 'checkbox' : 'radio'} name={idCampo} checked={marcada(opcao)} onChange={() => alternar(opcao)} onClick={() => { if (!multipla && marcada(opcao)) alternar(opcao); }} />
              {opcao}
            </label>
          ))}
        </div>
        {pergunta.outro && (
          <input
            className="input ficha-pergunta__outro"
            value={atual.outro ?? ''}
            onChange={(e) => onChange({ ...atual, outro: e.target.value })}
            placeholder={tr('Outro: escreva aqui')}
            aria-label={tr('{pergunta}: outro', { pergunta: pergunta.rotulo })}
          />
        )}
      </fieldset>
    );
  }

  return (
    <div className={`field ficha-pergunta${pergunta.tipo === 'longo' ? ' ficha-pergunta--larga' : ''}`}>
      <label className="field__label" htmlFor={idCampo}>{pergunta.rotulo}</label>
      {pergunta.tipo === 'longo' ? (
        <textarea id={idCampo} className="input textarea" rows={3} value={atual} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input id={idCampo} className="input" type={pergunta.tipo === 'data' ? 'date' : 'text'} value={atual} onChange={(e) => onChange(e.target.value)} />
      )}
      {pergunta.dica && <p className="field__hint">{pergunta.dica}</p>}
    </div>
  );
}

function respostaEmTexto(pergunta, valor) {
  if (!respondida(pergunta, valor)) return null;
  if (pergunta.tipo === 'data') return formatDataBR(valor);
  if (pergunta.tipo === 'marcar') return [...(valor.marcadas ?? []), valor.outro && tr('Outro: {texto}', { texto: valor.outro })].filter(Boolean).join(' · ');
  if (pergunta.tipo === 'escolha') return [valor.valor, valor.outro && tr('Outro: {texto}', { texto: valor.outro })].filter(Boolean).join(' · ');
  return valor;
}

// Ficha de anamnese: para preencher, ou só para ler e imprimir (somenteLeitura).
export default function FichaAnamnese({ secoes = [], respostas = {}, onChange, somenteLeitura = false, prefixo = 'ficha', mostrarIndice = true }) {
  const andamento = (secao) => secao.perguntas.filter((p) => respondida(p, respostas[p.id])).length;

  function irPara(secaoId) {
    document.getElementById(`${prefixo}-${secaoId}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <div className={`ficha${somenteLeitura ? ' ficha--leitura' : ''}`}>
      {mostrarIndice && secoes.length > 3 && (
        <nav className="ficha-indice no-print" aria-label={tr('Seções da anamnese')}>
          {secoes.map((secao, index) => {
            const feitas = andamento(secao);
            const completa = feitas === secao.perguntas.length && feitas > 0;
            return (
              <button key={secao.id} type="button" className={`ficha-indice__item${completa ? ' is-completa' : feitas ? ' is-iniciada' : ''}`} onClick={() => irPara(secao.id)}>
                <span className="ficha-indice__num">{index + 1}</span>
                <span className="ficha-indice__titulo">{secao.titulo}</span>
              </button>
            );
          })}
        </nav>
      )}

      {secoes.map((secao, index) => (
        <section key={secao.id} id={`${prefixo}-${secao.id}`} className="ficha-secao" style={{ '--i': Math.min(index, 10) }}>
          <header className="ficha-secao__cab">
            <span className="ficha-secao__num" aria-hidden="true">{index + 1}</span>
            <h4 className="ficha-secao__titulo">{secao.titulo}</h4>
            {!somenteLeitura && secao.perguntas.length > 0 && (
              <span className="ficha-secao__andamento">{tr('{feitas} de {total}', { feitas: andamento(secao), total: secao.perguntas.length })}</span>
            )}
          </header>
          {secao.descricao && <p className="ficha-secao__descricao">{secao.descricao}</p>}

          {somenteLeitura ? (
            <dl className="ficha-respostas">
              {secao.perguntas.map((pergunta) => {
                const texto = respostaEmTexto(pergunta, respostas[pergunta.id]);
                return (
                  <div key={pergunta.id} className={`ficha-respostas__item${pergunta.tipo === 'longo' ? ' ficha-respostas__item--larga' : ''}`}>
                    <dt>{pergunta.rotulo}</dt>
                    <dd className={texto ? '' : 'ficha-respostas__vazio'}>{texto ?? '—'}</dd>
                  </div>
                );
              })}
            </dl>
          ) : (
            <div className="ficha-secao__perguntas">
              {secao.perguntas.map((pergunta) => (
                <Pergunta
                  key={pergunta.id}
                  pergunta={pergunta}
                  idCampo={`${prefixo}-${pergunta.id}`}
                  valor={respostas[pergunta.id]}
                  onChange={(valor) => onChange(pergunta.id, valor)}
                />
              ))}
            </div>
          )}
        </section>
      ))}
    </div>
  );
}
