import { useState, useEffect } from "react";
import {
  getAllEspecialidades,
  createEspecialidade,
  updateEspecialidade,
  deleteEspecialidade,
} from "./especialidade.api";

export function useEspecialidades() {
  const [especialidades, setEspecialidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    let ignore = false;

    async function loadEspecialidades() {
      try {
        const { data } = await getAllEspecialidades();
        if (!ignore) setEspecialidades(data);
      } catch (err) {
        if (!ignore) setError(err);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadEspecialidades();

    return () => { ignore = true; };
  }, []);

  async function refreshEspecialidades() {
    try {
      const { data } = await getAllEspecialidades();
      setEspecialidades(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  async function addEspecialidade(newEspecialidade) {
    setError(null);
    setSuccessMessage(null);
    try {
      const response = await createEspecialidade(newEspecialidade);
      setSuccessMessage(response.message);
      await refreshEspecialidades();
      return response.data;
    } catch (err) {
      setError(err);
    }
  }

  async function editEspecialidade(id, updatedEspecialidade) {
    setError(null);
    setSuccessMessage(null);
    try {
      const response = await updateEspecialidade(id, updatedEspecialidade);
      setSuccessMessage(response.message);
      await refreshEspecialidades();
      return response.data;
    } catch (err) {
      setError(err);
    }
  }

  async function removeEspecialidade(id) {
    setError(null);
    setSuccessMessage(null);
    try {
      const response = await deleteEspecialidade(id);
      setSuccessMessage(response.message);
      await refreshEspecialidades();
    } catch (err) {
      setError(err);
    }
  }

  return {
    especialidades,
    loading,
    error,
    successMessage,
    addEspecialidade,
    editEspecialidade,
    removeEspecialidade,
    refreshEspecialidades,
  };
}