import { useEffect, useState } from 'react';
import { colors } from './theme/tokens';
import { useAuth } from './store/useAuth';
import { MOODS, usePeter } from './store/usePeter';
import { useChat } from './store/useChat';
import { useNav, type TabKey } from './store/useNav';
import type { MoodKey } from './services/api';
import { Icon, type IconName } from './components/Icons';
import { LoginScreen } from './screens/LoginScreen';
import { MapScreen } from './screens/MapScreen';
import { DashboardScreen } from './screens/DashboardScreen';
import { ChatScreen } from './screens/ChatScreen';
import { CallScreen } from './screens/CallScreen';
import { EmergenciaScreen } from './screens/EmergenciaScreen';
import { ConfirmadoScreen } from './screens/ConfirmadoScreen';

function TabButton({
  icon,
  label,
  active,
  badge,
  onClick,
}: {
  icon: IconName;
  label: string;
  active: boolean;
  badge?: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={`pt-tab-btn ${active ? 'is-active' : ''}`}
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
    >
      <span className="pt-tab-pill">
        <Icon name={icon} size={22} color={active ? colors.redSoft : colors.textMuted} />
        {!!badge && <span className="pt-tab-badge">{badge}</span>}
      </span>
      <span className="pt-tab-label">{label}</span>
    </button>
  );
}

export function App() {
  const { token, logout } = useAuth();
  const { tab, modal, setTab, openEmergencia, returnToMap } = useNav();
  const { status, refresh, subscribe, inactiveSimulated, toggleInactive, setMood } = usePeter();
  const unread = useChat((s) => s.unread);

  const [fullWidth, setFullWidth] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);

  useEffect(() => {
    if (!token) return;
    refresh();
    return subscribe();
  }, [token, refresh, subscribe]);

  const handleLogout = () => {
    returnToMap();
    logout();
    setDemoOpen(false);
  };

  const renderTab = (activeTab: TabKey) => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardScreen />;
      case 'chat':
        return <ChatScreen />;
      default:
        return <MapScreen />;
    }
  };

  return (
    <div className={`pt-stage ${fullWidth ? 'is-full' : ''}`}>
      <main className={`pt-device ${fullWidth ? 'is-full' : ''}`}>
        <div className="pt-device-inner">
          {!token ? (
            <LoginScreen />
          ) : (
            <div className="pt-app-shell">
              <div className="pt-app-content">{renderTab(tab)}</div>

              <nav className="pt-tabbar" aria-label="Navegação principal">
                <TabButton
                  icon="map"
                  label="Mapa"
                  active={tab === 'map'}
                  onClick={() => setTab('map')}
                />
                <TabButton
                  icon="bar-chart"
                  label="Dashboard"
                  active={tab === 'dashboard'}
                  onClick={() => setTab('dashboard')}
                />
                <TabButton
                  icon="chat"
                  label="Chat"
                  active={tab === 'chat'}
                  badge={unread}
                  onClick={() => setTab('chat')}
                />
                <TabButton
                  icon="shield"
                  label="Autoridades"
                  active={false}
                  onClick={openEmergencia}
                />
              </nav>

              {modal === 'call' && <CallScreen />}
              {modal === 'emergencia' && <EmergenciaScreen />}
              {modal === 'confirmado' && <ConfirmadoScreen />}
            </div>
          )}
        </div>
      </main>

      {/* Controles discretos para apresentações em desktop (ocultos em celular) */}
      <aside className="pt-demo-dock" aria-label="Controles de demonstração">
        <button
          type="button"
          className="pt-dock-btn"
          onClick={() => setFullWidth((v) => !v)}
          title={fullWidth ? 'Visualizar em moldura de celular' : 'Expandir para tela cheia'}
        >
          <Icon name={fullWidth ? 'smartphone' : 'fullscreen'} size={18} color={colors.textSoft} />
          <span>{fullWidth ? 'Modo celular' : 'Tela cheia'}</span>
        </button>

        {token && (
          <button
            type="button"
            className={`pt-dock-btn ${demoOpen ? 'is-active' : ''}`}
            onClick={() => setDemoOpen((v) => !v)}
            title="Simular cenários para apresentação"
          >
            <Icon name="tune" size={18} color={colors.textSoft} />
            <span>Simular</span>
          </button>
        )}

        {token && (
          <button
            type="button"
            className="pt-dock-btn"
            onClick={handleLogout}
            title="Sair para a tela de login"
          >
            <Icon name="logout" size={18} color={colors.textSoft} />
            <span>Sair</span>
          </button>
        )}

        {demoOpen && token && (
          <div className="pt-demo-panel">
            <div className="pt-demo-panel-title">Cenários de demonstração (offline)</div>

            <button
              type="button"
              className={`pt-demo-toggle ${inactiveSimulated ? 'is-on' : ''}`}
              onClick={toggleInactive}
            >
              <Icon
                name="warning"
                size={16}
                color={inactiveSimulated ? colors.redSoft : colors.textMuted}
              />
              <span>
                {inactiveSimulated ? 'Alerta >5 min ativo (clique p/ normalizar)' : 'Simular sem sinal há 8 min'}
              </span>
            </button>

            <div className="pt-demo-mood-label">Humor de Peter</div>
            <div className="pt-demo-mood-grid">
              {(Object.keys(MOODS) as MoodKey[]).map((key) => {
                const m = MOODS[key];
                const active = status?.mood === key;
                return (
                  <button
                    key={key}
                    type="button"
                    className={`pt-demo-mood-chip ${active ? 'is-active' : ''}`}
                    onClick={() => setMood(key)}
                  >
                    <Icon name={m.icon} size={14} color={m.color} />
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}

export default App;
