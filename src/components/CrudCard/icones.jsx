export function Icone({ children }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  )
}

export const IconeMais = () => <Icone><path d="M5 12h14M12 5v14" /></Icone>
export const IconeLapis = () => <Icone><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /></Icone>
export const IconeLixeira = () => (
  <Icone>
    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </Icone>
)
export const IconeCheck = () => <Icone><path d="M20 6 9 17l-5-5" /></Icone>
export const IconeX = () => <Icone><path d="M18 6 6 18M6 6l12 12" /></Icone>
export const IconeBusca = () => <Icone><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></Icone>
export const IconeImpressora = () => (
  <Icone>
    <path d="M6 9V2h12v7" />
    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
    <path d="M6 14h12v8H6z" />
  </Icone>
)
export const IconeFicha = () => (
  <Icone>
    <rect x="8" y="2" width="8" height="4" rx="1" />
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <path d="M9 12h6M9 16h4" />
  </Icone>
)
export const IconeAbrirJanela = () => (
  <Icone>
    <path d="M15 3h6v6M10 14 21 3" />
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
  </Icone>
)
export const IconeSetaEsquerda = () => <Icone><path d="m12 19-7-7 7-7M19 12H5" /></Icone>
export const IconeAlerta = () => (
  <Icone>
    <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
    <path d="M12 9v4M12 17h.01" />
  </Icone>
)
export const IconeChevron = () => <Icone><path d="m6 9 6 6 6-6" /></Icone>
export const IconeSetaEsq = () => <Icone><path d="m15 18-6-6 6-6" /></Icone>
export const IconeSetaDir = () => <Icone><path d="m9 18 6-6-6-6" /></Icone>
export const IconeCadeado = () => (
  <Icone>
    <rect width="18" height="11" x="3" y="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </Icone>
)
export const IconeCadeadoAberto = () => (
  <Icone>
    <rect width="18" height="11" x="3" y="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 9.9-1" />
  </Icone>
)
export const IconeTrocar = () => (
  <Icone>
    <path d="m17 2 4 4-4 4M3 11V9a4 4 0 0 1 4-4h14M7 22l-4-4 4-4M21 13v2a4 4 0 0 1-4 4H3" />
  </Icone>
)
export const IconeRelogioMais = () => (
  <Icone>
    <circle cx="11" cy="13" r="8" />
    <path d="M11 9v4l2.5 2.5" />
    <path d="M18 2v4M16 4h4" />
  </Icone>
)
export const IconeChave = () => (
  <Icone>
    <circle cx="7.5" cy="15.5" r="5.5" />
    <path d="m21 2-9.6 9.6M15.5 7.5l3 3L22 7l-3-3" />
  </Icone>
);
export const IconeTelefone = () => <Icone><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" /></Icone>
export const IconeGrafico = () => <Icone><path d="M3 3v18h18" /><path d="M18 17V9M13 17V5M8 17v-3" /></Icone>
