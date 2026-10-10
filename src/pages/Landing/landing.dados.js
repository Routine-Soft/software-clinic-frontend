// Textos da landing page. Os ícones são chaves de ICONES (components/Sidebar/menuIcones.jsx).
// As capturas em public/landing/ foram tiradas de uma clínica de demonstração com dados fictícios.

export const SECOES = [
  ['funcionalidades', 'Funcionalidades'],
  ['como-funciona', 'Como funciona'],
  ['para-quem', 'Para quem'],
  ['precos', 'Preços'],
  ['duvidas', 'Dúvidas'],
];

export const ESPECIALIDADES = [
  'Clínicas multiprofissionais',
  'Psicologia',
  'Psiquiatria',
  'Nutrição',
  'Fonoaudiologia',
  'Neuropsicologia',
  'Saúde do trabalho (NR-01)',
];

export const DORES = [
  {
    icone: 'agenda',
    dor: 'Agenda no caderno, na planilha e no WhatsApp',
    solucao: 'Uma agenda só para a clínica inteira, com uma cor para cada profissional, visão de dia, semana e mês, salas e consultas que se repetem.',
  },
  {
    icone: 'prontuario',
    dor: 'Prontuário em papel, difícil de achar e sem sigilo',
    solucao: 'Prontuário eletrônico com histórico em linha do tempo, CID-10, alergias em destaque e leitura liberada só para quem pode ver.',
  },
  {
    icone: 'receita',
    dor: 'Fim do mês perdido calculando repasse na planilha',
    solucao: 'O repasse de cada profissional é calculado sozinho a cada atendimento realizado, por percentual ou valor fixo, e fica tudo registrado.',
  },
  {
    icone: 'convenios',
    dor: 'Cada convênio tem um preço e ninguém lembra qual',
    solucao: 'Tabela de preço e de repasse por convênio dentro de cada serviço: ao agendar, o valor certo já aparece.',
  },
  {
    icone: 'espera',
    dor: 'O paciente desmarcou e o horário ficou vazio',
    solucao: 'Lista de espera por especialidade e profissional: quando abre uma vaga, você já sabe quem chamar.',
  },
  {
    icone: 'inicio',
    dor: 'Ninguém sabe ao certo como está o dia',
    solucao: 'A página inicial mostra a agenda de hoje, quem está em atendimento agora, a lista de espera e os cancelamentos do mês.',
  },
];

export const VITRINE = [
  {
    chave: 'agenda',
    rotulo: 'Agenda',
    imagem: '/landing/agenda-semana.jpg',
    titulo: 'A agenda da clínica inteira em uma tela',
    itens: [
      'Visão de dia, semana e mês, com uma cor por profissional',
      'Sala, serviço, convênio e valor em cada agendamento',
      'Consultas que se repetem: escolha os dias e até quando',
      'Filtro por profissional e busca por paciente',
      'Cancelados aparecem riscados, sem sumir do histórico',
      'Comprovante do agendamento pronto para imprimir',
    ],
  },
  {
    chave: 'prontuario',
    rotulo: 'Prontuário',
    imagem: '/landing/prontuario.jpg',
    titulo: 'Prontuário eletrônico completo e sigiloso',
    itens: [
      'Queixa, anamnese, exame, avaliação, CID-10, conduta e retorno',
      'Histórico de atendimentos em linha do tempo',
      'Adendos: corrija ou complemente sem apagar o original',
      'O autor escolhe quem mais pode ler cada atendimento',
      'Alergias e medicamentos em destaque no topo',
      'Registro de quem abriu cada prontuário',
    ],
  },
  {
    chave: 'inicio',
    rotulo: 'Página inicial',
    imagem: '/landing/inicio.jpg',
    titulo: 'O resumo do dia logo ao entrar',
    itens: [
      'Agenda de hoje, com um clique para abrir o prontuário',
      'Quem está em atendimento neste momento',
      'Pacientes na lista de espera e cancelamentos do mês',
      'Cada pessoa vê o resumo do seu papel na clínica',
    ],
  },
  {
    chave: 'pacientes',
    rotulo: 'Pacientes',
    imagem: '/landing/pacientes.jpg',
    titulo: 'Cadastro de pacientes simples e organizado',
    itens: [
      'Busca por nome, CPF, telefone ou e-mail',
      'Convênio e empresa de cada paciente',
      'Menores de idade com até dois responsáveis',
      'Paciente de teste para experimentar o sistema à vontade',
    ],
  },
  {
    chave: 'repasses',
    rotulo: 'Repasses',
    imagem: '/landing/repasses.jpg',
    titulo: 'Repasse dos profissionais sem planilha',
    itens: [
      'Quanto cada profissional tem a receber, atualizado na hora',
      'Atendimentos detalhados com a parte da clínica e a do profissional',
      'Pague tudo de uma vez e guarde o histórico de pagamentos',
      'O profissional acompanha os próprios repasses pelo login dele',
    ],
  },
  {
    chave: 'painel',
    rotulo: 'Painel Admin',
    imagem: '/landing/painel-admin.jpg',
    titulo: 'Configuração guiada, passo a passo',
    itens: [
      'Um caminho numerado mostra o que cadastrar primeiro',
      'Especialidades, profissionais, convênios, serviços e salas',
      'Preço e repasse por convênio em cada serviço',
      'Usuários da clínica com o papel de cada um',
    ],
  },
  {
    chave: 'reunioes',
    rotulo: 'Reuniões',
    imagem: '/landing/reunioes.jpg',
    titulo: 'Agenda separada para reuniões internas',
    itens: [
      'Conversas com clientes antes de fecharem o serviço',
      'Sem serviço, sala ou valor: só com quem, quando e o assunto',
      'Telefone com atalho para o WhatsApp',
      'Só a gestão e a recepção veem',
    ],
  },
];

