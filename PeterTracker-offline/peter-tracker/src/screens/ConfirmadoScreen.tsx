import { useState } from 'react';
import { colors } from '../theme/tokens';
import { hhmm } from '../store/usePeter';
import { useNav } from '../store/useNav';
import { Icon } from '../components/Icons';
import { Card, OutlineButton, PrimaryButton, SectionLabel } from '../components/ui';

export function ConfirmadoScreen() {
  const { receipt, returnToMap } = useNav();
  const [dialNote, setDialNote] = useState(false);

  const call911 = () => {
    setDialNote(true);
    try {
      window.location.href = 'tel:911';
    } catch {
      // Ambiente desktop sem discador configurado
    }
  };

  return (
    <div className="pt-modal-screen pt-confirmado-screen" role="dialog" aria-modal="true" aria-label="Autoridades acionadas">
      <div className="pt-confirmado-top">
        <div className="pt-confirmado-ring">
          <Icon name="verified-user" size={48} color={colors.blue} />
        </div>
        <h1 className="pt-confirmado-title">Autoridades acionadas</h1>
        <p className="pt-confirmado-text">
          Enviamos a localização de Peter e seus dados de contato. Mantenha o celular por perto — a
          equipe pode ligar para você.
        </p>
      </div>

      <Card className="pt-confirmado-card">
        <div className="pt-confirmado-row">
          <SectionLabel>Protocolo</SectionLabel>
          <span className="pt-confirmado-value">{receipt?.protocol || 'NYPD-000000'}</span>
        </div>
        <div className="pt-confirmado-row">
          <SectionLabel>Enviado às</SectionLabel>
          <span className="pt-confirmado-value">
            {receipt?.sentAt ? hhmm(receipt.sentAt) : '—'}
          </span>
        </div>
        <div className="pt-confirmado-row">
          <SectionLabel>Status</SectionLabel>
          <span className="pt-confirmado-status">
            <span className="pt-status-dot" />
            <span className="pt-confirmado-value">{receipt?.status || 'Unidade a caminho'}</span>
          </span>
        </div>
      </Card>

      {dialNote && (
        <p className="pt-dial-note">
          Chamada de emergência simulada para <strong>911</strong> (em celulares abre o discador).
        </p>
      )}

      <div className="pt-confirmado-actions">
        <PrimaryButton title="Acompanhar no mapa" icon="map" onPress={returnToMap} />
        <OutlineButton title="Ligar para o 911" icon="call" onPress={call911} />
      </div>
    </div>
  );
}
