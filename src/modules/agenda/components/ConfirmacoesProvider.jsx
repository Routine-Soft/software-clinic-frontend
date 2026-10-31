import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuthContext } from '@/hooks/useAuthContext';
import { getConfirmacoes } from '../agenda.api';
import { ConfirmacoesContext } from '../confirmacoes.context';
import ConfirmarAtendimentosModal from './ConfirmarAtendimentosModal';

const QUEM_CONFIRMA = ['admin', 'recepcao', 'super_admin'];
const JA_AVISOU = 'confirmacoes-avisadas';

function jaAvisouNestaEntrada() {
  try {
    return sessionStorage.getItem(JA_AVISOU) === '1';
  } catch {
    return false;
  }
}

function lembrarQueAvisou() {
  try {
    sessionStorage.setItem(JA_AVISOU, '1');
  } catch {
    // Sem armazenamento, a janela só volta a aparecer ao recarregar a tela.
  }
}

function temDiasAnteriores(pendentes) {
  const hoje = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' });
  return pendentes.some((a) => String(a.data).slice(0, 10) < hoje);
}

// Busca o que falta confirmar a cada troca de tela e, uma vez a cada entrada no sistema, abre a janela
// com os atendimentos de dias anteriores que ficaram em aberto.
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
        if (temDiasAnteriores(data.pendentes) && !jaAvisouNestaEntrada()) {
          lembrarQueAvisou();
          setJanelaAberta(true);
        }
      })
      .catch(() => {});
    return () => { ignore = true; };
  }, [pathname, versaoBusca]);

  const recarregar = useCallback(() => setVersaoBusca((v) => v + 1), []);
  const abrirJanela = useCallback(() => setJanelaAberta(true), []);

  const valor = useMemo(() => ({
    ...dados,
    podeConfirmar: dados.modo === 'recepcao' && QUEM_CONFIRMA.includes(user?.role),
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
