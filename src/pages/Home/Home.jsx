import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthContext } from '@/hooks/useAuthContext'
import { useAgendas } from '@/modules/agenda/agenda.hooks'
import { paraISO, STATUS_AGENDA, ehDoUsuario } from '@/modules/agenda/agenda.utils'
import { usePacientes } from '@/modules/paciente/paciente.hooks'
import { useListaEspera } from '@/modules/lista-espera/lista-espera.hooks'
import { useProfissionais } from '@/modules/profissional/profissional.hooks'
import { useEmpresas } from '@/modules/empresa/empresa.hooks'
import { useTodosProntuarios, useAcessoProntuario } from '@/modules/prontuario/prontuario.hooks'
import { atendimentoEmAndamento } from '@/modules/prontuario/prontuario.utils'
import { getTotalEmAtendimento } from '@/modules/prontuario/prontuario.api'
import ProntuarioModal from '@/modules/prontuario/components/ProntuarioModal'
import AssinaturaStatus from '@/modules/assinatura/components/AssinaturaStatus'
import { Icone, IconeMais } from '@/components/CrudCard/icones'
import { ICONES } from '@/components/Sidebar/menuIcones'
import { iniciais } from '@/utils/nome'
import './Home.css'
import { localeAtual, tr } from '@/i18n';

const CLASSE_STATUS = { aguardando: 'badge--info', realizado: 'badge--success', cancelado: 'badge--danger' }

const ATALHOS = [
    { label: tr('Novo agendamento'), descricao: tr('Marcar uma consulta na agenda'), to: '/agenda', icone: 'agenda', roles: ['admin', 'profissional', 'recepcao'] },
    { label: tr('Pacientes'), descricao: tr('Cadastro e busca de pacientes'), to: '/pacientes', icone: 'pacientes', roles: ['admin', 'profissional', 'recepcao'] },
    { label: tr('Prontuário'), descricao: tr('Atendimentos e histórico clínico'), to: '/prontuario', icone: 'prontuario', roles: ['admin', 'profissional'] },
    { label: tr('Lista de espera'), descricao: tr('Fila de pacientes aguardando vaga'), to: '/lista-espera', icone: 'espera', roles: ['admin', 'profissional', 'recepcao'] },
    { label: tr('Avaliações NR-01'), descricao: tr('Riscos psicossociais das empresas'), to: '/avaliacoes-nr01', icone: 'nr01', roles: ['admin', 'profissional'] },
    { label: tr('Avaliação neuropsicológica'), descricao: tr('Anamnese, testes e laudo'), to: '/avaliacoes-neuropsicologicas', icone: 'neuro', roles: ['admin', 'profissional'] },
    { label: tr('Repasses'), descricao: tr('O que pagar a cada profissional'), to: '/repasses', icone: 'receita', roles: ['admin'] },
    { label: tr('Meus repasses'), descricao: tr('Quanto você tem a receber'), to: '/meus-repasses', icone: 'receita', roles: ['profissional'] },
    { label: tr('Usuários'), descricao: tr('Colaboradores e permissões da clínica'), to: '/usuarios', icone: 'usuarios', roles: ['admin', 'recepcao'] },
    { label: tr('Painel Super Admin'), descricao: tr('Total de clínicas e quem está pagando'), to: '/super-admin', icone: 'painel', roles: ['super_admin'] },
    { label: tr('Clínicas'), descricao: tr('Clínicas cadastradas na plataforma'), to: '/clinicas', icone: 'empresas', roles: ['super_admin'] },
    { label: tr('Planos'), descricao: tr('Planos de assinatura da plataforma'), to: '/planos', icone: 'planos', roles: ['super_admin'] },
    { label: tr('Minha conta'), descricao: tr('Seus dados e senha'), to: '/minha-conta', icone: 'usuarios', roles: ['super_admin', 'admin', 'profissional', 'recepcao'] },
]

function saudacao(hora) {
    if (hora < 12) return tr('Bom dia')
    if (hora < 18) return tr('Boa tarde')
    return tr('Boa noite')
}

function capitalizar(texto) {
    return texto.charAt(0).toUpperCase() + texto.slice(1)
}

