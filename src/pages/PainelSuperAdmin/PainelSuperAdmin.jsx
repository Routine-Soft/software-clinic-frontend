import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAdmins, useResumoAdmins, useReceitaAdmins } from '@/modules/user/clinica-admin.hooks';
import NovoAdminModal from '@/modules/user/components/NovoAdminModal';
import { formatarData, formatarPreco } from '@/modules/assinatura/assinatura.utils';
import { Icone, IconeMais } from '@/components/CrudCard/icones';
import FiltroPeriodo from '@/components/FiltroPeriodo/FiltroPeriodo';
import { ICONES } from '@/components/Sidebar/menuIcones';
import './PainelSuperAdmin.css';
import { tr } from '@/i18n';
import { useResumoBloqueios } from '@/modules/plano/plano.hooks';

function CardResumo({ icone, tom, rotulo, valor, loading, detalhe }) {
  return (
    <article className="card painel-sa__card" data-tom={tom}>
      <span className="painel-sa__icone"><Icone>{ICONES[icone]}</Icone></span>
      <span className="painel-sa__rotulo">{rotulo}</span>
      {loading ? <span className="skeleton skeleton--line painel-sa__skeleton" /> : <strong className="painel-sa__valor">{valor}</strong>}
      {detalhe && <span className="painel-sa__detalhe">{detalhe}</span>}
    </article>
  );
}

function CardReceita({ periodo, onPeriodoChange, receita, loading }) {
  return (
    <article className="card painel-sa__card painel-sa__card--receita" data-tom="success">
      <span className="painel-sa__icone"><Icone>{ICONES.receita}</Icone></span>
      <span className="painel-sa__rotulo">{tr('Receita de assinantes')}</span>
      {loading ? <span className="skeleton skeleton--line painel-sa__skeleton" /> : <strong className="painel-sa__valor">{formatarPreco(receita?.total ?? 0)}</strong>}
      {receita?.totalUSD > 0 && <span className="painel-sa__detalhe">{tr('+ {p0} no Stripe (em dólar)', { p0: formatarPreco(receita.totalUSD, 'USD') })}</span>}

      <FiltroPeriodo valor={periodo} onChange={onPeriodoChange} rotulo={tr('Período da receita')} className="painel-sa__periodo" />

      {receita?.desde && (
        <span className="painel-sa__detalhe">{tr('Desde {p0} · pagamentos aprovados no Pix e no cartão', { p0: formatarData(receita.desde) })}</span>
      )}
    </article>
  );
}

const NOME_DO_RECURSO = {
  prontuario: tr('Prontuário'),
  anamnese: tr('Anamneses'),
  termo: tr('Termos (TCLE)'),
  convenio: tr('Convênios'),
  avaliacoes: tr('Avaliações'),
  empresas: tr('Empresas clientes'),
  reunioes: tr('Reuniões'),
  whatsapp: tr('Lembretes pelo WhatsApp'),
  repasse: tr('Repasses'),
  recepcao: tr('Recepção'),
  equipe: tr('Equipe da clínica'),
  pacientes: tr('Pacientes sem limite'),
  profissionais: tr('Mais profissionais'),
};

// Cliques nos cadeados (planos Grátis e Basic) nos últimos 90 dias: mostra o que faz as clínicas quererem assinar.
function CardCadeados() {
  const { resumo, carregando } = useResumoBloqueios();
  const linhas = resumo?.recursos ?? [];
  const maximo = Math.max(1, ...linhas.map((l) => l.cliques));

  return (
    <article className="card painel-sa__card painel-sa__card--cadeados" data-tom="warning">
      <span className="painel-sa__icone"><Icone>{ICONES.planos}</Icone></span>
      <span className="painel-sa__rotulo">{tr('Cliques nos cadeados')}</span>
      {carregando ? (
        <span className="skeleton skeleton--line painel-sa__skeleton" />
      ) : linhas.length === 0 ? (
        <span className="painel-sa__detalhe">{tr('Nenhum clique ainda. Eles aparecem quando uma clínica no plano Grátis ou Basic toca num recurso com cadeado.')}</span>
      ) : (
        <ul className="painel-sa__cadeados">
          {linhas.map((l) => (
            <li key={l.recurso}>
              <span className="painel-sa__cadeado-nome">{NOME_DO_RECURSO[l.recurso] ?? l.recurso}</span>
              <span className="painel-sa__cadeado-barra" style={{ '--parte': `${(l.cliques / maximo) * 100}%` }} aria-hidden="true" />
              <span className="painel-sa__cadeado-numeros">
                {tr('{cliques} cliques · {clinicas} clínicas', { cliques: l.cliques, clinicas: l.clinicas })}
              </span>
            </li>
          ))}
        </ul>
      )}
      <span className="painel-sa__detalhe">{tr('Últimos 90 dias')}</span>
    </article>
  );
}

// Painel do super_admin: visão rápida de quantas clínicas existem, quantas pagam e quantas não, e um atalho para cadastrar uma nova.
export default function PainelSuperAdmin() {
  const { resumo, loading, error, refresh } = useResumoAdmins();
  const { addAdmin, error: erroCriacao } = useAdmins();
  const [criando, setCriando] = useState(false);
  const [periodoReceita, setPeriodoReceita] = useState('mensal');
  const { receita, loading: loadingReceita } = useReceitaAdmins(periodoReceita);

  async function handleCriar(dados) {
    const criado = await addAdmin(dados);
    if (criado) refresh();
    return criado;
  }

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h2 className="page-title">{tr('Painel Super Admin')}</h2>
          <p className="page-subtitle">{tr('Visão geral das clínicas cadastradas na plataforma')}</p>
        </div>
        <div className="page-header__acoes">
          <Link to="/clinicas" className="btn btn--ghost">{tr('Ver todas as clínicas')}</Link>
        </div>
      </header>

      {error && (
        <div className="alerts">
          <p className="alert alert--error" role="alert">{error.message}</p>
        </div>
      )}

      <div className="painel-sa__grade">
        <CardResumo icone="usuarios" rotulo={tr('Usuários admin')} valor={resumo?.totalAdmins} loading={loading} detalhe={tr('Clínicas cadastradas')} />
        <CardResumo icone="assinatura" tom="success" rotulo={tr('Usuários pagantes')} valor={resumo?.pagantes} loading={loading} detalhe={tr('Assinatura ativa agora')} />
        <CardResumo icone="espera" tom="warning" rotulo={tr('Usuários não pagantes')} valor={resumo?.naoPagantes} loading={loading} detalhe={tr('Teste, pendente, atraso ou sem assinatura')} />
        <CardReceita periodo={periodoReceita} onPeriodoChange={setPeriodoReceita} receita={receita} loading={loadingReceita} />

        <CardCadeados />

        <article className="card painel-sa__card painel-sa__card--acao">
          <span className="painel-sa__icone"><IconeMais /></span>
          <span className="painel-sa__rotulo">{tr('Cadastrar clínica')}</span>
          <p className="painel-sa__acao-texto">{tr('Crie o acesso de uma nova clínica, já com o período de teste')}</p>
          <button type="button" className="btn btn--primary btn--block" onClick={() => setCriando(true)}>
            <IconeMais />
            {tr('Nova clínica')}
          </button>
        </article>
      </div>

      {criando && (
        <NovoAdminModal
          erro={erroCriacao}
          onSave={handleCriar}
          onClose={() => setCriando(false)}
        />
      )}
    </div>
  );
}
