import { useEffect, useState } from 'react';
import { colors } from '../theme/tokens';
import { usePeter } from '../store/usePeter';
import { useNav } from '../store/useNav';
import { Icon, type IconName } from '../components/Icons';
import { Avatar } from '../components/ui';

const NO_ANSWER_MS = 45000;

function CallAction({
  icon,
  label,
  active,
  onPress,
}: {
  icon: IconName;
  label: string;
  active?: boolean;
  onPress: () => void;
}) {
  return (
    <button
      type="button"
      className="pt-call-action"
      onClick={onPress}
      aria-pressed={active}
    >
      <span className={`pt-call-action-icon ${active ? 'is-active' : ''}`}>
        <Icon name={icon} size={26} color={active ? colors.bg : colors.text} />
      </span>
      <span className="pt-call-action-label">{label}</span>
    </button>
  );
}

export function CallScreen() {
  const closeCall = useNav((n) => n.closeCall);
  const status = usePeter((st) => st.status);
  const [secs, setSecs] = useState(0);
  const [muted, setMuted] = useState(false);
  const [speaker, setSpeaker] = useState(false);

  const hangUp = () => closeCall(true);

  useEffect(() => {
    const tick = window.setInterval(() => setSecs((x) => x + 1), 1000);
    const timeout = window.setTimeout(hangUp, NO_ANSWER_MS);
    return () => {
      window.clearInterval(tick);
      window.clearTimeout(timeout);
    };
  }, []);

  const mmss = `${String(Math.floor(secs / 60)).padStart(2, '0')}:${String(secs % 60).padStart(2, '0')}`;

  return (
    <div className="pt-modal-screen pt-call-screen" role="dialog" aria-modal="true" aria-label="Ligação para Peter Parker">
      <div className="pt-call-center">
        <div className="pt-call-avatar-wrap">
          <span className="pt-call-ring" />
          <span className="pt-call-ring is-delayed" />
          <Avatar size={120} />
        </div>
        <h1 className="pt-call-name">Peter Parker</h1>
        <p className="pt-call-status">Chamando… {mmss}</p>
        {status && (
          <div className="pt-call-chip">
            <Icon name="place" size={14} color={colors.redSoft} />
            <span>{status.address}</span>
          </div>
        )}
      </div>

      <div className="pt-call-actions">
        <CallAction
          icon={muted ? 'mic-off' : 'mic'}
          label="Mudo"
          active={muted}
          onPress={() => setMuted(!muted)}
        />
        <CallAction
          icon="volume-up"
          label="Alto-falante"
          active={speaker}
          onPress={() => setSpeaker(!speaker)}
        />
        <CallAction icon="chat" label="Chat" onPress={() => closeCall(false)} />
      </div>

      <button
        type="button"
        className="pt-call-end"
        onClick={hangUp}
        aria-label="Encerrar chamada"
      >
        <Icon name="call-end" size={32} color={colors.text} />
      </button>
    </div>
  );
}
