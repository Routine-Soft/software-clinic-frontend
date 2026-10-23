import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Icone, IconeMais, IconeLixeira, IconeSetaEsquerda, IconeCheck, IconeX } from '@/components/CrudCard/icones';
import { useModeloAnamnese } from '../anamnese.hooks';
import { AUTOS, TIPOS, comOpcoes, mover, perguntaNova, secaoNova, totalDePerguntas } from '../anamnese.utils';
import FichaAnamnese from './FichaAnamnese';
import GuiaModeloAnamnese from './GuiaModeloAnamnese';
import '../anamnese.css';
import { tr } from '@/i18n';

const IconeCima = () => <Icone><path d="m18 15-6-6-6 6" /></Icone>;
const IconeBaixo = () => <Icone><path d="m6 9 6 6 6-6" /></Icone>;

// No editor, as opções ficam como texto (uma por linha) para dar para digitar à vontade; viram lista ao salvar.
function paraEdicao(modelo) {
  return {
    titulo: modelo.titulo ?? '',
    area: modelo.area ?? '',
    descricao: modelo.descricao ?? '',
    secoes: (modelo.secoes ?? []).map((s) => ({
      ...s,
      perguntas: s.perguntas.map((p) => ({ ...p, opcoesTexto: (p.opcoes ?? []).join('\n') })),
    })),
  };
}

function paraSalvar(form) {
  return {
    titulo: form.titulo,
    area: form.area,
    descricao: form.descricao,
    secoes: form.secoes.map((s) => ({
      id: s.id,
      titulo: s.titulo,
      descricao: s.descricao,
      perguntas: s.perguntas.map(({ opcoesTexto, ...p }) => ({
        ...p,
        opcoes: comOpcoes(p.tipo) ? String(opcoesTexto ?? '').split('\n').map((o) => o.trim()).filter(Boolean) : [],
        outro: comOpcoes(p.tipo) && !!p.outro,
        auto: p.auto || null,
      })),
    })),
  };
}

export default function ModeloAnamneseEditor() {
  const { id } = useParams();
  const { modelo, loading, error, salvar, novo } = useModeloAnamnese(id);

  if (loading) {
    return (
      <div className="page">
        <section className="card" aria-busy="true"><div className="skeleton skeleton--bloco" /></section>
      </div>
    );
  }
  if (!modelo) {
    return (
      <div className="page">
        <Link to="/anamneses" className="link anamnese-voltar"><IconeSetaEsquerda /> {tr('Voltar para as anamneses')}</Link>
        <p className="alert alert--error" role="alert">{error?.message ?? tr('Modelo de anamnese não encontrado')}</p>
      </div>
    );
  }
  return <Editor key={modelo._id ?? 'novo'} modelo={modelo} salvar={salvar} error={error} novo={novo} />;
}

