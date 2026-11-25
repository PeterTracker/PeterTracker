import { colors } from '../theme/tokens';
import { minutesSince, usePeter } from '../store/usePeter';
import { useNav } from '../store/useNav';
import { Icon } from './Icons';
import { OutlineButton, PrimaryButton } from './ui';

export function DangerSheet({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const openEmergencia = useNav((n) => n.openEmergencia);
  const status = usePeter((st) => st.status);
  const min = status ? minutesSince(status.updatedAt) : 0;

  if (!visible) return null;

  return (
    <div className="pt-sheet-overlay" role="dialog" aria-modal="true" aria-labelledby="danger-title">
      <button type="button" className="pt-sheet-backdrop" onClick={onClose} aria-label="Fechar" />
      <div className="pt-sheet">
        <div className="pt-sheet-handle" />
        <div className="pt-sheet-icon">
          <Icon name="warning" size={32} color={colors.redSoft} />
        </div>
        <h2 id="danger-title" className="pt-sheet-title">
          Peter está em perigo?
        </h2>
        <p className="pt-sheet-text">
          Peter não atendeu e a localização não atualiza há {min} min. Se achar que ele precisa de
          ajuda, acione as autoridades.
        </p>
        <div className="pt-sheet-actions">
          <PrimaryButton
            title="Sim, acionar autoridades"
            icon="shield"
            onPress={() => {
              onClose();
              openEmergencia();
            }}
          />
          <OutlineButton title="Não, voltar ao chat" onPress={onClose} />
        </div>
      </div>
    </div>
  );
}
