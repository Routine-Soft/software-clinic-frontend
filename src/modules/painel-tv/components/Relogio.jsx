import { useEffect, useState } from 'react';
import { localeAtual } from '@/i18n';

function formatar(data) {
  return {
    hora: data.toLocaleTimeString(localeAtual(), { hour: '2-digit', minute: '2-digit' }),
    dia: data.toLocaleDateString(localeAtual(), { weekday: 'long', day: 'numeric', month: 'long' }),
  };
}

export default function Relogio() {
  const [agora, setAgora] = useState(() => formatar(new Date()));

  useEffect(() => {
    const intervalo = setInterval(() => setAgora(formatar(new Date())), 15000);
    return () => clearInterval(intervalo);
  }, []);

  return (
    <div className="tv-relogio">
      <strong>{agora.hora}</strong>
      <span>{agora.dia}</span>
    </div>
  );
}