// Números "sobem" até o valor final. Quem prefere menos movimento recebe o valor direto.
function useContagem(alvo, duracao = 700) {
    const [valor, setValor] = useState(0)

    useEffect(() => {
        if (alvo === null) return undefined

        if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
            const id = requestAnimationFrame(() => setValor(alvo))
            return () => cancelAnimationFrame(id)
        }

        let id
        const inicio = performance.now()
        const passo = (agora) => {
            const progresso = Math.min(1, (agora - inicio) / duracao)
            setValor(Math.round(alvo * (1 - (1 - progresso) ** 3)))
            if (progresso < 1) id = requestAnimationFrame(passo)
        }
        id = requestAnimationFrame(passo)
        return () => cancelAnimationFrame(id)
    }, [alvo, duracao])

    return valor
}

function Kpi({ icone, rotulo, valor, detalhe, tom = 'primary', to, indice }) {
    const exibido = useContagem(valor)
    const conteudo = (
        <>
            <span className="home-kpi__icone"><Icone>{ICONES[icone]}</Icone></span>
            <span className="home-kpi__rotulo">{rotulo}</span>
            {valor === null ? <span className="skeleton skeleton--line home-kpi__skeleton" /> : <strong className="home-kpi__valor">{exibido}</strong>}
            {detalhe && <span className="home-kpi__detalhe">{detalhe}</span>}
        </>
    )

    return to
        ? <Link to={to} className="card home-kpi" data-tom={tom} style={{ '--i': indice }}>{conteudo}</Link>
        : <div className="card home-kpi" data-tom={tom} style={{ '--i': indice }}>{conteudo}</div>
}

// Quem abre prontuários (profissional com login vinculado) vê os atendimentos que pode ler e vai até eles.
// Recepção e admin sem vínculo veem só a quantidade aberta na clínica, sem nenhum dado clínico.
function KpiEmAtendimentoDoUsuario({ indice, veTotalDaClinica }) {
    const { carregando, profissional } = useAcessoProntuario()
    if (carregando) return <Kpi icone="prontuario" rotulo={tr('Em atendimento')} valor={null} tom="success" indice={indice} />
    if (profissional) return <KpiEmAtendimento indice={indice} />
    return veTotalDaClinica ? <KpiEmAtendimentoDaClinica indice={indice} /> : null
}

function KpiEmAtendimentoDaClinica({ indice }) {
    const [total, setTotal] = useState(null)

    useEffect(() => {
        let ignore = false
        getTotalEmAtendimento()
            .then((response) => { if (!ignore) setTotal(response.data.total) })
            .catch(() => { if (!ignore) setTotal(0) })
        return () => { ignore = true }
    }, [])

    return <Kpi icone="prontuario" rotulo={tr('Em atendimento')} valor={total} detalhe={total === 1 ? tr('atendimento aberto agora') : tr('atendimentos abertos agora')} tom="success" indice={indice} />
}

// Cancelamentos das consultas marcadas para este mês; o card abre a agenda só com os cancelados.
function KpiCancelados({ agora, indice, filtrar }) {
    const inicio = paraISO(new Date(agora.getFullYear(), agora.getMonth(), 1))
    const fim = paraISO(new Date(agora.getFullYear(), agora.getMonth() + 1, 0))
    const { agendas, loading } = useAgendas({ dataInicio: inicio, dataFim: fim })
    const total = filtrar(agendas).filter((a) => a.status === 'cancelado').length
    return <Kpi icone="cancelado" rotulo={tr('Agendamentos cancelados')} valor={loading ? null : total} detalhe={tr('neste mês')} tom="danger" to="/agenda?status=cancelado" indice={indice} />
}

function KpiEmAtendimento({ indice }) {
    const { prontuarios, loading } = useTodosProntuarios()
    const total = useMemo(() => prontuarios.filter(atendimentoEmAndamento).length, [prontuarios])
    return <Kpi icone="prontuario" rotulo={tr('Em atendimento')} valor={loading ? null : total} detalhe={total === 1 ? tr('atendimento aberto agora') : tr('atendimentos abertos agora')} tom="success" to="/prontuario" indice={indice} />
}

