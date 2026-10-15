import { useCallback, useEffect, useState } from 'react';
import { getPainelAfiliado, getAfiliados, registrarPagamentoAfiliado, definirAfiliadoAtivo, excluirAfiliado } from './afiliado.api';

export function usePainelAfiliado() {
  const [painel, setPainel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;

    Promise.resolve()
      .then(() => {
        if (ignore) return undefined;
        setLoading(true);
        return getPainelAfiliado();
      })
      .then((response) => {
        if (ignore || !response) return;
        setPainel(response.data);
        setLoading(false);
      })
      .catch((err) => {
        if (!ignore) {
          setError(err);
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  return { painel, loading, error };
}

export function useAfiliadosAdm() {
  const [afiliados, setAfiliados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const recarregar = useCallback(async () => {
    const { data } = await getAfiliados();
    setAfiliados(data);
  }, []);

  useEffect(() => {
    let ignore = false;

    Promise.resolve()
      .then(() => {
        if (ignore) return undefined;
        setLoading(true);
        return getAfiliados();
      })
      .then((response) => {
        if (ignore || !response) return;
        setAfiliados(response.data);
        setLoading(false);
      })
      .catch((err) => {
        if (!ignore) {
          setError(err);
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  async function executar(acao) {
    setError(null);
    setSuccessMessage(null);
    try {
      const resposta = await acao();
      await recarregar();
      setSuccessMessage(resposta.message);
      return true;
    } catch (err) {
      setError(err);
      return false;
    }
  }

  return {
    afiliados,
    loading,
    error,
    successMessage,
    registrarPagamento: (id) => executar(() => registrarPagamentoAfiliado(id)),
    definirAtivo: (id, ativo) => executar(() => definirAfiliadoAtivo(id, ativo)),
    excluir: (id) => executar(() => excluirAfiliado(id)),
  };
}
