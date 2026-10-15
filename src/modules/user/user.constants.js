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
