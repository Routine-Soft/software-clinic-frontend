import { useCallback, useEffect, useState } from 'react';
import { atualizarWhatsapp, conectarWhatsapp, desconectarWhatsapp, enviarTesteWhatsapp, getWhatsapp } from './whatsapp.api';

// Situação do WhatsApp da clínica e as ações da tela. Enquanto conecta, pede o QR Code de novo a cada 5 segundos
// (ele muda sozinho) até o celular ler e a conexão abrir.
export function useWhatsapp() {
  const [situacao, setSituacao] = useState(null);
  const [erro, setErro] = useState(null);
  const [mensagem, setMensagem] = useState(null);
  const [conectando, setConectando] = useState(false);
  const [ocupado, setOcupado] = useState(null);

  useEffect(() => {
    let cancelado = false;
    getWhatsapp()
      .then(({ data }) => { if (!cancelado) setSituacao(data); })
      .catch((e) => { if (!cancelado) setErro(e); });
    return () => { cancelado = true; };
  }, []);

  useEffect(() => {
    if (!conectando) return undefined;
    let cancelado = false;
    function pedir() {
      conectarWhatsapp()
        .then(({ data }) => {
          if (cancelado) return;
          setSituacao(data);
          if (data.conectado) {
            setConectando(false);
            setMensagem('conectado');
          }
        })
        .catch((e) => {
          if (cancelado) return;
          setErro(e);
          setConectando(false);
        });
    }
    pedir();
    const intervalo = setInterval(pedir, 5000);
    return () => {
      cancelado = true;
      clearInterval(intervalo);
    };
  }, [conectando]);

  const executar = useCallback(async (nome, acao) => {
    setErro(null);
    setMensagem(null);
    setOcupado(nome);
    try {
      const resposta = await acao();
      if (resposta?.data) setSituacao(resposta.data);
      setMensagem(resposta?.message ?? null);
      return true;
    } catch (e) {
      setErro(e);
      return false;
    } finally {
      setOcupado(null);
    }
  }, []);

  return {
    situacao,
    carregando: situacao === null && !erro,
    erro,
    mensagem,
    conectando,
    ocupado,
    conectar: () => { setErro(null); setMensagem(null); setConectando(true); },
    cancelarConexao: () => setConectando(false),
    desconectar: () => executar('desconectar', desconectarWhatsapp),
    salvar: (dados) => executar('salvar', () => atualizarWhatsapp(dados)),
    enviarTeste: (telefone) => executar('teste', () => enviarTesteWhatsapp(telefone)),
  };
}
