import { useState } from 'react';
import { Link } from 'react-router-dom';
import { IconeImpressora, IconeSetaEsquerda, IconeMais } from '@/components/CrudCard/icones';
import AcessoAtendimento from '@/modules/prontuario/components/AcessoAtendimento';
import { useModelosAnamnese } from '../anamnese.hooks';
import { contarRespondidas, preencherAutomaticos } from '../anamnese.utils';
import { localeAtual, tr } from '@/i18n';
import FichaAnamnese from './FichaAnamnese';
import { IconeAnamnese } from './AnamnesesPage';
import '../anamnese.css';

const dataCurta = (iso) => (iso ? new Date(iso).toLocaleDateString(localeAtual()) : '');
const idDe = (v) => String(v?._id ?? v ?? '');

// Aba "Anamnese" do prontuário. `dados` vem de useAnamnesesDoPaciente (o prontuário também usa a contagem).
// O profissional escolhe o modelo dele; o sistema lembra a escolha para a próxima vez.
export default function AnamnesesDoPaciente({ paciente, profissional, especialidades, dados }) {
  const { modelos, loading: carregandoModelos } = useModelosAnamnese();
  const [modeloEscolhido, setModeloEscolhido] = useState(null);
  const [aberta, setAberta] = useState(null);
  const [respostas, setRespostas] = useState({});
  const [original, setOriginal] = useState('{}');
  const [acao, setAcao] = useState(null);
  const [aviso, setAviso] = useState(null);

  const modeloId = modeloEscolhido
    ?? (modelos.some((m) => m._id === idDe(dados.modeloPreferidoId)) ? idDe(dados.modeloPreferidoId) : modelos[0]?._id ?? '');
  const souAutor = aberta && idDe(aberta.profissionalId) === idDe(profissional?._id);
  const alterado = JSON.stringify(respostas) !== original;

  function mostrar(anamnese) {
    const iniciais = anamnese.respostas ?? {};
    setAberta(anamnese);
    setRespostas(iniciais);
    setOriginal(JSON.stringify(iniciais));
  }

  async function abrir(id) {
    setAviso(null);
    setAcao('abrir');
    const anamnese = await dados.abrir(id);
    setAcao(null);
    if (anamnese) mostrar(anamnese);
  }

  async function comecar() {
    const modelo = modelos.find((m) => m._id === modeloId);
    if (!modelo) return;
    setAviso(null);
    setAcao('criar');
    const resposta = await dados.criar({
      modeloId,
      respostas: preencherAutomaticos(modelo.secoes, {}, { paciente, profissional }),
    });
    setAcao(null);
    if (resposta?.data) mostrar(resposta.data);
  }

  async function salvar() {
    setAcao('salvar');
    setAviso(null);
    const resposta = await dados.salvar(aberta._id, { respostas });
    setAcao(null);
    if (resposta?.data) {
      mostrar(resposta.data);
      setAviso({ tipo: 'success', texto: resposta.message });
    }
  }

  async function compartilhar(id, compartilhadoCom) {
    const resposta = await dados.salvar(id, { compartilhadoCom });
    if (resposta?.data) setAberta((a) => ({ ...a, compartilhadoCom: resposta.data.compartilhadoCom }));
    return !!resposta;
  }

  if (aberta) {
    const andamento = contarRespondidas(aberta.secoes, respostas);
    return (
      <div className="anamnese-aberta">
        <div className="anamnese-aberta__cab">
          <button type="button" className="btn btn--ghost btn--sm" onClick={() => setAberta(null)} disabled={acao === 'salvar'}>
            <IconeSetaEsquerda /> {tr('Todas as anamneses')}
          </button>
          <Link to={`/anamneses/ficha/${aberta._id}`} target="_blank" className="btn btn--ghost btn--sm">
            <IconeImpressora /> {tr('Imprimir')}
          </Link>
        </div>
        <div className="anamnese-aberta__cab">
          <div>
            <h3 className="anamnese-aberta__titulo">{aberta.titulo}</h3>
            <span className="field__hint">
              {tr('{profissional} · criada em {criada} · {feitas} de {total} respondidas', {
                profissional: aberta.profissionalId?.nome ?? '—',
                criada: dataCurta(aberta.createdAt),
                feitas: andamento.respondidas,
                total: andamento.total,
              })}
            </span>
          </div>
        </div>
        <AcessoAtendimento prontuario={aberta} especialidades={especialidades} souAutor={souAutor} onSalvar={compartilhar} />
        {!souAutor && <p className="pront-parcial" role="note">{tr('Somente leitura: só quem preencheu altera esta anamnese.')}</p>}

        <FichaAnamnese
          prefixo={`anamnese-${aberta._id}`}
          secoes={aberta.secoes}
          respostas={respostas}
          somenteLeitura={!souAutor}
          onChange={(id, valor) => { setRespostas((r) => ({ ...r, [id]: valor })); setAviso(null); }}
        />

        {(aviso || dados.error) && (
          <p className={`alert alert--${dados.error ? 'error' : aviso.tipo}`} role={dados.error ? 'alert' : 'status'}>
            {dados.error?.message ?? aviso.texto}
          </p>
        )}

        {souAutor && (
          <div className="modelo-editor__rodape">
            <span className="modelo-editor__status">{alterado ? tr('Alterações não salvas') : tr('Tudo salvo')}</span>
            <button type="button" className={`btn btn--primary${acao === 'salvar' ? ' btn--loading' : ''}`} disabled={!alterado || acao === 'salvar'} onClick={salvar}>
              {acao === 'salvar' ? tr('Salvando...') : tr('Salvar anamnese')}
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="ficha">
      <div className="anamnese-nova">
        <label className="field__label" htmlFor="anamnese-modelo">{tr('Nova anamnese: escolha o seu modelo')}</label>
        <div className="anamnese-nova__linha">
          <select id="anamnese-modelo" className="input" value={modeloId} onChange={(e) => setModeloEscolhido(e.target.value)} disabled={carregandoModelos || modelos.length === 0}>
            {carregandoModelos && <option value="">{tr('Carregando...')}</option>}
            {modelos.map((m) => <option key={m._id} value={m._id}>{m.area ? `${m.titulo} (${m.area})` : m.titulo}</option>)}
          </select>
          <button type="button" className={`btn btn--primary${acao === 'criar' ? ' btn--loading' : ''}`} disabled={!modeloId || acao !== null} onClick={comecar}>
            <IconeMais />
            {acao === 'criar' ? tr('Abrindo...') : tr('Preencher anamnese')}
          </button>
        </div>
        <p className="field__hint">
          {tr('O modelo escolhido fica guardado para as próximas vezes. Os modelos são criados e editados em Anamneses, no menu.')}
        </p>
      </div>

      {dados.error && <p className="alert alert--error" role="alert">{dados.error.message}</p>}

      {dados.loading ? (
        <div className="skeleton skeleton--bloco" />
      ) : dados.anamneses.length === 0 ? (
        <div className="crud-vazio">
          <IconeAnamnese />
          <p>{tr('Este paciente ainda não tem anamnese.')}</p>
        </div>
      ) : (
        <ul className="anamnese-lista">
          {dados.anamneses.map((a, index) => (
            <li key={a._id} style={{ '--i': Math.min(index, 10) }}>
              <button type="button" className="anamnese-lista__item" onClick={() => abrir(a._id)} disabled={acao === 'abrir'}>
                <span className="anamnese-lista__dados">
                  <strong>{a.titulo}</strong>
                  <span>{tr('{profissional} · atualizada em {data}', { profissional: a.profissionalId?.nome ?? '—', data: dataCurta(a.updatedAt) })}</span>
                </span>
                <span className={`badge${a.andamento.respondidas === a.andamento.total ? ' badge--success' : ''}`}>
                  {tr('{feitas} de {total}', { feitas: a.andamento.respondidas, total: a.andamento.total })}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
