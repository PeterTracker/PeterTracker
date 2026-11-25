import { useState } from 'react';
import { colors } from '../theme/tokens';
import { relTime, useNow, usePeter } from '../store/usePeter';
import { triggerEmergency, type EmergencyTarget } from '../services/api';
import { useNav } from '../store/useNav';
import { Icon } from '../components/Icons';
import { Card, IconButton, InfoRow, SectionLabel } from '../components/ui';
import { HoldToConfirmButton } from '../components/HoldToConfirmButton';

const TARGETS: { key: EmergencyTarget; label: string; sub: string }[] = [
  { key: '911', label: 'Emergência (911)', sub: 'Polícia, bombeiros e ambulância' },
  { key: 'delegacia', label: 'Delegacia mais próxima', sub: 'NYPD 112th Precinct · 1,2 km' },
];

export function EmergenciaScreen() {
  const { closeEmergencia, showConfirmado } = useNav();
  const status = usePeter((st) => st.status);
  const now = useNow();
  const [target, setTarget] = useState<EmergencyTarget>('911');
  const [sending, setSending] = useState(false);

  const confirm = async () => {
    if (!status) return;
    setSending(true);
    try {
      const receipt = await triggerEmergency({ target, coords: status.coords });
      showConfirmado(receipt);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="pt-modal-screen pt-emergencia-screen" role="dialog" aria-modal="true" aria-label="Acionar autoridades">
      <header className="pt-emergencia-header">
        <IconButton icon="close" label="Fechar" onPress={closeEmergencia} />
        <h1 className="pt-screen-title">Acionar autoridades</h1>
      </header>

      <div className="pt-scroll-body">
        <Card className="pt-info-card">
          <InfoRow icon="place" label="Localização" value={status?.address || '—'} />
          <InfoRow
            icon="schedule"
            label="Último sinal"
            value={status ? relTime(status.updatedAt, now) : '—'}
          />
          <InfoRow
            icon="person"
            label="Contato responsável"
            value="Mary Jane Watson"
            sub="(212) 555-0187"
          />
        </Card>

        <SectionLabel>Enviar para</SectionLabel>

        <div className="pt-radio-list" role="radiogroup" aria-label="Destino do alerta">
          {TARGETS.map((t) => {
            const on = t.key === target;
            return (
              <button
                key={t.key}
                type="button"
                role="radio"
                aria-checked={on}
                className={`pt-radio ${on ? 'is-checked' : ''}`}
                onClick={() => setTarget(t.key)}
              >
                <Icon
                  name={on ? 'radio-button-checked' : 'radio-button-unchecked'}
                  size={22}
                  color={on ? colors.redSoft : colors.textMuted}
                />
                <div className="pt-radio-body">
                  <div className="pt-radio-label">{t.label}</div>
                  <div className="pt-radio-sub">{t.sub}</div>
                </div>
              </button>
            );
          })}
        </div>

        <p className="pt-warn">
          Use apenas em emergências reais. Sua localização e a de Peter serão compartilhadas.
        </p>
      </div>

      <div className="pt-emergencia-footer">
        <HoldToConfirmButton
          title={sending ? 'Enviando…' : 'Segure para acionar'}
          onConfirm={confirm}
          disabled={sending || !status}
        />
      </div>
    </div>
  );
}
