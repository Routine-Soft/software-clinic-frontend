import { IconeMais, IconeLixeira } from '@/components/CrudCard/icones';
import {
  CAMPOS_ANAMNESE, DOMINIOS, CLASSIFICACOES, classificacaoSugerida, sessaoVazia, instrumentoVazio, resumoDasSessoes,
} from '../avaliacao-neuro.utils';
import CampoServicoDoModulo from '@/modules/servico/components/CampoServicoDoModulo';
import { tr } from '@/i18n';

// Instrumentos comuns no Brasil, só como sugestão ao digitar (o campo aceita qualquer nome).
const INSTRUMENTOS_SUGERIDOS = [
  'WISC-IV', 'WAIS-III', 'WASI', tr('SON-R 2½-7'), tr('Columbia 3'), 'BPA-2', 'D2-R', 'RAVLT', tr('Figuras Complexas de Rey'),
  'FDT', tr('Trail Making Test (TMT)'), tr('Stroop'), tr('Torre de Londres'), 'WCST', 'NEUPSILIN', tr('NEUPSILIN-Inf'), 'TDE II',
  tr('Fluência verbal'), tr('Teste de Nomeação de Boston'), tr('MoCA'), 'MEEM', 'SNAP-IV', 'ETDAH', tr('Vineland-3'), 'BAI', 'BDI-II',
];

function Texto({ id, rotulo, valor, onChange, linhas = 3, dica, placeholder }) {
  return (
    <div className="field">
      <label className="field__label" htmlFor={id}>{rotulo}</label>
      <textarea id={id} className="input textarea" rows={linhas} value={valor} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      {dica && <p className="field__hint">{dica}</p>}
    </div>
  );
}

export function AbaIdentificacao({ form, set, servicos }) {
  return (
    <div className="neuro-secao">
      <div className="modal-form__row">
        <div className="field">
          <label className="field__label" htmlFor="neuro-solicitante">{tr('Solicitante')}</label>
          <input id="neuro-solicitante" className="input" value={form.solicitante} onChange={(e) => set('solicitante', e.target.value)} placeholder={tr('Quem pediu a avaliação')} />
        </div>
        <div className="field">
          <label className="field__label" htmlFor="neuro-finalidade">{tr('Finalidade')}</label>
          <input id="neuro-finalidade" className="input" value={form.finalidade} onChange={(e) => set('finalidade', e.target.value)} placeholder={tr('Para que serve o laudo')} />
        </div>
      </div>
      <CampoServicoDoModulo id="neuro-servico" modulo="neuropsicologica" servicos={servicos} value={form.servicoId} onChange={(v) => set('servicoId', v)} />
      <Texto
        id="neuro-demanda"
        rotulo={tr('Descrição da demanda')}
        linhas={5}
        valor={form.demanda}
        onChange={(v) => set('demanda', v)}
        dica={tr('O que motivou a avaliação: queixa principal, desde quando, em quais contextos aparece.')}
      />
      <Texto
        id="neuro-informantes"
        rotulo={tr('Informantes')}
        linhas={2}
        valor={form.informantes}
        onChange={(v) => set('informantes', v)}
        placeholder={tr('Ex: o próprio paciente, mãe, professora')}
        dica={tr('Quem forneceu as informações. Entra no laudo, em Procedimento.')}
      />
    </div>
  );
}

export function AbaAnamnese({ form, setAnamnese }) {
  return (
    <div className="neuro-secao neuro-secao--grade">
      {CAMPOS_ANAMNESE.map(([campo, rotulo, placeholder]) => (
        <Texto key={campo} id={`neuro-anamnese-${campo}`} rotulo={rotulo} valor={form.anamnese[campo]} onChange={(v) => setAnamnese(campo, v)} placeholder={placeholder} />
      ))}
    </div>
  );
}