export const FUNCIONALIDADES = [
  { icone: 'agenda', titulo: 'Agenda completa', texto: 'Dia, semana e mês, salas, recorrência e uma cor por profissional.' },
  { icone: 'prontuario', titulo: 'Prontuário eletrônico', texto: 'Histórico, CID-10, sinais vitais, anexos, adendos e impressão.' },
  { icone: 'pacientes', titulo: 'Pacientes', texto: 'Cadastro com convênio, empresa e responsáveis para menores.' },
  { icone: 'espera', titulo: 'Lista de espera', texto: 'Quem está aguardando vaga, por especialidade e profissional.' },
  { icone: 'convenios', titulo: 'Convênios', texto: 'Preço e repasse diferentes para cada convênio em cada serviço.' },
  { icone: 'receita', titulo: 'Repasses', texto: 'Cálculo automático e histórico de pagamentos aos profissionais.' },
  { icone: 'nr01', titulo: 'Avaliação NR-01', texto: 'Riscos psicossociais dos funcionários das empresas atendidas.' },
  { icone: 'neuro', titulo: 'Avaliação neuropsicológica', texto: 'Registro estruturado das avaliações neuropsicológicas.' },
  { icone: 'reunioes', titulo: 'Reuniões', texto: 'Agenda à parte para conversas com clientes e parceiros.' },
  { icone: 'empresas', titulo: 'Empresas clientes', texto: 'Empresas atendidas pela clínica e seus funcionários.' },
  { icone: 'usuarios', titulo: 'Usuários e permissões', texto: 'Gestão, recepção e profissionais, cada um com seu acesso.' },
  { icone: 'painel', titulo: 'Painel guiado', texto: 'Passo a passo para deixar a clínica pronta para atender.' },
];

export const PERFIS = [
  {
    icone: 'painel',
    papel: 'Gestão da clínica',
    texto: 'Enxerga a clínica inteira e decide quem acessa o quê.',
    itens: ['Agenda de todos os profissionais', 'Repasses e pagamentos', 'Cadastros, usuários e assinatura'],
  },
  {
    icone: 'agenda',
    papel: 'Recepção',
    texto: 'Cuida da agenda e dos pacientes sem ver o conteúdo clínico.',
    itens: ['Agendar, remarcar e cancelar', 'Cadastrar pacientes e responsáveis', 'Lista de espera e reuniões'],
  },
  {
    icone: 'profissionais',
    papel: 'Profissional',
    texto: 'Abre o sistema já na própria agenda e foca no atendimento.',
    itens: ['A própria agenda do dia', 'Prontuário dos seus pacientes', 'Quanto tem a receber de repasse'],
  },
];

export const PASSOS = [
  { titulo: 'Crie sua conta', texto: 'Leva dois minutos e não pede cartão de crédito. Dá para entrar com o Google.' },
  { titulo: 'Configure com o passo a passo', texto: 'O Painel Admin mostra o que cadastrar: especialidades, profissionais, convênios, serviços e salas.' },
  { titulo: 'Comece a agendar e atender', texto: 'Convide a recepção e os profissionais. Cada um entra com o próprio login.' },
];

export const SEGURANCA = [
  'Cada clínica vê somente os próprios dados',
  'Prontuário lido só pelo autor e por quem ele liberar',
  'A recepção não vê o conteúdo clínico',
  'Registro de quem abriu cada prontuário',
  'Prontuários guardados por 20 anos, como pede a Lei 13.787/2018',
  'Conexão criptografada (HTTPS) e login com senha ou Google',
];

export const PLANO_PRO = [
  'Todas as funcionalidades incluídas',
  'Profissionais, pacientes e usuários sem limite',
  'Pague no Pix ou no cartão',
  'No cartão, renova sozinho e você cancela quando quiser',
];

export const DUVIDAS = [
  ['Preciso instalar alguma coisa?', 'Não. O SoftwareClinic funciona no navegador do computador, do tablet e do celular. Se quiser, dá para instalar como aplicativo, com ícone na área de trabalho ou na tela inicial.'],
  ['Como funciona o teste grátis?', 'Você usa tudo liberado por 3 dias, sem cadastrar cartão. Depois, é só assinar o plano Pro no Pix ou no cartão para continuar.'],
  ['Quantos profissionais posso cadastrar?', 'No plano Pro não há limite de profissionais, pacientes nem usuários.'],
  ['A recepção consegue ler o prontuário?', 'Não. A recepção vê a agenda e os dados de cadastro, mas o conteúdo clínico fica restrito aos profissionais autorizados.'],
  ['O sistema atende convênios?', 'Sim. Você cadastra os convênios e define, em cada serviço, o preço e o repasse do profissional para cada um deles.'],
  ['Posso cancelar quando quiser?', 'Sim. No cartão, você cancela a renovação a qualquer momento e o acesso continua até o fim do período pago. O Pix não renova sozinho.'],
  ['Meus dados ficam seguros?', 'Cada clínica acessa apenas os próprios dados, a conexão é criptografada e o prontuário tem regras de sigilo e registro de acesso.'],
];
