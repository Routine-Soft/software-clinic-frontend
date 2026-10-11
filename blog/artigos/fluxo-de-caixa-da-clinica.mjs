export default {
  slug: 'fluxo-de-caixa-da-clinica',
  titulo: 'Fluxo de caixa da clínica: como controlar entradas e saídas (com modelo)',
  tituloSeo: 'Fluxo de caixa da clínica: como controlar (com modelo)',
  descricao: 'Separe as contas, registre entradas por particular e convênio, preveja as saídas e veja o caixa dos próximos meses. Com um modelo simples para começar hoje.',
  palavraChave: 'fluxo de caixa clínica',
  categoria: 'Financeiro',
  publicadoEm: '2026-10-11',
  atualizadoEm: '2026-10-11',
  autor: 'Equipe Sonelia',
  ctaFinal: 'Atendimentos, valores e repasses no mesmo lugar',
  imagem: 'fluxo-de-caixa-da-clinica.jpg',
  imagemAlt: 'Tela de repasses de uma clínica com valores por profissional',
  resumo: [
    'Fluxo de caixa é o registro de tudo o que entra e sai, com a data em que o dinheiro realmente se move.',
    'Separe as contas da clínica das contas pessoais: é o primeiro passo.',
    'Registre as entradas por origem (particular, cada convênio, empresas) e as saídas por tipo.',
    'Convênios pagam depois e podem glosar: registre o faturado e o recebido.',
    'Projete os próximos 3 meses para não ser pego de surpresa.',
  ],
  corpo: `
<p>A clínica pode estar cheia e mesmo assim faltar dinheiro no dia de pagar o aluguel. Isso acontece quando o dinheiro entra depois do que sai, típico de quem atende convênio ou parcela no boleto. O <strong>fluxo de caixa</strong> mostra isso antes de virar problema.</p>

<h2 id="o-que-e">O que é fluxo de caixa</h2>
<p>É o registro, dia a dia, de todo dinheiro que <strong>entra</strong> e <strong>sai</strong> da clínica, pela data em que ele realmente se move (e não pela data do atendimento). Ele responde a uma pergunta simples: vai sobrar ou faltar dinheiro nas próximas semanas?</p>

<h2 id="separar">Primeiro passo: separe as contas</h2>
<p>Conta da clínica é da clínica. Misturar com gastos pessoais é o erro mais comum, citado por praticamente todo guia de gestão de consultório, como o da <a href="https://telemedicinamorsch.com.br/blog/fluxo-de-caixa-para-consultorio" rel="noopener" target="_blank">Telemedicina Morsch</a>. Defina um pró-labore fixo para você e retire só ele.</p>

<h2 id="entradas">Entradas: separe por origem</h2>
<ul>
  <li>pacientes particulares (Pix, cartão, dinheiro);</li>
  <li>cada convênio, separadamente;</li>
  <li>empresas (exames, avaliações, palestras);</li>
  <li>outras (sublocação de sala, cursos).</li>
</ul>
<p>No cartão, registre a data em que o dinheiro cai na conta e o valor já sem a taxa. No convênio, registre o <strong>faturado</strong>, o <strong>recebido</strong> e o <strong>glosado</strong>: só o recebido entra no caixa.</p>

<h2 id="saidas">Saídas: separe por tipo</h2>
<ul>
  <li><strong>fixas</strong>: aluguel, condomínio, salários, sistema, internet, contador;</li>
  <li><strong>variáveis</strong>: materiais, taxas de cartão, repasses aos profissionais;</li>
  <li><strong>impostos</strong>;</li>
  <li><strong>investimentos</strong>: equipamentos, reformas, marketing.</li>
</ul>

{{CTA}}

<h2 id="modelo">Modelo simples para começar</h2>
<table>
  <thead><tr><th>Data</th><th>Descrição</th><th>Categoria</th><th>Entrada</th><th>Saída</th><th>Saldo</th></tr></thead>
  <tbody>
    <tr><td>01/11</td><td>Saldo inicial</td><td>—</td><td></td><td></td><td>R$ 8.000</td></tr>
    <tr><td>03/11</td><td>Atendimentos particulares da semana</td><td>Particular</td><td>R$ 3.200</td><td></td><td>R$ 11.200</td></tr>
    <tr><td>05/11</td><td>Aluguel</td><td>Fixa</td><td></td><td>R$ 4.500</td><td>R$ 6.700</td></tr>
    <tr><td>10/11</td><td>Repasse dos profissionais (outubro)</td><td>Variável</td><td></td><td>R$ 5.600</td><td>R$ 1.100</td></tr>
    <tr><td>15/11</td><td>Pagamento convênio A (setembro)</td><td>Convênio</td><td>R$ 4.300</td><td></td><td>R$ 5.400</td></tr>
  </tbody>
</table>
<p>Repare no dia 10: o saldo quase zerou antes de o convênio pagar. É exatamente isso que o fluxo de caixa mostra com antecedência.</p>

<h2 id="projecao">Projete os próximos meses</h2>
<p>Além do que já aconteceu, preencha o que <strong>vai</strong> acontecer: aluguel do mês que vem, repasses previstos, pagamentos de convênio esperados, 13º salário, impostos. Com 3 meses projetados, dá para decidir com calma quando investir e quando segurar.</p>

<h2 id="reserva">Tenha uma reserva</h2>
<p>Uma reserva de 3 a 6 meses de custos fixos protege a clínica de meses fracos, atrasos de convênio e imprevistos. Construa aos poucos, separando um percentual do resultado de cada mês.</p>

<h2 id="reforma">Atenção à reforma tributária</h2>
<p>Com o <a href="/blog/split-payment-clinicas/">split payment</a>, receitas de empresas e convênios podem passar a entrar já sem o imposto. Quem já acompanha o fluxo de caixa por origem vai se adaptar mais fácil.</p>

<h2 id="na-pratica">Na prática</h2>
<p>O fluxo de caixa fica muito mais simples quando os atendimentos, os valores por convênio e os repasses já estão registrados no sistema da clínica. Na Sonelia, cada atendimento realizado já tem o valor do serviço e o repasse do profissional calculados, e o histórico de pagamentos aos profissionais fica guardado.</p>
`,
  duvidas: [
    ['Como fazer o fluxo de caixa de uma clínica?', 'Registre todas as entradas e saídas pela data em que o dinheiro se move, separando por origem (particular, convênio, empresa) e por tipo de despesa, e projete os próximos meses.'],
    ['Convênio entra no fluxo de caixa quando?', 'Quando o pagamento cai na conta. Registre à parte o valor faturado e o glosado para acompanhar a diferença.'],
    ['Quanto deixar de reserva?', 'O mais comum é de 3 a 6 meses de custos fixos, construída aos poucos.'],
  ],
  fontes: [
    ['Como fazer o controle do fluxo de caixa para consultório (Telemedicina Morsch)', 'https://telemedicinamorsch.com.br/blog/fluxo-de-caixa-para-consultorio'],
    ['Controle financeiro para clínicas e consultórios (Asaas)', 'https://blog.asaas.com/controle-financeiro-para-clinicas-e-consultorios/amp/'],
  ],
};
