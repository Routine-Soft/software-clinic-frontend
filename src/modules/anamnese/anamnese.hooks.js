import { useCallback, useEffect, useState } from 'react';
import {
  getModelos, getModelo, createModelo, updateModelo, duplicarModelo, deleteModelo,
  getAnamneses, getAnamnese, createAnamnese, updateAnamnese,
} from './anamnese.api';
import { getAvaliacaoNeuro } from '@/modules/avaliacao-neuropsicologica/avaliacao-neuro.api';
import { modeloVazio } from './anamnese.utils';

// Lista de modelos da clínica (tela "Anamneses" e escolha do modelo).
export function useModelosAnamnese() {
  const [modelos, setModelos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const recarregar = useCallback(async () => {
    const { data } = await getModelos();
    setModelos(data);
  }, []);

  useEffect(() => {
    let ignore = false;
    getModelos()
      .then(({ data }) => { if (!ignore) { setModelos(data); setLoading(false); } })
      .catch((err) => { if (!ignore) { setError(err); setLoading(false); } });
    return () => { ignore = true; };
  }, []);

  async function executar(acao) {
    setError(null);
    setSuccessMessage(null);
    try {
      const resposta = await acao();
      setSuccessMessage(resposta.message);
      await recarregar();
      return resposta.data ?? true;
    } catch (err) {
      setError(err);
    }
  }

  return {
    modelos,
    loading,
    error,
    successMessage,
    duplicar: (id) => executar(() => duplicarModelo(id)),
    excluir: (id) => executar(() => deleteModelo(id)),
  };
}

// Um modelo no editor. id 'novo' = modelo em branco.
export function useModeloAnamnese(id) {
  const novo = id === 'novo';
  const [modelo, setModelo] = useState(novo ? modeloVazio() : null);
  const [loading, setLoading] = useState(!novo);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (novo) return undefined;
    let ignore = false;
    getModelo(id)
      .then(({ data }) => { if (!ignore) { setModelo(data); setLoading(false); } })
      .catch((err) => { if (!ignore) { setError(err); setLoading(false); } });
    return () => { ignore = true; };
  }, [id, novo]);

  async function salvar(dados) {
    setError(null);
    try {
      const resposta = novo ? await createModelo(dados) : await updateModelo(id, dados);
      setModelo(resposta.data);
      return resposta;
    } catch (err) {
      setError(err);
      return null;
    }
  }

  return { modelo, loading, error, salvar, novo };
}

// Anamneses de um paciente no prontuário.
export function useAnamnesesDoPaciente(pacienteId) {
  const [anamneses, setAnamneses] = useState([]);
  const [modeloPreferidoId, setModeloPreferidoId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const recarregar = useCallback(async () => {
    const { data } = await getAnamneses(pacienteId);
    setAnamneses(data.anamneses);
    setModeloPreferidoId(data.modeloPreferidoId);
  }, [pacienteId]);

  useEffect(() => {
    let ignore = false;
    getAnamneses(pacienteId)
      .then(({ data }) => {
        if (ignore) return;
        setAnamneses(data.anamneses);
        setModeloPreferidoId(data.modeloPreferidoId);
        setLoading(false);
      })
      .catch((err) => { if (!ignore) { setError(err); setLoading(false); } });
    return () => { ignore = true; };
  }, [pacienteId]);

  async function executar(acao) {
    setError(null);
    try {
      const resposta = await acao();
      await recarregar();
      return resposta;
    } catch (err) {
      setError(err);
      return null;
    }
  }

  return {
    anamneses,
    modeloPreferidoId,
    loading,
    error,
    abrir: async (id) => {
      setError(null);
      try {
        return (await getAnamnese(id)).data;
      } catch (err) {
        setError(err);
        return null;
      }
    },
    criar: (dados) => executar(() => createAnamnese({ ...dados, pacienteId })),
    salvar: (id, dados) => executar(() => updateAnamnese(id, dados)),
  };
}

// Anamnese para imprimir: a do prontuário (tipo 'prontuario') ou a da avaliação neuropsicológica ('neuro').
export function useFichaImpressa(tipo, id) {
  const [ficha, setFicha] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;
    const carregar = tipo === 'neuro'
      ? getAvaliacaoNeuro(id).then(({ data }) => ({
        titulo: data.anamnese?.titulo ?? '',
        secoes: data.anamnese?.secoes ?? [],
        respostas: data.anamnese?.respostas ?? {},
        paciente: data.pacienteId,
        profissional: data.profissionalId,
        data: data.updatedAt,
      }))
      : getAnamnese(id).then(({ data }) => ({
        titulo: data.titulo,
        secoes: data.secoes,
        respostas: data.respostas ?? {},
        paciente: data.pacienteId,
        profissional: data.profissionalId,
        data: data.updatedAt,
      }));
    carregar
      .then((f) => { if (!ignore) { setFicha(f); setLoading(false); } })
      .catch((err) => { if (!ignore) { setError(err); setLoading(false); } });
    return () => { ignore = true; };
  }, [tipo, id]);

  return { ficha, loading, error };
}
