import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from '@/components/Modal/Modal';
import { useAuthContext } from '@/hooks/useAuthContext';
import { idiomaAtual, localeAtual, tr } from '@/i18n';
import { getPlanosPublicos } from '../plano.api';
import { planoQueLibera } from '../plano.contexto';
import { formatarPrecoPlano, NOME_DO_NIVEL } from '../plano.utils';
import './recurso-bloqueado.css';

// O que cada recurso traz, com uma captura do sistema desfocada atrás do cadeado (as de public/landing).
const RECURSOS = {
  prontuario: { titulo: tr('Prontuário eletrônico'), texto: tr('Registre cada atendimento com histórico em linha do tempo, CID-10, alergias em destaque e sigilo garantido.'), imagem: 'prontuario.jpg' },
  anamnese: { titulo: tr('Anamneses'), texto: tr('Modelos prontos por área, preenchidos no atendimento e guardados junto do prontuário.'), imagem: 'prontuario.jpg' },
  termo: { titulo: tr('Termo de consentimento (TCLE)'), texto: tr('Envie o termo pelo WhatsApp e o paciente assina pelo celular, com o PDF guardado.'), imagem: 'pacientes.jpg' },
  convenio: { titulo: tr('Convênios'), texto: tr('Preço e repasse diferentes para cada convênio, que já aparecem certos ao agendar.'), imagem: 'painel-admin.jpg' },
  avaliacoes: { titulo: tr('Avaliações'), texto: tr('Avaliação neuropsicológica e NR-01 com registro estruturado, do jeito que o laudo pede.'), imagem: 'prontuario.jpg' },
  empresas: { titulo: tr('Empresas clientes'), texto: tr('Cadastre as empresas atendidas e os funcionários de cada uma.'), imagem: 'painel-admin.jpg' },
  whatsapp: { titulo: tr('Lembretes pelo WhatsApp'), texto: tr('O lembrete da consulta sai do WhatsApp da clínica 24 horas antes, e menos pacientes faltam.'), imagem: 'agenda-semana.jpg' },
  reunioes: { titulo: tr('Agenda de reuniões'), texto: tr('Uma agenda à parte para conversas com clientes e parceiros.'), imagem: 'reunioes.jpg' },
  equipe: { titulo: tr('Equipe da clínica'), texto: tr('Cada profissional com o próprio login, a própria agenda e os próprios prontuários.'), imagem: 'agenda-semana.jpg' },
  pacientes: { titulo: tr('Pacientes sem limite'), texto: tr('O Grátis vai até 20 pacientes; nos planos pagos, não há limite.'), imagem: 'pacientes.jpg' },
  profissionais: { titulo: tr('Mais profissionais'), texto: tr('Cadastre a equipe toda, cada profissional com a sua cor na agenda.'), imagem: 'agenda-semana.jpg' },
  repasse: { titulo: tr('Repasses'), texto: tr('Quanto cada profissional tem a receber, calculado sozinho a cada atendimento.'), imagem: 'repasses.jpg' },
  recepcao: { titulo: tr('Recepção'), texto: tr('A recepção agenda, cadastra e chama os pacientes, sem ver o conteúdo clínico.'), imagem: 'agenda-semana.jpg' },
};

function IconeCadeado() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="18" height="11" x="3" y="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

// Janela "recurso de plano pago": mostra o que o recurso faz, qual plano libera e quanto custa por dia.
// Quem paga (admin e recepção) vai para a tela de planos; o profissional é orientado a pedir à gestão.
// `rota`: tela do recurso (vinda do menu), para quem só quer consultar o que já foi registrado.
export default function RecursoBloqueadoModal({ recurso, mensagem, rota, nivel, moeda, onClose }) {
  const { user } = useAuthContext();
  const [planos, setPlanos] = useState(null);
  const info = RECURSOS[recurso] ?? { titulo: tr('Recurso dos planos pagos'), texto: mensagem ?? '', imagem: 'inicio.jpg' };
  const alvo = planoQueLibera(recurso, nivel).toLowerCase();
  const podePagar = ['admin', 'recepcao'].includes(user?.role);
  const pasta = idiomaAtual() === 'pt' ? '/landing' : '/landing/en';

  useEffect(() => {
    let cancelado = false;
    getPlanosPublicos(user?.paisClinica ?? 'BR')
      .then(({ data }) => { if (!cancelado) setPlanos(data ?? []); })
      .catch(() => { if (!cancelado) setPlanos([]); });
    return () => { cancelado = true; };
  }, [user?.paisClinica]);

  const plano = planos?.find((p) => (p.nivel ?? 'pro') === alvo);
  const nomePlano = plano?.nome ?? NOME_DO_NIVEL[alvo];
  const porDia = plano ? formatarPrecoPlano(Math.ceil((plano.preco / 30) * 100) / 100, localeAtual(), plano.moeda ?? moeda) : null;

  // Limite do plano mais completo (ex.: o 101º profissional no Rede): não há o que assinar, só o aviso.
  if (nivel === 'rede') {
    return (
      <Modal title={tr('Limite do plano')} onClose={onClose} className="recurso-bloqueado">
        {(fechar) => (
          <div className="recurso-bloqueado__corpo">
            <p className="recurso-bloqueado__texto">{mensagem ?? info.texto}</p>
            <div className="recurso-bloqueado__acoes">
              <button type="button" className="btn btn--primary btn--block" onClick={fechar} data-autofocus>{tr('Entendi')}</button>
            </div>
          </div>
        )}
      </Modal>
    );
  }

  return (
    <Modal title={info.titulo} onClose={onClose} className="recurso-bloqueado">
      {(fechar) => (
      <div className="recurso-bloqueado__corpo">
        <div className="recurso-bloqueado__vitrine">
          <img src={`${pasta}/${info.imagem}`} alt="" loading="lazy" />
          <span className="recurso-bloqueado__cadeado"><IconeCadeado /></span>
          <span className="recurso-bloqueado__selo">{nomePlano}</span>
        </div>

        <p className="recurso-bloqueado__texto">{info.texto}</p>
        {mensagem && mensagem !== info.texto && <p className="recurso-bloqueado__aviso">{mensagem}</p>}
        <p className="recurso-bloqueado__plano">
          {tr('Disponível a partir do plano {plano}.', { plano: nomePlano })}
          {porDia && <> {tr('Sai por {valor} por dia.', { valor: porDia })}</>}
        </p>

        {podePagar ? (
          <div className="recurso-bloqueado__acoes">
            <Link to="/assinaturas" className="btn btn--primary btn--block" onClick={fechar} data-autofocus>
              {porDia ? tr('Assinar o {plano} por {valor}/dia', { plano: nomePlano, valor: porDia }) : tr('Ver os planos')}
            </Link>
            <button type="button" className="btn btn--ghost btn--block" onClick={fechar}>{tr('Agora não')}</button>
            {rota && <Link to={rota} className="recurso-bloqueado__consultar" onClick={fechar}>{tr('Só consultar o que já foi registrado')}</Link>}
          </div>
        ) : (
          <div className="recurso-bloqueado__acoes">
            <p className="alert alert--info" role="status">{tr('Peça para a gestão da clínica assinar o plano {plano} para liberar este recurso.', { plano: nomePlano })}</p>
            <button type="button" className="btn btn--ghost btn--block" onClick={fechar} data-autofocus>{tr('Entendi')}</button>
            {rota && <Link to={rota} className="recurso-bloqueado__consultar" onClick={fechar}>{tr('Só consultar o que já foi registrado')}</Link>}
          </div>
        )}
      </div>
      )}
    </Modal>
  );
}
