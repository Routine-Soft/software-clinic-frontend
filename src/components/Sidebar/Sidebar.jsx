import { Link, NavLink } from 'react-router-dom'
import { useAuthContext } from '@/hooks/useAuthContext'
import ThemeToggle from '@/components/ThemeToggle/ThemeToggle'
import IdiomaToggle from '@/components/IdiomaToggle/IdiomaToggle'
import { Icone, IconeX } from '@/components/CrudCard/icones'
import { ROTULO_FUNCAO } from '@/modules/user/user.constants'
import { iniciais } from '@/utils/nome'
import Marca from './Marca'
import BotaoInstalar from './BotaoInstalar'
import { ICONES } from './menuIcones'
import { clinicaNoBrasil } from '@/i18n/paises'
import './Sidebar.css'
import { tr } from '@/i18n';

const TODOS = ['super_admin', 'admin', 'profissional', 'recepcao']

// soBrasil: só aparece para clínica do Brasil (ver clinicaNoBrasil).
// Os cadastros (profissionais, serviços, salas...) ficam no Painel Admin; o menu tem só o dia a dia.
const GRUPOS = [
    {
        titulo: tr('Principal'),
        itens: [
            { label: tr('Página inicial'), path: '/home', icone: 'inicio', roles: TODOS },
            { label: tr('Painel Admin'), path: '/dashboard-admin', icone: 'painel', roles: ['admin', 'recepcao'] },
            { label: tr('Sala de espera'), path: '/sala-de-espera', icone: 'tv', roles: ['admin', 'profissional', 'recepcao'] },
            { label: tr('Reuniões'), path: '/reunioes', icone: 'reunioes', roles: ['admin', 'recepcao'] },
        ],
    },
    {
        titulo: tr('Clínica'),
        itens: [
            { label: tr('Pacientes'), path: '/pacientes', icone: 'pacientes', roles: ['admin', 'profissional', 'recepcao'] },
            { label: tr('Prontuário'), path: '/prontuario', icone: 'prontuario', roles: ['admin', 'profissional'] },
            { label: tr('Anamneses'), path: '/anamneses', icone: 'anamnese', roles: ['admin', 'profissional', 'recepcao'] },
            { label: tr('Termos (TCLE)'), path: '/termos-consentimento', icone: 'termo', roles: ['admin', 'profissional', 'recepcao'] },
            { label: tr('Avaliações NR-01'), path: '/avaliacoes-nr01', icone: 'nr01', roles: ['admin', 'profissional'], soBrasil: true },
            { label: tr('Avaliação neuropsicológica'), path: '/avaliacoes-neuropsicologicas', icone: 'neuro', roles: ['admin', 'profissional'] },
            { label: tr('Repasses'), path: '/repasses', icone: 'receita', roles: ['admin'] },
            { label: tr('Usuários'), path: '/usuarios', icone: 'usuarios', roles: ['admin', 'recepcao'] },
            { label: tr('Meus repasses'), path: '/meus-repasses', icone: 'receita', roles: ['profissional'] },
        ],
    },
    {
        titulo: tr('Super Admin'),
        itens: [
            { label: tr('Painel Super Admin'), path: '/super-admin', icone: 'painel', roles: ['super_admin'] },
            { label: tr('Clínicas'), path: '/clinicas', icone: 'empresas', roles: ['super_admin'] },
            { label: tr('Planos'), path: '/planos', icone: 'planos', roles: ['super_admin'] },
            { label: tr('Afiliados'), path: '/afiliados-adm', icone: 'indicacao', roles: ['super_admin'] },
        ],
    },
    {
        titulo: tr('Afiliado'),
        itens: [
            // soAfiliado: aparece para quem ativou o programa, seja qual for o papel (recepção, profissional...).
            { label: tr('Painel do afiliado'), path: '/afiliado', icone: 'receita', roles: [], soAfiliado: true },
        ],
    },
    {
        titulo: tr('Conta'),
        itens: [
            { label: tr('Assinaturas'), path: '/assinaturas', icone: 'assinatura', roles: ['super_admin', 'admin', 'recepcao'] },
            { label: tr('Indique e ganhe'), path: '/indique', icone: 'indicacao', roles: ['admin'], soBrasil: true },
            { label: tr('Minha conta'), path: '/minha-conta', icone: 'usuarios', roles: [...TODOS, 'afiliado'] },
        ],
    },
]

export function Sidebar({ aberto = false, onFechar }) {
    const { user, hasRole, logout } = useAuthContext()

    async function handleLogout() {
        await logout()
    }

    const noBrasil = clinicaNoBrasil(user)
    const podeVer = (item) => (item.soAfiliado ? !!user?.afiliadoDesde : item.roles.some((role) => hasRole(role)))
    const grupos = GRUPOS
        .map((grupo) => ({ ...grupo, itens: grupo.itens.filter((item) => podeVer(item) && (noBrasil || !item.soBrasil)) }))
        .filter((grupo) => grupo.itens.length > 0)

    return (
        <aside id="menu-principal" className={`sidebar${aberto ? ' is-aberto' : ''}`} aria-label={tr('Menu principal')}>
            <div className="sidebar__topo">
                <Link to="/home" className="marca-link" aria-label={tr('Ir para o início')} onClick={onFechar}>
                    <Marca empresa={user?.nomeEmpresa} />
                </Link>
                <button type="button" className="icon-btn sidebar__fechar" aria-label={tr('Fechar menu')} onClick={onFechar}>
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
                <BotaoInstalar />

                <div className="sidebar__usuario">
                    <span className="sidebar__avatar" aria-hidden="true">{iniciais(user?.nomeCompleto)}</span>
                    <span className="sidebar__usuario-dados">
                        <strong>{user?.nomeCompleto}</strong>
                        <span>{ROTULO_FUNCAO[user?.role] ?? user?.role}</span>
                    </span>
                </div>

                <div className="sidebar__idioma">
                    <IdiomaToggle />
                </div>

                <div className="sidebar__acoes">
                    <ThemeToggle />
                    <button type="button" className="btn btn--ghost btn--sm sidebar__sair" onClick={handleLogout}>
                        <Icone>{ICONES.sair}</Icone>
                        {tr('Sair')}
                    </button>
                </div>
            </div>
        </aside>
    )
}

export default Sidebar
