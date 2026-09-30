// E-mail sem espaços e em minúsculas enquanto a pessoa digita: "Maria@Gmail.com " vira "maria@gmail.com",
// e o login não falha por diferença de maiúscula.
export function normalizarEmail(valor) {
  return String(valor ?? '').replace(/\s+/g, '').toLowerCase();
}
