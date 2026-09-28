import { useAuthContext } from '@/hooks/useAuthContext'
import ProfissionalADM from '@/modules/profissional/components/ProfissionalADM'
import PacienteCard from '@/modules/paciente/components/PacienteCard'
import EmpresaADM from '@/modules/empresa/components/EmpresaADM'
import ServicoADM from '@/modules/servico/components/ServicoADM'
import SalaADM from '@/modules/sala/components/SalaADM'
import EspecialidadeADM from '@/modules/especialidade/components/EspecialidadeADM'
import ConvenioADM from '@/modules/convenio/components/ConvenioADM'
import UsuariosClinicaCard from '@/modules/user/components/UsuariosClinicaCard'
import './DashboardAdmin.css'

// Dashboard do administrador: reúne os cadastros da clínica em cartões.
// Esquerda: pessoas, clientes e convênios. Direita: a estrutura do atendimento (serviços, salas, especialidades) e quem acessa o sistema.
export function DashboardAdmin() {
    const { user } = useAuthContext()

    return (
        <div className="page dash-admin">
            <header className="page-header">
                <div>
                    <h2 className="page-title">Dashboard do administrador</h2>
                    <p className="page-subtitle">
                        {user?.nomeEmpresa ? `Cadastros e estrutura de ${user.nomeEmpresa}` : 'Cadastros e estrutura da clínica'}
                    </p>
                </div>
            </header>

            <div className="dash-admin__colunas">
                <div className="dash-admin__coluna">
                    <ProfissionalADM />
                    <PacienteCard />
                    <EmpresaADM />
                    <ConvenioADM />
                </div>

                <div className="dash-admin__coluna">
                    <ServicoADM />
                    <SalaADM />
                    <EspecialidadeADM />
                    <UsuariosClinicaCard />
                </div>
            </div>
        </div>
    )
}

export default DashboardAdmin
