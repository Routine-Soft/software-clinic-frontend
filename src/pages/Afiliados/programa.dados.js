import { localeAtual, tr } from '@/i18n';

// Textos da página pública "Seja afiliado". Os números vêm daqui e precisam bater com o backend
// (COMISSAO_AFILIADO_PERCENTUAL e DIAS_DE_CARENCIA em indicacao.service.js) e com os preços dos planos.
export const COMISSAO_PERCENTUAL = 50;
export const DIAS_CARENCIA = 7;

// Planos à venda e quanto o afiliado ganha em cada um (a porcentagem da primeira mensalidade).
export const PLANOS = [
  { nome: tr('Pro'), preco: 200 },
  { nome: tr('Individual'), preco: 100 },
].map((plano) => ({ ...plano, comissao: (plano.preco * COMISSAO_PERCENTUAL) / 100 }));

const reais = (valor) => tr('R$ {p0}', { p0: valor.toLocaleString(localeAtual(), { minimumFractionDigits: 2 }) });
const EXEMPLOS = PLANOS.map((p) => tr('{p0} no plano {nome}', { p0: reais(p.comissao), nome: p.nome })).join(tr(' e '));

export const PASSOS = [
  [tr('Cadastre-se'), tr('Leva um minuto. Já usa a Sonelia? Ative na sua própria conta, com o mesmo e-mail.')],
  [tr('Compartilhe o seu link'), tr('Mande pelo WhatsApp, nas redes sociais ou passe o seu código para a clínica digitar no cadastro.')],
  [tr('A clínica assina'), tr('Ela testa grátis e paga a primeira mensalidade. Cada clínica que pagar vale {COMISSAO_PERCENTUAL}% da primeira mensalidade.', { COMISSAO_PERCENTUAL })],
  [tr('Receba por Pix'), tr('Depois de {DIAS_CARENCIA} dias do pagamento da clínica, a comissão é liberada e paga na sua chave Pix.', { DIAS_CARENCIA })],
];

export const PUBLICO = [
  tr('Recepcionistas e secretárias'),
  tr('Profissionais de saúde'),
  tr('Donas e donos de clínica'),
  tr('Influenciadores digitais'),
  tr('Consultores e freelancers'),
];

export const REGRAS = [
  tr('{COMISSAO_PERCENTUAL}% da primeira mensalidade de cada clínica que criar a conta pelo seu link (ou com o seu código) e pagar: {EXEMPLOS}.', { COMISSAO_PERCENTUAL, EXEMPLOS }),
  tr('Sem limite: indicou 10 clínicas que pagaram, recebe 10 comissões.'),
  tr('O cliente tem {DIAS_CARENCIA} dias para desistir e pedir o dinheiro de volta (Código de Defesa do Consumidor). Por isso a comissão é liberada no {p0}º dia.', { DIAS_CARENCIA, p0: DIAS_CARENCIA + 1 }),
  tr('As comissões liberadas são pagas por Pix, uma vez por mês, na chave que você cadastrar.'),
  tr('Se a clínica pedir o dinheiro de volta antes de a comissão ser paga, ela é cancelada.'),
  tr('Divulgue com honestidade: sem spam, sem anúncios com a marca e sem indicar a si mesmo.'),
];

export const DUVIDAS = [
  [tr('Preciso ter CNPJ?'), tr('Não. Você pode se cadastrar com CPF. Os impostos sobre o que você recebe são de sua responsabilidade.')],
  [tr('Já trabalho numa clínica que usa a Sonelia. Posso ser afiliada?'), tr('Pode, e com o mesmo e-mail: entre na sua conta e ative o programa. Você continua usando o sistema da clínica normalmente e ganha um painel de afiliado.')],
  [tr('Sou dona de clínica. Qual a diferença para o "Indique e ganhe"?'), tr('No "Indique e ganhe", {COMISSAO_PERCENTUAL}% da primeira mensalidade da clínica indicada vira desconto na sua mensalidade. Como afiliada, você recebe os mesmos {p0}% em dinheiro, por Pix. São dois links diferentes: você escolhe qual mandar.', { COMISSAO_PERCENTUAL, p0: COMISSAO_PERCENTUAL })],
  [tr('Quanto eu ganho por clínica?'), tr('{COMISSAO_PERCENTUAL}% do valor da primeira mensalidade do plano que a clínica assinar: {EXEMPLOS}. A comissão é paga uma vez por clínica.', { COMISSAO_PERCENTUAL, EXEMPLOS })],
  [tr('E se a clínica não usar o meu link?'), tr('Ela pode digitar o seu código no campo "Código de indicação" ao criar a conta. Sem o link ou o código, a indicação não conta.')],
  [tr('Como acompanho o que tenho a receber?'), tr('No Painel do afiliado: as clínicas que você trouxe, o que está em carência, o que já está liberado e o que já recebeu.')],
];
