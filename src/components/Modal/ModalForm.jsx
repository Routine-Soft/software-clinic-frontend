import { useState } from 'react'
import { tr } from '@/i18n';

export function ModalForm({ erro, onSubmit, submitDisabled = false, submitLabel = tr('Salvar alterações'), loadingLabel = tr('Salvando...'), fechar, children }) {
    const [salvando, setSalvando] = useState(false)
    const [tentouSalvar, setTentouSalvar] = useState(false)

    async function handleSubmit(e) {
        e.preventDefault()
        setSalvando(true)
        setTentouSalvar(true)
        const salvo = await onSubmit()
        setSalvando(false)
        if (salvo) fechar()
    }

    return (
        <form className="modal-form" onSubmit={handleSubmit}>
            {tentouSalvar && !salvando && erro && (
                <p className="alert alert--error" role="alert">{erro.message}</p>
            )}

            {children}

            <div className="modal__footer">
                <button className="btn btn--ghost" type="button" onClick={fechar}>{tr('Cancelar')}</button>
                <button
                    className={`btn btn--primary${salvando ? ' btn--loading' : ''}`}
                    type="submit"
                    disabled={salvando || submitDisabled}
                >
                    {salvando ? loadingLabel : submitLabel}
                </button>
            </div>
        </form>
    )
}

export default ModalForm
