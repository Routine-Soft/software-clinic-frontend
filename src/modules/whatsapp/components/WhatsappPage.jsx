import { useState } from 'react';
import { useAuthContext } from '@/hooks/useAuthContext';
import { tr } from '@/i18n';
import { useWhatsapp } from '../whatsapp.hooks';
import { VARIAVEIS_DO_LEMBRETE, formatarNumeroWhatsapp, previaDoLembrete } from '../whatsapp.utils';
import './whatsapp.css';

function IconeWhatsapp() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
      <path d="M8.5 9.5c0 3 3 6 6 6l1.5-1.5-2-1-1 1c-1 0-2.5-1.5-2.5-2.5l1-1-1-2z" />
    </svg>
  );
}

// Conexão do WhatsApp da clínica: desconectado (botão Conectar), conectando (QR Code) ou conectado (número).
function CartaoConexao({ situacao, conectando, ocupado, onConectar, onCancelar, onDesconectar }) {
  const [confirmando, setConfirmando] = useState(false);

  if (!situacao.disponivel) {
    return (
      <section className="card whats-card">
        <h3 className="whats-card__titulo">{tr('Conexão')}</h3>
        <p className="alert alert--info" role="status">{tr('O WhatsApp ainda não está disponível neste ambiente.')}</p>
      </section>
    );
  }

  if (situacao.conectado) {
    return (
      <section className="card whats-card whats-card--conectado">
        <div className="whats-conexao">
          <span className="whats-conexao__icone"><IconeWhatsapp /></span>
          <div className="whats-conexao__dados">
            <span className="badge badge--success">{tr('Conectado')}</span>
            <strong>{formatarNumeroWhatsapp(situacao.numero)}</strong>
            {situacao.nomePerfil && <span className="whats-conexao__perfil">{situacao.nomePerfil}</span>}
          </div>
        </div>
        <p className="whats-card__texto">{tr('Os lembretes saem deste número. As respostas dos pacientes chegam normalmente no WhatsApp da clínica.')}</p>
        {ocupado === 'desconectar' ? (
          <p className="whats-card__dica" role="status">{tr('Desconectando... isso leva alguns segundos.')}</p>
        ) : confirmando ? (
          <div className="whats-confirmar" role="group" aria-label={tr('Confirmar desconexão')}>
            <span>{tr('Desconectar?')}</span>
            <button type="button" className="btn btn--danger btn--sm" disabled={ocupado === 'desconectar'} onClick={async () => { await onDesconectar(); setConfirmando(false); }} aria-label={tr('Sim, desconectar')}>✓</button>
            <button type="button" className="btn btn--ghost btn--sm" onClick={() => setConfirmando(false)} aria-label={tr('Não desconectar')}>✗</button>
          </div>
        ) : (
          <button type="button" className="btn btn--ghost btn--sm whats-card__acao" onClick={() => setConfirmando(true)}>{tr('Desconectar')}</button>
        )}
      </section>
    );
  }

  if (conectando) {
    return (
      <section className="card whats-card">
        <h3 className="whats-card__titulo">{tr('Leia o QR Code com o celular da clínica')}</h3>
        <div className="whats-qr">
          <div className="whats-qr__imagem">
            {situacao.qrcode ? <img src={situacao.qrcode} alt={tr('QR Code para conectar o WhatsApp')} /> : <div className="skeleton whats-qr__carregando" />}
          </div>
          <ol className="whats-qr__passos">
            <li>{tr('Abra o WhatsApp no celular da clínica.')}</li>
            <li>{tr('Toque em Mais opções (⋮) ou Configurações e depois em Aparelhos conectados.')}</li>
            <li>{tr('Toque em Conectar um aparelho e aponte a câmera para este código.')}</li>
          </ol>
        </div>
        <p className="whats-card__dica">{tr('O código muda a cada poucos segundos. Esta tela avisa sozinha quando conectar.')}</p>
        <button type="button" className="btn btn--ghost btn--sm whats-card__acao" onClick={onCancelar}>{tr('Cancelar')}</button>
      </section>
    );
  }

  return (
    <section className="card whats-card whats-card--vazio">
      <span className="whats-conexao__icone whats-conexao__icone--apagado"><IconeWhatsapp /></span>
      <h3 className="whats-card__titulo">{tr('Conecte o WhatsApp da clínica')}</h3>
      <p className="whats-card__texto">{tr('Os lembretes de consulta saem do número da própria clínica. Para conectar, basta ler um QR Code com o celular, como no WhatsApp Web.')}</p>
      <button type="button" className="btn btn--primary" onClick={onConectar}>{tr('Conectar WhatsApp')}</button>
    </section>
  );
}