function AgendaDeHoje({ agendas, loading, agora, clinico, onAbrir }) {
    const hhmm = `${String(agora.getHours()).padStart(2, '0')}:${String(agora.getMinutes()).padStart(2, '0')}`

    return (
        <section className="card home-agenda">
            <header className="home-card__topo">
                <div>
                    <h3>{tr('Agenda de hoje')}</h3>
                    <p>{tr('Clique em uma pessoa para {p0}', { p0: clinico ? tr('abrir o prontuário') : tr('ver os detalhes') })}</p>
                </div>
                <Link to="/agenda" className="btn btn--ghost btn--sm">{tr('Abrir agenda')}</Link>
            </header>

            {loading ? (
                <ul className="home-agenda__lista" aria-busy="true">
                    {[0, 1, 2].map((i) => (
                        <li key={i} className="home-agenda__item"><div className="skeleton skeleton--line" style={{ width: `${80 - i * 15}%` }} /></li>
                    ))}
                </ul>
            ) : agendas.length === 0 ? (
                <div className="home-vazio">
                    <Icone>{ICONES.agenda}</Icone>
                    <p>{tr('Nenhum agendamento para hoje.')}</p>
                    <Link to="/agenda" className="btn btn--primary btn--sm"><IconeMais />{tr('Agendar')}</Link>
                </div>
            ) : (
                <ul className="home-agenda__lista">
                    {agendas.map((agenda, index) => {
                        const cancelado = agenda.status === 'cancelado'
                        const agoraMesmo = !cancelado && agenda.horaInicio <= hhmm && hhmm < agenda.horaFim
                        const passou = !cancelado && agenda.horaFim <= hhmm
                        return (
                            <li key={agenda._id} style={{ '--i': index }}>
                                <button
                                    type="button"
                                    className={`home-agenda__item${cancelado ? ' is-cancelado' : ''}${passou ? ' is-passou' : ''}${agoraMesmo ? ' is-agora' : ''}`}
                                    onClick={() => onAbrir(agenda)}
                                >
                                    <span className="home-agenda__hora">
                                        <strong>{agenda.horaInicio}</strong>
                                        <span>{agenda.horaFim}</span>
                                    </span>
                                    <span className="home-agenda__avatar" aria-hidden="true">{iniciais(agenda.pacienteId?.nome)}</span>
                                    <span className="home-agenda__dados">
                                        <strong>{agenda.pacienteId?.nome ?? tr('Paciente')}</strong>
                                        <span>{[agenda.profissionalId?.nome, agenda.servicoId?.nome].filter(Boolean).join(' · ')}</span>
                                    </span>
                                    {agoraMesmo
                                        ? <span className="badge badge--live badge--success">{tr('Agora')}</span>
                                        : <span className={`badge ${CLASSE_STATUS[agenda.status] ?? ''}`}>{STATUS_AGENDA[agenda.status] ?? agenda.status}</span>}
                                </button>
                            </li>
                        )
                    })}
                </ul>
            )}
        </section>
    )
}

function Atalhos({ hasRole }) {
    const itens = ATALHOS.filter((atalho) => atalho.roles.some((role) => hasRole(role)))

    return (
        <section className="card home-atalhos">
            <header className="home-card__topo">
                <div>
                    <h3>{tr('Atalhos')}</h3>
                    <p>{tr('Vá direto ao que você mais usa')}</p>
                </div>
            </header>
            <ul>
                {itens.map((atalho) => (
                    <li key={atalho.to}>
                        <Link to={atalho.to} className="home-atalho">
                            <span className="home-atalho__icone"><Icone>{ICONES[atalho.icone]}</Icone></span>
                            <span className="home-atalho__textos">
                                <strong>{atalho.label}</strong>
                                <span>{atalho.descricao}</span>
                            </span>
                        </Link>
                    </li>
                ))}
            </ul>
        </section>
    )
}

