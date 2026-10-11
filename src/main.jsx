import '@fontsource/dm-serif-display/latin-400.css'
import './styles/theme.css'
import './styles/ui.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { ThemeProvider } from '@/context/ThemeContext'
import { registrarApp } from '@/utils/instalarApp'
import { capturarCodigoIndicacao } from '@/modules/indicacao/indicacao.utils'

registrarApp()
capturarCodigoIndicacao()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
)
