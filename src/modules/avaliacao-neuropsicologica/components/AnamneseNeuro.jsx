import { useState } from 'react';
import { Link } from 'react-router-dom';
import { IconeImpressora, IconeCheck, IconeX } from '@/components/CrudCard/icones';
import FichaAnamnese from '@/modules/anamnese/components/FichaAnamnese';
import { useModelosAnamnese } from '@/modules/anamnese/anamnese.hooks';
import { contarRespondidas } from '@/modules/anamnese/anamnese.utils';
import { tr } from '@/i18n';

// Aba "Anamnese" da avaliação: a ficha do modelo neuropsicológico da clínica (ou outro escolhido).
// Trocar de modelo recomeça as respostas, por isso pede confirmação.
export default function AnamneseNeuro({ avaliacao, respostas, onChange, somenteLeitura, onTrocarModelo, trocando }) {
  const { modelos, loading: carregandoModelos } = useModelosAnamnese();
  const ficha = avaliacao.anamnese?.secoes ? avaliacao.anamnese : null;
  const [modeloId, setModeloId] = useState('');
  const [confirmando, setConfirmando] = useState(false);
  const andamento = contarRespondidas(ficha?.secoes, respostas);
  // Sem ficha ainda, já vem marcado o modelo neuropsicológico da clínica.
  const padrao = modelos.find((m) => m.chave === 'neuropsicologica') ?? modelos[0];
  const escolhido = modeloId || (ficha ? '' : padrao?._id ?? '');

  async function trocar() {
    setConfirmando(false);
    await onTrocarModelo(escolhido);
    setModeloId('');
  }

  const escolhaDeModelo = !somenteLeitura && (
    <div className="anamnese-nova neuro-no-print">
      <label className="field__label" htmlFor="neuro-anamnese-modelo">{ficha ? tr('Usar outro modelo de anamnese') : tr('Escolha o modelo de anamnese')}</label>
      <div className="anamnese-nova__linha">
        <select id="neuro-anamnese-modelo" className="input" value={escolhido} onChange={(e) => { setModeloId(e.target.value); setConfirmando(false); }}>
          {carregandoModelos && <option value="">{tr('Carregando...')}</option>}
          {ficha && <option value="">{tr('Escolha o modelo')}</option>}
          {modelos.map((m) => <option key={m._id} value={m._id}>{m.area ? `${m.titulo} (${m.area})` : m.titulo}</option>)}
        </select>
        {confirmando ? (
          <span className="anamnese-modelo__acoes">
            <span>{tr('As respostas desta anamnese serão apagadas. Trocar?')}</span>
            <button type="button" className="icon-btn icon-btn--danger" aria-label={tr('Confirmar troca de modelo')} onClick={trocar}><IconeCheck /></button>
            <button type="button" className="icon-btn" aria-label={tr('Manter o modelo atual')} onClick={() => setConfirmando(false)}><IconeX /></button>
          </span>
        ) : (
          <button
            type="button"
            className={`btn btn--ghost${trocando ? ' btn--loading' : ''}`}
            disabled={!escolhido || trocando}
            onClick={() => (ficha && andamento.respondidas > 0 ? setConfirmando(true) : trocar())}
          >
            {trocando ? tr('Trocando...') : tr('Usar este modelo')}
          </button>
        )}
      </div>
    </div>
  );

  if (!ficha) {
    return (
      <div className="neuro-secao">
        {escolhaDeModelo || <p className="pront-vazio">{tr('Nenhuma anamnese foi preenchida nesta avaliação.')}</p>}
      </div>
    );
  }

  return (
    <div className="neuro-secao">
      <div className="anamnese-aberta__cab">
        <div>
          <h4 className="anamnese-aberta__titulo">{ficha.titulo}</h4>
          <span className="field__hint">{tr('{feitas} de {total} respondidas', { feitas: andamento.respondidas, total: andamento.total })}</span>
        </div>
        <Link to={`/avaliacoes-neuropsicologicas/${avaliacao._id}/anamnese`} target="_blank" className="btn btn--ghost btn--sm neuro-no-print">
          <IconeImpressora /> {tr('Imprimir anamnese')}
        </Link>
      </div>
      <FichaAnamnese prefixo="neuro-anamnese" secoes={ficha.secoes} respostas={respostas} somenteLeitura={somenteLeitura} onChange={onChange} />
      {escolhaDeModelo && <details className="acompanhamentos__historico">
        <summary>{tr('Trocar o modelo desta anamnese')}</summary>
        {escolhaDeModelo}
      </details>}
    </div>
  );
}
