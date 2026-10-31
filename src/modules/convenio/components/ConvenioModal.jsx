import { useId, useState } from 'react';
import Modal from '@/components/Modal/Modal';
import ModalForm from '@/components/Modal/ModalForm';
import { pagaOPlano } from '@/modules/agenda/agenda.utils';
import { tr } from '@/i18n';

// Cadastro e edição do convênio: nome, quem paga e, no plano de saúde, a coparticipação do paciente.
export default function ConvenioModal({ titulo, item = null, placeholder, dica, erro, onSave, onClose }) {
  const id = useId();
  const [nome, setNome] = useState(item?.nome ?? '');
  // Até escolher, segue a regra padrão: "Particular" é o paciente quem paga; os demais, o plano.
  const [quemPagaEscolhido, setQuemPaga] = useState(item ? (pagaOPlano(item) ? 'plano' : 'paciente') : null);
  const quemPaga = quemPagaEscolhido ?? (pagaOPlano({ nome }) ? 'plano' : 'paciente');
  const [comCoparticipacao, setComCoparticipacao] = useState(Number(item?.coparticipacao) > 0);
  const [valor, setValor] = useState(Number(item?.coparticipacao) > 0 ? item.coparticipacao : '');

  const faltaValor = quemPaga === 'plano' && comCoparticipacao && !(Number(valor) > 0);

  function salvar() {
    const dados = { nome, quemPaga, coparticipacao: quemPaga === 'plano' && comCoparticipacao ? Number(valor) : 0 };
    return item ? onSave(item._id, dados) : onSave(dados);
  }

  return (
    <Modal title={titulo} onClose={onClose}>
      {(fechar) => (
        <ModalForm
          erro={erro}
          fechar={fechar}
          submitDisabled={faltaValor}
          submitLabel={item ? undefined : tr('Cadastrar')}
          loadingLabel={item ? undefined : tr('Cadastrando...')}
          onSubmit={salvar}
        >
          <div className="field">
            <label className="field__label" htmlFor={`${id}-nome`}>{tr('Nome')}</label>
            <input id={`${id}-nome`} className="input" type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder={placeholder} required data-autofocus />
            {dica && <p className="field__hint">{dica}</p>}
          </div>

          <div className="pagamento-modo" role="radiogroup" aria-labelledby={`${id}-quem`}>
            <span id={`${id}-quem`} className="field__label">{tr('Quem paga?')}</span>
            <div className="pagamento-modo__opcoes">
              {[['paciente', tr('O paciente')], ['plano', tr('O plano de saúde')]].map(([valorOpcao, rotulo]) => (
                <label key={valorOpcao} className={`pagamento-modo__opcao${quemPaga === valorOpcao ? ' is-ativa' : ''}`}>
                  <input type="radio" name={`${id}-quem-paga`} checked={quemPaga === valorOpcao} onChange={() => setQuemPaga(valorOpcao)} />
                  {rotulo}
                </label>
              ))}
            </div>
          </div>

          {quemPaga === 'plano' && (
            <div className="pagamento-modo" role="radiogroup" aria-labelledby={`${id}-copart`}>
              <span id={`${id}-copart`} className="field__label">{tr('Coparticipação do paciente')}</span>
              <div className="pagamento-modo__opcoes">
                {[[false, tr('Sem coparticipação')], [true, tr('Com coparticipação')]].map(([valorOpcao, rotulo]) => (
                  <label key={rotulo} className={`pagamento-modo__opcao${comCoparticipacao === valorOpcao ? ' is-ativa' : ''}`}>
                    <input type="radio" name={`${id}-coparticipacao`} checked={comCoparticipacao === valorOpcao} onChange={() => setComCoparticipacao(valorOpcao)} />
                    {rotulo}
                  </label>
                ))}
              </div>
              {comCoparticipacao && (
                <div className="field pagamento-modo__parcelas">
                  <label className="field__label" htmlFor={`${id}-valor`}>{tr('Valor por atendimento (R$)')}</label>
                  <input id={`${id}-valor`} className="input" type="number" min="0.01" step="0.01" inputMode="decimal" value={valor} onChange={(e) => setValor(e.target.value)} required />
                </div>
              )}
              <p className="pagamento-modo__resumo">
                {comCoparticipacao ? tr('O paciente paga esse valor à clínica em cada atendimento. O resto é com o plano.') : tr('O paciente não paga nada à clínica.')}
              </p>
            </div>
          )}
        </ModalForm>
      )}
    </Modal>
  );
}
