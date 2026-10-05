// Consentimento do paciente para receber o lembrete da consulta no WhatsApp (exigido pela Meta e pela LGPD).
export default function CampoAceitaWhatsapp({ valor, onChange }) {
  return (
    <div className="field field--full">
      <label className="check paciente-whatsapp">
        <input type="checkbox" checked={!!valor} onChange={(e) => onChange(e.target.checked)} />
        <span>Aceita receber lembretes de consulta pelo WhatsApp</span>
      </label>
    </div>
  );
}
