// Traduções para o inglês dos textos do sistema: { 'texto em português': 'English text' }.
import geral from './geral';
import clinica from './clinica';
import negocio from './negocio';
import avaliacoes from './avaliacoes';
import extras from './extras';
import termos from './termos';
import acompanhamento from './acompanhamento';
import anamnese from './anamnese';
import jornada from './jornada';
import freemium from './freemium';
import whatsapp from './whatsapp';
import importacao from './importacao';
import financeiro from './financeiro';

export default { ...financeiro, ...importacao, ...geral, ...clinica, ...negocio, ...avaliacoes, ...extras, ...termos, ...acompanhamento, ...anamnese, ...jornada, ...freemium, ...whatsapp };
