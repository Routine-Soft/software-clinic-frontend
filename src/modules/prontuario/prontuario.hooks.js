import { useState, useEffect, useCallback } from "react";
import {
  getAllProntuarios,
  createProntuario,
  updateProntuario,
  finalizarAtendimento,
  deleteProntuario,
} from "./prontuario.api";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const refreshProntuarios = useCallback(async () => {
    if (!pacienteId) {
      setProntuarios([]);
      setLoading(false);
      return;
    }
    try {
      const { data } = await getAllProntuarios({ pacienteId });
      setProntuarios(data);
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
        setProntuarios(response.data);
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

  async function removeProntuario(id) {
    limparAvisos();
    try {
      const response = await deleteProntuario(id);
      setSuccessMessage(response.message);
      await refreshProntuarios();
      return true;
    } catch (err) {
      setError(err);
    }
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
    loading,
    error,
    successMessage,
    addProntuario,
    editProntuario,
    removeProntuario,
    finalizarProntuario,
    refreshProntuarios,
  };
}