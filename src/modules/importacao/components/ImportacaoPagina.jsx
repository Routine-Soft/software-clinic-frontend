import { useId, useState } from 'react';
import { useAuthContext } from '@/hooks/useAuthContext';
import { Icone } from '@/components/CrudCard/icones';
import { ICONES } from '@/components/Sidebar/menuIcones';
import { tr } from '@/i18n';
import { useImportacao } from '../importacao.hooks';
import { tiposDoPapel, pendenciasDoMapa, baixarModelo, baixarErros } from '../importacao.utils';
import './importacao.css';

const fmt = (n) => Number(n).toLocaleString();

function EscolhaDoTipo({ tipos, atual, onEscolher }) {
  return (
    <section className="card importacao__passo" aria-labelledby="imp-passo-1">
      <h3 id="imp-passo-1" className="importacao__titulo"><span className="importacao__numero">1</span>{tr('O que você vai importar?')}</h3>
      <p className="importacao__dica">{tr('Siga esta ordem: cadastros, profissionais, pacientes, consultas e, por último, prontuários. As consultas e os prontuários são ligados aos pacientes e profissionais já importados.')}</p>
      <div className="importacao__tipos" role="radiogroup" aria-label={tr('Tipo de dado')}>
        {tipos.map((t) => (
          <button
            key={t.chave}
            type="button"
            role="radio"
            aria-checked={atual?.chave === t.chave}
            className={`importacao__tipo${atual?.chave === t.chave ? ' is-ativo' : ''}`}
            onClick={() => onEscolher(t)}
          >
            <span className="importacao__tipo-icone"><Icone>{ICONES[t.icone]}</Icone></span>
            <span className="importacao__tipo-textos">
              <strong>{t.titulo}</strong>
              <span>{t.descricao}</span>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

function EnvioDoArquivo({ tipo, planilha, lendo, onArquivo }) {
  const id = useId();
  const [arrastando, setArrastando] = useState(false);
  return (
    <section className="card importacao__passo" aria-labelledby="imp-passo-2">
      <h3 id="imp-passo-2" className="importacao__titulo"><span className="importacao__numero">2</span>{tr('Envie a planilha')}</h3>
      <p className="importacao__dica">
        {tr('No sistema antigo, exporte os dados em Excel (.xlsx) ou CSV. Não precisa arrumar as colunas: no próximo passo você diz qual é qual.')}
      </p>
      <label
        htmlFor={id}
        className={`importacao__arquivo${arrastando ? ' is-arrastando' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setArrastando(true); }}
        onDragLeave={() => setArrastando(false)}
        onDrop={(e) => { e.preventDefault(); setArrastando(false); onArquivo(e.dataTransfer.files?.[0]); }}
      >
        <span className="importacao__arquivo-icone"><Icone>{ICONES.importar}</Icone></span>
        {lendo ? (
          <strong>{tr('Lendo a planilha...')}</strong>
        ) : planilha ? (
          <>
            <strong>{planilha.nomeArquivo}</strong>
            <span>{tr('{total} linhas encontradas. Toque para trocar o arquivo.', { total: fmt(planilha.linhas.length) })}</span>
          </>
        ) : (
          <>
            <strong>{tr('Escolher arquivo')}</strong>
            <span>{tr('ou arraste a planilha para cá (.xlsx ou .csv)')}</span>
          </>
        )}
        <input
          id={id}
          type="file"
          accept=".xlsx,.csv,.txt,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          className="importacao__input-arquivo"
          onChange={(e) => { onArquivo(e.target.files?.[0]); e.target.value = ''; }}
        />
      </label>
      {tipo && (
        <button type="button" className="link importacao__modelo" onClick={() => baixarModelo(tipo)}>
          {tr('Baixar planilha modelo de {tipo}', { tipo: tipo.titulo.toLowerCase() })}
        </button>
      )}
    </section>
  );
}

function Colunas({ tipo, planilha, mapa, onTrocar }) {
  const exemplo = planilha.linhas[0]?.valores ?? [];
  return (
    <section className="card importacao__passo" aria-labelledby="imp-passo-3">
      <h3 id="imp-passo-3" className="importacao__titulo"><span className="importacao__numero">3</span>{tr('Confira as colunas')}</h3>
      <p className="importacao__dica">{tr('Já escolhemos as colunas com nome parecido. Confira e ajuste; o exemplo mostra o valor da primeira linha.')}</p>
      <div className="importacao__colunas">
        {tipo.campos.map((campo) => {
          const indice = mapa[campo.chave];
          const idCampo = `imp-campo-${campo.chave}`;
          return (
            <div className="field importacao__coluna" key={campo.chave}>
              <label className="field__label" htmlFor={idCampo}>
                {campo.rotulo}
                {campo.obrigatorio && <span className="badge badge--primary importacao__obrigatorio">{tr('obrigatório')}</span>}
              </label>
              <select id={idCampo} className="input" value={indice ?? ''} onChange={(e) => onTrocar(campo.chave, e.target.value)}>
                <option value="">{tr('Não importar')}</option>
                {planilha.cabecalhos.map((c, i) => <option key={i} value={i}>{c}</option>)}
              </select>
              {indice !== undefined && (
                <span className="field__hint importacao__exemplo">{tr('Ex.: {valor}', { valor: exemplo[indice] || '—' })}</span>
              )}
            </div>
          );
        })}
      </div>
      {tipo.sigiloso && (
        <p className="alert alert--info">
          {tr('Prontuário é sigiloso: cada atendimento importado fica com o profissional informado como autor e só ele (e as especialidades que ele liberar) consegue ler. A importação fica registrada na auditoria.')}
        </p>
      )}
    </section>
  );
}

function Resultado({ tipo, resultado }) {
  const { importados, ignorados, erros, avisos, interrompido } = resultado;
  return (
    <section className="card importacao__passo importacao__resultado" aria-live="polite">
      <h3 className="importacao__titulo">{interrompido ? tr('Importação interrompida') : tr('Importação concluída')}</h3>
      <div className="importacao__numeros">
        <div className="importacao__numero-card" data-tom="sucesso"><strong>{fmt(importados)}</strong><span>{tr('importados')}</span></div>
        <div className="importacao__numero-card" data-tom="neutro"><strong>{fmt(ignorados.length)}</strong><span>{tr('já existiam')}</span></div>
        <div className="importacao__numero-card" data-tom={erros.length ? 'erro' : 'neutro'}><strong>{fmt(erros.length)}</strong><span>{tr('com problema')}</span></div>
      </div>
      {erros.length > 0 && (
        <div className="importacao__lista">
          <div className="importacao__lista-topo">
            <h4>{tr('Linhas que não entraram')}</h4>
            <button type="button" className="btn btn--ghost btn--sm" onClick={() => baixarErros(tipo, erros)}>{tr('Baixar lista')}</button>
          </div>
          <ul>
            {erros.slice(0, 50).map((e) => <li key={`e${e.linha}`}><span className="importacao__linha">{tr('Linha {n}', { n: e.linha })}</span>{e.motivo}</li>)}
          </ul>
          {erros.length > 50 && <p className="importacao__dica">{tr('E mais {total}. Baixe a lista para ver todas.', { total: fmt(erros.length - 50) })}</p>}
          <p className="importacao__dica">{tr('Corrija essas linhas na planilha e importe de novo: o que já entrou é ignorado, nada fica repetido.')}</p>
        </div>
      )}
      {avisos.length > 0 && (
        <div className="importacao__lista">
          <h4>{tr('Avisos')}</h4>
          <ul>
            {avisos.slice(0, 30).map((a) => <li key={`a${a.linha}`}><span className="importacao__linha">{tr('Linha {n}', { n: a.linha })}</span>{a.motivo}</li>)}
          </ul>
        </div>
      )}
    </section>
  );
}

export default function ImportacaoPagina() {
  const { user } = useAuthContext();
  const tipos = tiposDoPapel(user?.role);
  const imp = useImportacao();
  const pendencias = imp.tipo && imp.planilha ? pendenciasDoMapa(imp.tipo, imp.mapa) : [];
  const ocupado = !!imp.progresso;

  return (
    <div className="page importacao">
      <header className="page-header">
        <div>
          <h2 className="page-title">{tr('Importar dados')}</h2>
          <p className="page-subtitle">{tr('Traga pacientes, consultas, prontuários e cadastros do sistema que você usava')}</p>
        </div>
      </header>

      <EscolhaDoTipo tipos={tipos} atual={imp.tipo} onEscolher={imp.escolherTipo} />

      {imp.tipo && <EnvioDoArquivo tipo={imp.tipo} planilha={imp.planilha} lendo={imp.lendo} onArquivo={imp.abrirArquivo} />}

      {imp.erro && <p className="alert alert--error" role="alert">{imp.erro}</p>}

      {imp.tipo && imp.planilha && (
        <>
          <Colunas tipo={imp.tipo} planilha={imp.planilha} mapa={imp.mapa} onTrocar={imp.trocarColuna} />
          <div className="importacao__acoes">
            {pendencias.length > 0 && (
              <ul className="importacao__pendencias">{pendencias.map((p) => <li key={p}>{p}</li>)}</ul>
            )}
            {imp.progresso && (
              <div className="importacao__progresso" role="progressbar" aria-valuemin={0} aria-valuemax={imp.progresso.total} aria-valuenow={imp.progresso.feitas}>
                <span style={{ width: `${(imp.progresso.feitas / imp.progresso.total) * 100}%` }} />
              </div>
            )}
            <div className="form-actions">
              <button type="button" className="btn btn--ghost" onClick={imp.recomecar} disabled={ocupado}>{tr('Trocar arquivo')}</button>
              <button type="button" className="btn btn--primary" onClick={imp.importar} disabled={ocupado || pendencias.length > 0}>
                {imp.progresso
                  ? tr('Importando... {feitas} de {total}', { feitas: fmt(imp.progresso.feitas), total: fmt(imp.progresso.total) })
                  : tr('Importar {total} linhas', { total: fmt(imp.planilha.linhas.length) })}
              </button>
            </div>
          </div>
        </>
      )}

      {imp.resultado && <Resultado tipo={imp.tipo} resultado={imp.resultado} />}
    </div>
  );
}
