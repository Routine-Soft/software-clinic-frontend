import { useId, useState } from 'react'
import Modal from '@/components/Modal/Modal'
import ModalForm from '@/components/Modal/ModalForm'

export default function NovoNomeModal({ titulo, label, placeholder, erro, onSave, onClose }) {
    const [formCriar, setFormCriar] = useState({ nome: '' })
    const inputId = useId()

    return (
        <Modal title={titulo} onClose={onClose}>
            {(fechar) => (
                <ModalForm erro={erro} fechar={fechar} submitLabel="Cadastrar" loadingLabel="Cadastrando..." onSubmit={() => onSave(formCriar)}>
                    <div className="field">
                        <label className="field__label" htmlFor={inputId}>{label}</label>
                        <input
                            id={inputId}
                            className="input"
                            type="text"
                            value={formCriar.nome}
                            onChange={(e) => setFormCriar({ ...formCriar, nome: e.target.value })}
                            placeholder={placeholder}
                            required
                        />
                    </div>
                </ModalForm>
            )}
        </Modal>
    )
}
