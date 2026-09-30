import { useEffect, useRef, useState } from 'react';

// O Client ID é público; a variável de ambiente permite trocar sem mexer no código.
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
  || '1022121828002-pf838u13cosngkb5uffb3slq1foneq0c.apps.googleusercontent.com';

let scriptGoogle = null;

// Carrega o script do Google uma vez só, mesmo indo e voltando entre login e cadastro.
function carregarScriptGoogle() {
  if (window.google?.accounts?.id) return Promise.resolve(window.google);
  if (!scriptGoogle) {
    scriptGoogle = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.onload = () => resolve(window.google);
      script.onerror = () => {
        scriptGoogle = null;
        reject(new Error('Não foi possível carregar o login do Google.'));
      };
      document.head.appendChild(script);
    });
  }
  return scriptGoogle;
}

// Botão oficial "Continuar com o Google". Entrega o token (credential) para quem usa o componente.
export default function BotaoGoogle({ onCredencial }) {
  const areaRef = useRef(null);
  const onCredencialRef = useRef(onCredencial);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    onCredencialRef.current = onCredencial;
  }, [onCredencial]);

  useEffect(() => {
    let cancelado = false;

    carregarScriptGoogle()
      .then((google) => {
        if (cancelado || !areaRef.current) return;
        google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: (resposta) => onCredencialRef.current?.(resposta.credential),
          ux_mode: 'popup',
        });
        const escuro = document.documentElement.dataset.theme === 'dark'
          || (document.documentElement.dataset.theme !== 'light' && window.matchMedia('(prefers-color-scheme: dark)').matches);
        google.accounts.id.renderButton(areaRef.current, {
          type: 'standard',
          theme: escuro ? 'filled_black' : 'outline',
          size: 'large',
          shape: 'pill',
          text: 'continue_with',
          logo_alignment: 'center',
          locale: 'pt-BR',
          width: Math.min(400, Math.max(200, Math.floor(areaRef.current.clientWidth))),
        });
      })
      .catch((err) => {
        if (!cancelado) setErro(err.message);
      });

    return () => {
      cancelado = true;
    };
  }, []);

  return (
    <div className="auth-google">
      <div ref={areaRef} className="auth-google__botao" />
      {erro && <p className="field__hint">{erro}</p>}
    </div>
  );
}
