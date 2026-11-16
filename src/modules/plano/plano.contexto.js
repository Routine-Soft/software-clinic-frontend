import { createContext, useContext } from 'react';

// O que a clínica pode usar agora, vindo de /assinaturas/atual (`acesso`): nível "gratis", "basic" ou "pro",
// os recursos liberados e os limites. Mesmas regras de plano.limites.js no backend (lá é quem barra de verdade).
//  - pro: plano Pro e o período de teste, tudo liberado;
//  - basic: até 5 profissionais, sem recepção nem repasses;
//  - gratis: agenda, até 10 pacientes e um profissional.
export const PlanoContext = createContext({
  carregando: true,
  nivel: null,
  bloqueado: false,
  motivo: null,
  limites: {},
  tem: () => true,
  abrirBloqueio: () => {},
  recarregar: () => {},
});

// Nível em que o recurso existe pela primeira vez (para a janela dizer qual plano libera).
const PLANO_DO_RECURSO = {
  prontuario: 'basic',
  anamnese: 'basic',
  termo: 'basic',
  convenio: 'basic',
  avaliacoes: 'basic',
  empresas: 'basic',
  reunioes: 'basic',
  equipe: 'basic',
  pacientes: 'basic',
  repasse: 'pro',
  recepcao: 'pro',
  profissionais: 'basic',
};

// Nome do plano que libera o recurso para esta clínica (no Basic, o que falta é sempre do Pro).
export function planoQueLibera(recurso, nivel) {
  return nivel === 'basic' || PLANO_DO_RECURSO[recurso] === 'pro' ? 'Pro' : 'Basic';
}

// `equipe` (cadastrar usuários, como os profissionais com login): Basic e Pro. O resto vem da lista do backend.
export function recursoLiberado(acesso, recurso) {
  if (!acesso?.nivel) return true;
  if (recurso === 'equipe') return acesso.nivel !== 'gratis';
  return (acesso.recursos ?? []).includes(recurso);
}

// Plano da clínica e a janela "recurso de plano pago". Fica no PlanoProvider, dentro do MainLayout.
export function usePlano() {
  return useContext(PlanoContext);
}
