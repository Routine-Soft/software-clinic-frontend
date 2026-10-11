// Textos dos termos aceitos no cadastro. Ao mudar o texto, mude também a data (VERSAO) aqui e no backend
// (TERMOS_CLINICA_VERSAO em user.service.js e TERMOS_AFILIADO_VERSAO em afiliado.service.js).
// Os dados da empresa que ficarem vazios simplesmente não aparecem na página.
export const EMPRESA = {
  nome: 'Sonelia',
  razaoSocial: '',
  cnpj: '',
  email: '',
  cidadeForo: '',
};

export const VERSAO = '11/10/2026';

export const TERMOS_CLINICA = {
  titulo: 'Termos de uso',
  subtitulo: 'Para clínicas que usam a Sonelia',
  secoes: [
    ['1. O que é a Sonelia', [
      'A Sonelia é um sistema on-line de gestão para clínicas: agenda, pacientes, prontuário eletrônico, convênios, repasses aos profissionais e outros recursos. Ao criar a conta, a pessoa que se cadastra declara ter autorização para contratar em nome da clínica e aceita estes termos.',
    ]],
    ['2. Conta e acessos', [
      'Quem cria a conta é o administrador da clínica e responde por ela. É ele quem cadastra os demais usuários (recepção e profissionais) e define o que cada um pode fazer.',
      'Cada usuário deve ter o próprio login. A senha é pessoal e não deve ser compartilhada. Avise o suporte se suspeitar de uso indevido da sua conta.',
    ]],
    ['3. Teste grátis, planos e pagamento', [
      'A conta começa com um período de teste grátis, sem cartão de crédito. Depois dele, o acesso continua apenas com um plano pago, no Pix ou no cartão de crédito, pelo Mercado Pago.',
      'No cartão, a assinatura renova sozinha todo mês até ser cancelada. No Pix, cada pagamento libera um período de acesso e não há renovação automática.',
      'O plano Individual é para quem atende sozinho: só o titular da conta usa o sistema, como o único profissional, sem recepção nem outros usuários. Para ter equipe, é preciso um plano com equipe, como o Pro.',
      'Os preços dos planos podem mudar. Uma mudança de preço não afeta o período já pago e será avisada com antecedência.',
    ]],
    ['4. Desistência e cancelamento', [
      'Você pode desistir da contratação em até 7 dias depois do pagamento e receber o valor de volta, como prevê o art. 49 do Código de Defesa do Consumidor. Basta pedir ao suporte.',
      'Depois desse prazo, você pode cancelar quando quiser: o acesso continua até o fim do período já pago, e não há devolução proporcional.',
      'A falta de pagamento bloqueia o acesso depois do prazo de tolerância. Os dados continuam guardados e o acesso volta quando a assinatura for regularizada.',
    ]],
    ['5. Dados dos pacientes e LGPD', [
      'A clínica é a controladora dos dados dos seus pacientes e responde pela base legal para tratá-los, inclusive os dados de saúde. A Sonelia atua como operadora: guarda e processa esses dados apenas para prestar o serviço, segundo as instruções da clínica.',
      'A Sonelia não vende nem compartilha os dados da clínica e dos pacientes, e só os acessa quando for necessário para dar suporte, corrigir problemas ou cumprir a lei.',
      'Cada clínica vê somente os próprios dados. A conexão é criptografada, e o sistema registra quem abriu cada prontuário.',
    ]],
    ['6. Prontuário', [
      'O conteúdo do prontuário é de responsabilidade do profissional que o escreve. Prontuários não podem ser apagados antes de 20 anos, como determina a Lei 13.787/2018; correções são feitas por adendos, sem apagar o registro original.',
    ]],
    ['7. Uso adequado', [
      'É proibido usar o sistema para fins ilegais, tentar acessar dados de outras clínicas, sobrecarregar ou atacar o serviço, ou revender o acesso sem autorização.',
      'A Sonelia pode suspender a conta que descumprir estes termos.',
    ]],
    ['8. Disponibilidade e responsabilidade', [
      'Trabalhamos para manter o sistema disponível o tempo todo, mas podem ocorrer interrupções para manutenção ou por falhas de terceiros (internet, servidores, Mercado Pago).',
      'As decisões clínicas, administrativas e financeiras tomadas com base nas informações do sistema são de responsabilidade da clínica.',
    ]],
    ['9. Encerramento da conta', [
      'A clínica pode pedir o encerramento da conta a qualquer momento. Os prontuários continuam guardados pelo prazo exigido em lei.',
    ]],
    ['10. Mudanças nos termos', [
      'Estes termos podem ser atualizados. Mudanças importantes serão avisadas no sistema ou por e-mail. Continuar usando a Sonelia depois do aviso significa concordar com a nova versão.',
    ]],
  ],
};