function Editor({ modelo, salvar, error, novo }) {
  const navigate = useNavigate();
  const [form, setForm] = useState(() => paraEdicao(modelo));
  const [original, setOriginal] = useState(() => JSON.stringify(paraEdicao(modelo)));
  const [salvando, setSalvando] = useState(false);
  const [aviso, setAviso] = useState(null);
  const [previa, setPrevia] = useState(false);
  const [respostasPrevia, setRespostasPrevia] = useState({});
  const [removendoSecao, setRemovendoSecao] = useState(null);

  const alterado = JSON.stringify(form) !== original;

  const set = (campo, valor) => setForm((f) => ({ ...f, [campo]: valor }));
  const setSecoes = (fn) => setForm((f) => ({ ...f, secoes: fn(f.secoes) }));
  const setSecao = (i, campo, valor) => setSecoes((secoes) => secoes.map((s, j) => (j === i ? { ...s, [campo]: valor } : s)));
  const setPerguntas = (i, fn) => setSecoes((secoes) => secoes.map((s, j) => (j === i ? { ...s, perguntas: fn(s.perguntas) } : s)));
  const setPergunta = (i, k, campo, valor) => setPerguntas(i, (ps) => ps.map((p, j) => (j === k ? { ...p, [campo]: valor } : p)));

  async function handleSalvar() {
    setSalvando(true);
    setAviso(null);
    const resposta = await salvar(paraSalvar(form));
    setSalvando(false);
    if (!resposta) return;
    setAviso({ tipo: 'success', texto: resposta.message });
    const salvo = paraEdicao(resposta.data);
    setForm(salvo);
    setOriginal(JSON.stringify(salvo));
    if (novo) navigate(`/anamneses/${resposta.data._id}`, { replace: true });
  }

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <Link to="/anamneses" className="link anamnese-voltar"><IconeSetaEsquerda /> {tr('Voltar para as anamneses')}</Link>
          <h2 className="page-title">{novo ? tr('Novo modelo de anamnese') : tr('Editar modelo de anamnese')}</h2>
          <p className="page-subtitle">
            {tr('{secoes} seções · {perguntas} perguntas', { secoes: form.secoes.length, perguntas: totalDePerguntas(form.secoes) })}
          </p>
        </div>
        <div className="page-header__acoes">
          <button type="button" className="btn btn--ghost" onClick={() => setPrevia((v) => !v)} aria-pressed={previa}>
            {previa ? tr('Voltar a editar') : tr('Ver como fica')}
          </button>
        </div>
      </header>

      {previa ? (
        <section className="card modelo-editor__dados">
          <h3 className="anamnese-aberta__titulo">{form.titulo || tr('Sem título')}</h3>
          <FichaAnamnese
            prefixo="previa"
            secoes={paraSalvar(form).secoes}
            respostas={respostasPrevia}
            onChange={(pid, valor) => setRespostasPrevia((r) => ({ ...r, [pid]: valor }))}
          />
        </section>
      ) : (
        <div className="modelo-editor">
          <GuiaModeloAnamnese aberto={novo} />

          <section className="card modelo-editor__dados">
            <div className="modal-form__row">
              <div className="field">
                <label className="field__label" htmlFor="modelo-anamnese-titulo">{tr('Nome do modelo')}</label>
                <input id="modelo-anamnese-titulo" className="input" value={form.titulo} onChange={(e) => set('titulo', e.target.value)} placeholder={tr('Ex.: Anamnese de Fonoaudiologia')} />
              </div>
              <div className="field">
                <label className="field__label" htmlFor="modelo-anamnese-area">{tr('Área / profissional')}</label>
                <input id="modelo-anamnese-area" className="input" value={form.area} onChange={(e) => set('area', e.target.value)} placeholder={tr('Ex.: Fonoaudiologia')} />
              </div>
            </div>
            <div className="field">
              <label className="field__label" htmlFor="modelo-anamnese-descricao">{tr('Descrição (opcional)')}</label>
              <input id="modelo-anamnese-descricao" className="input" value={form.descricao} onChange={(e) => set('descricao', e.target.value)} placeholder={tr('Para quem é este modelo')} />
            </div>
          </section>

          {form.secoes.map((secao, i) => (
            <section key={secao.id} className="card modelo-editor__secao">
              <div className="modelo-editor__secao-cab">
                <span className="ficha-secao__num" aria-hidden="true">{i + 1}</span>
                <input className="input" value={secao.titulo} onChange={(e) => setSecao(i, 'titulo', e.target.value)} placeholder={tr('Assunto da seção, ex.: Alimentação')} aria-label={tr('Título da seção {n}', { n: i + 1 })} />
                <span className="modelo-editor__botoes">
                  <button type="button" className="icon-btn" aria-label={tr('Subir seção')} disabled={i === 0} onClick={() => setSecoes((s) => mover(s, i, -1))}><IconeCima /></button>
                  <button type="button" className="icon-btn" aria-label={tr('Descer seção')} disabled={i === form.secoes.length - 1} onClick={() => setSecoes((s) => mover(s, i, 1))}><IconeBaixo /></button>
                  {removendoSecao === secao.id ? (
                    <>
                      <button type="button" className="icon-btn icon-btn--danger" aria-label={tr('Confirmar: remover a seção')} onClick={() => { setRemovendoSecao(null); setSecoes((s) => s.filter((_, j) => j !== i)); }}><IconeCheck /></button>
                      <button type="button" className="icon-btn" aria-label={tr('Manter a seção')} onClick={() => setRemovendoSecao(null)}><IconeX /></button>
                    </>
                  ) : (
                    <button type="button" className="icon-btn icon-btn--danger" aria-label={tr('Remover seção')} title={tr('Remover seção')} disabled={form.secoes.length === 1} onClick={() => setRemovendoSecao(secao.id)}><IconeLixeira /></button>
                  )}
                </span>
              </div>
              <textarea className="input textarea" rows={2} value={secao.descricao} onChange={(e) => setSecao(i, 'descricao', e.target.value)} placeholder={tr('Orientação da seção (opcional), ex.: "Preencher quando o paciente for criança"')} aria-label={tr('Orientação da seção {n}', { n: i + 1 })} />

              {secao.perguntas.map((pergunta, k) => (
                <div key={pergunta.id} className="modelo-editor__pergunta">
                  <div className="modelo-editor__pergunta-linha">
                    <div className="field">
                      <label className="field__label" htmlFor={`pergunta-${pergunta.id}`}>{tr('Pergunta {n}', { n: k + 1 })}</label>
                      <input id={`pergunta-${pergunta.id}`} className="input" value={pergunta.rotulo} onChange={(e) => setPergunta(i, k, 'rotulo', e.target.value)} placeholder={tr('Ex.: Queixa principal')} />
                    </div>
                    <div className="field">
                      <label className="field__label" htmlFor={`tipo-${pergunta.id}`}>{tr('Tipo de resposta')}</label>
                      <select id={`tipo-${pergunta.id}`} className="input" value={pergunta.tipo} onChange={(e) => setPergunta(i, k, 'tipo', e.target.value)}>
                        {TIPOS.map((t) => <option key={t.valor} value={t.valor}>{t.rotulo}</option>)}
                      </select>
                    </div>
                    <span className="modelo-editor__botoes">
                      <button type="button" className="icon-btn" aria-label={tr('Subir pergunta')} disabled={k === 0} onClick={() => setPerguntas(i, (ps) => mover(ps, k, -1))}><IconeCima /></button>
                      <button type="button" className="icon-btn" aria-label={tr('Descer pergunta')} disabled={k === secao.perguntas.length - 1} onClick={() => setPerguntas(i, (ps) => mover(ps, k, 1))}><IconeBaixo /></button>
                      <button type="button" className="icon-btn icon-btn--danger" aria-label={tr('Remover pergunta')} title={tr('Remover pergunta')} onClick={() => setPerguntas(i, (ps) => ps.filter((_, j) => j !== k))}><IconeLixeira /></button>
                    </span>
                  </div>

                  {comOpcoes(pergunta.tipo) ? (
                    <div className="modelo-editor__opcoes">
                      <div className="field">
                        <label className="field__label" htmlFor={`opcoes-${pergunta.id}`}>{tr('Opções (uma por linha)')}</label>
                        <textarea id={`opcoes-${pergunta.id}`} className="input textarea" rows={4} value={pergunta.opcoesTexto ?? ''} onChange={(e) => setPergunta(i, k, 'opcoesTexto', e.target.value)} placeholder={tr('Ansiedade\nTristeza\nInsônia')} />
                      </div>
                      <label className="check">
                        <input type="checkbox" checked={!!pergunta.outro} onChange={(e) => setPergunta(i, k, 'outro', e.target.checked)} />
                        {tr('Campo "Outro" para escrever')}
                      </label>
                    </div>
                  ) : (
                    <div className="field">
                      <label className="field__label" htmlFor={`auto-${pergunta.id}`}>{tr('Preencher sozinho com')}</label>
                      <select id={`auto-${pergunta.id}`} className="input" value={pergunta.auto ?? ''} onChange={(e) => setPergunta(i, k, 'auto', e.target.value || null)}>
                        {AUTOS.map((a) => <option key={a.valor} value={a.valor}>{a.rotulo}</option>)}
                      </select>
                    </div>
                  )}
                </div>
              ))}

              <button type="button" className="btn btn--ghost btn--sm" onClick={() => setPerguntas(i, (ps) => [...ps, perguntaNova()])}>
                <IconeMais />
                {tr('Adicionar pergunta')}
              </button>
            </section>
          ))}

          <button type="button" className="btn btn--ghost" onClick={() => setSecoes((s) => [...s, secaoNova()])}>
            <IconeMais />
            {tr('Adicionar seção')}
          </button>
        </div>
      )}

      {(error || aviso) && (
        <div className="alerts">
          {error && <p className="alert alert--error" role="alert">{error.message}</p>}
          {aviso && !error && <p className={`alert alert--${aviso.tipo}`} role="status">{aviso.texto}</p>}
        </div>
      )}

      <div className="modelo-editor__rodape">
        <span className="modelo-editor__status">{alterado ? tr('Alterações não salvas') : tr('Tudo salvo')}</span>
        <button type="button" className={`btn btn--primary${salvando ? ' btn--loading' : ''}`} disabled={salvando || !alterado || !form.titulo.trim()} onClick={handleSalvar}>
          {salvando ? tr('Salvando...') : tr('Salvar modelo')}
        </button>
      </div>
    </div>
  );
}
