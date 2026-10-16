import { useEffect, useState } from 'react';
import { usePacientes } from '@/modules/paciente/paciente.hooks';
import { createPaciente } from '@/modules/paciente/paciente.api';
import { useProfissionais } from '@/modules/profissional/profissional.hooks';
import { useConvenios } from '@/modules/convenio/convenio.hooks';
import { useEmpresas } from '@/modules/empresa/empresa.hooks';
import {
  getModelos, createModelo, updateModelo, deleteModelo,
  getTermos, getTermo, enviarTermo, cancelarTermo,
  getTermoPublico, assinarTermoPublico,
} from './termo.api';

// Página "Termos de consentimento": modelos da clínica e termos enviados aos pacientes.
export function useTermos() {
  const [modelos, setModelos] = useState([]);
  const [termos, setTermos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    let ignore = false;
    Promise.all([getModelos(), getTermos()])
      .then(([m, t]) => {
        if (ignore) return;
        setModelos(m.data);
        setTermos(t.data);
        setLoading(false);
      })
      .catch((err) => {
        if (ignore) return;
        setError(err);
        setLoading(false);
      });
    return () => { ignore = true; };
  }, []);

  async function recarregar() {
    const [m, t] = await Promise.all([getModelos(), getTermos()]);
    setModelos(m.data);
    setTermos(t.data);
  }

  // Roda a ação, mostra a mensagem da API e recarrega. Devolve o `data` da resposta, ou undefined com erro.
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
    termos,
    loading,
    error,
    successMessage,
    limparAvisos: () => { setError(null); setSuccessMessage(null); },
    addModelo: (dados) => executar(() => createModelo(dados)),
    editModelo: (id, dados) => executar(() => updateModelo(id, dados)),
    removeModelo: (id) => executar(() => deleteModelo(id)),
    enviar: (dados) => executar(() => enviarTermo(dados)),
    cancelar: (id) => executar(() => cancelarTermo(id)),
  };
}

// O que o modal de envio precisa: pacientes (com cadastro na hora) e profissionais.
export function useDadosEnvio() {
  const { pacientes, refreshPacientes } = usePacientes();
  const { profissionais } = useProfissionais();
  const { convenios } = useConvenios();
  const { empresas } = useEmpresas();

  async function criarPaciente(dados) {
    const response = await createPaciente(dados);
    await refreshPacientes();
    return response.data;
  }

  return { pacientes, profissionais, convenios, empresas, criarPaciente };
}

// Termo completo (com a assinatura desenhada), para ver e imprimir.
export function useTermo(id) {
  const [termo, setTermo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;
    getTermo(id)
      .then((r) => { if (!ignore) { setTermo(r.data); setLoading(false); } })
      .catch((err) => { if (!ignore) { setError(err); setLoading(false); } });
    return () => { ignore = true; };
  }, [id]);

  return { termo, loading, error };
}

// Página do paciente: carrega o termo pelo link e assina.
export function useTermoPublico(token) {
  const [termo, setTermo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [assinando, setAssinando] = useState(false);
  const [erroAssinatura, setErroAssinatura] = useState(null);

  useEffect(() => {
    let ignore = false;
    getTermoPublico(token)
      .then((r) => { if (!ignore) { setTermo(r.data); setLoading(false); } })
      .catch((err) => { if (!ignore) { setError(err); setLoading(false); } });
    return () => { ignore = true; };
  }, [token]);

  async function assinar(dados) {
    setAssinando(true);
    setErroAssinatura(null);
    try {
      const resposta = await assinarTermoPublico(token, dados);
      setTermo(resposta.data);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setErroAssinatura(err);
    } finally {
      setAssinando(false);
    }
  }

  return { termo, loading, error, assinando, erroAssinatura, assinar };
}
