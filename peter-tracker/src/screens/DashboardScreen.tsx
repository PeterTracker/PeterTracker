import { useState } from 'react';
import { colors } from '../theme/tokens';
import { hhmm, INACTIVE_MIN, minutesSince, MOODS, relTime, useNow, usePeter } from '../store/usePeter';
import { useNav } from '../store/useNav';
import { Icon } from '../components/Icons';
import { OfflineMap } from '../components/OfflineMap';
import { Avatar, Banner, Card, IconButton, InfoRow, OutlineButton, SectionLabel } from '../components/ui';

export function DashboardScreen() {
  const setTab = useNav((n) => n.setTab);
  const { status, refresh } = usePeter();
  const now = useNow();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  const mood = status ? MOODS[status.mood] : null;
  const home = () => setTab('map');

  return (
    <div className="pt-screen pt-dashboard-screen">
      <header className="pt-screen-header">
        <IconButton icon="arrow-back" label="Voltar" onPress={home} />
        <h1 className="pt-screen-title">Dashboard</h1>
        <IconButton icon="refresh" label="Atualizar" onPress={onRefresh} spin={refreshing} />
      </header>

      <div className="pt-scroll-body">
        {status && mood && (
          <>
            {minutesSince(status.updatedAt, now) > INACTIVE_MIN && (
              <Banner
                icon="warning"
                text={`Localização sem atualizar há ${minutesSince(status.updatedAt, now)} min`}
              />
            )}

            <Card className="pt-mood-card">
              <SectionLabel>Humor de Peter</SectionLabel>
              <div className="pt-mood-row">
                <Avatar size={52} online={status.online} />
                <div className="pt-mood-info">
                  <div className="pt-mood-title-row">
                    <Icon name={mood.icon} size={22} color={mood.color} />
                    <span className="pt-mood-label" style={{ color: mood.color }}>
                      {mood.label}
                    </span>
                  </div>
                  <div className="pt-muted-line">
                    Baseado na movimentação recente · desde {hhmm(status.moodSince)}
                  </div>
                </div>
              </div>
            </Card>

            <div className="pt-mini-map" onClick={home} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && home()}>
              <OfflineMap coords={status.coords} interactive={false} />
              <span className="pt-mini-map-chip">
                <Icon name="open-in-full" size={14} color={colors.text} />
                <span>Abrir mapa</span>
              </span>
            </div>

            <Card className="pt-info-card">
              <InfoRow
                icon="place"
                label="Última localização"
                value={status.address}
                sub={`${status.coords.latitude.toFixed(5)}, ${status.coords.longitude.toFixed(5)}`}
              />
              <div className="pt-divider" />
              <InfoRow
                icon="schedule"
                label="Última atualização"
                value={relTime(status.updatedAt, now)}
                sub={`às ${hhmm(status.updatedAt)}`}
              />
            </Card>
          </>
        )}

        <OutlineButton title="Voltar à tela principal" icon="home" onPress={home} />
      </div>
    </div>
  );
}
