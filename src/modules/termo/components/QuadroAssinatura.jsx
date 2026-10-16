import { useEffect, useRef, useState } from 'react';
import { tr } from '@/i18n';

const ALTURA = 180;
const TINTA = '#13234a';

// Quadro para desenhar a assinatura com o dedo, a caneta ou o mouse. Avisa o pai com o PNG (ou null ao limpar).
export default function QuadroAssinatura({ onChange, desabilitado = false }) {
  const canvasRef = useRef(null);
  const desenhando = useRef(false);
  const ultimoPonto = useRef(null);
  const [vazio, setVazio] = useState(true);

  // Ajusta a resolução do quadro à tela (nítido no celular). Mudar o tamanho apaga o desenho: avisa o pai.
  useEffect(() => {
    const canvas = canvasRef.current;
    function ajustar() {
      const escala = Math.min(window.devicePixelRatio || 1, 2);
      const largura = canvas.clientWidth;
      if (canvas.width === Math.round(largura * escala)) return false;
      canvas.width = Math.round(largura * escala);
      canvas.height = Math.round(ALTURA * escala);
      const ctx = canvas.getContext('2d');
      ctx.scale(escala, escala);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = 2.4;
      ctx.strokeStyle = TINTA;
      return true;
    }
    ajustar();
    const observador = new ResizeObserver(() => {
      if (!ajustar()) return;
      setVazio(true);
      onChange(null);
    });
    observador.observe(canvas);
    return () => observador.disconnect();
  }, [onChange]);

  function ponto(e) {
    const caixa = canvasRef.current.getBoundingClientRect();
    return { x: e.clientX - caixa.left, y: e.clientY - caixa.top };
  }

  function comecar(e) {
    if (desabilitado) return;
    e.preventDefault();
    canvasRef.current.setPointerCapture(e.pointerId);
    desenhando.current = true;
    ultimoPonto.current = ponto(e);
    // Um toque sem arrastar vira um pontinho.
    const ctx = canvasRef.current.getContext('2d');
    ctx.beginPath();
    ctx.arc(ultimoPonto.current.x, ultimoPonto.current.y, 1.2, 0, Math.PI * 2);
    ctx.fillStyle = TINTA;
    ctx.fill();
  }

  function mover(e) {
    if (!desenhando.current) return;
    e.preventDefault();
    const atual = ponto(e);
    const ctx = canvasRef.current.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(ultimoPonto.current.x, ultimoPonto.current.y);
    ctx.lineTo(atual.x, atual.y);
    ctx.stroke();
    ultimoPonto.current = atual;
  }

  function terminar() {
    if (!desenhando.current) return;
    desenhando.current = false;
    setVazio(false);
    onChange(canvasRef.current.toDataURL('image/png'));
  }

  function limpar() {
    const canvas = canvasRef.current;
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    setVazio(true);
    onChange(null);
  }

  return (
    <div className="quadro-assinatura">
      <div className="quadro-assinatura__area">
        <canvas
          ref={canvasRef}
          className="quadro-assinatura__canvas"
          style={{ height: ALTURA }}
          onPointerDown={comecar}
          onPointerMove={mover}
          onPointerUp={terminar}
          onPointerCancel={terminar}
          role="img"
          aria-label={tr('Quadro para desenhar a assinatura')}
        />
        {vazio && <span className="quadro-assinatura__dica" aria-hidden="true">{tr('Assine aqui com o dedo ou o mouse')}</span>}
        <span className="quadro-assinatura__linha" aria-hidden="true" />
      </div>
      <button type="button" className="btn btn--ghost btn--sm" onClick={limpar} disabled={vazio || desabilitado}>
        {tr('Limpar e assinar de novo')}
      </button>
    </div>
  );
}
