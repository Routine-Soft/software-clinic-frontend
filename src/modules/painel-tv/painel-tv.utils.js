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

// O que a voz da TV fala: "Maria S., Sala 2".
export function textoParaFalar(chamada) {
  const quem = chamada.paciente ? chamada.paciente.replace(/\.$/, '') : 'Próximo paciente';
  return chamada.sala ? `${quem}, ${chamada.sala}` : quem;
}

export function falar(texto) {
  const voz = window.speechSynthesis;
  if (!voz || !texto) return;
  voz.cancel();
  const fala = new SpeechSynthesisUtterance(texto);
  fala.lang = 'pt-BR';
  fala.rate = 0.9;
  const portugues = voz.getVoices().find((v) => v.lang?.toLowerCase().startsWith('pt'));
  if (portugues) fala.voice = portugues;
  voz.speak(fala);
}

export function anunciar(chamada) {
  tocarAviso();
  // A voz começa depois do aviso sonoro.
  setTimeout(() => falar(textoParaFalar(chamada)), 1300);
}

export function horaCurta(iso) {
  return new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

export function visto(iso, agora) {
  if (!iso) return 'Aguardando a TV abrir o painel';
  const minutos = Math.floor((agora - new Date(iso).getTime()) / 60000);
  if (minutos < 2) return 'Ligada agora';
  if (minutos < 60) return `Vista há ${minutos} min`;
  return `Vista em ${new Date(iso).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}`;
}
