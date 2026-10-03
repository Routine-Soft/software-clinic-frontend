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

// Na ordem em que a clínica precisa cadastrar: o profissional exige especialidade (e usa o login do usuário);
// o serviço tem preço e repasse por convênio; o agendamento exige profissional, serviço e sala;
// o paciente pode usar convênio e empresa.
const PASSOS = [
    { chave: 'especialidades', Card: EspecialidadeADM },
    { chave: 'usuarios', Card: UsuariosClinicaCard },
    { chave: 'profissionais', Card: ProfissionalADM },
    { chave: 'convenios', Card: ConvenioADM },
    { chave: 'servicos', Card: ServicoADM },
    { chave: 'salas', Card: SalaADM },
    { chave: 'empresas', Card: EmpresaADM },
    { chave: 'pacientes', Card: PacienteCard },
]

function Passo({ numero, Card }) {
    return (
        <div className="dash-admin__passo" data-passo={numero}>
            <Card />
        </div>
    )
}

export function DashboardAdmin() {
    const { user } = useAuthContext()
    const metade = Math.ceil(PASSOS.length / 2)

    return (
        <div className="page dash-admin">
            <header className="page-header">
                <div>
                    <h2 className="page-title">Dashboard do administrador</h2>
                    <p className="page-subtitle">
                        {user?.nomeEmpresa ? `Cadastros e estrutura de ${user.nomeEmpresa}` : 'Cadastros e estrutura da clínica'}
                        {' · '}siga a ordem dos números: alguns cadastros dependem dos anteriores
                    </p>
                </div>
            </header>

            <div className="dash-admin__colunas">
                {[PASSOS.slice(0, metade), PASSOS.slice(metade)].map((coluna, indiceColuna) => (
                    <div className="dash-admin__coluna" key={indiceColuna}>
                        {coluna.map(({ chave, Card }, i) => (
                            <Passo key={chave} numero={indiceColuna * metade + i + 1} Card={Card} />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default DashboardAdmin
