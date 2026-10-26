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

// Idade em anos, meses e dias a partir de uma data-only ISO (ex.: 32 anos, 4 meses e 3 dias).
export function calcularIdadeCompleta(isoString) {
  if (!isoString) return null;
  const [ano, mes, dia] = isoString.substring(0, 10).split('-').map(Number);
  const hoje = new Date();
  let anos = hoje.getFullYear() - ano;
  let meses = hoje.getMonth() + 1 - mes;
  let dias = hoje.getDate() - dia;
  if (dias < 0) {
    meses -= 1;
    // Empresta os dias do mês anterior ao atual.
    dias += new Date(hoje.getFullYear(), hoje.getMonth(), 0).getDate();
  }
  if (meses < 0) {
    anos -= 1;
    meses += 12;
  }
  return anos < 0 ? null : { anos, meses, dias };
}
