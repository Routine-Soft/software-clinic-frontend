import SimboloMarca from '@/components/Marca/SimboloMarca'

// Marca da Sonelia (símbolo sobre gradiente teal) + nome da clínica logada.
export function Marca({ empresa }) {
    return (
        <div className="marca">
            <span className="marca__selo" aria-hidden="true">
                <SimboloMarca />
            </span>
            <span className="marca__textos">
                <strong>Sonelia</strong>
                {empresa && <span title={empresa}>{empresa}</span>}
            </span>
        </div>
    )
}

export default Marca
