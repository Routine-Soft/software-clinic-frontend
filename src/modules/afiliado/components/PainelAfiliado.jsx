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

export default function PainelAfiliado() {
  const { painel, loading, error } = usePainelAfiliado();
  const percentual = painel?.comissaoPercentual ?? 50;
  const porPlano = painel?.comissoesPorPlano ?? [];
  const carencia = painel?.diasDeCarencia ?? 7;

  const totais = [
    ['A receber', painel?.totais.aPagar, 'Liberado: entra no próximo pagamento por Pix', 'success'],
    ['Em carência', painel?.totais.emCarencia, `Clínicas que pagaram há menos de ${carencia + 1} dias`, 'info'],
    ['Já recebido', painel?.totais.recebido, 'Total pago a você até hoje', 'primary'],
  ];

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h2 className="page-title">Painel do afiliado</h2>
          <p className="page-subtitle">{percentual}% da primeira mensalidade de cada clínica que assinar pelo seu link</p>
        </div>
      </header>

      {error && <p className="alert alert--error" role="alert">{error.message}</p>}
      {painel && !painel.ativo && (
        <p className="alert alert--warning" role="status">
          Sua conta de afiliado está desativada: o seu código não vale para novos cadastros. As comissões já liberadas continuam sendo pagas.
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
          titulo="Divulgue o seu link"
          texto="Mande para donas de clínica, consultórios e profissionais de saúde. Quem criar a conta pelo link fica ligado a você."
          mensagem={mensagemConviteAfiliado}
        />

        <section className="card indicacao-saldo">
          <h3>Como você recebe</h3>
          <ol className="afiliado-regras">
            <li>A clínica cria a conta pelo seu link e paga a primeira mensalidade.</li>
            <li>
              Você ganha {percentual}% dessa mensalidade
              {porPlano.length > 0 && `: ${porPlano.map((p) => `${formatarReais(p.comissao)} no plano ${p.plano}`).join(' e ')}`}.
            </li>
            <li>A comissão fica {carencia} dias em carência, o prazo em que o cliente pode desistir e pedir o dinheiro de volta.</li>
            <li>A partir do {carencia + 1}º dia, ela fica liberada e é paga por Pix, uma vez por mês.</li>
          </ol>
          <p className="indicacao-saldo__regra">
            Chave Pix: <strong>{painel?.chavePix ?? '—'}</strong>. Para trocar, vá em <Link className="link" to="/minha-conta">Minha conta</Link>.
          </p>
        </section>
      </div>

      <section className="card indicacao-lista">
        <div className="indicacao-lista__topo">
          <h3>Clínicas que você trouxe</h3>
          {painel?.indicacoes.length > 0 && <span className="badge badge--primary">{painel.indicacoes.length}</span>}
        </div>

        {loading ? (
          <div className="skeleton skeleton--line" style={{ width: '100%', height: 60 }} />
        ) : !painel?.indicacoes.length ? (
          <div className="crud-vazio">
            <Icone>{ICONES.indicacao}</Icone>
            <p>Nenhuma clínica ainda. Envie o seu link para começar a ganhar!</p>
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
        Regras completas nos <a className="link" href="/#/termos-afiliado" target="_blank" rel="noreferrer">Termos do afiliado</a>.
      </p>
    </div>
  );
}
