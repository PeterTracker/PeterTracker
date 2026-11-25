import { useState } from 'react';
import { colors } from '../theme/tokens';
import { INACTIVE_MIN, minutesSince, relTime, useNow, usePeter } from '../store/usePeter';
import { useNav } from '../store/useNav';
import { Icon } from '../components/Icons';
import { OfflineMap } from '../components/OfflineMap';
import { Avatar, Banner, Card, IconButton, SectionLabel } from '../components/ui';

export function MapScreen() {
  const setTab = useNav((n) => n.setTab);
  const status = usePeter((s) => s.status);
  const now = useNow();
  const [recenterSignal, setRecenterSignal] = useState(0);

  const inactive = status ? minutesSince(status.updatedAt, now) > INACTIVE_MIN : false;

  const recenter = () => setRecenterSignal((n) => n + 1);

  return (
    <div className="pt-screen pt-map-screen">
      {status && (
        <OfflineMap
          coords={status.coords}
          tagLabel={`Peter · ${relTime(status.updatedAt, now)}`}
          interactive
          recenterSignal={recenterSignal}
        />
      )}

      <div className="pt-map-header">
        <Card className="pt-hello-card">
          <Avatar size={40} initials="MJ" />
          <div className="pt-hello-info">
            <div className="pt-hello-title">Olá, MJ</div>
            <div className="pt-hello-sub">Monitorando Peter</div>
          </div>
          <IconButton icon="bar-chart" label="Abrir dashboard" onPress={() => setTab('dashboard')} />
        </Card>

        {inactive && status && (
          <Banner
            icon="warning"
            text={`Localização sem atualizar há ${minutesSince(status.updatedAt, now)} min`}
          />
        )}
      </div>

      <div className="pt-map-bottom">
        <button
          type="button"
          className="pt-fab"
          onClick={recenter}
          aria-label="Recentralizar em Peter"
          title="Recentralizar em Peter"
        >
          <Icon name="my-location" size={24} color={colors.text} />
        </button>

        <Card className="pt-loc-card">
          <SectionLabel>Localização atual</SectionLabel>
          <div className="pt-address">{status?.address || 'Carregando…'}</div>
          {status && (
            <div className="pt-time">
              Atualizado {relTime(status.updatedAt, now)} · {status.coords.latitude.toFixed(4)},{' '}
              {status.coords.longitude.toFixed(4)}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