export function AbaSessoes({ form, set, setLinha, adicionar, remover }) {
  const resumo = resumoDasSessoes(form.sessoes);
  return (
    <div className="neuro-secao">
      <div className="neuro-lista-cab">
        <h4>{tr('Sessões')}</h4>
        <span className="neuro-sub">{resumo.quantidade} {resumo.quantidade === 1 ? tr('sessão') : tr('sessões')}{resumo.minutos ? tr(' · {minutos} min no total', { minutos: resumo.minutos }) : ''}</span>
      </div>

      {form.sessoes.map((sessao, index) => (
        <div className="neuro-linha" key={index}>
          <div className="neuro-linha__campos neuro-linha__campos--sessao">
            <div className="field">
              <label className="field__label" htmlFor={`neuro-sessao-data-${index}`}>{tr('Data')}</label>
              <input id={`neuro-sessao-data-${index}`} className="input" type="date" value={sessao.data} onChange={(e) => setLinha('sessoes', index, 'data', e.target.value)} />
            </div>
            <div className="field">
              <label className="field__label" htmlFor={`neuro-sessao-min-${index}`}>{tr('Duração (min)')}</label>
              <input id={`neuro-sessao-min-${index}`} className="input" type="number" min="0" value={sessao.duracaoMin} onChange={(e) => setLinha('sessoes', index, 'duracaoMin', e.target.value)} />
            </div>
            <div className="field neuro-linha__largo">
              <label className="field__label" htmlFor={`neuro-sessao-desc-${index}`}>{tr('O que foi feito')}</label>
              <input id={`neuro-sessao-desc-${index}`} className="input" value={sessao.descricao} onChange={(e) => setLinha('sessoes', index, 'descricao', e.target.value)} placeholder="Ex: anamnese com os pais; aplicação do WISC-IV" />
            </div>
          </div>
          <button type="button" className="icon-btn icon-btn--danger" aria-label={tr('Remover sessão {p0}', { p0: index + 1 })} title={tr('Remover')} onClick={() => remover('sessoes', index)}>
            <IconeLixeira />
          </button>
        </div>
      ))}

      <button type="button" className="btn btn--ghost btn--sm neuro-adicionar" onClick={() => adicionar('sessoes', sessaoVazia())}>
        <IconeMais />
        {tr('Adicionar sessão')}
      </button>

      <Texto
        id="neuro-procedimento"
        rotulo={tr('Procedimento')}
        linhas={4}
        valor={form.procedimento}
        onChange={(v) => set('procedimento', v)}
        dica={tr('Fundamentação teórica e metodológica e os recursos usados. O laudo já acrescenta o número de sessões, o período, os informantes e os instrumentos.')}
      />

      <div className="modal-form__row">
        <div className="field">
          <label className="field__label" htmlFor="neuro-devolutiva-data">{tr('Devolutiva em')}</label>
          <input id="neuro-devolutiva-data" className="input" type="date" value={form.devolutivaEm} onChange={(e) => set('devolutivaEm', e.target.value)} />
        </div>
        <div className="field">
          <label className="field__label" htmlFor="neuro-devolutiva-obs">{tr('Observações da devolutiva')}</label>
          <input id="neuro-devolutiva-obs" className="input" value={form.devolutivaObservacoes} onChange={(e) => set('devolutivaObservacoes', e.target.value)} placeholder={tr('Quem participou, orientações dadas')} />
        </div>
      </div>
    </div>
  );
}

