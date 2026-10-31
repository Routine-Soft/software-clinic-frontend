import { createContext, useContext } from 'react';

// Quando a janela de atendimentos em aberto apareceu pela última vez; sair do sistema apaga.
export const AVISO_CONFIRMACOES = 'confirmacoes-avisadas-em';

export const ConfirmacoesContext = createContext({ modo: null, pendentes: [], podeConfirmar: false, podeResolver: false, versaoJanela: 0, recarregar: () => {}, abrirJanela: () => {} });

// Como a clínica confirma os atendimentos e o que falta confirmar. Fica em ConfirmacoesProvider, dentro do MainLayout.
export function useConfirmacoes() {
  return useContext(ConfirmacoesContext);
}
