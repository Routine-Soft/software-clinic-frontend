import { tr } from '@/i18n';

// Variáveis do texto do lembrete (as mesmas de lembrete.texto.js no backend) e os exemplos da prévia.
export const VARIAVEIS_DO_LEMBRETE = [
  ['paciente', tr('Nome do paciente'), 'Maria'],
  ['data', tr('Dia da consulta'), tr('terça-feira, 18/11')],
  ['hora', tr('Horário'), '14:00'],
  ['profissional', tr('Profissional'), 'Dra. Ana'],
  ['clinica', tr('Nome da clínica'), null],
];

// Prévia do lembrete com dados de exemplo.
export function previaDoLembrete(texto, nomeClinica) {
  const exemplos = Object.fromEntries(VARIAVEIS_DO_LEMBRETE.map(([chave, , exemplo]) => [chave, exemplo ?? nomeClinica ?? '']));
  return String(texto ?? '').replace(/\{(\w+)\}/g, (trecho, nome) => (nome in exemplos ? exemplos[nome] : trecho));
}

// "5521992002356" -> "+55 21 99200-2356" (só para mostrar).
export function formatarNumeroWhatsapp(numero) {
  const d = String(numero ?? '').replace(/\D/g, '');
  const br = d.match(/^55(\d{2})(\d{4,5})(\d{4})$/);
  return br ? `+55 ${br[1]} ${br[2]}-${br[3]}` : d ? `+${d}` : '';
}
