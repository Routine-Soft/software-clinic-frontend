import { useState } from 'react';
import Modal from '@/components/Modal/Modal';
import { usePlanos } from '@/modules/plano/plano.hooks';
import { formatarPreco } from '@/modules/assinatura/assinatura.utils';
import './clinicas-adm.css';

// Troca o plano/status da assinatura diretamente, por fora do Mercado Pago (ex.: pagamento combinado por outro meio).
export default function TrocarPlanoModal({ admin, erro, onSave, onClose }) {
  const { planos, loading } = usePlanos();
  const [planoId, setPlanoId] = useState(admin.assinatura?.planoId?._id ?? '');
  const [salvando, setSalvando] = useState(false);

  const planosAtivos = planos.filter((plano) => plano.ativo);

  async function handleSalvar(fechar) {
    setSalvando(true);
    const ok = await onSave(admin._id, planoId);
    setSalvando(false);
    if (ok) fechar();
  }

  return (
    <Modal title="Trocar plano" onClose={onClose}>
      {(fechar) => (
        <div className="modal-form">
          <p className="modal-form__hint">
            {admin.nomeEmpresa}: define o plano e o status da assinatura direto, sem passar pelo Mercado Pago.
            Um plano pago fica ativo sem cobrança automática, até a clínica assinar pelo cartão ou Pix, ou você trocar de novo.
          </p>

          {erro && <p className="alert alert--error" role="alert">{erro.message}</p>}

          {loading ? (
            <div className="troca-plano__lista" aria-busy="true" aria-label="Carregando planos">
              {[0, 1, 2].map((i) => (
                <div key={i} className="skeleton skeleton--line" style={{ width: `${70 - i * 10}%`, height: 46 }} />
              ))}
            </div>
          ) : (
            <div className="troca-plano__lista" role="radiogroup" aria-label="Planos disponíveis">
              {planosAtivos.map((plano) => (
                <label key={plano._id} className="troca-plano__opcao" data-selecionado={planoId === plano._id || undefined}>
                  <input
                    type="radio"
                    name="plano"
                    value={plano._id}
                    checked={planoId === plano._id}
                    onChange={() => setPlanoId(plano._id)}
                    data-autofocus={plano._id === planosAtivos[0]?._id ? '' : undefined}
                  />
                  <span className="troca-plano__nome">{plano.nome}</span>
                  <span className="troca-plano__preco">
                    {plano.tipo === 'gratis' && !plano.preco ? 'Grátis' : formatarPreco(plano.preco)}
                  </span>
                </label>
              ))}
            </div>
          )}

          <div className="modal__footer">
            <button type="button" className="btn btn--ghost" onClick={fechar}>Cancelar</button>
            <button
              type="button"
              className={`btn btn--primary${salvando ? ' btn--loading' : ''}`}
              disabled={salvando || !planoId}
              onClick={() => handleSalvar(fechar)}
            >
              {salvando ? 'Salvando...' : 'Confirmar plano'}
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
