import { createContext, useContext } from 'react';

export const ConfirmacoesContext = createContext({ modo: null, pendentes: [], podeConfirmar: false, versaoJanela: 0, recarregar: () => {}, abrirJanela: () => {} });

// Como a clínica confirma os atendimentos e o que falta confirmar. Fica em ConfirmacoesProvider, dentro do MainLayout.
export function useConfirmacoes() {
  return useContext(ConfirmacoesContext);
}
