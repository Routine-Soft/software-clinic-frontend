import { tr } from '@/i18n';
export const ROTULO_FUNCAO = {
  super_admin: tr('Super admin'),
  admin: tr('Administrador'),
  profissional: tr('Profissional'),
  recepcao: tr('Recepção'),
  afiliado: tr('Afiliado'),
};

// A recepção administra os usuários da clínica, menos as contas de administrador (o backend também barra).
export function podeAlterarUsuario(usuarioLogado, alvo) {
  return !(usuarioLogado?.role === 'recepcao' && ['admin', 'super_admin'].includes(alvo.role));
}

// Área de atuação escolhida no cadastro da clínica (mesmas chaves de clinica-nova.js no backend).
// Define o que a clínica nova já recebe pronto e se as avaliações aparecem no menu.
export const AREAS_CLINICA = [
  ['psicologia', tr('Psicologia')],
  ['psiquiatria', tr('Psiquiatria')],
  ['neuropsicologia', tr('Neuropsicologia')],
  ['clinica_medica', tr('Clínica médica')],
  ['terapias', tr('Terapias (TO, ABA e outras)')],
  ['fisioterapia', tr('Fisioterapia')],
  ['fonoaudiologia', tr('Fonoaudiologia')],
  ['nutricao', tr('Nutrição')],
  ['odontologia', tr('Odontologia')],
  ['estetica', tr('Estética')],
  ['saude_trabalho', tr('Saúde do trabalho')],
  ['outra', tr('Outra área')],
];

// Áreas em que a avaliação neuropsicológica e a NR-01 aparecem no menu. Clínica sem área (cadastrada antes
// dessa escolha) ou de "outra área" vê tudo.
const AREAS_COM_AVALIACOES = ['psicologia', 'psiquiatria', 'neuropsicologia', 'clinica_medica', 'terapias', 'saude_trabalho', 'outra'];

export function clinicaVeAvaliacoes(user) {
  const area = user?.areaClinica ?? null;
  return !area || AREAS_COM_AVALIACOES.includes(area);
}
