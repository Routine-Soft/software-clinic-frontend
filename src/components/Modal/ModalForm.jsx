import { useState } from 'react'

export function ModalForm({ erro, onSubmit, submitDisabled = false, submitLabel = 'Salvar alterações', loadingLabel = 'Salvando...', fechar, children }) {
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
                <button className="btn btn--ghost" type="button" onClick={fechar}>Cancelar</button>
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