function PainelDaClinica({ agora, clinico, admin, recepcao, hasRole, user }) {
    const hoje = paraISO(agora)
    const hhmm = `${String(agora.getHours()).padStart(2, '0')}:${String(agora.getMinutes()).padStart(2, '0')}`
    // O profissional vê só a própria agenda; admin e recepção veem a da clínica toda.
    const soOsMeus = user?.role === 'profissional'
    const filtrar = (lista) => (soOsMeus ? lista.filter((a) => ehDoUsuario(a, user)) : lista)
    const { agendas: agendasDaClinica, loading: carregandoAgenda } = useAgendas({ dataInicio: hoje, dataFim: hoje })
    const agendas = filtrar(agendasDaClinica)
    const { itens: fila, loading: carregandoFila } = useListaEspera({ status: 'aguardando' })
    const { pacientes, loading: carregandoPacientes } = usePacientes()
    const { profissionais, loading: carregandoProfissionais } = useProfissionais()
    const { empresas, loading: carregandoEmpresas } = useEmpresas()
    const [agendaDetalhes, setAgendaDetalhes] = useState(null)

    const ativas = agendas.filter((a) => a.status !== 'cancelado')
    const restantes = ativas.filter((a) => a.horaFim > hhmm).length
    const realizados = ativas.filter((a) => a.status === 'realizado').length

    return (
        <>
            <div className="home-kpis">
                <Kpi
                    icone="agenda"
                    rotulo={tr('Agendamentos hoje')}
                    valor={carregandoAgenda ? null : ativas.length}
                    detalhe={ativas.length === 0 ? tr('nada marcado') : tr('{restantes} ainda por vir{p0}', { restantes, p0: realizados ? tr(' · {realizados} realizado{p0}', { realizados, p0: realizados > 1 ? 's' : '' }) : '' })}
                    to="/agenda"
                    indice={0}
                />
                <Kpi icone="espera" rotulo={tr('Na lista de espera')} valor={carregandoFila ? null : fila.length} detalhe={tr('aguardando vaga')} tom="warning" to="/lista-espera" indice={1} />
                <Kpi icone="pacientes" rotulo={tr('Pacientes')} valor={carregandoPacientes ? null : pacientes.length} detalhe={tr('cadastrados')} tom="info" to="/pacientes" indice={2} />
                <KpiEmAtendimentoDoUsuario indice={3} veTotalDaClinica={admin || recepcao} />
                <KpiCancelados agora={agora} indice={4} filtrar={filtrar} />
                <Kpi
                    icone="profissionais"
                    rotulo={tr('Profissionais')}
                    valor={carregandoProfissionais ? null : profissionais.length}
                    detalhe={profissionais.length === 1 ? tr('na equipe') : tr('na equipe de atendimento')}
                    tom="success"
                    to={admin ? '/profissionais' : undefined}
                    indice={5}
                />
                <Kpi
                    icone="empresas"
                    rotulo={tr('Empresas')}
                    valor={carregandoEmpresas ? null : empresas.length}
                    detalhe={empresas.length === 1 ? tr('empresa cliente') : tr('empresas clientes')}
                    tom="warning"
                    to={admin ? '/empresas' : undefined}
                    indice={6}
                />
            </div>

            <div className="home-grid">
                <AgendaDeHoje agendas={agendas} loading={carregandoAgenda} agora={agora} clinico={clinico} onAbrir={setAgendaDetalhes} />

                <div className="home-lateral">
                    {admin && <AssinaturaStatus className="home-assinatura" />}
                    <Atalhos hasRole={hasRole} />
                </div>
            </div>

            {agendaDetalhes && (
                <ProntuarioModal
                    paciente={agendaDetalhes.pacienteId}
                    agendamento={agendaDetalhes}
                    somenteAgendamento={!clinico}
                    onClose={() => setAgendaDetalhes(null)}
                />
            )}
        </>
    )
}

export function Home() {
    const { user, hasRole } = useAuthContext()
    const [agora] = useState(() => new Date())

    const admin = hasRole('admin')
    const clinico = admin || hasRole('profissional')
    const recepcao = hasRole('recepcao')
    const daClinica = clinico || recepcao
    const primeiroNome = user?.nomeCompleto?.split(' ')[0] ?? ''

    return (
        <div className="page home">
            <header className="home-hero">
                <div>
                    <p className="home-hero__data">{capitalizar(agora.toLocaleDateString(localeAtual(), { weekday: 'long', day: 'numeric', month: 'long' }))}</p>
                    <h2 className="page-title">{saudacao(agora.getHours())}, {primeiroNome}!</h2>
                    <p className="page-subtitle">{daClinica ? (user?.nomeEmpresa ? tr('Resumo de hoje em {nomeEmpresa}', { nomeEmpresa: user.nomeEmpresa }) : tr('Resumo de hoje')) : tr('Painel de administração da plataforma')}</p>
                </div>
                {daClinica && (
                    <Link to="/agenda" className="btn btn--primary">
                        <IconeMais />
                        {tr('Novo agendamento')}
                    </Link>
                )}
            </header>

            {daClinica ? (
                <PainelDaClinica agora={agora} clinico={clinico} admin={admin} recepcao={recepcao} hasRole={hasRole} user={user} />
            ) : (
                <div className="home-grid home-grid--unico">
                    <Atalhos hasRole={hasRole} />
                </div>
            )}
        </div>
    )
}

export default Home
