import { inject } from '@vercel/analytics'

// Vercel Web Analytics (sem cookies, por isso sem aviso da LGPD). Mede só as páginas públicas: o sistema por
// dentro não conta (economiza a cota do plano grátis), e o link de "Criar senha nova" leva um código secreto na URL.
const PAGINAS_PUBLICAS = ['/', '/afiliados', '/registro', '/login', '/esqueci-senha', '/termos', '/termos-afiliado']

// O site usa HashRouter ("/#/afiliados"): a rota vira o caminho da URL ("/afiliados"), para o painel da Vercel
// separar as páginas. Parâmetros depois do "#" (ex.: código de indicação) ficam de fora.
function paginaPublica(evento) {
  const url = new URL(evento.url)
  const rota = url.hash.replace(/^#/, '').split('?')[0] || url.pathname
  if (!PAGINAS_PUBLICAS.includes(rota)) return null
  url.pathname = rota
  url.hash = ''
  return { ...evento, url: url.toString() }
}

export function iniciarAnalytics() {
  inject({ beforeSend: paginaPublica })
}
