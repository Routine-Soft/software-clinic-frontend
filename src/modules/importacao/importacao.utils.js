import { tr } from '@/i18n';

// O que dá para importar de outro sistema. Cada campo tem os nomes de coluna mais comuns nas exportações
// (sinônimos), para a coluna certa já vir escolhida. As chaves dos campos são as que a API espera.
// papeis: quem vê o tipo (prontuário é sigiloso: só profissional de saúde; a recepção nunca).
const GESTAO = ['admin', 'recepcao', 'super_admin'];
const SAUDE = ['admin', 'profissional', 'super_admin'];

const CAMPOS_PACIENTE_LIGADO = [
  { chave: 'paciente', rotulo: tr('Paciente (nome)'), sinonimos: ['paciente', 'nome do paciente', 'nome paciente', 'cliente', 'nome do cliente', 'nome'] },
  { chave: 'pacienteCpf', rotulo: tr('CPF do paciente'), sinonimos: ['cpf', 'cpf do paciente', 'cpf paciente', 'documento'] },
  { chave: 'pacienteNascimento', rotulo: tr('Nascimento do paciente'), sinonimos: ['nascimento', 'data de nascimento', 'data nascimento', 'dt nascimento'] },
  { chave: 'profissional', rotulo: tr('Profissional (nome)'), sinonimos: ['profissional', 'nome do profissional', 'terapeuta', 'medico', 'psicologo', 'atendente', 'responsavel'] },
  { chave: 'profissionalRegistro', rotulo: tr('Registro do profissional'), sinonimos: ['registro', 'crp', 'crm', 'crefito', 'conselho', 'numero do registro'] },
];