export function AbaTestes({ form, setLinha, setForm, adicionar, remover }) {
  // Ao digitar o percentil, sugere a classificação, a menos que a pessoa já tenha escolhido outra.
  function mudarPercentil(index, valor) {
    setForm((atual) => ({
      ...atual,
      instrumentos: atual.instrumentos.map((linha, i) => {
        if (i !== index) return linha;
        const sugeridaAntes = classificacaoSugerida(linha.percentil);
        const manterEscolha = linha.classificacao && linha.classificacao !== sugeridaAntes;
        return { ...linha, percentil: valor, classificacao: manterEscolha ? linha.classificacao : classificacaoSugerida(valor) };
      }),
    }));
  }

  return (
    <div className="neuro-secao">
      <p className="field__hint">
        {tr('A classificação é sugerida pelo percentil com as faixas usuais (padrão Wechsler). Cada instrumento tem a sua tabela: confira no manual e ajuste se precisar.')}
      </p>
      <datalist id="neuro-instrumentos-sugeridos">
        {INSTRUMENTOS_SUGERIDOS.map((nome) => <option key={nome} value={nome} />)}
      </datalist>

      {form.instrumentos.map((linha, index) => (
        <div className="neuro-linha neuro-linha--instrumento" key={index}>
          <div className="neuro-linha__campos neuro-linha__campos--instrumento">
            <div className="field neuro-linha__largo">
              <label className="field__label" htmlFor={`neuro-inst-nome-${index}`}>{tr('Instrumento / subteste')}</label>
              <input id={`neuro-inst-nome-${index}`} className="input" list="neuro-instrumentos-sugeridos" value={linha.nome} onChange={(e) => setLinha('instrumentos', index, 'nome', e.target.value)} placeholder={tr('Ex: WISC-IV – Dígitos')} />
            </div>
            <div className="field neuro-linha__largo">
              <label className="field__label" htmlFor={`neuro-inst-dominio-${index}`}>{tr('Domínio')}</label>
              <select id={`neuro-inst-dominio-${index}`} className="input" value={linha.dominio} onChange={(e) => setLinha('instrumentos', index, 'dominio', e.target.value)}>
                <option value="">{tr('Selecione...')}</option>
                {DOMINIOS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="field">
              <label className="field__label" htmlFor={`neuro-inst-bruto-${index}`}>{tr('Escore bruto')}</label>
              <input id={`neuro-inst-bruto-${index}`} className="input" value={linha.escoreBruto} onChange={(e) => setLinha('instrumentos', index, 'escoreBruto', e.target.value)} />
            </div>
            <div className="field">
              <label className="field__label" htmlFor={`neuro-inst-padrao-${index}`}>{tr('Escore padrão')}</label>
              <input id={`neuro-inst-padrao-${index}`} className="input" value={linha.escorePadrao} onChange={(e) => setLinha('instrumentos', index, 'escorePadrao', e.target.value)} placeholder={tr('QI, ponderado, z, T')} />
            </div>
            <div className="field">
              <label className="field__label" htmlFor={`neuro-inst-percentil-${index}`}>{tr('Percentil')}</label>
              <input id={`neuro-inst-percentil-${index}`} className="input" type="number" min="0" max="100" step="0.1" value={linha.percentil} onChange={(e) => mudarPercentil(index, e.target.value)} />
            </div>
            <div className="field">
              <label className="field__label" htmlFor={`neuro-inst-classe-${index}`}>{tr('Classificação')}</label>
              <select id={`neuro-inst-classe-${index}`} className="input" value={linha.classificacao} onChange={(e) => setLinha('instrumentos', index, 'classificacao', e.target.value)}>
                <option value="">—</option>
                {CLASSIFICACOES.map(([nome]) => <option key={nome} value={nome}>{nome}</option>)}
              </select>
            </div>
            <div className="field neuro-linha__inteiro">
              <label className="field__label" htmlFor={`neuro-inst-obs-${index}`}>{tr('Observação')}</label>
              <input id={`neuro-inst-obs-${index}`} className="input" value={linha.observacao} onChange={(e) => setLinha('instrumentos', index, 'observacao', e.target.value)} placeholder={tr('Comportamento durante a tarefa, estratégias, erros')} />
            </div>
          </div>
          <button type="button" className="icon-btn icon-btn--danger" aria-label={tr('Remover instrumento {p0}', { p0: index + 1 })} title={tr('Remover')} onClick={() => remover('instrumentos', index)}>
            <IconeLixeira />
          </button>
        </div>
      ))}

      <button type="button" className="btn btn--ghost btn--sm neuro-adicionar" onClick={() => adicionar('instrumentos', instrumentoVazio())}>
        <IconeMais />
        {tr('Adicionar instrumento')}
      </button>
    </div>
  );
}

export function AbaConclusao({ form, set }) {
  return (
    <div className="neuro-secao">
      <Texto
        id="neuro-analise"
        rotulo={tr('Análise')}
        linhas={8}
        valor={form.analise}
        onChange={(v) => set('analise', v)}
        dica={tr('Exposição dos resultados, integrando testes, observação e anamnese. Inclua só o necessário para responder à demanda.')}
      />
      <div className="modal-form__row">
        <div className="field">
          <label className="field__label" htmlFor="neuro-hipotese">{tr('Hipótese diagnóstica')}</label>
          <input id="neuro-hipotese" className="input" value={form.hipoteseDiagnostica} onChange={(e) => set('hipoteseDiagnostica', e.target.value)} />
        </div>
        <div className="field">
          <label className="field__label" htmlFor="neuro-cid">{tr('CID (opcional)')}</label>
          <input id="neuro-cid" className="input" value={form.cid} onChange={(e) => set('cid', e.target.value)} placeholder={tr('Ex: F90.0 / 6A05')} />
        </div>
      </div>
      <Texto id="neuro-conclusao" rotulo={tr('Conclusão')} linhas={5} valor={form.conclusao} onChange={(v) => set('conclusao', v)} />
      <Texto id="neuro-encaminhamentos" rotulo={tr('Encaminhamentos e orientações')} linhas={4} valor={form.encaminhamentos} onChange={(v) => set('encaminhamentos', v)} />
      <Texto
        id="neuro-referencias"
        rotulo={tr('Referências')}
        linhas={4}
        valor={form.referencias}
        onChange={(v) => set('referencias', v)}
        dica={tr('Obrigatórias no laudo: manuais dos testes e a literatura usada.')}
      />
    </div>
  );
}
