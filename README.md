# Sonelia — Frontend (website + web app)

Website and web app for **Sonelia**, a multi-tenant SaaS for health clinics (psychology, physiotherapy, speech therapy, aesthetics, medical and more). It includes the public landing page, the blog, the legal pages and the clinic management system.

> The project was formerly called **Software Clinic**. The repository and folder names (`softwareclinic-frontend`) were kept.

![React](https://img.shields.io/badge/react-19-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/vite-8-646CFF?logo=vite&logoColor=white)
![Vercel](https://img.shields.io/badge/deploy-vercel-000000?logo=vercel)
![License](https://img.shields.io/badge/license-private-lightgrey)

## Demo

- **Website and app:** https://sonelia.com.br
- **Blog:** https://sonelia.com.br/blog/
- **API:** https://api.sonelia.com.br/api (backend in [`softwareclinic-backend`](../softwareclinic-backend))

## Features

- **Landing page** and **landing pages by specialty** (psychology, psychiatry, physiotherapy, speech therapy, aesthetics, medical clinics).
- **Static blog** generated at build time, plus terms of use, privacy policy and data deletion pages.
- **Login and sign-up** with email/password or Google, password recovery and a "My account" page.
- **Dashboard** for the clinic owner, front desk and health professionals, with a menu that adapts to each role.
- **Scheduling:** calendar, appointments, rooms, services, health plans, waiting list and meetings.
- **Patients:** patient record with the "patient journey" history and the confidential medical record (only for the patient's health professional).
- **Clinical forms:** anamnesis, neuropsychological assessment, NR-01 assessment and informed consent forms (TCLE).
- **Finance:** payments, session packages and professional payouts.
- **Subscription:** plans, checkout (Mercado Pago or Stripe), referral program and affiliate area.
- **Waiting room and TV panel** for calling patients.
- **Super admin panel** with all subscribing clinics.
- **Three languages:** Portuguese, English and Spanish, with a country selector.
- **Four theme options:** light, pink, dark and "follow the system".
- **Installable as an app (PWA)**, mobile first.

## Tech stack

| Area | Technology |
|---|---|
| UI | React 19 |
| Build | Vite 8 |
| Routing | React Router 7 (`HashRouter`) |
| Styles | Plain CSS with design tokens (`theme.css`, `ui.css`) |
| HTTP | Native `fetch` through a single `httpClient` |
| Analytics | Vercel Analytics |
| Quality | ESLint 10 (React Hooks + React Refresh rules) |
| Hosting | Vercel |

## Prerequisites

- **Node.js** (version in `.nvmrc`; with nvm, run `nvm use`)
- **npm**
- The backend running locally, or the URL of a test API

## Installation

```bash
git clone <repository-url> softwareclinic-frontend
cd softwareclinic-frontend
nvm use
npm install
```

Create a `.env.local` file (see the next section) and start the dev server:

```bash
npm run dev
```

The app opens at `http://localhost:5173`.

## Configuration (environment variables)

Only public values go here: everything starting with `VITE_` ends up in the browser bundle. Never put secrets in the frontend.

| Variable | Required | Description |
|---|---|---|
| `VITE_API_URL` | Yes | API base URL, including `/api` (default `http://localhost:8080/api`) |
| `VITE_GOOGLE_CLIENT_ID` | No | Google sign-in client ID |

Example (`.env.local`):

```env
VITE_API_URL=http://localhost:8081/api
VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

## Usage

| Command | Description |
|---|---|
| `npm run dev` | Generates the blog and starts the Vite dev server (the blog is regenerated when files in `blog/` change) |
| `npm run build` | Generates the blog and builds the production bundle in `dist/` |
| `npm run preview` | Serves the production build locally |
| `npm run blog` | Generates only the blog and the static pages |
| `npm run lint` | Runs ESLint |

Quick check before pushing:

```bash
npx eslint src
npx vite build
```

## Folder structure

```
softwareclinic-frontend/
├── blog/                 # Static blog generator (articles, templates, specialty pages)
├── public/               # Static files, generated pages, PWA manifest, service worker, sitemap
└── src/
    ├── App.jsx           # Routes (HashRouter)
    ├── components/       # Shared components (Sidebar, Modal, CrudCard, CampoSenha, ThemeToggle...)
    ├── context/          # Auth and theme contexts
    ├── hooks/            # useApi, useAuth, useTheme
    ├── i18n/             # Translations (pt, en, es) and country rules
    ├── layouts/          # Main layout with the sidebar
    ├── modules/
    │   └── <entity>/     # Same names as the backend modules
    │       ├── <entity>.api.js
    │       ├── <entity>.hooks.js
    │       ├── <entity>.utils.js
    │       └── components/
    ├── pages/            # Landing, Home, DashboardAdmin, PainelSuperAdmin, Afiliados, Termos
    ├── services/         # httpClient (fetch, tokens, language header)
    ├── styles/           # theme.css (tokens for each theme) and ui.css (base components)
    └── utils/
```

## Deployment

- Hosted on **Vercel**. Every push to `main` publishes automatically to https://sonelia.com.br.
- Set `VITE_API_URL` (and `VITE_GOOGLE_CLIENT_ID`) in the Vercel project settings.
- When a change touches both projects, deploy the **backend first**, then push the frontend.

## Contributing

1. Create a branch from `main`: `feature/<name>` (or `fix/<name>`).
2. Every screen text goes through `tr('Portuguese text')` from `@/i18n` and needs its English and Spanish translations in `src/i18n/en/` and `src/i18n/es/`.
3. Every color comes from a token, and every screen must work in all themes and on mobile (no horizontal scroll).
4. Use `fetch` through `httpClient` (no axios). `.jsx` files export only components.
5. Run `npx eslint src` and `npx vite build` before opening a pull request.
6. Write commit messages in Portuguese and open a pull request to `main`.

## License and author

**Private and proprietary.** All rights reserved. Copying, distribution or use without authorization is not allowed.

Developed by **Stanley Andrade**.
