import { useState, useEffect } from "react";
import {
  getAllPlanos,
  createPlano,
  updatePlano,
  deletePlano,
} from "./plano.api";

export function usePlanos() {
  const [planos, setPlanos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    let ignore = false;

    async function loadPlanos() {
      try {
        const { data } = await getAllPlanos();
        if (!ignore) setPlanos(data);
      } catch (err) {
        if (!ignore) setError(err);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadPlanos();

    return () => { ignore = true; };
  }, []);

  async function refreshPlanos() {
    try {
      setLoading(true);
      const { data } = await getAllPlanos();
      setPlanos(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  async function addPlano(newPlano) {
    try {
      const response = await createPlano(newPlano);
      setSuccessMessage(response.message);
      await refreshPlanos();
      return response.data;
    } catch (err) {
      setError(err);
    }
  }

  async function editPlano(id, updatedPlano) {
    try {
      const response = await updatePlano(id, updatedPlano);
      setSuccessMessage(response.message);
      await refreshPlanos();
      return response.data;
    } catch (err) {
      setError(err);
    }
  }

  async function removePlano(id) {
    try {
      const response = await deletePlano(id);
      setSuccessMessage(response.message);
      await refreshPlanos();
    } catch (err) {
      setError(err);
    }
  }

  return {
    planos,
    loading,
    error,
    successMessage,
    addPlano,
    editPlano,
    removePlano,
    refreshPlanos,
  };
}