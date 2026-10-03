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
import { AbaIdentificacao, AbaAnamnese, AbaSessoes, AbaTestes, AbaConclusao } from './CamposAvaliacao';
import LaudoNeuro from './LaudoNeuro';
import '../avaliacao-neuro.css';

function Voltar() {
  return (
    <Link to="/avaliacoes-neuropsicologicas" className="link neuro-voltar">
      <IconeSetaEsquerda />
      Todas as avaliações
    </Link>
  );
}

export default function AvaliacaoNeuroPage() {
  const { id } = useParams();
  const acesso = useAcessoProntuario();

  if (!acesso.carregando && !acesso.profissional) {
    return (
      <div className="page">
        <header className="page-header"><div><Voltar /><h2 className="page-title">Avaliação neuropsicológica</h2></div></header>
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
        <header className="page-header"><div><Voltar /><h2 className="page-title">Avaliação neuropsicológica</h2></div></header>
        <section className="card neuro-editor" aria-busy="true"><div className="skeleton skeleton--bloco" /></section>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <header className="page-header"><div><Voltar /><h2 className="page-title">Avaliação neuropsicológica</h2></div></header>
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
  const setAnamnese = (campo, valor) => setForm((atual) => ({ ...atual, anamnese: { ...atual.anamnese, [campo]: valor } }));
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
      setAviso({ tipo: 'success', texto: response?.message ?? 'Pronto.' });
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

  const salvar = () => executar('salvar', () => updateAvaliacaoNeuro(avaliacao._id, payload()), 'Não foi possível salvar.');
  const finalizar = () => executar('finalizar', () => finalizarAvaliacaoNeuro(avaliacao._id, payload()), 'Não foi possível finalizar.');
  async function excluir() {
    const ok = await executar('excluir', () => deleteAvaliacaoNeuro(avaliacao._id), 'Não foi possível excluir.');
    if (ok) navigate('/avaliacoes-neuropsicologicas');
  }

  const props = { form, set, setForm, setAnamnese, setLinha, adicionar, remover, servicos };

  return (
    <div className="page">
      <header className="page-header neuro-no-print">
        <div>
          <Voltar />
          <h2 className="page-title">Avaliação neuropsicológica</h2>
        </div>
      </header>

      <section className="card neuro-editor">
        <header className="neuro-cab neuro-no-print">
          <div>
            <h3 className="neuro-cab__nome">{paciente.nome ?? 'Paciente removido'}</h3>
            <p className="neuro-sub">
              {[
                paciente.dataNascimento && `${formatDataBR(paciente.dataNascimento)}${idade !== null ? ` (${idade} ${idade === 1 ? 'ano' : 'anos'})` : ''}`,
                `Responsável: ${avaliacao.profissionalId?.nome ?? '—'}`,
                avaliacao.servicoId?.nome,
              ].filter(Boolean).join(' · ')}
            </p>
          </div>
          <span className={`badge ${classeSituacao}`}>{situacao}</span>
        </header>

        {somenteLeitura && (
          <p className="neuro-trava neuro-no-print" role="note">
            {finalizada
              ? `Avaliação finalizada em ${new Date(avaliacao.finalizadaEm).toLocaleDateString('pt-BR')}: o conteúdo não pode mais ser alterado.`
              : 'Somente leitura: só o profissional responsável altera esta avaliação.'}
          </p>
        )}

        <div className="neuro-abas neuro-no-print" role="tablist" aria-label="Etapas da avaliação">
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
                  O laudo é montado com o que foi preenchido nas outras abas, nas seis partes da Resolução CFP 06/2019.
                  {alterado && ' Há alterações ainda não salvas.'}
                </p>
                <button type="button" className="btn btn--ghost btn--sm" onClick={() => window.print()}>
                  <IconeImpressora />
                  Imprimir ou salvar PDF
                </button>
              </div>
              <LaudoNeuro avaliacao={avaliacao} form={form} />
            </div>
          ) : (
            <fieldset className="neuro-fieldset" disabled={somenteLeitura}>
              {aba === 'identificacao' && <AbaIdentificacao {...props} />}
              {aba === 'anamnese' && <AbaAnamnese {...props} />}
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
                <span>Excluir esta avaliação em andamento?</span>
                <button type="button" className="icon-btn icon-btn--danger" aria-label="Confirmar exclusão" onClick={excluir}><IconeCheck /></button>
                <button type="button" className="icon-btn" aria-label="Cancelar exclusão" onClick={() => setConfirmando(null)}><IconeX /></button>
              </div>
            ) : (
              <button type="button" className="btn btn--ghost btn--sm neuro-rodape__excluir" disabled={acao !== null} onClick={() => setConfirmando('excluir')}>
                <IconeLixeira />
                Excluir rascunho
              </button>
            )}

            <div className="neuro-rodape__acoes">
              {alterado && <span className="neuro-sub">Alterações não salvas</span>}
              <button type="button" className={`btn btn--ghost${acao === 'salvar' ? ' btn--loading' : ''}`} disabled={acao !== null || !alterado} onClick={salvar}>
                {acao === 'salvar' ? 'Salvando...' : 'Salvar'}
              </button>
              {confirmando === 'finalizar' ? (
                <div className="neuro-confirmar">
                  <span>Finalizar? Depois disso não dá mais para editar.</span>
                  <button type="button" className="btn btn--primary btn--sm" disabled={acao !== null} onClick={finalizar}>
                    {acao === 'finalizar' ? 'Finalizando...' : 'Confirmar'}
                  </button>
                  <button type="button" className="icon-btn" aria-label="Cancelar" onClick={() => setConfirmando(null)}><IconeX /></button>
                </div>
              ) : (
                <button type="button" className="btn btn--primary" disabled={acao !== null} onClick={() => setConfirmando('finalizar')}>
                  Finalizar avaliação
                </button>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
