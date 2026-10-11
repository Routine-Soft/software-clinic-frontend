// Artigo do blog. O corpo é HTML simples: <h2> vira item do sumário (precisa de id), <p>, <ul>, <ol>, <table>,
// <blockquote>. O bloco {{CTA}} é trocado pelo convite para testar a Sonelia.
export default {
  slug: 'como-reduzir-faltas-de-pacientes',
  titulo: 'Como reduzir faltas de pacientes na clínica: 8 estratégias que funcionam',
  // Até ~60 caracteres: é o título que aparece no Google.
  tituloSeo: 'Como reduzir faltas de pacientes na clínica: 8 estratégias',
  // Até ~155 caracteres: o texto que aparece embaixo do título no Google.
  descricao: 'Falta de paciente é horário perdido e dinheiro que não volta. Veja como medir, confirmar consultas, usar lista de espera e criar uma política de faltas.',
  palavraChave: 'como reduzir faltas de pacientes',
  categoria: 'Gestão da agenda',
  publicadoEm: '2026-10-11',
  atualizadoEm: '2026-10-11',
  autor: 'Equipe Sonelia',
  imagem: 'como-reduzir-faltas-de-pacientes.jpg',
  imagemAlt: 'Agenda semanal de uma clínica com consultas coloridas por profissional',
  resumo: [
    'Meça a taxa de faltas por profissional, dia e horário antes de mudar qualquer coisa.',
    'Confirme a consulta de 1 a 3 dias antes; o contato feito pela recepção funciona melhor que a mensagem automática.',
    'Facilite remarcar: o paciente que desmarca libera o horário, o que falta não.',
    'Use a lista de espera para preencher na hora o horário que abriu.',
    'Combine por escrito a política de faltas e registre o motivo de cada cancelamento.',
  ],
  corpo: `
<p>Toda clínica conhece a cena: o horário está reservado, o profissional está pronto, a sala está livre e o paciente simplesmente não aparece. Não avisou, não remarcou, e aquele horário não volta mais.</p>
<p>Pesquisas sobre consultas no mundo todo encontram taxas de falta que vão de 5% a 55%, conforme o país e o tipo de atendimento, com média perto de 23% (<a href="https://acimed.sld.cu/index.php/acimed/article/download/1566/pdf_44" rel="noopener" target="_blank">revisão publicada na ACIMED</a>). Mesmo uma taxa bem menor já pesa no caixa. A boa notícia: falta tem causa, e a maior parte delas dá para combater com organização.</p>

<h2 id="quanto-custa">Quanto uma falta custa para a clínica</h2>
<p>Antes de mudar a rotina, vale colocar o problema em reais. Imagine uma clínica com 4 profissionais, cada um com 8 atendimentos por dia, consulta média de R$ 150 e 10% de faltas:</p>
<table>
  <thead><tr><th>Item</th><th>Conta</th><th>Resultado</th></tr></thead>
  <tbody>
    <tr><td>Atendimentos por dia</td><td>4 profissionais × 8</td><td>32</td></tr>
    <tr><td>Faltas por dia</td><td>32 × 10%</td><td>3,2</td></tr>
    <tr><td>Perda por dia</td><td>3,2 × R$ 150</td><td>R$ 480</td></tr>
    <tr><td>Perda por mês</td><td>R$ 480 × 22 dias úteis</td><td><strong>R$ 10.560</strong></td></tr>
  </tbody>
</table>
<p>E a conta não para aí: o profissional que recebe por repasse também perde, a sala fica ociosa e o paciente que precisava daquele horário ficou sem vaga.</p>

<h2 id="medir">1. Meça a sua taxa de faltas</h2>
<p>O que não é medido não melhora. A fórmula é simples:</p>
<blockquote><strong>Taxa de faltas</strong> = consultas em que o paciente faltou ÷ consultas agendadas × 100</blockquote>
<p>Calcule por mês e, principalmente, separe por <strong>profissional</strong>, <strong>dia da semana</strong> e <strong>horário</strong>. É comum descobrir que as faltas se concentram na segunda de manhã, no último horário da sexta ou nos pacientes de primeira consulta. Com isso em mãos, as próximas ações deixam de ser chute.</p>

<h2 id="confirmar">2. Confirme a consulta de 1 a 3 dias antes</h2>
<p>O esquecimento é um dos principais motivos de falta, e o lembrete é a forma mais barata de combatê-lo. Um estudo publicado no <em>American Journal of Medicine</em> comparou três grupos de pacientes (<a href="https://pubmed.ncbi.nlm.nih.gov/20569761/" rel="noopener" target="_blank">Parikh e colegas, 2010</a>):</p>
<ul>
  <li><strong>Sem lembrete:</strong> 23,1% de faltas;</li>
  <li><strong>Mensagem automática:</strong> 17,3% de faltas;</li>
  <li><strong>Contato feito pela equipe da recepção:</strong> 13,6% de faltas.</li>
</ul>
<p>Ou seja: qualquer lembrete ajuda, e o contato humano funciona melhor. Na prática, a recepção pode reservar 20 minutos por dia para confirmar a agenda do dia seguinte pelo WhatsApp, usando uma mensagem pronta como esta:</p>
<blockquote>Olá, Maria! Aqui é da Clínica Vida. Passando para confirmar sua consulta com a Dra. Helena amanhã, quinta-feira, às 14h. Podemos confirmar? Se precisar remarcar, é só responder esta mensagem.</blockquote>
<p>Repare que a mensagem já oferece a remarcação. Isso nos leva ao próximo ponto.</p>

{{CTA}}

<h2 id="remarcar">3. Facilite remarcar (desmarcar é melhor que faltar)</h2>
<p>O paciente que desmarca devolve o horário a tempo de outra pessoa usar. O que falta, não. Por isso, quanto mais fácil for remarcar, menos faltas a clínica terá:</p>
<ul>
  <li>deixe claro, em toda confirmação, que dá para remarcar respondendo a mensagem;</li>
  <li>não trate a remarcação como um problema: agradeça o aviso;</li>
  <li>ofereça já duas opções de novo horário, em vez de perguntar "quando você pode?".</li>
</ul>

<h2 id="lista-de-espera">4. Tenha uma lista de espera ativa</h2>
<p>Desmarcação só vira prejuízo se o horário ficar vazio. Mantenha uma lista de pacientes que querem ser atendidos antes, separada por especialidade e por profissional. Quando um horário abrir, a recepção já sabe quem chamar, em vez de procurar nomes em cadernos e conversas antigas.</p>

<h2 id="retorno">5. Marque o retorno antes de o paciente ir embora</h2>
<p>Em tratamentos contínuos, como psicologia, fonoaudiologia e nutrição, o paciente que sai sem o próximo horário marcado tem mais chance de sumir. Agende o retorno ainda na recepção. Para atendimentos semanais, reserve horários fixos que se repetem: o paciente cria o hábito, e a agenda fica previsível para os dois lados.</p>

<h2 id="politica">6. Tenha uma política de faltas clara e por escrito</h2>
<p>Combinado não sai caro. Explique, no primeiro atendimento e por escrito, as regras da clínica:</p>
<ul>
  <li>com quanto tempo de antecedência o paciente deve avisar que não vai (24 horas é o mais comum);</li>
  <li>o que acontece em caso de falta sem aviso (por exemplo, cobrança da sessão ou perda do horário fixo);</li>
  <li>como avisar: telefone, WhatsApp ou e-mail.</li>
</ul>
<p>Na psicologia, isso costuma fazer parte do contrato terapêutico. Se a clínica decidir cobrar faltas, a regra precisa ter sido combinada antes e por escrito. Confira também as orientações do conselho da sua profissão.</p>

<h2 id="antecedencia">7. Evite agendar muito longe</h2>
<p>Quanto maior o intervalo entre o agendamento e a consulta, maior a chance de o paciente esquecer, resolver o problema de outra forma ou mudar de planos. Se a agenda vive lotada com semanas de antecedência, considere abrir horários extras, reorganizar os períodos dos profissionais ou usar mais a lista de espera.</p>

<h2 id="motivos">8. Registre o motivo de cada cancelamento</h2>
<p>Não apague da agenda a consulta que foi cancelada: marque como cancelada e anote o motivo. Com o tempo, os motivos se repetem (horário de trabalho, transporte, valor, esquecimento) e mostram o que a clínica pode mudar, como abrir horários no início da manhã ou depois do expediente.</p>

<h2 id="na-pratica">Como colocar tudo isso em prática</h2>
<p>Nenhuma dessas estratégias exige grandes investimentos, mas todas exigem uma <strong>agenda organizada</strong>. Quando a agenda está espalhada entre caderno, planilha e WhatsApp, fica difícil medir faltas, encontrar o paciente da lista de espera ou saber quem confirmou.</p>
<p>Um bom começo para esta semana:</p>
<ol>
  <li>calcule a taxa de faltas do último mês;</li>
  <li>defina quem confirma as consultas do dia seguinte e em que horário;</li>
  <li>monte a lista de espera;</li>
  <li>escreva a política de faltas e mostre a cada paciente novo.</li>
</ol>
`,
  duvidas: [
    ['Qual é uma taxa de faltas normal em clínicas?', 'Depende da especialidade, do público e do tipo de atendimento. Estudos internacionais encontram de 5% a 55%. O mais útil é acompanhar a taxa da sua própria clínica mês a mês e trabalhar para reduzi-la.'],
    ['Quando devo confirmar a consulta?', 'De 1 a 3 dias antes. Assim o paciente lembra da consulta e ainda há tempo de oferecer o horário para alguém da lista de espera, se ele precisar desmarcar.'],
    ['A clínica pode cobrar quando o paciente falta?', 'Pode, desde que a regra tenha sido combinada antes e por escrito com o paciente, e respeitando as orientações do conselho da sua profissão.'],
    ['Lembrete automático resolve sozinho?', 'Ajuda, mas o estudo citado no artigo mostrou que o contato feito pela equipe da recepção reduziu mais as faltas do que a mensagem automática.'],
  ],
  fontes: [
    ['Parikh A. et al. The effectiveness of outpatient appointment reminder systems in reducing no-show rates. Am J Med, 2010', 'https://pubmed.ncbi.nlm.nih.gov/20569761/'],
    ['Revisão sobre absenteísmo em consultas médicas, revista ACIMED', 'https://acimed.sld.cu/index.php/acimed/article/download/1566/pdf_44'],
  ],
};
