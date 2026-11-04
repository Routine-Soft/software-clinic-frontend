import { useState, useSyncExternalStore } from 'react'
import { assinarInstalacao, podeInstalar, instalarApp, jaInstalado, ehIos } from '@/utils/instalarApp'
import { Icone } from '@/components/CrudCard/icones'
import { tr } from '@/i18n';

// Aparece sempre que o sistema ainda não está aberto como aplicativo.
// Com o aviso do navegador (Chrome, Edge, Android) instala direto; nos demais (iPhone, Safari, Firefox) mostra o passo a passo.
export function BotaoInstalar() {
    const disponivel = useSyncExternalStore(assinarInstalacao, podeInstalar, () => false)
    const [dica, setDica] = useState(false)
    if (jaInstalado()) return null

    function clicar() {
        if (disponivel) instalarApp()
        else setDica((aberta) => !aberta)
    }

    return (
        <>
            <button type="button" className="btn btn--ghost btn--sm btn--block sidebar__instalar" onClick={clicar}>
                <Icone>
                    <path d="M12 3v12M7 10l5 5 5-5" />
                    <rect x="3" y="17" width="18" height="4" rx="1" />
                </Icone>
                {tr('Instalar aplicativo')}
            </button>
            {dica && !disponivel && (
                <p className="sidebar__instalar-dica" role="note">
                    {ehIos()
                        ? tr('No Safari, toque em Compartilhar e depois em "Adicionar à Tela de Início".')
                        : tr('No menu do navegador (⋮), escolha "Instalar aplicativo" ou "Adicionar à tela inicial".')}
                </p>
            )}
        </>
    )
}

export default BotaoInstalar
