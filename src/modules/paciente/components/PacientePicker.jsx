import { useMemo, useState } from 'react';
import NovoPacienteForm from './NovoPacienteForm';
import { filtrarPacientes, ordenarPacientes, cpfDoPaciente } from '../paciente.utils';
import { iniciais } from '@/utils/nome';
import { IconeBusca, IconeX } from '@/components/CrudCard/icones';
import '@/components/CrudCard/CrudCard.css';
import './paciente-picker.css';
import SeloTeste from './SeloTeste';

// Escolhe um paciente por busca (nome, CPF, telefone) ou cadastra um novo na hora.
// `onCriarPaciente` deve devolver o paciente criado (ou lançar erro).
// Não renderiza <form> próprio ao redor, então pode ficar ao lado de um <form> sem aninhar.
export default function PacientePicker({ pacientes, convenios, empresas, valor, onChange, onCriarPaciente, rotulo = 'Paciente' }) {
  const [busca, setBusca] = useState('');
  const [mostrandoNovo, setMostrandoNovo] = useState(false);
  const [erroNovo, setErroNovo] = useState(null);

  const sugestoes = useMemo(() => {
    if (!busca.trim()) return [];
    return filtrarPacientes(ordenarPacientes(pacientes), busca).slice(0, 5);
  }, [pacientes, busca]);

  function selecionar(paciente) {
    onChange(paciente);
    setBusca('');
    setMostrandoNovo(false);
    setErroNovo(null);
  }

  async function handleCriar(dados) {
    try {
      const criado = await onCriarPaciente(dados);
      selecionar(criado);
      return true;
    } catch (err) {
      setErroNovo(err.message || 'Erro ao cadastrar paciente');
      return false;
    }
  }

  return (
    <div className="field">
      <span className="field__label">{rotulo}</span>

      {valor ? (
        <div className="picker__paciente">
          <span className="picker__paciente-avatar" aria-hidden="true">{iniciais(valor.nome)}</span>
          <span className="picker__paciente-nome">{valor.nome}</span>
          <SeloTeste paciente={valor} />
          <span className="picker__paciente-cpf">{cpfDoPaciente(valor)}</span>
          <button type="button" className="icon-btn" aria-label="Trocar paciente" onClick={() => onChange(null)}>
            <IconeX />
          </button>
        </div>
      ) : (
        <>
          <div className="search">
            <IconeBusca />
            <input
              className="input"
              type="search"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por nome, CPF ou telefone"
              aria-label="Buscar paciente"
              autoComplete="off"
            />
          </div>

          {sugestoes.length > 0 && (
            <ul className="picker__sugestoes">
              {sugestoes.map((p) => (
                <li key={p._id}>
                  <button type="button" onClick={() => selecionar(p)}>
                    <strong>{p.nome}{p.teste && ' (teste)'}</strong>
                    <span>{cpfDoPaciente(p)}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {busca.trim() && sugestoes.length === 0 && <p className="modal-form__hint">Nenhum paciente encontrado.</p>}

          <button type="button" className="btn btn--ghost btn--sm picker__novo" onClick={() => setMostrandoNovo(!mostrandoNovo)}>
            {mostrandoNovo ? 'Cancelar cadastro' : '+ Cadastrar novo paciente'}
          </button>

          {erroNovo && <p className="alert alert--error" role="alert">{erroNovo}</p>}

          {mostrandoNovo && (
            <div className="picker__aninhado">
              <NovoPacienteForm convenios={convenios} empresas={empresas} onSubmit={handleCriar} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
