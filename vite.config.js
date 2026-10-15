import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import { execFile } from 'node:child_process'

// No `npm run dev` o Vite não abre o index.html das pastas de public/ (manda tudo para o sistema).
// Este ajuste faz /blog/ e /blog/artigo abrirem as páginas geradas, como na Vercel, e gera o blog
// de novo sempre que um arquivo da pasta blog/ muda.
function blogNoDev() {
  return {
    name: 'blog-no-dev',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        const [caminho, busca] = req.url.split('?')
        if (/^\/blog(\/[^.]*)?$/.test(caminho)) {
          req.url = `${caminho.replace(/\/?$/, '/')}index.html${busca ? `?${busca}` : ''}`
        }
        next()
      })

      const pastaBlog = fileURLToPath(new URL('./blog', import.meta.url))
      server.watcher.add(pastaBlog)
      server.watcher.on('change', (arquivo) => {
        if (!arquivo.startsWith(pastaBlog)) return
        execFile('node', [fileURLToPath(new URL('./blog/gerar.mjs', import.meta.url))], (erro, saida) => {
          server.config.logger.info(erro ? `blog: erro ao gerar (${erro.message})` : saida.trim())
        })
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), blogNoDev()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
