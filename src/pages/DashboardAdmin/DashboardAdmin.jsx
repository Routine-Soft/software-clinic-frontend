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
import { tr } from '@/i18n';

// Na ordem em que a clínica precisa cadastrar: o profissional exige especialidade (e usa o login do usuário);
// o serviço tem preço e repasse por convênio; o agendamento exige profissional, serviço e sala;
// o paciente pode usar convênio e empresa.
const PASSOS = [
    { chave: 'especialidades', titulo: tr('Especialidades'), Card: EspecialidadeADM },
    { chave: 'usuarios', titulo: tr('Usuários'), opcional: true, Card: UsuariosClinicaCard },
    { chave: 'profissionais', titulo: tr('Profissionais'), Card: ProfissionalADM },
    { chave: 'convenios', titulo: tr('Convênios'), Card: ConvenioADM },
    { chave: 'servicos', titulo: tr('Serviços'), Card: ServicoADM },
    { chave: 'salas', titulo: tr('Salas'), Card: SalaADM },
    { chave: 'empresas', titulo: tr('Empresas'), opcional: true, Card: EmpresaADM },
    { chave: 'pacientes', titulo: tr('Pacientes'), Card: PacienteCard },
]

function Passo({ numero, chave, Card }) {
    return (
        <div className="dash-admin__passo" id={`passo-${chave}`} data-passo={numero}>
            <Card />
        </div>
    )
}

// Trilha dos 8 passos, como uma jornada: cada parada leva ao card correspondente e o destaca por um instante.
function Jornada() {
    function irPara(chave) {
        const card = document.getElementById(`passo-${chave}`)
        if (!card) return
        const reduzir = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
        card.scrollIntoView({ behavior: reduzir ? 'auto' : 'smooth', block: 'center' })
        card.classList.remove('is-destaque')
        void card.offsetWidth
        card.classList.add('is-destaque')
    }

    return (
        <section className="card dash-jornada" aria-labelledby="dash-jornada-titulo">
            <div className="dash-jornada__textos">
                <h3 id="dash-jornada-titulo">{tr('Para a sua clínica começar a funcionar')}</h3>
                <p>{tr('Siga este passo a passo antes de começar a trabalhar: alguns cadastros dependem dos anteriores. Toque em um passo para ir até ele.')}</p>
            </div>
            <ol className="dash-jornada__trilha" lang="pt-BR">
                {PASSOS.map(({ chave, titulo, opcional }, i) => (
                    <li key={chave} style={{ '--i': i }}>
                        <button type="button" className="dash-jornada__parada" onClick={() => irPara(chave)}>
                            <span className="dash-jornada__numero">{i + 1}</span>
                            <span className="dash-jornada__nome">{titulo}</span>
                            {opcional && <span className="dash-jornada__opcional">{tr('opcional')}</span>}
                        </button>
                    </li>
                ))}
            </ol>
        </section>
    )
}

export function DashboardAdmin() {
    const { user } = useAuthContext()
    const metade = Math.ceil(PASSOS.length / 2)

    return (
        <div className="page dash-admin">
            <header className="page-header">
                <div>
                    <h2 className="page-title">{tr('Painel Admin')}</h2>
                    <p className="page-subtitle">
                        {user?.nomeEmpresa ? tr('Cadastros e estrutura de {nomeEmpresa}', { nomeEmpresa: user.nomeEmpresa }) : tr('Cadastros e estrutura da clínica')}
                    </p>
                </div>
            </header>

            <Jornada />

            <div className="dash-admin__colunas">
                {[PASSOS.slice(0, metade), PASSOS.slice(metade)].map((coluna, indiceColuna) => (
                    <div className="dash-admin__coluna" key={indiceColuna}>
                        {coluna.map(({ chave, Card }, i) => (
                            <Passo key={chave} chave={chave} numero={indiceColuna * metade + i + 1} Card={Card} />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default DashboardAdmin
