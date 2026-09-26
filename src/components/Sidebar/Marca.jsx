// Marca provisória (o projeto ainda não tem logo): cruz sobre gradiente teal + nome da clínica logada.
export function Marca({ empresa }) {
    return (
        <div className="marca">
            <span className="marca__selo" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 5v14M5 12h14" />
                </svg>
            </span>
            <span className="marca__textos">
                <strong>SoftwareClinic</strong>
                {empresa && <span title={empresa}>{empresa}</span>}
            </span>
        </div>
    )
}

export default Marca
