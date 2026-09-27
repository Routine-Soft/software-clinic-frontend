import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuthContext } from '@/hooks/useAuthContext';
import Modal from '@/components/Modal/Modal';
import { gerarPix, sincronizarPix } from '../assinatura.api';
import { documentoCompleto, formatarContagem, formatarData, formatarDocumento, formatarPreco } from '../assinatura.utils';
import './pix-modal.css';

const INTERVALO_CONSULTA_MS = 5000;
const SITUACOES_ENCERRADAS = ['expirado', 'cancelado', 'rejeitado'];

function IconeCheck() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

// Pagamento avulso por Pix: pede o documento de quem paga, mostra o QR Code e confirma sozinho quando o Pix cai.
export default function PixModal({ plano, renovacao = false, onPago, onClose }) {
  const { user } = useAuthContext();
  const [etapa, setEtapa] = useState('documento'); // documento | qr | pago
  const [documento, setDocumento] = useState(() => formatarDocumento(user?.cnpj ?? ''));
  const [gerando, setGerando] = useState(false);
  const [erro, setErro] = useState(null);
  const [pagamento, setPagamento] = useState(null);
  const [encerrado, setEncerrado] = useState(false);
  const [acessoAte, setAcessoAte] = useState(null);
  const [agora, setAgora] = useState(() => Date.now());
  const [verificando, setVerificando] = useState(false);
  const [copiado, setCopiado] = useState(false);
  const codigoRef = useRef(null);

  const restanteMs = pagamento?.expiraEm ? new Date(pagamento.expiraEm).getTime() - agora : 0;
  const expirado = etapa === 'qr' && (encerrado || restanteMs <= 0);

  const consultar = useCallback(async () => {
    try {
      const { data } = await sincronizarPix();
      const situacao = data.pagamento?.status;

      if (situacao === 'aprovado') {
        setAcessoAte(data.assinatura.acesso?.ate ?? data.assinatura.proximaCobranca);
        onPago?.(data.assinatura);
        setEtapa('pago');
      } else if (SITUACOES_ENCERRADAS.includes(situacao)) {
        setEncerrado(true);
      }
    } catch {
      // Falha de rede ou do Mercado Pago: a próxima consulta tenta de novo.
    }
  }, [onPago]);

  // Enquanto o QR Code está na tela, pergunta a cada poucos segundos se o Pix já foi pago.
  useEffect(() => {
    if (etapa !== 'qr' || expirado) return undefined;

    const consulta = setInterval(consultar, INTERVALO_CONSULTA_MS);
    const relogio = setInterval(() => setAgora(Date.now()), 1000);
    return () => {
      clearInterval(consulta);
      clearInterval(relogio);
    };
  }, [etapa, expirado, consultar]);

  async function gerar(e) {
    e?.preventDefault();
    setErro(null);
    setGerando(true);
    try {
      const { data } = await gerarPix(plano._id, documento);
      setPagamento(data);
      setEncerrado(false);
      setCopiado(false);
      setAgora(Date.now());
      setEtapa('qr');
    } catch (err) {
      setErro(err);
    } finally {
      setGerando(false);
    }
  }

  async function verificarAgora() {
    setVerificando(true);
    await consultar();
    setVerificando(false);
  }

  async function copiar() {
    try {
      await navigator.clipboard.writeText(pagamento.qrCode);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    } catch {
      // Sem permissão para a área de transferência: deixa o código selecionado para copiar com Ctrl+C.
      codigoRef.current?.select();
    }
  }

  return (
    <Modal title={renovacao ? 'Renovar por Pix' : 'Pagar com Pix'} onClose={onClose} persistente className="pix-modal">
      {(fechar) => (
        <>
          {etapa === 'documento' && (
            <form className="modal-form" onSubmit={gerar}>
              <div className="pix__resumo">
                <span>{plano.nome}</span>
                <strong>{formatarPreco(plano.preco)}</strong>
                <small>30 dias de acesso, sem renovação automática</small>
              </div>

              {erro && <p className="alert alert--error" role="alert">{erro.message}</p>}

              <div className="field">
                <label className="field__label" htmlFor="pix-documento">CPF ou CNPJ de quem vai pagar</label>
                <input
                  id="pix-documento"
                  className="input"
                  inputMode="numeric"
                  autoComplete="off"
                  placeholder="000.000.000-00"
                  value={documento}
                  onChange={(e) => setDocumento(formatarDocumento(e.target.value))}
                  data-autofocus
                  required
                />
              </div>
              <p className="modal-form__hint">O Mercado Pago exige o documento de quem paga o Pix.</p>

              <div className="modal__footer">
                <button type="button" className="btn btn--ghost" onClick={fechar}>Cancelar</button>
                <button
                  type="submit"
                  className={`btn btn--primary${gerando ? ' btn--loading' : ''}`}
                  disabled={gerando || !documentoCompleto(documento)}
                >
                  {gerando ? 'Gerando...' : 'Gerar Pix'}
                </button>
              </div>
            </form>
          )}

          {etapa === 'qr' && !expirado && (
            <div className="pix">
              <p className="pix__valor">
                <strong>{formatarPreco(pagamento.valor)}</strong>
                <span>{plano.nome} · 30 dias</span>
              </p>

              {pagamento.qrCodeBase64 && (
                <div className="pix__qr">
                  <img src={`data:image/png;base64,${pagamento.qrCodeBase64}`} alt="QR Code do Pix" width="220" height="220" />
                </div>
              )}

              <p className="pix__expira">Este código expira em <strong>{formatarContagem(restanteMs)}</strong></p>

              <div className="pix__codigo">
                <label className="field__label" htmlFor="pix-codigo">Pix copia e cola</label>
                <div className="pix__codigo-linha">
                  <input id="pix-codigo" className="input" readOnly value={pagamento.qrCode} ref={codigoRef} onFocus={(e) => e.target.select()} />
                  <button type="button" className="btn btn--primary btn--sm" onClick={copiar} data-autofocus>
                    {copiado ? 'Copiado!' : 'Copiar'}
                  </button>
                </div>
              </div>

              <ol className="pix__passos">
                <li>Abra o app do seu banco e escolha Pix.</li>
                <li>Leia o QR Code ou use o Pix copia e cola.</li>
                <li>Confirme o pagamento. O acesso é liberado assim que ele cair.</li>
              </ol>

              <p className="pix__status" role="status">
                <span className="pix__pulso" aria-hidden="true" />
                Aguardando o pagamento. Confirmamos sozinhos, você não precisa fazer mais nada.
              </p>

              <div className="modal__footer">
                <button type="button" className="btn btn--ghost" onClick={fechar}>Fechar</button>
                <button type="button" className={`btn btn--ghost${verificando ? ' btn--loading' : ''}`} onClick={verificarAgora} disabled={verificando}>
                  {verificando ? 'Verificando...' : 'Já paguei, verificar agora'}
                </button>
              </div>
            </div>
          )}

          {expirado && (
            <div className="pix pix--aviso">
              <h4>Este Pix expirou</h4>
              <p>O código não vale mais. Gere um novo para pagar.</p>
              {erro && <p className="alert alert--error" role="alert">{erro.message}</p>}
              <div className="modal__footer">
                <button type="button" className="btn btn--ghost" onClick={fechar}>Fechar</button>
                <button type="button" className={`btn btn--primary${gerando ? ' btn--loading' : ''}`} onClick={gerar} disabled={gerando} data-autofocus>
                  {gerando ? 'Gerando...' : 'Gerar novo Pix'}
                </button>
              </div>
            </div>
          )}

          {etapa === 'pago' && (
            <div className="pix pix--pago" role="status">
              <div className="pix__sucesso" aria-hidden="true"><IconeCheck /></div>
              <h4>Pagamento confirmado!</h4>
              <p>
                Seu acesso está liberado{acessoAte ? <> até <strong>{formatarData(acessoAte)}</strong></> : ''}. Lembre-se de renovar antes do vencimento.
              </p>
              <div className="modal__footer">
                <button type="button" className="btn btn--primary" onClick={fechar} data-autofocus>Concluir</button>
              </div>
            </div>
          )}
        </>
      )}
    </Modal>
  );
}
