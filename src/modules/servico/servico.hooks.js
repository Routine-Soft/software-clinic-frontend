import { useState, useEffect } from "react";
import {
  getAllServicos,
  createServico,
  updateServico,
  deleteServico,
} from "./servico.api";

export function useServicos() {
  const [servicos, setServicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    let ignore = false;

    async function loadServicos() {
      try {
        const { data } = await getAllServicos();
        if (!ignore) setServicos(data);
      } catch (err) {
        if (!ignore) setError(err);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadServicos();

    return () => { ignore = true; };
  }, []);

  async function refreshServicos() {
    try {
      const { data } = await getAllServicos();
      setServicos(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  async function addServico(newServico) {
    setError(null);
    setSuccessMessage(null);
    try {
      const response = await createServico(newServico);
      setSuccessMessage(response.message);
      await refreshServicos();
      return response.data;
    } catch (err) {
      setError(err);
    }
  }

  async function editServico(id, updatedServico) {
    setError(null);
    setSuccessMessage(null);
    try {
      const response = await updateServico(id, updatedServico);
      setSuccessMessage(response.message);
      await refreshServicos();
      return response.data;
    } catch (err) {
      setError(err);
    }
  }

  async function removeServico(id) {
    setError(null);
    setSuccessMessage(null);
    try {
      const response = await deleteServico(id);
      setSuccessMessage(response.message);
      await refreshServicos();
    } catch (err) {
      setError(err);
    }
  }

  return {
    servicos,
    loading,
    error,
    successMessage,
    addServico,
    editServico,
    removeServico,
    refreshServicos,
  };
}