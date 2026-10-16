import { useState } from 'react';
import Modal from '@/components/Modal/Modal';
import ModalForm from '@/components/Modal/ModalForm';
import { MARCADORES } from '../termo.utils';
import { tr } from '@/i18n';

// Criar ou editar um modelo de termo. `modelo` vazio = novo.
export default function ModeloTermoModal({ modelo, erro, onSave, onClose }) {
  const [titulo, setTitulo] = useState(modelo?.titulo ?? '');
  const [texto, setTexto] = useState(modelo?.texto ?? '');

  return (
    <Modal title={modelo ? tr('Editar modelo de termo') : tr('Novo modelo de termo')} onClose={onClose} wide>
      {(fechar) => (
        <ModalForm
          erro={erro}
          fechar={fechar}
          submitLabel={modelo ? tr('Salvar alterações') : tr('Criar modelo')}
          submitDisabled={!titulo.trim() || !texto.trim()}
          onSubmit={() => onSave({ titulo, texto })}
        >
          <div className="field">
            <label className="field__label" htmlFor="modelo-titulo">{tr('Título')}</label>
            <input
              id="modelo-titulo"
              className="input"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder={tr('Ex.: TCLE – Atendimento psicológico')}
              required
            />
          </div>

          <div className="field">
            <label className="field__label" htmlFor="modelo-texto">{tr('Texto do termo')}</label>
            <textarea
              id="modelo-texto"
              className="textarea modelo-termo__texto"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              rows={14}
              required
            />
          </div>

          <details className="modelo-termo__marcadores">
            <summary>{tr('Campos que se preenchem sozinhos')}</summary>
            <p className="modal-form__hint">{tr('Escreva o campo entre chaves duplas no texto. Ao enviar, ele vira o dado do paciente.')}</p>
            <ul>
              {MARCADORES.map((m) => (
                <li key={m.chave}><code>{`{{${m.chave}}}`}</code> {m.descricao}</li>
              ))}
            </ul>
          </details>

          <p className="modal-form__hint">
            {tr('Mudar o modelo não altera os termos já enviados. Revise o texto com as regras do seu conselho profissional.')}
          </p>
        </ModalForm>
      )}
    </Modal>
  );
}
