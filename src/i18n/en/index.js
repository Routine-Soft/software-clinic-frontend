// Traduções para o inglês dos textos do sistema: { 'texto em português': 'English text' }.
import geral from './geral';
import clinica from './clinica';
import negocio from './negocio';
import avaliacoes from './avaliacoes';
import extras from './extras';
import termos from './termos';

export default { ...geral, ...clinica, ...negocio, ...avaliacoes, ...extras, ...termos };
