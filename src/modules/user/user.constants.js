export const ROTULO_FUNCAO = {
  super_admin: 'Super admin',
  admin: 'Administrador',
  profissional: 'Profissional',
  recepcao: 'Recepção',
};

// A recepção administra os usuários da clínica, menos as contas de administrador (o backend também barra).
export function podeAlterarUsuario(usuarioLogado, alvo) {
  return !(usuarioLogado?.role === 'recepcao' && ['admin', 'super_admin'].includes(alvo.role));
}
