# Sonelia: frontend (site + sistema)

O mapa completo do projeto e as skills do Sonelia ficam no repositório irmão: **`../softwareclinic-backend/CLAUDE.md`** e **`../softwareclinic-backend/.claude/skills/`** (traduções, sigilo, pagamentos, WhatsApp). Leia de lá quando a tarefa precisar.

- React 19 + Vite, HashRouter, CSS puro. Visual: skill global `ui-web`.
- Produção: `https://sonelia.com.br` (Vercel; push na `main` publica). API em `https://api.sonelia.com.br`; local `VITE_API_URL=http://localhost:8081/api`.
- Todo texto de tela passa por `tr('texto em português')` de `@/i18n` e precisa da tradução em `src/i18n/en/*.js` (ver skill `sonelia-traducoes`).
- Checagem rápida: `npx eslint src` e `npx vite build`.