export const TERMOS_AFILIADO = {
  titulo: 'Termos do afiliado',
  subtitulo: 'Para quem divulga a Sonelia e ganha comissão',
  secoes: [
    ['1. O programa de afiliados', [
      'O afiliado divulga a Sonelia para clínicas e recebe uma comissão por cada clínica que criar a conta pelo seu link ou código e pagar a primeira mensalidade. Ao criar a conta de afiliado, você aceita estes termos.',
    ]],
    ['2. Como a indicação é contada', [
      'A clínica precisa criar a conta pelo seu link ou digitar o seu código no cadastro. Clínicas já cadastradas, ou que se cadastrarem sem o seu link ou código, não contam.',
      'Cada clínica gera uma única comissão, mesmo que continue pagando nos meses seguintes.',
    ]],
    ['3. Valor da comissão e prazo', [
      'A comissão é de 50% do valor da primeira mensalidade do plano assinado pela clínica indicada (por exemplo: R$ 50,00 no plano Individual, de R$ 100,00, e R$ 100,00 no plano Pro, de R$ 200,00). Descontos de indicação que a clínica tiver não diminuem a comissão.',
      'O cliente tem 7 dias, pelo Código de Defesa do Consumidor, para desistir e receber o dinheiro de volta. Por isso, a comissão fica em carência e só pode ser paga a partir do 8º dia depois do pagamento da clínica.',
      'Se o pagamento da clínica for devolvido ou contestado antes de a comissão ser paga, ela é cancelada. Ela volta a valer se a clínica pagar de novo.',
    ]],
    ['4. Pagamento das comissões', [
      'As comissões liberadas são pagas por Pix, na chave cadastrada pelo afiliado, uma vez por mês. Você acompanha tudo no painel do afiliado: o que está em carência, o que está para receber e o que já recebeu.',
      'Mantenha a chave Pix e o CPF ou CNPJ corretos. Pagamentos feitos na chave informada pelo afiliado são considerados entregues.',
    ]],
    ['5. Impostos e vínculo', [
      'O afiliado é independente: não há vínculo de emprego, sociedade ou representação comercial com a Sonelia. Cada um é responsável pelos próprios impostos.',
      'A Sonelia pode pedir nota fiscal (por exemplo, como MEI) ou os dados necessários para registrar o pagamento, conforme a lei.',
    ]],
    ['6. Divulgação permitida', [
      'Divulgue com honestidade: não prometa recursos, preços ou resultados que o sistema não oferece.',
      'É proibido: enviar spam ou mensagens em massa para quem não pediu; criar anúncios pagos com o nome "Sonelia" sem autorização; usar a marca em domínios, perfis ou páginas que pareçam oficiais; e indicar a si mesmo ou criar clínicas falsas para ganhar comissão.',
    ]],
    ['7. Desativação', [
      'A Sonelia pode desativar o afiliado que descumprir estes termos. As comissões ligadas a fraude ou a indicações irregulares são canceladas. Comissões legítimas já liberadas continuam sendo pagas.',
      'O afiliado pode encerrar a participação a qualquer momento, pedindo ao suporte.',
    ]],
    ['8. Mudanças no programa', [
      'O valor da comissão e as regras do programa podem mudar, com aviso prévio no painel do afiliado. As mudanças não afetam as comissões já liberadas.',
    ]],
    ['9. Seus dados', [
      'Usamos o seu nome, contato, CPF ou CNPJ e chave Pix apenas para administrar o programa e pagar as comissões, conforme a LGPD.',
    ]],
  ],
};
