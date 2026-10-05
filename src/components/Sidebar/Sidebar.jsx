import { Link, NavLink } from 'react-router-dom'
import { useAuthContext } from '@/hooks/useAuthContext'
import ThemeToggle from '@/components/ThemeToggle/ThemeToggle'
import { Icone, IconeX } from '@/components/CrudCard/icones'
import { ROTULO_FUNCAO } from '@/modules/user/user.constants'
import { iniciais } from '@/utils/nome'
import Marca from './Marca'
import { ICONES } from './menuIcones'
import './Sidebar.css'

const TODOS = ['super_admin', 'admin', 'profissional', 'recepcao']

// Os cadastros (profissionais, serviços, salas...) ficam no Dashboard admin; o menu tem só o dia a dia.
const GRUPOS = [
    {
        titulo: 'Principal',
        itens: [
            { label: 'Início', path: '/home', icone: 'inicio', roles: TODOS },
            { label: 'Dashboard admin', path: '/dashboard-admin', icone: 'painel', roles: ['admin', 'recepcao'] },
            { label: 'Agenda', path: '/agenda', icone: 'agenda', roles: ['admin', 'profissional', 'recepcao'] },
        ],
    },
    {
        titulo: 'Clínica',
        itens: [
            { label: 'Pacientes', path: '/pacientes', icone: 'pacientes', roles: ['admin', 'profissional', 'recepcao'] },
            { label: 'Prontuário', path: '/prontuario', icone: 'prontuario', roles: ['admin', 'profissional'] },
            { label: 'Avaliações NR-01', path: '/avaliacoes-nr01', icone: 'nr01', roles: ['admin', 'profissional'] },
            { label: 'Avaliação neuropsicológica', path: '/avaliacoes-neuropsicologicas', icone: 'neuro', roles: ['admin', 'profissional'] },
            { label: 'Repasses', path: '/repasses', icone: 'receita', roles: ['admin'] },
            { label: 'Usuários', path: '/usuarios', icone: 'usuarios', roles: ['admin', 'recepcao'] },
            { label: 'Meus repasses', path: '/meus-repasses', icone: 'receita', roles: ['profissional'] },
        ],
    },
    {
        titulo: 'Super Admin',
        itens: [
            { label: 'Painel Super Admin', path: '/super-admin', icone: 'painel', roles: ['super_admin'] },
            { label: 'Clínicas', path: '/clinicas', icone: 'empresas', roles: ['super_admin'] },
            { label: 'Planos', path: '/planos', icone: 'planos', roles: ['super_admin'] },
        ],
    },
    {
        titulo: 'Conta',
        itens: [
            { label: 'Assinaturas', path: '/assinaturas', icone: 'assinatura', roles: ['super_admin', 'admin', 'recepcao'] },
            { label: 'Minha conta', path: '/minha-conta', icone: 'usuarios', roles: TODOS },
        ],
    },
]

export function Sidebar({ aberto = false, onFechar }) {
    const { user, hasRole, logout } = useAuthContext()

    async function handleLogout() {
        await logout()
    }

    const grupos = GRUPOS
        .map((grupo) => ({ ...grupo, itens: grupo.itens.filter((item) => item.roles.some((role) => hasRole(role))) }))
        .filter((grupo) => grupo.itens.length > 0)

    return (
        <aside id="menu-principal" className={`sidebar${aberto ? ' is-aberto' : ''}`} aria-label="Menu principal">
            <div className="sidebar__topo">
                <Link to="/home" className="marca-link" aria-label="Ir para o início" onClick={onFechar}>
                    <Marca empresa={user?.nomeEmpresa} />
                </Link>
                <button type="button" className="icon-btn sidebar__fechar" aria-label="Fechar menu" onClick={onFechar}>
                    <IconeX />
                </button>
            </div>

            <nav className="sidebar__nav">
                {grupos.map((grupo) => (
                    <div className="sidebar__grupo" key={grupo.titulo}>
                        <span className="sidebar__titulo">{grupo.titulo}</span>
                        <ul>
                            {grupo.itens.map((item) => (
                                <li key={item.path}>
                                    <NavLink to={item.path} className="sidebar__link" onClick={onFechar}>
                                        <Icone>{ICONES[item.icone]}</Icone>
                                        <span>{item.label}</span>
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </nav>

            <div className="sidebar__rodape">
                <div className="sidebar__usuario">
                    <span className="sidebar__avatar" aria-hidden="true">{iniciais(user?.nomeCompleto)}</span>
                    <span className="sidebar__usuario-dados">
                        <strong>{user?.nomeCompleto}</strong>
                        <span>{ROTULO_FUNCAO[user?.role] ?? user?.role}</span>
                    </span>
                </div>

                <div className="sidebar__acoes">
                    <ThemeToggle />
                    <button type="button" className="btn btn--ghost btn--sm sidebar__sair" onClick={handleLogout}>
                        <Icone>{ICONES.sair}</Icone>
                        Sair
                    </button>
                </div>
            </div>
        </aside>
    )
}

export default Sidebar
