import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Modal from '@/components/Modal/Modal';
import { marcarVistoHoje, textoDaJanela, vistoHoje } from '../assinatura.utils';
import './aviso-vencimento.css';
import { tr } from '@/i18n';

// Janela de aviso da mensalidade: aparece na primeira ação da pessoa no sistema (clique ou tecla) e, depois de
// fechada, só volta no dia seguinte. Na tela de assinaturas ela não aparece: ali a pessoa já está resolvendo.
export default function ModalVencimento({ aviso, chave }) {
  const { pathname } = useLocation();
  const [aberta, setAberta] = useState(false);
  const aguardando = !aberta && pathname !== '/assinaturas' && !vistoHoje(chave);

  useEffect(() => {
    if (!aguardando) return undefined;
    function aoAgir() {
      setAberta(true);
    }
    document.addEventListener('click', aoAgir, { capture: true, once: true });
    document.addEventListener('keydown', aoAgir, { capture: true, once: true });
    return () => {
      document.removeEventListener('click', aoAgir, { capture: true });
      document.removeEventListener('keydown', aoAgir, { capture: true });
    };
  }, [aguardando]);

  if (!aberta) return null;

  function fechar() {
    marcarVistoHoje(chave);
    setAberta(false);
  }

  const { titulo, textos } = textoDaJanela(aviso);

  return (
    <Modal title={titulo} onClose={fechar}>
      {(pedirFechar) => (
        <>
          <div className="modal-vencimento">
            {textos.map((texto) => <p key={texto}>{texto}</p>)}
          </div>
          <div className="modal__footer">
            <button type="button" className="btn btn--ghost" onClick={pedirFechar}>{tr('Agora não')}</button>
            <Link to="/assinaturas" className="btn btn--primary" data-autofocus onClick={pedirFechar}>{tr('Ir para assinaturas')}</Link>
          </div>
        </>
      )}
    </Modal>
  );
}
