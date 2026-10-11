import { useIndicacoes } from '../indicacao.hooks';
import { STATUS_INDICACAO, mensagemConviteClinica, formatarReais } from '../indicacao.utils';
import CartaoConvite from './CartaoConvite';
import { Icone } from '@/components/CrudCard/icones';
import { ICONES } from '@/components/Sidebar/menuIcones';
import '@/components/CrudCard/CrudCard.css';
import './indicacao.css';

const PASSOS = [
  ['Envie o seu link', 'Mande para outras clínicas pelo WhatsApp, ou passe o seu código para digitarem no cadastro.'],
  ['A clínica testa e assina', 'Ela cria a conta pelo seu link, usa o teste grátis e paga a primeira mensalidade.'],
  ['Você ganha o desconto', 'Os R$ 100 entram na sua próxima mensalidade. Os descontos se somam e podem cobrir a mensalidade inteira.'],
];

function dataBR(data) {
  return data ? new Date(data).toLocaleDateString('pt-BR') : '';
}

export default function IndiqueGanhe() {
  const { resumo, loading, error } = useIndicacoes();
  const valor = formatarReais(resumo?.valorPorIndicacao ?? 100);

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h2 className="page-title">Indique e ganhe</h2>
          <p className="page-subtitle">{valor} de desconto na sua mensalidade para cada clínica que assinar pelo seu link</p>
        </div>
      </header>

      {error && <p className="alert alert--error" role="alert">{error.message}</p>}

      <div className="indicacao-grid">
        <CartaoConvite
          codigo={resumo?.codigo}
          carregando={loading}
          titulo={`Ganhe ${valor} por indicação`}
          texto="Conhece outra clínica que ainda se organiza no papel ou na planilha? Mande o seu link."
          mensagem={mensagemConviteClinica}
        />

        <section className="card indicacao-saldo">
          <h3>Seu desconto</h3>
          {loading ? (
            <div className="skeleton skeleton--line" style={{ width: '50%', height: 44 }} />
          ) : (
            <p className="indicacao-saldo__valor">{formatarReais(resumo?.descontoGuardado)}</p>
          )}
          <p className="indicacao-saldo__legenda">guardado para as próximas mensalidades</p>
          <p className="indicacao-saldo__regra">
            Os descontos se somam e entram na próxima mensalidade. Se passarem do valor dela, a mensalidade sai de graça e o resto fica para os meses seguintes.
            No Pix, o valor já vem menor. No cartão, a mensalidade é cobrada normalmente e o desconto volta para o mesmo cartão logo em seguida.
          </p>
        </section>
      </div>

      <section className="card indicacao-passos">
        <h3>Como funciona</h3>
        <ol className="stagger">
          {PASSOS.map(([titulo, texto], i) => (
            <li key={titulo} style={{ '--i': i }}>
              <span className="indicacao-passos__numero" aria-hidden="true">{i + 1}</span>
              <div>
                <strong>{titulo}</strong>
                <p>{texto}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="card indicacao-lista">
        <div className="indicacao-lista__topo">
          <h3>Suas indicações</h3>
          {resumo?.indicacoes.length > 0 && <span className="badge badge--primary">{resumo.indicacoes.length}</span>}
        </div>

        {loading ? (
          <div className="skeleton skeleton--line" style={{ width: '100%', height: 60 }} />
        ) : !resumo?.indicacoes.length ? (
          <div className="crud-vazio">
            <Icone>{ICONES.indicacao}</Icone>
            <p>Nenhuma indicação ainda. Envie o seu link para a primeira clínica!</p>
          </div>
        ) : (
          <ul className="crud-lista stagger">
            {resumo.indicacoes.map((indicacao, i) => {
              const status = STATUS_INDICACAO[indicacao.status];
              return (
                <li key={indicacao.id} className="indicacao-item" style={{ '--i': i }}>
                  <div>
                    <strong>{indicacao.clinica}</strong>
                    <span>
                      Cadastrou-se em {dataBR(indicacao.criadaEm)}
                      {indicacao.usadaEm && ` · desconto usado em ${dataBR(indicacao.usadaEm)}`}
                    </span>
                  </div>
                  <span className={`badge badge--${status.tom}`}>{status.rotulo}</span>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
