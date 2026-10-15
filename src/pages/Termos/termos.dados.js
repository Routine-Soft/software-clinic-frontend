// Textos dos termos aceitos no cadastro. Ao mudar o texto, mude também a data (VERSAO) aqui e no backend
// (TERMOS_CLINICA_VERSAO em user.service.js e TERMOS_AFILIADO_VERSAO em afiliado.service.js).
// Os dados da empresa que ficarem vazios simplesmente não aparecem na página. Este arquivo também é lido pelo
// blog/gerar.mjs, que publica as versões sem "#" (sonelia.com.br/privacidade etc.): por isso só import relativo.
import { WHATSAPP_EXIBICAO, LINK_WHATSAPP } from '../../utils/contato.js';

export const CONTATO = { whatsapp: WHATSAPP_EXIBICAO, linkWhatsapp: LINK_WHATSAPP };
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

export const PRIVACIDADE = {
  versao: '15/10/2026',
  titulo: 'Política de privacidade',
  subtitulo: 'Como a Sonelia trata os dados pessoais',
  secoes: [
    ['1. Quem somos', [
      'A Sonelia é um sistema on-line de gestão para clínicas: agenda, pacientes, prontuário eletrônico, convênios, repasses e lembretes de consulta. Esta política explica quais dados pessoais tratamos, para quê e quais são os seus direitos, de acordo com a Lei Geral de Proteção de Dados (Lei 13.709/2018, LGPD).',
    ]],
    ['2. Dois papéis diferentes', [
      'Dados de quem usa o sistema (dono da clínica, recepção, profissionais e afiliados): a Sonelia é a controladora desses dados.',
      'Dados dos pacientes que a clínica cadastra, inclusive o prontuário: a controladora é a clínica, e a Sonelia é a operadora. Tratamos esses dados só para prestar o serviço, conforme as instruções da clínica. Pedidos de pacientes sobre os próprios dados devem ser feitos à clínica, e a Sonelia ajuda a clínica a atendê-los.',
    ]],
    ['3. Dados que tratamos', [
      'Cadastro: nome, e-mail, telefone, nome e CNPJ da clínica e a senha, que é guardada de forma criptografada e nunca em texto.',
      'Login com Google: nome, e-mail e o identificador da conta Google.',
      'Pagamento: os dados do cartão ficam com o Mercado Pago. A Sonelia recebe só a situação do pagamento e, no Pix, o CPF ou CNPJ de quem paga.',
      'Dados inseridos pela clínica: pacientes, responsáveis, agenda, prontuário e outros registros de atendimento, inclusive dados de saúde, que a lei trata como dados sensíveis.',
      'WhatsApp: quando a clínica usa os lembretes de consulta e o paciente autorizou, tratamos o número de celular do paciente, o texto do lembrete e a resposta dele (confirmar ou desmarcar).',
      'Uso do site: estatísticas de visitas sem cookies (Vercel Web Analytics), que não identificam a pessoa. Preferências, como o tema de cores, ficam guardadas só no seu navegador.',
    ]],
    ['4. Para que usamos', [
      'Para prestar o serviço contratado e manter a conta funcionando; cobrar a assinatura; enviar e-mails do sistema, como o de redefinição de senha; enviar os lembretes de consulta pelo WhatsApp quando a clínica ativa o recurso e o paciente autoriza; dar suporte; cumprir obrigações legais; e melhorar o sistema com estatísticas de uso.',
      'Não vendemos dados pessoais e não usamos os dados dos pacientes para publicidade.',
    ]],
    ['5. Com quem compartilhamos', [
      'Só com os fornecedores necessários para o serviço funcionar, cada um usando os dados apenas para essa finalidade: hospedagem do sistema (OVHcloud) e do site (Vercel), banco de dados (MongoDB Atlas), pagamentos (Mercado Pago), envio de e-mails (Resend), mensagens de WhatsApp (Meta, pela plataforma WhatsApp Business) e login com Google (Google).',
      'Alguns desses fornecedores guardam dados fora do Brasil, com as garantias previstas na LGPD.',
      'Também podemos compartilhar dados quando a lei ou uma ordem judicial exigir.',
    ]],
    ['6. Por quanto tempo guardamos', [
      'Os dados da conta ficam guardados enquanto ela existir. Os prontuários seguem o prazo mínimo de guarda de 20 anos da Lei 13.787/2018 e as regras de cada conselho profissional. Os registros de pagamento ficam pelo prazo exigido pelas leis fiscais. As chamadas da TV da sala de espera são apagadas em 24 horas.',
    ]],
    ['7. Segurança', [
      'Usamos conexão criptografada (HTTPS), senhas guardadas com criptografia e acesso por perfil: a recepção não vê o conteúdo clínico, e o sistema registra quem abriu cada prontuário. Se acontecer um incidente de segurança que possa causar risco relevante, avisamos as pessoas afetadas e a Autoridade Nacional de Proteção de Dados (ANPD), como manda a lei.',
    ]],
    ['8. Seus direitos', [
      'Pela LGPD, você pode pedir: confirmação de que tratamos seus dados, acesso, correção, anonimização, portabilidade, exclusão, informação sobre com quem compartilhamos e a revogação do consentimento. Faça o pedido pelo contato no fim desta página. Para excluir a conta e os dados, veja a página Exclusão de dados (sonelia.com.br/exclusao-de-dados).',
    ]],
    ['9. Mudanças nesta política', [
      'Esta política pode ser atualizada. Mudanças importantes serão avisadas no sistema ou por e-mail, e a data da versão no topo da página muda.',
    ]],
  ],
};

export const EXCLUSAO_DE_DADOS = {
  versao: '15/10/2026',
  titulo: 'Exclusão de dados',
  subtitulo: 'Como pedir a exclusão da sua conta e dos seus dados',
  secoes: [
    ['1. Quem usa a Sonelia', [
      'Donos de clínica, profissionais, recepção e afiliados podem pedir a exclusão da conta e dos dados pelo contato no fim desta página, de preferência a partir do telefone ou e-mail cadastrado. Para sua segurança, confirmamos que o pedido é seu antes de excluir.',
      'Usuários de uma clínica (recepção e profissionais) também podem ser excluídos pelo administrador da clínica, no menu Usuários.',
      'Fazemos a exclusão em até 15 dias e avisamos quando terminar.',
    ]],
    ['2. O que é apagado e o que precisa ficar', [
      'Apagamos os dados de cadastro e de acesso. Ficam guardados só os dados que a lei obriga: os prontuários pelo prazo mínimo de 20 anos (Lei 13.787/2018) e os registros de pagamento pelo prazo das leis fiscais. Esses dados ficam bloqueados para qualquer outro uso.',
    ]],
    ['3. Pacientes', [
      'Os dados do paciente pertencem à clínica onde ele é atendido. Para pedir acesso, correção ou exclusão, fale com a clínica: a Sonelia dá a ela as ferramentas para atender o pedido.',
      'Para parar de receber os lembretes de consulta pelo WhatsApp, avise a clínica, que desmarca a autorização no seu cadastro.',
    ]],
    ['4. Dados recebidos pelo WhatsApp', [
      'O número de celular e as respostas recebidas pelo WhatsApp fazem parte dos dados da clínica e são apagados junto com o cadastro do paciente ou da clínica, respeitando os prazos legais acima.',
    ]],
  ],
};
