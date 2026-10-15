import { localeAtual, tr } from '@/i18n';

// Chave que a TV recebe ao ser conectada. Fica só no navegador da TV.
const CHAVE_DA_TV = 'painel-tv-chave';

export function lerChaveDaTv() {
  try {
    return localStorage.getItem(CHAVE_DA_TV);
  } catch {
    return null;
  }
}

export function guardarChaveDaTv(chave) {
  try {
    if (chave) localStorage.setItem(CHAVE_DA_TV, chave);
    else localStorage.removeItem(CHAVE_DA_TV);
  } catch {
    // Sem armazenamento (modo anônimo): a TV pede o código de novo quando recarregar.
  }
}

// Endereço que se abre na TV.
export function enderecoDoPainel() {
  return `${window.location.origin}/#/tv`;
}

// Aviso sonoro de duas notas, gerado no navegador (sem arquivo de áudio).
export function tocarAviso() {
  const Contexto = window.AudioContext || window.webkitAudioContext;
  if (!Contexto) return;
  const audio = new Contexto();
  [[880, 0], [660, 0.32]].forEach(([frequencia, inicio]) => {
    const oscilador = audio.createOscillator();
    const volume = audio.createGain();
    oscilador.type = 'sine';
    oscilador.frequency.value = frequencia;
    const t = audio.currentTime + inicio;
    volume.gain.setValueAtTime(0.0001, t);
    volume.gain.exponentialRampToValueAtTime(0.5, t + 0.03);
    volume.gain.exponentialRampToValueAtTime(0.0001, t + 0.9);
    oscilador.connect(volume).connect(audio.destination);
    oscilador.start(t);
    oscilador.stop(t + 1);
  });
  setTimeout(() => audio.close(), 1600);
}

// O que a voz da TV fala: o nome completo ("Maria da Silva, Sala 2"), mesmo quando a tela mostra abreviado.
export function textoParaFalar(chamada) {
  const nome = chamada.nomeFalado ?? chamada.paciente;
  const quem = nome ? nome.replace(/\.$/, '') : tr('Próximo paciente');
  return chamada.sala ? `${quem}, ${chamada.sala}` : quem;
}

export function falar(texto) {
  const voz = window.speechSynthesis;
  if (!voz || !texto) return;
  voz.cancel();
  const fala = new SpeechSynthesisUtterance(texto);
  // A voz segue o idioma da TV: em inglês, fala em inglês ("Next patient, Room 2").
  fala.lang = localeAtual() === 'en-US' ? 'en-US' : 'pt-BR';
  fala.rate = 0.9;
  const daLingua = voz.getVoices().find((v) => v.lang?.toLowerCase().startsWith(fala.lang.slice(0, 2)));
  if (daLingua) fala.voice = daLingua;
  voz.speak(fala);
}

export function anunciar(chamada) {
  tocarAviso();
  // A voz começa depois do aviso sonoro.
  setTimeout(() => falar(textoParaFalar(chamada)), 1300);
}

export function horaCurta(iso) {
  return new Date(iso).toLocaleTimeString(localeAtual(), { hour: '2-digit', minute: '2-digit' });
}

export function visto(iso, agora) {
  if (!iso) return tr('Aguardando a TV abrir o painel');
  const minutos = Math.floor((agora - new Date(iso).getTime()) / 60000);
  if (minutos < 2) return tr('Ligada agora');
  if (minutos < 60) return tr('Vista há {minutos} min', { minutos });
  return tr('Vista em {p0}', { p0: new Date(iso).toLocaleString(localeAtual(), { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) });
}
