import { useState } from 'react';
import { importarLinhas } from './importacao.api';
import { lerPlanilha } from './importacao.planilha';
import { adivinharColunas, montarLinhas } from './importacao.utils';

// Linhas por envio: prontuário tem textos longos, então vai em partes menores.
const TAMANHO_DO_LOTE = { prontuarios: 100 };
const LOTE_PADRAO = 250;

const RESULTADO_VAZIO = { importados: 0, ignorados: [], erros: [], avisos: [] };

export function useImportacao() {
  const [tipo, setTipo] = useState(null);
  const [planilha, setPlanilha] = useState(null); // { nomeArquivo, cabecalhos, linhas }
  const [mapa, setMapa] = useState({});
  const [lendo, setLendo] = useState(false);
  const [progresso, setProgresso] = useState(null); // { feitas, total }
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState(null);

  function escolherTipo(novo) {
    setTipo(novo);
    setResultado(null);
    setErro(null);
    setMapa(planilha && novo ? adivinharColunas(novo, planilha.cabecalhos) : {});
  }

  async function abrirArquivo(arquivo) {
    if (!arquivo) return;
    setLendo(true);
    setErro(null);
    setResultado(null);
    try {
      const lida = await lerPlanilha(arquivo);
      setPlanilha({ nomeArquivo: arquivo.name, ...lida });
      setMapa(tipo ? adivinharColunas(tipo, lida.cabecalhos) : {});
    } catch (e) {
      setPlanilha(null);
      setErro(e.message);
    } finally {
      setLendo(false);
    }
  }

  function trocarColuna(campo, indice) {
    setMapa((atual) => {
      const novo = { ...atual };
      if (indice === '') delete novo[campo];
      else novo[campo] = Number(indice);
      return novo;
    });
  }

  function recomecar() {
    setPlanilha(null);
    setMapa({});
    setResultado(null);
    setErro(null);
    setProgresso(null);
  }

  async function importar() {
    if (!tipo || !planilha) return;
    const linhas = montarLinhas(tipo, mapa, planilha.linhas);
    const lote = TAMANHO_DO_LOTE[tipo.chave] ?? LOTE_PADRAO;
    const soma = { ...RESULTADO_VAZIO, ignorados: [], erros: [], avisos: [] };
    setErro(null);
    setResultado(null);
    setProgresso({ feitas: 0, total: linhas.length });
    try {
      for (let i = 0; i < linhas.length; i += lote) {
        const { data } = await importarLinhas(tipo.chave, linhas.slice(i, i + lote));
        soma.importados += data.importados;
        soma.ignorados.push(...data.ignorados);
        soma.erros.push(...data.erros);
        soma.avisos.push(...data.avisos);
        setProgresso({ feitas: Math.min(i + lote, linhas.length), total: linhas.length });
      }
      setResultado(soma);
    } catch (e) {
      // Parou no meio (plano, permissão, conexão): mostra o que já entrou e o motivo.
      if (soma.importados || soma.erros.length || soma.ignorados.length) setResultado({ ...soma, interrompido: true });
      setErro(e.message);
    } finally {
      setProgresso(null);
    }
  }

  return { tipo, planilha, mapa, lendo, progresso, resultado, erro, escolherTipo, abrirArquivo, trocarColuna, recomecar, importar };
}
