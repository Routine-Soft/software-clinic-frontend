import { tr } from '@/i18n';

const PASSOS = [
  {
    titulo: tr('Dê um nome ao modelo'),
    texto: tr('Ex.: "Anamnese de Fonoaudiologia". O modelo é o formulário em branco: cada paciente recebe a sua própria cópia para responder.'),
  },
  {
    titulo: tr('Separe por assuntos (seções)'),
    texto: tr('Cada seção é um assunto, como "Gestação e parto", "Alimentação" ou "Escola". No título da seção vai o nome do assunto, nunca o nome de um paciente.'),
  },
  {
    titulo: tr('Escreva as perguntas'),
    texto: tr('Em cada seção, escreva as perguntas e escolha o tipo de resposta: texto curto, texto longo, caixas de marcar, escolha única (como Sim / Não) ou data.'),
  },
  {
    titulo: tr('Confira e salve'),
    texto: tr('Toque em "Ver como fica" para testar o formulário e depois em "Salvar modelo". Ele passa a aparecer no prontuário, na aba Anamnese, para o profissional escolher.'),
  },
];

// Explica, para quem não é da área de tecnologia, como montar um modelo de anamnese. Aberto ao criar um modelo novo.
export default function GuiaModeloAnamnese({ aberto }) {
  return (
    <details className="card anamnese-guia" open={aberto}>
      <summary className="anamnese-guia__resumo">{tr('Como montar a sua anamnese')}</summary>

      <p className="alert alert--info anamnese-guia__aviso">
        <strong>{tr('Não precisa perguntar o nome do paciente.')}</strong>{' '}
        {tr('A anamnese é preenchida dentro do prontuário de um paciente que já está cadastrado. O nome e a data de nascimento já estão no sistema e aparecem sozinhos no prontuário e na impressão.')}
      </p>

      <ol className="anamnese-guia__passos">
        {PASSOS.map((passo, i) => (
          <li key={passo.titulo} className="anamnese-guia__passo">
            <span className="anamnese-guia__num" aria-hidden="true">{i + 1}</span>
            <div>
              <strong>{passo.titulo}</strong>
              <p>{passo.texto}</p>
            </div>
          </li>
        ))}
      </ol>

      <p className="anamnese-guia__dica">
        {tr('Dica: se quiser mesmo uma pergunta com o nome, a idade ou a data de hoje, escolha a opção em "Preencher sozinho com". O sistema completa a resposta sozinho.')}
      </p>
    </details>
  );
}
