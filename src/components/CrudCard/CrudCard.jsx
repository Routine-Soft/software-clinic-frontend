import { useState } from 'react'
import EditarNomeModal from './EditarNomeModal'
import NovoNomeModal from './NovoNomeModal'
import { IconeMais, IconeLapis, IconeLixeira, IconeCheck, IconeX } from './icones'
import './CrudCard.css'
import { tr } from '@/i18n';

export default function CrudCard({
    titulo,
    subtitulo,
    icone,
    singular,
    plural,
    labelNovo,
    placeholder,
    dica,
    textoVazio,
    tituloEdicao,
    itens,
    loading,
    error,
    successMessage,
    onAdd,
    onEdit,
    onRemove,
    className = '',
    ModalItem = null,
    detalhe = null,
}) {
    const [criando, setCriando] = useState(false)
    const [itemEditando, setItemEditando] = useState(null)
    const [confirmandoId, setConfirmandoId] = useState(null)

    async function handleSalvarCriacao(dados) {
        return await onAdd(dados)
    }

    function handleEdit(item) {
        setConfirmandoId(null)
        setItemEditando(item)
    }

    async function handleDelete(id) {
        setConfirmandoId(null)
        await onRemove(id)
    }

    return (
        <section className={`card crud-card ${className}`.trim()}>
            <header className="crud-card__head">
                <div className="crud-card__icon">{icone}</div>

                <div className="crud-card__titulos">
                    <h3 className="crud-card__titulo">{titulo}</h3>
                    <p className="crud-card__subtitulo">{subtitulo}</p>
                </div>

                {!loading && (
                    <span className="badge badge--primary">
                        {itens.length} {itens.length === 1 ? singular : plural}
                    </span>
                )}
                <button type="button" className="btn btn--primary btn--sm crud-card__novo-btn" onClick={() => setCriando(true)} aria-label={`Adicionar ${singular}`}>
                    <IconeMais />
                    <span className="crud-card__rotulo">{tr('Adicionar')}</span>
                </button>
            </header>

            {(successMessage || (error && !criando && !itemEditando)) && (
                <div className="alerts crud-card__alertas">
                    {error && !criando && !itemEditando && <p className="alert alert--error" role="alert">{error.message}</p>}
                    {successMessage && <p className="alert alert--success" role="status">{successMessage}</p>}
                </div>
            )}

            {loading ? (
                <ul className="crud-lista" aria-busy="true" aria-label={`Carregando ${plural}`}>
                    {[0, 1, 2].map((i) => (
                        <li key={i} className="crud-item crud-item--skeleton" style={{ '--i': i }}>
                            <div className="skeleton crud-item__icone-skeleton" />
                            <div className="skeleton skeleton--line" style={{ width: `${60 - i * 10}%` }} />
                        </li>
                    ))}
                </ul>
            ) : itens.length === 0 ? (
                <div className="crud-vazio">
                    {icone}
                    <p>{textoVazio}</p>
                </div>
            ) : (
                <ul className="crud-lista">
                    {itens.map((item, index) => (
                        <li
                            key={item._id}
                            className={`crud-item${itemEditando?._id === item._id ? ' crud-item--editando' : ''}`}
                            style={{ '--i': index }}
                        >
                            <div className="crud-item__icone">{icone}</div>
                            {detalhe ? (
                                <div className="crud-item__info">
                                    <span className="crud-item__nome" title={item.nome}>{item.nome}</span>
                                    <span className="crud-item__meta">{detalhe(item)}</span>
                                </div>
                            ) : (
                                <span className="crud-item__nome" title={item.nome}>{item.nome}</span>
                            )}

                            {confirmandoId === item._id ? (
                                <div className="crud-item__confirmar">
                                    <span>{tr('Excluir?')}</span>
                                    <button type="button" className="icon-btn icon-btn--danger" aria-label={tr('Confirmar exclusão de {nome}', { nome: item.nome })} onClick={() => handleDelete(item._id)}>
                                        <IconeCheck />
                                    </button>
                                    <button type="button" className="icon-btn" aria-label={tr('Cancelar exclusão')} onClick={() => setConfirmandoId(null)}>
                                        <IconeX />
                                    </button>
                                </div>
                            ) : (
                                <div className="crud-item__acoes">
                                    <button type="button" className="icon-btn" aria-label={`Editar ${item.nome}`} title={tr('Editar')} onClick={() => handleEdit(item)}>
                                        <IconeLapis />
                                    </button>
                                    <button type="button" className="icon-btn icon-btn--danger" aria-label={`Excluir ${item.nome}`} title={tr('Excluir')} onClick={() => setConfirmandoId(item._id)}>
                                        <IconeLixeira />
                                    </button>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}

            {ModalItem && itemEditando && (
                <ModalItem key={itemEditando._id} titulo={tituloEdicao} item={itemEditando} placeholder={placeholder} erro={error} onSave={onEdit} onClose={() => setItemEditando(null)} />
            )}

            {ModalItem && criando && (
                <ModalItem titulo={labelNovo} placeholder={placeholder} dica={dica} erro={error} onSave={handleSalvarCriacao} onClose={() => setCriando(false)} />
            )}

            {!ModalItem && itemEditando && (
                <EditarNomeModal
                    key={itemEditando._id}
                    titulo={tituloEdicao}
                    item={itemEditando}
                    placeholder={placeholder}
                    erro={error}
                    onSave={onEdit}
                    onClose={() => setItemEditando(null)}
                />
            )}

            {!ModalItem && criando && (
                <NovoNomeModal
                    titulo={labelNovo}
                    label={tr('Nome')}
                    placeholder={placeholder}
                    dica={dica}
                    erro={error}
                    onSave={handleSalvarCriacao}
                    onClose={() => setCriando(false)}
                />
            )}
        </section>
    )
}
