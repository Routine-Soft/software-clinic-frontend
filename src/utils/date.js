// Formata uma data-only ISO string (ex: "1988-03-03T00:00:00.000Z") vinda do backend
// direto por manipulação de string, sem passar por `new Date(...)`. Isso evita o bug
// de fuso horário: reconstruir um Date a partir de uma string UTC e ler os componentes
// locais desloca a data em 1 dia em fusos negativos (ex: Brasil, UTC-3).
export function formatDataBR(isoString) {
  if (!isoString) return null;
  const [ano, mes, dia] = isoString.substring(0, 10).split('-');
  return `${dia}/${mes}/${ano}`;
}

// Idade em anos a partir de uma data-only ISO, também sem passar por `new Date(...)`.
export function calcularIdade(isoString) {
  if (!isoString) return null;
  const [ano, mes, dia] = isoString.substring(0, 10).split('-').map(Number);
  const hoje = new Date();
  let idade = hoje.getFullYear() - ano;
  const aindaNaoFezAniversario = hoje.getMonth() + 1 < mes || (hoje.getMonth() + 1 === mes && hoje.getDate() < dia);
  if (aindaNaoFezAniversario) idade -= 1;
  return idade;
}
