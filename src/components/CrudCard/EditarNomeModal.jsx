import { useId, useState } from 'react'
import Modal from '@/components/Modal/Modal'
import ModalForm from '@/components/Modal/ModalForm'

export default function EditarNomeModal({ titulo, item, placeholder, erro, onSave, onClose }) {
    const [formEdicao, setFormEdicao] = useState({ nome: item.nome })
    const inputId = useId()

    return (
        <Modal title={titulo} onClose={onClose}>
            {(fechar) => (
                <ModalForm erro={erro} fechar={fechar} onSubmit={() => onSave(item._id, formEdicao)}>
                    <div className="field">
                        <label className="field__label" htmlFor={inputId}>Nome</label>
                        <input
                            id={inputId}
                            className="input"
                            type="text"
                            value={formEdicao.nome}
                            onChange={(e) => setFormEdicao({ ...formEdicao, nome: e.target.value })}
                            placeholder={placeholder}
                            required
                        />
                    </div>
                </ModalForm>
            )}
        </Modal>
    )
}
