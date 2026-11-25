import { useEffect, useState } from 'react';
import { create } from 'zustand';
import { colors } from '../theme/tokens';
import * as api from '../services/api';
import type { MoodKey, PeterStatus } from '../services/api';
import type { IconName } from '../components/Icons';

export const MOODS: Record<MoodKey, { label: string; icon: IconName; color: string }> = {
  bem: { label: 'Tudo bem', icon: 'sentiment-satisfied', color: colors.green },
  correndo: { label: 'Correndo contra o tempo', icon: 'directions-run', color: colors.blue },
  balancando: { label: 'Balançando pela cidade', icon: 'swap-calls', color: colors.blue },
  focado: { label: 'Focado', icon: 'center-focus-strong', color: colors.blue },
  cansado: { label: 'Cansado', icon: 'bedtime', color: colors.textMuted },
  tenso: { label: 'Tenso', icon: 'priority-high', color: colors.redSoft },
};

export const INACTIVE_MIN = 5;

type PeterStore = {
  status: PeterStatus | null;
  inactiveSimulated: boolean;
  refresh: () => Promise<void>;
  subscribe: () => () => void;
  setMood: (mood: MoodKey) => void;
  toggleInactive: () => void;
};

export const usePeter = create<PeterStore>((set, get) => ({
  status: null,
  inactiveSimulated: false,
  async refresh() {
    set({ status: await api.getPeterStatus() });
  },
  subscribe: () => api.subscribeLocation((status) => set({ status })),
  setMood: (mood) => set({ status: api.setSimulatedMood(mood) }),
  toggleInactive: () => {
    const next = !get().inactiveSimulated;
    set({
      inactiveSimulated: next,
      status: api.setSimulatedInactivity(next),
    });
  },
}));

// Re-renderiza periodicamente para atualizar tempos relativos.
export function useNow(ms = 15000) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), ms);
    return () => window.clearInterval(id);
  }, [ms]);
  return now;
}

export const minutesSince = (iso: string, now = Date.now()) =>
  Math.max(0, Math.floor((now - new Date(iso).getTime()) / 60000));

export const relTime = (iso: string, now = Date.now()) => {
  const m = minutesSince(iso, now);
  if (m < 1) return 'agora';
  if (m < 60) return `há ${m} min`;
  return `há ${Math.floor(m / 60)} h`;
};

export const hhmm = (iso: string) =>
  new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
