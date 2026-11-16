import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuthContext } from '@/hooks/useAuthContext';
import { getAssinaturaAtual } from '@/modules/assinatura/assinatura.api';
import { PlanoContext, recursoLiberado } from '../plano.contexto';
import { registrarBloqueio } from '../plano.api';
import RecursoBloqueadoModal from './RecursoBloqueadoModal';

// Carrega o plano da clínica uma vez (e de novo quando a API avisa de um recurso barrado) e mostra a janela
// "recurso de plano pago" quando alguém clica num cadeado ou a API recusa uma ação por causa do plano.
export default function PlanoProvider({ children }) {
  const { user } = useAuthContext();
  const [acesso, setAcesso] = useState(null);
  const [assinatura, setAssinatura] = useState(null);
  const [versao, setVersao] = useState(0);
  const [bloqueio, setBloqueio] = useState(null);

  // Super admin e afiliado não têm plano de clínica: tudo aparece liberado para eles.
  const semPlano = !user || ['super_admin', 'afiliado'].includes(user.role);

  useEffect(() => {
    if (semPlano) return undefined;
    let cancelado = false;
    getAssinaturaAtual()
      .then(({ data }) => {
        if (cancelado) return;
        setAssinatura(data);
        setAcesso(data.acesso ?? null);
      })
      .catch(() => { if (!cancelado) setAcesso((atual) => atual ?? { nivel: null }); });
    return () => { cancelado = true; };
  }, [semPlano, versao]);

  const recarregar = useCallback(() => setVersao((v) => v + 1), []);

  const abrirBloqueio = useCallback((recurso, origem = 'tela', mensagem = null, rota = null) => {
    setBloqueio({ recurso, mensagem, rota });
    registrarBloqueio(recurso, origem).catch(() => {});
  }, []);

  // Acesso revogado pelo suporte com o sistema aberto: bloqueia na hora (AssinaturaGuard).
  useEffect(() => {
    function aoBloquear(e) {
      setAcesso((atual) => ({ ...(atual ?? {}), bloqueado: true, motivo: e.detail?.motivo ?? null }));
    }
    window.addEventListener('assinatura:inativa', aoBloquear);
    return () => window.removeEventListener('assinatura:inativa', aoBloquear);
  }, []);

  // A API recusou uma ação por causa do plano (ex.: o 11º paciente no plano Grátis).
  useEffect(() => {
    function aoBarrar(e) {
      abrirBloqueio(e.detail?.recurso, 'api', e.detail?.mensagem);
      recarregar();
    }
    window.addEventListener('plano:recurso', aoBarrar);
    return () => window.removeEventListener('plano:recurso', aoBarrar);
  }, [abrirBloqueio, recarregar]);

  const valor = useMemo(() => ({
    carregando: !semPlano && acesso === null,
    nivel: semPlano ? null : acesso?.nivel ?? null,
    bloqueado: !semPlano && !!acesso?.bloqueado,
    motivo: acesso?.motivo ?? null,
    limites: acesso?.limites ?? {},
    moeda: assinatura?.moeda ?? 'BRL',
    tem: (recurso) => semPlano || recursoLiberado(acesso, recurso),
    abrirBloqueio,
    recarregar,
  }), [semPlano, acesso, assinatura, abrirBloqueio, recarregar]);

  return (
    <PlanoContext.Provider value={valor}>
      {children}
      {bloqueio && (
        <RecursoBloqueadoModal
          recurso={bloqueio.recurso}
          mensagem={bloqueio.mensagem}
          rota={bloqueio.rota}
          nivel={valor.nivel}
          moeda={valor.moeda}
          onClose={() => setBloqueio(null)}
        />
      )}
    </PlanoContext.Provider>
  );
}
