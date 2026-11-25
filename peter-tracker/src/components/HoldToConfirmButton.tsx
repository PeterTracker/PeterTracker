import { useEffect, useRef, useState } from 'react';
import { colors, haptic } from '../theme/tokens';
import { Icon } from './Icons';

export function HoldToConfirmButton({
  title,
  onConfirm,
  duration = 3000,
  disabled,
}: {
  title: string;
  onConfirm: () => void;
  duration?: number;
  disabled?: boolean;
}) {
  const [holding, setHolding] = useState(false);
  const [pct, setPct] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number>(0);
  const confirmedRef = useRef(false);

  const stopRaf = () => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };

  useEffect(() => stopRaf, []);

  const start = () => {
    if (disabled || holding) return;
    confirmedRef.current = false;
    setHolding(true);
    haptic(15);
    startRef.current = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startRef.current;
      const ratio = Math.min(1, elapsed / duration);
      setPct(ratio * 100);
      if (ratio >= 1) {
        confirmedRef.current = true;
        setHolding(false);
        stopRaf();
        haptic([40, 30, 60]);
        onConfirm();
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  const cancel = () => {
    stopRaf();
    setHolding(false);
    if (!confirmedRef.current) {
      setPct(0);
    }
  };

  const remainingSec = Math.max(1, Math.ceil(((100 - pct) / 100) * (duration / 1000)));

  return (
    <button
      type="button"
      disabled={disabled}
      onPointerDown={(e) => {
        if (e.button !== 0 && e.pointerType === 'mouse') return;
        e.currentTarget.setPointerCapture?.(e.pointerId);
        start();
      }}
      onPointerUp={cancel}
      onPointerCancel={cancel}
      onPointerLeave={cancel}
      onKeyDown={(e) => {
        if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) {
          e.preventDefault();
          start();
        }
      }}
      onKeyUp={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          cancel();
        }
      }}
      onContextMenu={(e) => e.preventDefault()}
      aria-label={`${title}. Segure por ${duration / 1000} segundos para confirmar`}
      className={`pt-hold-btn ${holding ? 'is-holding' : ''}`}
    >
      <span
        className="pt-hold-fill"
        style={{
          width: `${pct}%`,
          transition: holding ? 'none' : 'width 180ms ease-out',
        }}
      />
      <span className="pt-hold-content">
        <Icon name="shield" size={22} color={colors.text} />
        <span>{holding ? `Continue segurando… (${remainingSec}s)` : title}</span>
      </span>
    </button>
  );
}