export const TIPOS = [
  {
    chave: 'especialidades', titulo: tr('Especialidades'), icone: 'especialidades', papeis: GESTAO,
    descricao: tr('Psicologia, fisioterapia, nutrição...'),
    campos: [{ chave: 'nome', rotulo: tr('Nome'), obrigatorio: true, sinonimos: ['nome', 'especialidade', 'especialidades', 'descricao'] }],
  },
  {
    chave: 'salas', titulo: tr('Salas'), icone: 'salas', papeis: GESTAO,
    descricao: tr('Consultórios e salas de atendimento'),
    campos: [{ chave: 'nome', rotulo: tr('Nome'), obrigatorio: true, sinonimos: ['nome', 'sala', 'consultorio', 'local', 'descricao'] }],
  },
  {
    chave: 'servicos', titulo: tr('Serviços'), icone: 'servicos', papeis: GESTAO,
    descricao: tr('Consultas e sessões com o preço'),
    campos: [
      { chave: 'nome', rotulo: tr('Nome'), obrigatorio: true, sinonimos: ['nome', 'servico', 'procedimento', 'descricao'] },
      { chave: 'preco', rotulo: tr('Preço'), sinonimos: ['preco', 'valor', 'valor unitario', 'preco unitario'] },
      { chave: 'tipo', rotulo: tr('Tipo (consulta ou sessões)'), sinonimos: ['tipo', 'categoria'] },
    ],
  },
  {
    chave: 'convenios', titulo: tr('Convênios'), icone: 'convenios', papeis: GESTAO,
    descricao: tr('Planos de saúde atendidos'),
    campos: [
      { chave: 'nome', rotulo: tr('Nome'), obrigatorio: true, sinonimos: ['nome', 'convenio', 'plano', 'operadora'] },
      { chave: 'quemPaga', rotulo: tr('Quem paga (paciente ou plano)'), sinonimos: ['quem paga', 'pagador'] },
      { chave: 'coparticipacao', rotulo: tr('Coparticipação'), sinonimos: ['coparticipacao', 'copart'] },
    ],
  },
  {
    chave: 'profissionais', titulo: tr('Profissionais'), icone: 'profissionais', papeis: GESTAO,
    descricao: tr('Equipe de saúde, com registro e especialidades'),
    campos: [
      { chave: 'nome', rotulo: tr('Nome'), obrigatorio: true, sinonimos: ['nome', 'profissional', 'nome completo'] },
      { chave: 'tipoRegistro', rotulo: tr('Conselho (CRP, CRM...)'), obrigatorio: true, sinonimos: ['conselho', 'tipo de registro', 'tipo registro', 'orgao'] },
      { chave: 'numeroRegistro', rotulo: tr('Número do registro'), obrigatorio: true, sinonimos: ['numero do registro', 'registro', 'numero', 'crp', 'crm', 'crefito'] },
      { chave: 'especialidades', rotulo: tr('Especialidades'), obrigatorio: true, sinonimos: ['especialidades', 'especialidade', 'area'] },
      { chave: 'email', rotulo: tr('E-mail (cria o login)'), sinonimos: ['email', 'e-mail'] },
      { chave: 'telefone', rotulo: tr('Telefone'), sinonimos: ['telefone', 'celular', 'whatsapp', 'fone'] },
    ],
  },
  {
    chave: 'usuarios', titulo: tr('Usuários'), icone: 'usuarios', papeis: GESTAO,
    descricao: tr('Logins da recepção e da equipe'),
    campos: [
      { chave: 'nome', rotulo: tr('Nome'), obrigatorio: true, sinonimos: ['nome', 'nome completo', 'usuario'] },
      { chave: 'email', rotulo: tr('E-mail'), obrigatorio: true, sinonimos: ['email', 'e-mail', 'login'] },
      { chave: 'telefone', rotulo: tr('Telefone'), obrigatorio: true, sinonimos: ['telefone', 'celular', 'whatsapp', 'fone'] },
      { chave: 'papel', rotulo: tr('Papel (recepção ou profissional)'), sinonimos: ['papel', 'perfil', 'funcao', 'cargo', 'tipo'] },
    ],
  },
  {
    chave: 'pacientes', titulo: tr('Pacientes'), icone: 'pacientes', papeis: GESTAO,
    descricao: tr('Cadastro com contato, CPF e responsável'),
    campos: [
      { chave: 'nome', rotulo: tr('Nome'), obrigatorio: true, sinonimos: ['nome', 'paciente', 'nome completo', 'nome do paciente', 'cliente'] },
      { chave: 'dataNascimento', rotulo: tr('Data de nascimento'), obrigatorio: true, sinonimos: ['data de nascimento', 'nascimento', 'data nascimento', 'dt nascimento', 'aniversario'] },
      { chave: 'cpf', rotulo: tr('CPF'), sinonimos: ['cpf', 'documento'] },
      { chave: 'telefone', rotulo: tr('Telefone'), sinonimos: ['telefone', 'celular', 'whatsapp', 'fone', 'telefone celular'] },
      { chave: 'email', rotulo: tr('E-mail'), sinonimos: ['email', 'e-mail'] },
      { chave: 'convenio', rotulo: tr('Convênio'), sinonimos: ['convenio', 'plano de saude', 'plano'] },
      { chave: 'responsavel', rotulo: tr('Responsável (nome)'), sinonimos: ['responsavel', 'nome do responsavel', 'mae', 'pai'] },
      { chave: 'responsavelParentesco', rotulo: tr('Parentesco do responsável'), sinonimos: ['parentesco'] },
      { chave: 'responsavelCpf', rotulo: tr('CPF do responsável'), sinonimos: ['cpf do responsavel', 'cpf responsavel'] },
      { chave: 'responsavelTelefone', rotulo: tr('Telefone do responsável'), sinonimos: ['telefone do responsavel', 'telefone responsavel'] },
      { chave: 'responsavelEmail', rotulo: tr('E-mail do responsável'), sinonimos: ['email do responsavel', 'email responsavel'] },
    ],
  },
  {
    chave: 'consultas', titulo: tr('Histórico de consultas'), icone: 'agenda', papeis: GESTAO,
    descricao: tr('Consultas passadas e futuras, com valor e situação'),
    umDe: ['paciente', 'pacienteCpf'],
    campos: [
      ...CAMPOS_PACIENTE_LIGADO,
      { chave: 'data', rotulo: tr('Data'), obrigatorio: true, sinonimos: ['data', 'data da consulta', 'data do atendimento', 'dia', 'data/hora'] },
      { chave: 'horaInicio', rotulo: tr('Hora de início'), sinonimos: ['hora', 'horario', 'hora inicio', 'hora de inicio', 'inicio'] },
      { chave: 'horaFim', rotulo: tr('Hora de término'), sinonimos: ['hora fim', 'hora final', 'termino', 'hora de termino', 'fim'] },
      { chave: 'duracao', rotulo: tr('Duração (minutos)'), sinonimos: ['duracao', 'minutos', 'tempo'] },
      { chave: 'servico', rotulo: tr('Serviço'), sinonimos: ['servico', 'procedimento', 'tipo de atendimento', 'tipo'] },
      { chave: 'sala', rotulo: tr('Sala'), sinonimos: ['sala', 'consultorio', 'local'] },
      { chave: 'convenio', rotulo: tr('Convênio'), sinonimos: ['convenio', 'plano'] },
      { chave: 'valor', rotulo: tr('Valor'), sinonimos: ['valor', 'preco', 'valor cobrado', 'total'] },
      { chave: 'status', rotulo: tr('Situação'), sinonimos: ['status', 'situacao', 'estado', 'presenca'] },
      { chave: 'pago', rotulo: tr('Pago (sim ou não)'), sinonimos: ['pago', 'pagamento', 'situacao do pagamento', 'status do pagamento', 'quitado'] },
    ],
  },
  {
    chave: 'prontuarios', titulo: tr('Prontuários'), icone: 'prontuario', papeis: SAUDE, sigiloso: true,
    descricao: tr('Evoluções e registros de atendimento (sigilosos)'),
    umDe: ['paciente', 'pacienteCpf'],
    algumDe: ['informacoes', 'queixaPrincipal', 'historicoAtual', 'avaliacao', 'conduta'],
    campos: [
      ...CAMPOS_PACIENTE_LIGADO,
      { chave: 'data', rotulo: tr('Data do atendimento'), obrigatorio: true, sinonimos: ['data', 'data do atendimento', 'data da evolucao', 'data da consulta', 'dia'] },
      { chave: 'hora', rotulo: tr('Hora'), sinonimos: ['hora', 'horario'] },
      { chave: 'informacoes', rotulo: tr('Evolução / anotações'), sinonimos: ['evolucao', 'anotacoes', 'anotacao', 'registro', 'texto', 'descricao', 'observacoes', 'prontuario', 'conteudo', 'notas'] },
      { chave: 'queixaPrincipal', rotulo: tr('Queixa principal'), sinonimos: ['queixa principal', 'queixa', 'motivo da consulta', 'motivo'] },
      { chave: 'historicoAtual', rotulo: tr('História da doença atual'), sinonimos: ['historia', 'historico', 'hda', 'historia da doenca atual', 'anamnese'] },
      { chave: 'avaliacao', rotulo: tr('Avaliação / diagnóstico'), sinonimos: ['avaliacao', 'diagnostico', 'hipotese diagnostica', 'impressao'] },
      { chave: 'cid10', rotulo: tr('CID-10'), sinonimos: ['cid', 'cid10', 'cid-10'] },
      { chave: 'conduta', rotulo: tr('Conduta / plano'), sinonimos: ['conduta', 'plano', 'plano terapeutico', 'orientacoes', 'tratamento'] },
    ],
  },
];

