import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAcessoProntuario } from '@/modules/prontuario/prontuario.hooks';
import SemAcessoProntuario from '@/modules/prontuario/components/SemAcessoProntuario';
import { useServicos } from '@/modules/servico/servico.hooks';
import { IconeSetaEsquerda, IconeImpressora, IconeCheck, IconeX, IconeLixeira } from '@/components/CrudCard/icones';
import { formatDataBR, calcularIdade } from '@/utils/date';
import { useAvaliacaoNeuro } from '../avaliacao-neuro.hooks';
import { updateAvaliacaoNeuro, finalizarAvaliacaoNeuro, deleteAvaliacaoNeuro } from '../avaliacao-neuro.api';
import { ABAS, formularioDaAvaliacao, situacaoDa } from '../avaliacao-neuro.utils';
import { AbaIdentificacao, AbaSessoes, AbaTestes, AbaConclusao } from './CamposAvaliacao';
import AnamneseNeuro from './AnamneseNeuro';
import LaudoNeuro from './LaudoNeuro';
import '../avaliacao-neuro.css';
import { localeAtual, tr } from '@/i18n';

function Voltar() {
  return (
    <Link to="/avaliacoes-neuropsicologicas" className="link neuro-voltar">
      <IconeSetaEsquerda />
      {tr('Todas as avaliações')}
    </Link>
  );
}

export default function AvaliacaoNeuroPage() {
  const { id } = useParams();
  const acesso = useAcessoProntuario();

  if (!acesso.carregando && !acesso.profissional) {
    return (
      <div className="page">
        <header className="page-header"><div><Voltar /><h2 className="page-title">{tr('Avaliação neuropsicológica')}</h2></div></header>
        <SemAcessoProntuario />
      </div>
    );
  }

  return <Carregar id={id} profissional={acesso.profissional} carregandoAcesso={acesso.carregando} />;
}

function Carregar({ id, profissional, carregandoAcesso }) {
  const { avaliacao, loading, error, setAvaliacao } = useAvaliacaoNeuro(id);

  if (loading || carregandoAcesso) {
    return (
      <div className="page">
        <header className="page-header"><div><Voltar /><h2 className="page-title">{tr('Avaliação neuropsicológica')}</h2></div></header>
        <section className="card neuro-editor" aria-busy="true"><div className="skeleton skeleton--bloco" /></section>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <header className="page-header"><div><Voltar /><h2 className="page-title">{tr('Avaliação neuropsicológica')}</h2></div></header>
        <p className="alert alert--error" role="alert">{error.message}</p>
      </div>
    );
  }

  return <Editor key={avaliacao._id} avaliacao={avaliacao} profissional={profissional} onSalva={setAvaliacao} />;
}

