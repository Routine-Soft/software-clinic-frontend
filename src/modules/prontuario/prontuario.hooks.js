import { useState, useEffect, useCallback } from "react";
import {
  getAllProntuarios,
  createProntuario,
  updateProntuario,
  finalizarAtendimento,
  adicionarAdendo,
  salvarPerfilClinico,
  getAcessoProntuario,
} from "./prontuario.api";

// Se o login pode abrir prontuários: só profissionais de saúde vinculados a um cadastro de profissional.
// A regra vale no servidor; aqui serve para mostrar a explicação em vez de uma tela de erro.
export function useAcessoProntuario() {
  const [estado, setEstado] = useState({ carregando: true, profissional: null, erro: null });

  useEffect(() => {
    let ignore = false;

    getAcessoProntuario()
      .then((response) => { if (!ignore) setEstado({ carregando: false, profissional: response.data.profissional, erro: null }); })
      .catch((err) => { if (!ignore) setEstado({ carregando: false, profissional: null, erro: err }); });

    return () => { ignore = true; };
  }, []);

  return estado;
}

export function useTodosProntuarios() {
  const [prontuarios, setProntuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    try {
      const { data } = await getAllProntuarios();
      setProntuarios(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;

    async function loadProntuarios() {
      try {
        const { data } = await getAllProntuarios();
        if (!ignore) setProntuarios(data);
      } catch (err) {
        if (!ignore) setError(err);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadProntuarios();

    return () => { ignore = true; };
  }, []);

  return { prontuarios, loading, error, refresh };
}

export function useProntuarios(pacienteId) {
  const [prontuarios, setProntuarios] = useState([]);
  // completo: o profissional atende o paciente e vê todos os atendimentos; senão, só os que ele registrou.
  const [completo, setCompleto] = useState(true);
  const [perfilClinico, setPerfilClinico] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  function aplicar(response) {
    setProntuarios(response.data);
    setCompleto(response.completo !== false);
    setPerfilClinico(response.perfilClinico ?? null);
  }

  const refreshProntuarios = useCallback(async () => {
    if (!pacienteId) {
      setProntuarios([]);
      setLoading(false);
      return;
    }
    try {
      const response = await getAllProntuarios({ pacienteId });
      aplicar(response);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [pacienteId]);

  useEffect(() => {
    let ignore = false;

    Promise.resolve()
      .then(() => {
        if (ignore) return undefined;

        if (!pacienteId) {
          setProntuarios([]);
          setLoading(false);
          return undefined;
        }

        setLoading(true);
        return getAllProntuarios({ pacienteId });
      })
      .then((response) => {
        if (ignore || !response) return;
        aplicar(response);
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
  }, [pacienteId]);

  function limparAvisos() {
    setError(null);
    setSuccessMessage(null);
  }

  async function addProntuario(newProntuario) {
    limparAvisos();
    try {
      const response = await createProntuario(newProntuario);
      setSuccessMessage(response.message);
      await refreshProntuarios();
      return response.data;
    } catch (err) {
      setError(err);
    }
  }

  async function editProntuario(id, updatedProntuario) {
    limparAvisos();
    try {
      const response = await updateProntuario(id, updatedProntuario);
      setSuccessMessage(response.message);
      await refreshProntuarios();
      return response.data;
    } catch (err) {
      setError(err);
    }
  }

  async function addAdendo(id, texto) {
    limparAvisos();
    try {
      const response = await adicionarAdendo(id, texto);
      setSuccessMessage(response.message);
      await refreshProntuarios();
      return response.data;
    } catch (err) {
      setError(err);
    }
  }

  // Devolve o perfil salvo, ou lança o erro para a aba "Perfil clínico" mostrar no lugar certo.
  async function salvarPerfil(perfil) {
    const response = await salvarPerfilClinico(pacienteId, perfil);
    setPerfilClinico(response.data);
    return response.data;
  }

  async function finalizarProntuario(id, dadosAtendimento) {
    limparAvisos();
    try {
      const response = await finalizarAtendimento(id, dadosAtendimento);
      setSuccessMessage(response.message);
      await refreshProntuarios();
      return response.data;
    } catch (err) {
      setError(err);
    }
  }

  return {
    prontuarios,
    completo,
    perfilClinico,
    loading,
    error,
    successMessage,
    addProntuario,
    editProntuario,
    addAdendo,
    salvarPerfil,
    finalizarProntuario,
    refreshProntuarios,
  };
}