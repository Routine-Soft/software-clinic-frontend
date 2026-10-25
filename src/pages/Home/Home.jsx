import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuthContext } from '@/hooks/useAuthContext'
import { useAgendas } from '@/modules/agenda/agenda.hooks'
import { paraISO, ehDoUsuario } from '@/modules/agenda/agenda.utils'
import AgendaCalendario from '@/modules/agenda/components/AgendaCalendario'
import { usePacientes } from '@/modules/paciente/paciente.hooks'
import { useListaEspera } from '@/modules/lista-espera/lista-espera.hooks'
import { useProfissionais } from '@/modules/profissional/profissional.hooks'
import { useEmpresas } from '@/modules/empresa/empresa.hooks'
import { useTodosProntuarios, useAcessoProntuario } from '@/modules/prontuario/prontuario.hooks'
import { atendimentoEmAndamento } from '@/modules/prontuario/prontuario.utils'
import { getTotalEmAtendimento } from '@/modules/prontuario/prontuario.api'
import { Icone } from '@/components/CrudCard/icones'
import { ICONES } from '@/components/Sidebar/menuIcones'
import '@/modules/agenda/agenda.css'
import './Home.css'
import { localeAtual, tr } from '@/i18n';

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

// Indicador compacto (fica numa faixa acima do calendário); o detalhe aparece ao passar o mouse.
function Kpi({ icone, rotulo, valor, detalhe, tom = 'primary', to, indice }) {
    const exibido = useContagem(valor)
    const conteudo = (
        <>
            <span className="home-kpi__icone"><Icone>{ICONES[icone]}</Icone></span>
            <span className="home-kpi__textos">
                {valor === null ? <span className="skeleton skeleton--line home-kpi__skeleton" /> : <strong className="home-kpi__valor">{exibido}</strong>}
                <span className="home-kpi__rotulo">{rotulo}</span>
            </span>
        </>
    )
    const props = { className: 'card home-kpi', 'data-tom': tom, style: { '--i': indice }, title: detalhe ? `${rotulo}: ${valor ?? ''} ${detalhe}` : undefined }

    return to ? <Link to={to} {...props}>{conteudo}</Link> : <div {...props}>{conteudo}</div>
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

// Cancelamentos das consultas marcadas para este mês; o card mostra só os cancelados no calendário.
function KpiCancelados({ agora, indice, filtrar }) {
    const inicio = paraISO(new Date(agora.getFullYear(), agora.getMonth(), 1))
    const fim = paraISO(new Date(agora.getFullYear(), agora.getMonth() + 1, 0))
    const { agendas, loading } = useAgendas({ dataInicio: inicio, dataFim: fim })
    const total = filtrar(agendas).filter((a) => a.status === 'cancelado').length
    return <Kpi icone="cancelado" rotulo={tr('Agendamentos cancelados')} valor={loading ? null : total} detalhe={tr('neste mês')} tom="danger" to="/home?status=cancelado" indice={indice} />
}

function KpiEmAtendimento({ indice }) {
    const { prontuarios, loading } = useTodosProntuarios()
    const total = useMemo(() => prontuarios.filter(atendimentoEmAndamento).length, [prontuarios])
    return <Kpi icone="prontuario" rotulo={tr('Em atendimento')} valor={loading ? null : total} detalhe={total === 1 ? tr('atendimento aberto agora') : tr('atendimentos abertos agora')} tom="success" to="/prontuario" indice={indice} />
}

function KpiHoje({ agora, filtrar, indice }) {
    const hoje = paraISO(agora)
    const hhmm = `${String(agora.getHours()).padStart(2, '0')}:${String(agora.getMinutes()).padStart(2, '0')}`
    const { agendas, loading } = useAgendas({ dataInicio: hoje, dataFim: hoje })
    const ativas = filtrar(agendas).filter((a) => a.status !== 'cancelado')
    const restantes = ativas.filter((a) => a.horaFim > hhmm).length
    const realizados = ativas.filter((a) => a.status === 'realizado').length

    return (
        <Kpi
            icone="agenda"
            rotulo={tr('Agendamentos hoje')}
            valor={loading ? null : ativas.length}
            detalhe={ativas.length === 0 ? tr('nada marcado') : tr('{restantes} ainda por vir{p0}', { restantes, p0: realizados ? tr(' · {realizados} realizado{p0}', { realizados, p0: realizados > 1 ? 's' : '' }) : '' })}
            indice={indice}
        />
    )
}

// Faixa de indicadores. `versao` muda quando um agendamento é criado ou alterado, para os de agenda recarregarem.
function Indicadores({ agora, admin, recepcao, user, versao }) {
    // O profissional vê só a própria agenda; admin e recepção veem a da clínica toda.
    const soOsMeus = user?.role === 'profissional'
    const filtrar = (lista) => (soOsMeus ? lista.filter((a) => ehDoUsuario(a, user)) : lista)
    const { itens: fila, loading: carregandoFila } = useListaEspera({ status: 'aguardando' })
    const { pacientes, loading: carregandoPacientes } = usePacientes()
    const { profissionais, loading: carregandoProfissionais } = useProfissionais()
    const { empresas, loading: carregandoEmpresas } = useEmpresas()

    return (
        <div className="home-kpis">
            <KpiHoje key={`hoje-${versao}`} agora={agora} filtrar={filtrar} indice={0} />
            <Kpi icone="espera" rotulo={tr('Na lista de espera')} valor={carregandoFila ? null : fila.length} detalhe={tr('aguardando vaga')} tom="warning" to="/lista-espera" indice={1} />
            <Kpi icone="pacientes" rotulo={tr('Pacientes')} valor={carregandoPacientes ? null : pacientes.length} detalhe={tr('cadastrados')} tom="info" to="/pacientes" indice={2} />
            <KpiEmAtendimentoDoUsuario indice={3} veTotalDaClinica={admin || recepcao} />
            <KpiCancelados key={`cancelados-${versao}`} agora={agora} indice={4} filtrar={filtrar} />
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
    )
}

// Página inicial = resumo do dia + agenda da clínica (calendário).
export function Home() {
    const { user, hasRole } = useAuthContext()
    const [agora] = useState(() => new Date())
    const [versao, setVersao] = useState(0)

    const admin = hasRole('admin')
    const recepcao = hasRole('recepcao')
    const daClinica = admin || hasRole('profissional') || recepcao
    const primeiroNome = user?.nomeCompleto?.split(' ')[0] ?? ''

    // Quem não é da clínica (afiliado) não tem agenda: vai para o painel dele.
    if (!daClinica) return <Navigate to="/afiliado" replace />

    return (
        <div className="page home agenda-page">
            <AgendaCalendario
                onMudou={() => setVersao((v) => v + 1)}
                cabecalho={(
                    <div>
                        <p className="home-hero__data">{capitalizar(agora.toLocaleDateString(localeAtual(), { weekday: 'long', day: 'numeric', month: 'long' }))}</p>
                        <h2 className="page-title">{saudacao(agora.getHours())}, {primeiroNome}!</h2>
                        <p className="page-subtitle">{user?.nomeEmpresa ? tr('Resumo de hoje em {nomeEmpresa}', { nomeEmpresa: user.nomeEmpresa }) : tr('Resumo de hoje')}</p>
                    </div>
                )}
                resumo={<Indicadores agora={agora} admin={admin} recepcao={recepcao} user={user} versao={versao} />}
            />
        </div>
    )
}

export default Home
