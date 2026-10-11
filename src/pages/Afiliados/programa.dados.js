// Textos da página pública "Seja afiliado". Os números vêm daqui e precisam bater com o backend
// (COMISSAO_AFILIADO e DIAS_DE_CARENCIA em indicacao.service.js).
export const COMISSAO = 100;
export const DIAS_CARENCIA = 7;

export const PASSOS = [
  ['Cadastre-se', 'Leva um minuto. Já usa a Sonelia? Ative na sua própria conta, com o mesmo e-mail.'],
  ['Compartilhe o seu link', 'Mande pelo WhatsApp, nas redes sociais ou passe o seu código para a clínica digitar no cadastro.'],
  ['A clínica assina', 'Ela testa grátis e paga a primeira mensalidade. Cada clínica que pagar vale uma comissão.'],
  ['Receba por Pix', `Depois de ${DIAS_CARENCIA} dias do pagamento da clínica, a comissão é liberada e paga na sua chave Pix.`],
];

export const PUBLICO = [
  'Recepcionistas e secretárias',
  'Profissionais de saúde',
  'Donas e donos de clínica',
  'Influenciadores digitais',
  'Consultores e freelancers',
];

export const REGRAS = [
  `R$ ${COMISSAO},00 por clínica que criar a conta pelo seu link (ou com o seu código) e pagar a primeira mensalidade.`,
  'Sem limite: indicou 10 clínicas que pagaram, recebe 10 comissões.',
  `O cliente tem ${DIAS_CARENCIA} dias para desistir e pedir o dinheiro de volta (Código de Defesa do Consumidor). Por isso a comissão é liberada no ${DIAS_CARENCIA + 1}º dia.`,
  'As comissões liberadas são pagas por Pix, uma vez por mês, na chave que você cadastrar.',
  'Se a clínica pedir o dinheiro de volta antes de a comissão ser paga, ela é cancelada.',
  'Divulgue com honestidade: sem spam, sem anúncios com a marca e sem indicar a si mesmo.',
];

export const DUVIDAS = [
  ['Preciso ter CNPJ?', 'Não. Você pode se cadastrar com CPF. Os impostos sobre o que você recebe são de sua responsabilidade.'],
  ['Já trabalho numa clínica que usa a Sonelia. Posso ser afiliada?', 'Pode, e com o mesmo e-mail: entre na sua conta e ative o programa. Você continua usando o sistema da clínica normalmente e ganha um painel de afiliado.'],
  ['Sou dona de clínica. Qual a diferença para o "Indique e ganhe"?', 'No "Indique e ganhe", cada clínica indicada vira R$ 100 de desconto na sua mensalidade. Como afiliada, você recebe R$ 100 em dinheiro. São dois links diferentes: você escolhe qual mandar.'],
  ['E se a clínica não usar o meu link?', 'Ela pode digitar o seu código no campo "Código de indicação" ao criar a conta. Sem o link ou o código, a indicação não conta.'],
  ['Como acompanho o que tenho a receber?', 'No Painel do afiliado: as clínicas que você trouxe, o que está em carência, o que já está liberado e o que já recebeu.'],
];
