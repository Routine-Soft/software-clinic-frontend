import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuthContext } from '@/hooks/useAuthContext';
import { getConfirmacoes } from '../agenda.api';
import { AVISO_CONFIRMACOES, ConfirmacoesContext } from '../confirmacoes.context';
import ConfirmarAtendimentosModal from './ConfirmarAtendimentosModal';

const QUEM_CONFIRMA = ['admin', 'recepcao', 'super_admin'];
const INTERVALO_BUSCA_MS = 10 * 60 * 1000;
const REAVISO_MS = 4 * 60 * 60 * 1000;

// Quem fica logado também é avisado: no primeiro uso do dia e de novo a cada 4 horas.
function jaEstaNaHoraDeAvisar() {
  try {
    const ultimo = Number(localStorage.getItem(AVISO_CONFIRMACOES));
    if (!ultimo) return true;
    return Date.now() - ultimo >= REAVISO_MS || new Date(ultimo).toDateString() !== new Date().toDateString();
  } catch {
    return false;
  }
}

function lembrarQueAvisou() {
  try {
    localStorage.setItem(AVISO_CONFIRMACOES, String(Date.now()));
  } catch {
    // Sem armazenamento, o aviso fica só no topo da agenda e no menu.
  }
}

function temDiasAnteriores(pendentes) {
  const hoje = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' });
  return pendentes.some((a) => String(a.data).slice(0, 10) < hoje);
}

// Busca o que falta confirmar a cada troca de tela, ao voltar para a aba e de tempos em tempos. Na hora de avisar, abre a
// janela com o que ficou em aberto de dias anteriores, nunca por cima de outra janela (a pessoa pode estar digitando).
export default function ConfirmacoesProvider({ children }) {
  const { user } = useAuthContext();
  const { pathname } = useLocation();
  const [dados, setDados] = useState({ modo: null, pendentes: [] });
  const [janelaAberta, setJanelaAberta] = useState(false);
  const [versaoBusca, setVersaoBusca] = useState(0);
  // Muda quando a janela altera um agendamento, para a agenda aberta atrás dela recarregar.
  const [versaoJanela, setVersaoJanela] = useState(0);

  useEffect(() => {
    let ignore = false;
    getConfirmacoes()
      .then(({ data }) => {
        if (ignore) return;
        setDados(data);
        if (temDiasAnteriores(data.pendentes) && !document.querySelector('.modal') && jaEstaNaHoraDeAvisar()) {
          lembrarQueAvisou();
          setJanelaAberta(true);
        }
      })
      .catch(() => {});
    return () => { ignore = true; };
  }, [pathname, versaoBusca]);

  useEffect(() => {
    const buscar = () => { if (!document.hidden) setVersaoBusca((v) => v + 1); };
    const intervalo = setInterval(buscar, INTERVALO_BUSCA_MS);
    document.addEventListener('visibilitychange', buscar);
    return () => {
      clearInterval(intervalo);
      document.removeEventListener('visibilitychange', buscar);
    };
  }, []);

  const recarregar = useCallback(() => setVersaoBusca((v) => v + 1), []);
  const abrirJanela = useCallback(() => setJanelaAberta(true), []);

  const valor = useMemo(() => ({
    ...dados,
    podeConfirmar: dados.modo === 'recepcao' && QUEM_CONFIRMA.includes(user?.role),
    podeResolver: QUEM_CONFIRMA.includes(user?.role),
    versaoJanela,
    recarregar,
    abrirJanela,
  }), [dados, user?.role, versaoJanela, recarregar, abrirJanela]);

  return (
    <ConfirmacoesContext.Provider value={valor}>
      {children}
      {janelaAberta && (
        <ConfirmarAtendimentosModal
          pendentes={dados.pendentes}
          onMudou={() => { recarregar(); setVersaoJanela((v) => v + 1); }}
          onClose={() => setJanelaAberta(false)}
        />
      )}
    </ConfirmacoesContext.Provider>
  );
}
