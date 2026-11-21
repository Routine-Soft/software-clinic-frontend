import { useCallback, useEffect, useState } from 'react';
import {
  atualizarLancamento, criarLancamento, desfazerRepasse, editarAtendimento, excluirAtendimento, excluirLancamento, getFinanceiro, pagarLancamento,
} from './financeiro.api';

// Dados do Financeiro no período escolhido. Ao trocar de período mostra o skeleton; ao recarregar (depois de lançar
// uma despesa ou pagar um repasse) mantém os números na tela até os novos chegarem.
export function useFinanceiro(periodo, data) {
  const chave = `${periodo}|${data}`;
  const [carregado, setCarregado] = useState(null);
  const [error, setError] = useState(null);
  const [versao, setVersao] = useState(0);

  useEffect(() => {
    let ignore = false;
    getFinanceiro(periodo, data)
      .then((response) => {
        if (ignore) return;
        setCarregado({ chave, dados: response.data });
        setError(null);
      })
      .catch((err) => { if (!ignore) setError(err); });
    return () => { ignore = true; };
  }, [periodo, data, chave, versao]);

  const recarregar = useCallback(() => setVersao((v) => v + 1), []);

  return {
    dados: carregado?.chave === chave ? carregado.dados : null,
    loading: carregado?.chave !== chave && !error,
    error,
    recarregar,
  };
}

// Tudo o que a dona muda pelo Financeiro (lançamentos, atendimentos e repasses), com a mensagem da API.
export function useAcoesFinanceiro(aoMudar) {
  const [erro, setErro] = useState(null);
  const [sucesso, setSucesso] = useState(null);

  async function executar(acao) {
    setErro(null);
    setSucesso(null);
    try {
      const response = await acao();
      setSucesso(response.message);
      aoMudar();
      return true;
    } catch (err) {
      setErro(err);
      return false;
    }
  }

  return {
    erro,
    sucesso,
    limparErro: () => setErro(null),
    salvarLancamento: (lancamento, id) => executar(() => (id ? atualizarLancamento(id, lancamento) : criarLancamento(lancamento))),
    pagarLancamento: (id, pago) => executar(() => pagarLancamento(id, pago)),
    excluirLancamento: (id, futuras) => executar(() => excluirLancamento(id, futuras)),
    editarAtendimento: (id, dados) => executar(() => editarAtendimento(id, dados)),
    excluirAtendimento: (id) => executar(() => excluirAtendimento(id)),
    desfazerRepasse: (id) => executar(() => desfazerRepasse(id)),
  };
}
