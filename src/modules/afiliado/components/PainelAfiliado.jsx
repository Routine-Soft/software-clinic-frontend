import { Link } from 'react-router-dom';
import { usePainelAfiliado } from '../afiliado.hooks';
import { SITUACAO_COMISSAO, mensagemConviteAfiliado, detalheComissao } from '../afiliado.utils';
import { formatarReais } from '@/modules/indicacao/indicacao.utils';
import CartaoConvite from '@/modules/indicacao/components/CartaoConvite';
import { Icone } from '@/components/CrudCard/icones';
import { ICONES } from '@/components/Sidebar/menuIcones';
import '@/components/CrudCard/CrudCard.css';
import '@/modules/indicacao/components/indicacao.css';
import './afiliado.css';
import { tr } from '@/i18n';

export default function PainelAfiliado() {
  const { painel, loading, error } = usePainelAfiliado();
  const percentual = painel?.comissaoPercentual ?? 50;
  const porPlano = painel?.comissoesPorPlano ?? [];
  const carencia = painel?.diasDeCarencia ?? 7;

  const totais = [
    [tr('A receber'), painel?.totais.aPagar, tr('Liberado: entra no próximo pagamento por Pix'), 'success'],
    [tr('Em carência'), painel?.totais.emCarencia, tr('Clínicas que pagaram há menos de {p0} dias', { p0: carencia + 1 }), 'info'],
    [tr('Já recebido'), painel?.totais.recebido, tr('Total pago a você até hoje'), 'primary'],
  ];

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h2 className="page-title">{tr('Painel do afiliado')}</h2>
          <p className="page-subtitle">{tr('{percentual}% da primeira mensalidade de cada clínica que assinar pelo seu link', { percentual })}</p>
        </div>
      </header>

      {error && <p className="alert alert--error" role="alert">{error.message}</p>}
      {painel && !painel.ativo && (
        <p className="alert alert--warning" role="status">
          {tr('Sua conta de afiliado está desativada: o seu código não vale para novos cadastros. As comissões já liberadas continuam sendo pagas.')}
        </p>
      )}

      <div className="afiliado-totais stagger">
        {totais.map(([titulo, valor, legenda, tom], i) => (
          <section key={titulo} className="card afiliado-total" data-tom={tom} style={{ '--i': i }}>
            <span className="afiliado-total__titulo">{titulo}</span>
            {loading ? (
              <div className="skeleton skeleton--line" style={{ width: '60%', height: 34 }} />
            ) : (
              <strong className="afiliado-total__valor">{formatarReais(valor)}</strong>
            )}
            <span className="afiliado-total__legenda">{legenda}</span>
          </section>
        ))}
      </div>

      <div className="indicacao-grid">
        <CartaoConvite
          codigo={painel?.codigo}
          carregando={loading}
          titulo={tr('Divulgue o seu link')}
          texto={tr('Mande para donas de clínica, consultórios e profissionais de saúde. Quem criar a conta pelo link fica ligado a você.')}
          mensagem={mensagemConviteAfiliado}
        />

        <section className="card indicacao-saldo">
          <h3>{tr('Como você recebe')}</h3>
          <ol className="afiliado-regras">
            <li>{tr('A clínica cria a conta pelo seu link e paga a primeira mensalidade.')}</li>
            <li>
              {tr('Você ganha {percentual}% dessa mensalidade {p0}.', { percentual, p0: porPlano.length > 0 && `: ${porPlano.map((p) => tr('{p0} no plano {plano}', { p0: formatarReais(p.comissao), plano: p.plano })).join(tr(' e '))}` })}
            </li>
            <li>{tr('A comissão fica {carencia} dias em carência, o prazo em que o cliente pode desistir e pedir o dinheiro de volta.', { carencia })}</li>
            <li>{tr('A partir do {p0}º dia, ela fica liberada e é paga por Pix, uma vez por mês.', { p0: carencia + 1 })}</li>
          </ol>
          <p className="indicacao-saldo__regra">
            {tr('Chave Pix:')} <strong>{painel?.chavePix ?? '—'}</strong>. {tr('Para trocar, vá em')} <Link className="link" to="/minha-conta">{tr('Minha conta')}</Link>.
          </p>
        </section>
      </div>

      <section className="card indicacao-lista">
        <div className="indicacao-lista__topo">
          <h3>{tr('Clínicas que você trouxe')}</h3>
          {painel?.indicacoes.length > 0 && <span className="badge badge--primary">{painel.indicacoes.length}</span>}
        </div>

        {loading ? (
          <div className="skeleton skeleton--line" style={{ width: '100%', height: 60 }} />
        ) : !painel?.indicacoes.length ? (
          <div className="crud-vazio">
            <Icone>{ICONES.indicacao}</Icone>
            <p>{tr('Nenhuma clínica ainda. Envie o seu link para começar a ganhar!')}</p>
          </div>
        ) : (
          <ul className="crud-lista stagger">
            {painel.indicacoes.map((c, i) => {
              const situacao = SITUACAO_COMISSAO[c.situacao];
              return (
                <li key={c.id} className="indicacao-item" style={{ '--i': i }}>
                  <div>
                    <strong>{c.clinica}</strong>
                    <span>{detalheComissao(c)}</span>
                  </div>
                  <span className={`badge badge--${situacao.tom}`}>
                    {situacao.rotulo}{c.situacao !== 'aguardando' && ` · ${formatarReais(c.valor)}`}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <p className="afiliado-termos">
        {tr('Regras completas nos')} <a className="link" href="/#/termos-afiliado" target="_blank" rel="noreferrer">{tr('Termos do afiliado')}</a>.
      </p>
    </div>
  );
}
