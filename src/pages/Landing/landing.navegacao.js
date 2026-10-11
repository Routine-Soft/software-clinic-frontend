// O HashRouter usa o "#" da URL para as rotas, então os links do menu rolam até a seção em vez de usar âncoras.
export function irPara(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
