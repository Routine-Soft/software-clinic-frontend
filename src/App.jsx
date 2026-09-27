import User from './modules/user/components/User';
import RegistroClinica from './modules/user/components/RegistroClinica';
import UsuariosClinicaADM from './modules/user/components/UsuariosClinicaADM';
import MinhaConta from './modules/user/components/MinhaConta';
import Home from './pages/Home/Home';
import PacienteADM from './modules/paciente/components/PacienteADM';
import ProfissionalADM from './modules/profissional/components/ProfissionalADM';
import SalaADM from './modules/sala/components/SalaADM';
import EspecialidadeADM from './modules/especialidade/components/EspecialidadeADM';
import ConvenioADM from './modules/convenio/components/ConvenioADM';
import EmpresaADM from './modules/empresa/components/EmpresaADM';
import AvaliacaoNr01ADM from './modules/avaliacao-nr01/components/AvaliacaoNr01ADM';
import ServicoADM from './modules/servico/components/ServicoADM';
import AgendaCalendario from './modules/agenda/components/AgendaCalendario';
import ProntuarioADM from './modules/prontuario/components/ProntuarioADM';
import ProntuarioPacientePage from './modules/prontuario/components/ProntuarioPacientePage';
import ProntuarioModalPreview from './modules/prontuario/components/ProntuarioModalPreview';
import ListaEsperaADM from './modules/lista-espera/components/ListaEsperaADM';
import PlanoADM from './modules/plano/components/PlanoADM';
import AssinaturaStatus from './modules/assinatura/components/AssinaturaStatus';
import AssinaturaRetorno from './modules/assinatura/components/AssinaturaRetorno';
import AssinaturasPlanos from './modules/assinatura/components/AssinaturasPlanos';
import PacienteCard from './modules/paciente/components/PacienteCard';
import DashboardAdmin from './pages/DashboardAdmin/DashboardAdmin';




import MainLayout from '@/layouts/MainLayout'
import { AuthProvider } from '@/context/AuthContext'
import ProtectedRoute from '@/components/ProtectedRoute'
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<User />} />
          <Route path="/registro" element={<RegistroClinica />} />

          <Route
            path="/dashboard-admin"
            element={
              <ProtectedRoute requiredRoles={['super_admin', 'admin']}>
                <MainLayout>
                  <DashboardAdmin />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Home />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/pacientes"
            element={
              <ProtectedRoute requiredRoles={['admin', 'profissional', 'recepcao', 'super_admin']}>
                <MainLayout>
                  <PacienteADM />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/paciente-card"
            element={
              <ProtectedRoute requiredRoles={['admin', 'profissional', 'recepcao', 'super_admin']}>
                <MainLayout>
                  <div className="page page--narrow">
                    <PacienteCard />
                  </div>
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/profissionais"
            element={
              <ProtectedRoute requiredRoles={['admin', 'super_admin']}>
                <MainLayout>
                  <div className="page page--narrow">
                    <ProfissionalADM />
                  </div>
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/salas"
            element={
              <ProtectedRoute requiredRoles={['admin', 'super_admin']}>
                <MainLayout>
                  <div className="page page--narrow">
                    <SalaADM />
                  </div>
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/especialidades"
            element={
              <ProtectedRoute requiredRoles={['admin', 'super_admin']}>
                <MainLayout>
                  <div className="page page--narrow">
                    <EspecialidadeADM />
                  </div>
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/convenios"
            element={
              <ProtectedRoute requiredRoles={['admin', 'super_admin']}>
                <MainLayout>
                  <div className="page page--narrow">
                    <ConvenioADM />
                  </div>
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/empresas"
            element={
              <ProtectedRoute requiredRoles={['admin', 'super_admin']}>
                <MainLayout>
                  <div className="page page--narrow">
                    <EmpresaADM />
                  </div>
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/avaliacoes-nr01"
            element={
              <ProtectedRoute requiredRoles={['admin', 'profissional', 'super_admin']}>
                <MainLayout>
                  <AvaliacaoNr01ADM />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/servicos"
            element={
              <ProtectedRoute requiredRoles={['admin', 'super_admin']}>
                <MainLayout>
                  <div className="page page--narrow">
                    <ServicoADM />
                  </div>
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/agenda"
            element={
              <ProtectedRoute requiredRoles={['admin', 'profissional', 'recepcao', 'super_admin']}>
                <MainLayout>
                  <AgendaCalendario />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/prontuario"
            element={
              <ProtectedRoute requiredRoles={['admin', 'profissional', 'super_admin']}>
                <MainLayout>
                  <ProntuarioADM />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/prontuario-modal"
            element={
              <ProtectedRoute requiredRoles={['admin', 'profissional', 'super_admin']}>
                <MainLayout>
                  <ProntuarioModalPreview />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/prontuario/:pacienteId"
            element={
              <ProtectedRoute requiredRoles={['admin', 'profissional', 'super_admin']}>
                <MainLayout>
                  <ProntuarioPacientePage />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/lista-espera"
            element={
              <ProtectedRoute requiredRoles={['admin', 'profissional', 'recepcao', 'super_admin']}>
                <MainLayout>
                  <div className="page page--narrow">
                    <ListaEsperaADM />
                  </div>
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/usuarios"
            element={
              <ProtectedRoute requiredRoles={['admin', 'super_admin']}>
                <MainLayout>
                  <UsuariosClinicaADM />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/minha-conta"
            element={
              <ProtectedRoute requiredRoles={['admin', 'profissional', 'recepcao', 'super_admin']}>
                <MainLayout>
                  <MinhaConta />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/planos"
            element={
              <ProtectedRoute requiredRoles={['super_admin']}>
                <MainLayout>
                  <PlanoADM />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/assinatura/retorno"
            element={
              <ProtectedRoute requiredRoles={['admin', 'super_admin']}>
                <MainLayout>
                  <AssinaturaRetorno />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/assinaturas"
            element={
              <ProtectedRoute requiredRoles={['super_admin', 'admin', 'recepcao']}>
                <MainLayout>
                  <AssinaturasPlanos />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/assinatura"
            element={
              <ProtectedRoute requiredRoles={['admin', 'super_admin']}>
                <MainLayout>
                  <div className="page">
                    <AssinaturaStatus />
                  </div>
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App