export function tiposDoPapel(role) {
  return TIPOS.filter((t) => t.papeis.includes(role));
}

export function normalizar(texto) {
  return String(texto ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[_.]/g, ' ').replace(/\s+/g, ' ').trim();
}

// Escolhe, para cada campo, a coluna da planilha com o nome mais parecido. Primeiro os nomes iguais, depois os que contêm.
export function adivinharColunas(tipo, cabecalhos) {
  const normais = cabecalhos.map(normalizar);
  const usadas = new Set();
  const mapa = {};
  for (const modo of ['igual', 'contem']) {
    for (const campo of tipo.campos) {
      if (mapa[campo.chave] !== undefined) continue;
      // O nome do campo vem primeiro: é o cabeçalho da planilha modelo.
      for (const sinonimo of [normalizar(campo.rotulo), ...campo.sinonimos]) {
        const i = normais.findIndex((c, idx) => !usadas.has(idx) && (modo === 'igual' ? c === sinonimo : sinonimo.length > 3 && c.includes(sinonimo)));
        if (i >= 0) { mapa[campo.chave] = i; usadas.add(i); break; }
      }
    }
  }
  return mapa;
}

// O que falta escolher para poder importar (mensagens prontas para a tela).
export function pendenciasDoMapa(tipo, mapa) {
  const tem = (chave) => mapa[chave] !== undefined && mapa[chave] !== '';
  const faltas = tipo.campos.filter((c) => c.obrigatorio && !tem(c.chave)).map((c) => tr('Escolha a coluna de "{campo}"', { campo: c.rotulo }));
  if (tipo.umDe && !tipo.umDe.some(tem)) faltas.push(tr('Escolha a coluna do nome ou do CPF do paciente'));
  if (tipo.algumDe && !tipo.algumDe.some(tem)) faltas.push(tr('Escolha ao menos uma coluna com o texto do atendimento'));
  return faltas;
}

export function montarLinhas(tipo, mapa, linhas) {
  return linhas.map(({ numero, valores }) => {
    const item = { linha: numero };
    for (const campo of tipo.campos) {
      const i = mapa[campo.chave];
      if (i !== undefined && i !== '') item[campo.chave] = valores[Number(i)] ?? '';
    }
    return item;
  });
}

// Planilha modelo (CSV com ";", que o Excel em português abre direto) com os nomes das colunas do tipo.
export function baixarModelo(tipo) {
  const cabecalho = tipo.campos.map((c) => `"${c.rotulo.replace(/"/g, '""')}"`).join(';');
  const blob = new Blob([`\uFEFF${cabecalho}\n`], { type: 'text/csv;charset=utf-8' });
  baixar(blob, `modelo-${tipo.chave}.csv`);
}

// Lista das linhas com problema, para a clínica corrigir na planilha e importar de novo.
export function baixarErros(tipo, erros) {
  const linhas = [`"${tr('Linha')}";"${tr('Motivo')}"`, ...erros.map((e) => `${e.linha};"${String(e.motivo).replace(/"/g, '""')}"`)];
  baixar(new Blob([`\uFEFF${linhas.join('\n')}\n`], { type: 'text/csv;charset=utf-8' }), `erros-${tipo.chave}.csv`);
}

function baixar(blob, nome) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nome;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