function CartaoLembretes({ situacao, ocupado, nomeClinica, onSalvar }) {
  const [texto, setTexto] = useState(situacao.texto);
  const [ativo, setAtivo] = useState(situacao.ativo);
  const alterado = texto !== situacao.texto || ativo !== situacao.ativo;

  function inserir(variavel) {
    setTexto((atual) => `${atual}${atual.endsWith(' ') || !atual ? '' : ' '}{${variavel}}`);
  }

  return (
    <section className="card whats-card">
      <div className="whats-card__cab">
        <h3 className="whats-card__titulo">{tr('Lembrete de consulta')}</h3>
        <button type="button" role="switch" aria-checked={ativo} className="switch" onClick={() => setAtivo(!ativo)}>
          <span className="switch__track" />
          {ativo ? tr('Ligado') : tr('Desligado')}
        </button>
      </div>
      <p className="whats-card__texto">{tr('Enviado 24 horas antes da consulta, entre 8h e 20h, para os pacientes marcados com "Aceita receber lembretes de consulta pelo WhatsApp" no cadastro.')}</p>

      <div className="field">
        <label className="field__label" htmlFor="whats-texto">{tr('Texto do lembrete')}</label>
        <textarea id="whats-texto" className="input textarea" rows={4} maxLength={1000} value={texto} onChange={(e) => setTexto(e.target.value)} />
        <div className="whats-variaveis" aria-label={tr('Inserir no texto')}>
          {VARIAVEIS_DO_LEMBRETE.map(([chave, rotulo]) => (
            <button key={chave} type="button" className="whats-variavel" onClick={() => inserir(chave)} title={rotulo}>{`{${chave}}`}</button>
          ))}
          {texto !== situacao.textoPadrao && (
            <button type="button" className="whats-variavel whats-variavel--padrao" onClick={() => setTexto(situacao.textoPadrao)}>{tr('Usar o texto padrão')}</button>
          )}
        </div>
      </div>

      <div className="whats-previa" aria-label={tr('Prévia da mensagem')}>
        <span className="whats-previa__rotulo">{tr('Prévia')}</span>
        <p className="whats-previa__balao">{previaDoLembrete(texto, nomeClinica)}</p>
      </div>

      <button type="button" className="btn btn--primary whats-card__acao" disabled={!alterado || !texto.trim() || ocupado === 'salvar'} onClick={() => onSalvar({ texto, ativo })}>
        {ocupado === 'salvar' ? tr('Salvando...') : tr('Salvar')}
      </button>
    </section>
  );
}

function CartaoTeste({ conectado, ocupado, onEnviar }) {
  const [telefone, setTelefone] = useState('');
  return (
    <section className="card whats-card">
      <h3 className="whats-card__titulo">{tr('Enviar um teste')}</h3>
      <p className="whats-card__texto">{tr('Manda o lembrete com dados de exemplo para o número que você digitar.')}</p>
      <form className="whats-teste" onSubmit={(e) => { e.preventDefault(); onEnviar(telefone); }}>
        <input className="input" type="tel" inputMode="tel" placeholder={tr('(11) 98765-4321')} value={telefone} onChange={(e) => setTelefone(e.target.value)} aria-label={tr('Telefone para o teste')} />
        <button type="submit" className="btn btn--ghost" disabled={!conectado || !telefone.trim() || ocupado === 'teste'}>
          {ocupado === 'teste' ? tr('Enviando...') : tr('Enviar teste')}
        </button>
      </form>
      {!conectado && <p className="whats-card__dica">{tr('Conecte o WhatsApp para enviar o teste.')}</p>}
    </section>
  );
}

// Tela do WhatsApp da clínica: conexão do número e o lembrete de consulta.
export default function WhatsappPage() {
  const { user } = useAuthContext();
  const { situacao, carregando, erro, mensagem, conectando, ocupado, conectar, cancelarConexao, desconectar, salvar, enviarTeste } = useWhatsapp();

  return (
    <div className="page page--narrow">
      <header className="page-header">
        <div>
          <h2 className="page-title">{tr('WhatsApp')}</h2>
          <p className="page-subtitle">{tr('Lembretes de consulta enviados pelo número da sua clínica')}</p>
        </div>
      </header>

      {(erro || mensagem) && (
        <div className="alerts">
          {erro && <p className="alert alert--error" role="alert">{erro.message}</p>}
          {mensagem && <p className="alert alert--success" role="status">{mensagem === 'conectado' ? tr('WhatsApp conectado!') : mensagem}</p>}
        </div>
      )}

      {carregando ? (
        <div className="whats-grade" aria-busy="true">
          <div className="skeleton skeleton--bloco" />
          <div className="skeleton skeleton--bloco" />
        </div>
      ) : situacao && (
        <div className="whats-grade">
          <CartaoConexao situacao={situacao} conectando={conectando} ocupado={ocupado} onConectar={conectar} onCancelar={cancelarConexao} onDesconectar={desconectar} />
          <CartaoLembretes key={`${situacao.texto}|${situacao.ativo}`} situacao={situacao} ocupado={ocupado} nomeClinica={user?.nomeEmpresa} onSalvar={salvar} />
          <CartaoTeste conectado={situacao.conectado} ocupado={ocupado} onEnviar={enviarTeste} />
          <p className="whats-aviso">{tr('Use um número de WhatsApp da clínica. O WhatsApp pode bloquear números que mandam muitas mensagens; a Sonelia espaça os envios para diminuir esse risco.')}</p>
        </div>
      )}
    </div>
  );
}
