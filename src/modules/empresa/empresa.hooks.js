import { useState, useEffect } from "react";
import {
  getAllEmpresas,
  createEmpresa,
  updateEmpresa,
  deleteEmpresa,
} from "./empresa.api";

export function useEmpresas() {
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    let ignore = false;

    async function loadEmpresas() {
      try {
        const { data } = await getAllEmpresas();
        if (!ignore) setEmpresas(data);
      } catch (err) {
        if (!ignore) setError(err);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadEmpresas();

    return () => { ignore = true; };
  }, []);

  async function refreshEmpresas() {
    try {
      const { data } = await getAllEmpresas();
      setEmpresas(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  async function addEmpresa(newEmpresa) {
    setError(null);
    setSuccessMessage(null);
    try {
      const response = await createEmpresa(newEmpresa);
      setSuccessMessage(response.message);
      await refreshEmpresas();
      return response.data;
    } catch (err) {
      setError(err);
    }
  }

  async function editEmpresa(id, updatedEmpresa) {
    setError(null);
    setSuccessMessage(null);
    try {
      const response = await updateEmpresa(id, updatedEmpresa);
      setSuccessMessage(response.message);
      await refreshEmpresas();
      return response.data;
    } catch (err) {
      setError(err);
    }
  }

  async function removeEmpresa(id) {
    setError(null);
    setSuccessMessage(null);
    try {
      const response = await deleteEmpresa(id);
      setSuccessMessage(response.message);
      await refreshEmpresas();
    } catch (err) {
      setError(err);
    }
  }

  return {
    empresas,
    loading,
    error,
    successMessage,
    addEmpresa,
    editEmpresa,
    removeEmpresa,
    refreshEmpresas,
  };
}