function Editor({ avaliacao, profissional, onSalva }) {
  const navigate = useNavigate();
  const { servicos } = useServicos();
  const original = useMemo(() => formularioDaAvaliacao(avaliacao), [avaliacao]);
  const [form, setForm] = useState(original);
  const [aba, setAba] = useState('identificacao');
  const [acao, setAcao] = useState(null);
  const [confirmando, setConfirmando] = useState(null); // 'finalizar' | 'excluir'
  const [aviso, setAviso] = useState(null);

  const souAutor = (avaliacao.profissionalId?._id ?? avaliacao.profissionalId) === profissional._id;
  const finalizada = !!avaliacao.finalizadaEm;
  const somenteLeitura = !souAutor || finalizada;
  const alterado = JSON.stringify(form) !== JSON.stringify(original);
  const [situacao, classeSituacao] = situacaoDa(avaliacao);
  const paciente = avaliacao.pacienteId ?? {};
  const idade = calcularIdade(paciente.dataNascimento);

  const set = (campo, valor) => setForm((atual) => ({ ...atual, [campo]: valor }));
  const setResposta = (pergunta, valor) => setForm((atual) => ({ ...atual, anamnese: { respostas: { ...atual.anamnese.respostas, [pergunta]: valor } } }));
  const setLinha = (lista, index, campo, valor) => setForm((atual) => ({
    ...atual,
    [lista]: atual[lista].map((linha, i) => (i === index ? { ...linha, [campo]: valor } : linha)),
  }));
  const adicionar = (lista, item) => setForm((atual) => ({ ...atual, [lista]: [...atual[lista], item] }));
  const remover = (lista, index) => setForm((atual) => ({ ...atual, [lista]: atual[lista].filter((_, i) => i !== index) }));

  const payload = () => ({ ...form, servicoId: form.servicoId || null });

  async function executar(nome, fn, mensagem) {
    setAcao(nome);
    setAviso(null);
    try {
      const response = await fn();
      // A versão salva vira a nova referência: o formulário passa a refletir o que está no servidor.
      if (response?.data) {
        onSalva(response.data);
        setForm(formularioDaAvaliacao(response.data));
      }
      setAviso({ tipo: 'success', texto: response?.message ?? tr('Pronto.') });
      setAcao(null);
      setConfirmando(null);
      return response;
    } catch (err) {
      setAviso({ tipo: 'error', texto: err.message || mensagem });
      setAcao(null);
      setConfirmando(null);
      return null;
    }
  }

  // Trocar o modelo salva o resto do formulário junto e recomeça a anamnese com as perguntas do novo modelo.
  const trocarModelo = (modeloId) => executar('modelo', () => updateAvaliacaoNeuro(avaliacao._id, { ...payload(), anamnese: { modeloId } }), tr('Não foi possível trocar o modelo.'));
  const salvar = () => executar('salvar', () => updateAvaliacaoNeuro(avaliacao._id, payload()), tr('Não foi possível salvar.'));
  const finalizar = () => executar('finalizar', () => finalizarAvaliacaoNeuro(avaliacao._id, payload()), tr('Não foi possível finalizar.'));
  async function excluir() {
    const ok = await executar('excluir', () => deleteAvaliacaoNeuro(avaliacao._id), tr('Não foi possível excluir.'));
    if (ok) navigate('/avaliacoes-neuropsicologicas');
  }

  const props = { form, set, setForm, setLinha, adicionar, remover, servicos };

  return (
    <div className="page">
      <header className="page-header neuro-no-print">
        <div>
          <Voltar />
          <h2 className="page-title">{tr('Avaliação neuropsicológica')}</h2>
        </div>
      </header>

      <section className="card neuro-editor">
        <header className="neuro-cab neuro-no-print">
          <div>
            <h3 className="neuro-cab__nome">{paciente.nome ?? tr('Paciente removido')}</h3>
            <p className="neuro-sub">
              {[
                paciente.dataNascimento && `${formatDataBR(paciente.dataNascimento)}${idade !== null ? ` (${idade} ${idade === 1 ? tr('ano') : tr('anos')})` : ''}`,
                tr('Responsável: {p0}', { p0: avaliacao.profissionalId?.nome ?? '—' }),
                avaliacao.servicoId?.nome,
              ].filter(Boolean).join(' · ')}
            </p>
          </div>
          <span className={`badge ${classeSituacao}`}>{situacao}</span>
        </header>

        {somenteLeitura && (
          <p className="neuro-trava neuro-no-print" role="note">
            {finalizada
              ? tr('Avaliação finalizada em {p0}: o conteúdo não pode mais ser alterado.', { p0: new Date(avaliacao.finalizadaEm).toLocaleDateString(localeAtual()) })
              : tr('Somente leitura: só o profissional responsável altera esta avaliação.')}
          </p>
        )}

        <div className="neuro-abas neuro-no-print" role="tablist" aria-label={tr('Etapas da avaliação')}>
          {ABAS.map(([chave, rotulo], index) => (
            <button
              key={chave}
              type="button"
              role="tab"
              id={`neuro-aba-${chave}`}
              aria-selected={aba === chave}
              aria-controls="neuro-painel"
              className="neuro-aba"
              onClick={(e) => { setAba(chave); e.currentTarget.scrollIntoView({ block: 'nearest', inline: 'nearest' }); }}
            >
              <span className="neuro-aba__num">{index + 1}</span>
              {rotulo}
            </button>
          ))}
        </div>

        <div id="neuro-painel" role="tabpanel" aria-labelledby={`neuro-aba-${aba}`}>
          {aba === 'laudo' ? (
            <div className="neuro-laudo">
              <div className="neuro-laudo__barra neuro-no-print">
                <p className="neuro-sub">
                  {tr('O laudo é montado com o que foi preenchido nas outras abas, nas seis partes da Resolução CFP 06/2019. {p0}', { p0: alterado && tr(' Há alterações ainda não salvas.') })}
                </p>
                <button type="button" className="btn btn--ghost btn--sm" onClick={() => window.print()}>
                  <IconeImpressora />
                  {tr('Imprimir ou salvar PDF')}
                </button>
              </div>
              <LaudoNeuro avaliacao={avaliacao} form={form} />
            </div>
          ) : (
            <fieldset className="neuro-fieldset" disabled={somenteLeitura}>
              {aba === 'identificacao' && <AbaIdentificacao {...props} />}
              {aba === 'anamnese' && (
                <AnamneseNeuro
                  avaliacao={avaliacao}
                  respostas={form.anamnese.respostas}
                  onChange={setResposta}
                  somenteLeitura={somenteLeitura}
                  onTrocarModelo={trocarModelo}
                  trocando={acao === 'modelo'}
                />
              )}
              {aba === 'sessoes' && <AbaSessoes {...props} />}
              {aba === 'testes' && <AbaTestes {...props} />}
              {aba === 'conclusao' && <AbaConclusao {...props} />}
            </fieldset>
          )}
        </div>

        {aviso && <p className={`alert alert--${aviso.tipo} neuro-no-print`} role={aviso.tipo === 'error' ? 'alert' : 'status'}>{aviso.texto}</p>}

        {!somenteLeitura && (
          <div className="neuro-rodape neuro-no-print">
            {confirmando === 'excluir' ? (
              <div className="neuro-confirmar">
                <span>{tr('Excluir esta avaliação em andamento?')}</span>
                <button type="button" className="icon-btn icon-btn--danger" aria-label={tr('Confirmar exclusão')} onClick={excluir}><IconeCheck /></button>
                <button type="button" className="icon-btn" aria-label={tr('Cancelar exclusão')} onClick={() => setConfirmando(null)}><IconeX /></button>
              </div>
            ) : (
              <button type="button" className="btn btn--ghost btn--sm neuro-rodape__excluir" disabled={acao !== null} onClick={() => setConfirmando('excluir')}>
                <IconeLixeira />
                {tr('Excluir rascunho')}
              </button>
            )}

            <div className="neuro-rodape__acoes">
              {alterado && <span className="neuro-sub">{tr('Alterações não salvas')}</span>}
              <button type="button" className={`btn btn--ghost${acao === 'salvar' ? ' btn--loading' : ''}`} disabled={acao !== null || !alterado} onClick={salvar}>
                {acao === 'salvar' ? tr('Salvando...') : tr('Salvar')}
              </button>
              {confirmando === 'finalizar' ? (
                <div className="neuro-confirmar">
                  <span>{tr('Finalizar? Depois disso não dá mais para editar.')}</span>
                  <button type="button" className="btn btn--primary btn--sm" disabled={acao !== null} onClick={finalizar}>
                    {acao === 'finalizar' ? tr('Finalizando...') : tr('Confirmar')}
                  </button>
                  <button type="button" className="icon-btn" aria-label={tr('Cancelar')} onClick={() => setConfirmando(null)}><IconeX /></button>
                </div>
              ) : (
                <button type="button" className="btn btn--primary" disabled={acao !== null} onClick={() => setConfirmando('finalizar')}>
                  {tr('Finalizar avaliação')}
                </button>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
