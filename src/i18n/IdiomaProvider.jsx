import { useCallback, useEffect, useMemo, useState } from 'react';
import { IdiomaContext } from './IdiomaContext';
import { lerIdioma, salvarIdioma, LOCALE } from './idioma';
import { traduzir } from './textos';

export function IdiomaProvider({ children }) {
  const [idioma] = useState(lerIdioma);

  useEffect(() => {
    salvarIdioma(idioma);
  }, [idioma]);

  // Trocar de idioma guarda a escolha e recarrega a página: todo o sistema volta já no idioma novo.
  const setIdioma = useCallback((novo) => {
    salvarIdioma(novo, true);
    window.location.reload();
  }, []);

  const t = useCallback((chave, params) => traduzir(idioma, chave, params), [idioma]);
  const valor = useMemo(() => ({ idioma, setIdioma, t, locale: LOCALE[idioma] }), [idioma, setIdioma, t]);

  return <IdiomaContext.Provider value={valor}>{children}</IdiomaContext.Provider>;
}

export default IdiomaProvider;
