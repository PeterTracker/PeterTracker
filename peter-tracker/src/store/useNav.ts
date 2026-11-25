import { create } from 'zustand';

export type TabKey = 'map' | 'dashboard' | 'chat';
export type ModalKey = null | 'call' | 'emergencia' | 'confirmado';

export type EmergencyReceipt = {
  protocol: string;
  sentAt: string;
  status: string;
};

type NavState = {
  tab: TabKey;
  modal: ModalKey;
  chatDangerOpen: boolean;
  receipt: EmergencyReceipt | null;
  setTab: (tab: TabKey) => void;
  openCall: () => void;
  closeCall: (showDanger?: boolean) => void;
  openEmergencia: () => void;
  closeEmergencia: () => void;
  showConfirmado: (receipt: EmergencyReceipt) => void;
  closeDanger: () => void;
  returnToMap: () => void;
};

export const useNav = create<NavState>((set) => ({
  tab: 'map',
  modal: null,
  chatDangerOpen: false,
  receipt: null,
  setTab: (tab) => set({ tab, modal: null }),
  openCall: () => set({ modal: 'call' }),
  closeCall: (showDanger = false) =>
    set({
      modal: null,
      tab: 'chat',
      chatDangerOpen: showDanger,
    }),
  openEmergencia: () => set({ modal: 'emergencia', chatDangerOpen: false }),
  closeEmergencia: () => set({ modal: null }),
  showConfirmado: (receipt) => set({ modal: 'confirmado', receipt }),
  closeDanger: () => set({ chatDangerOpen: false }),
  returnToMap: () => set({ tab: 'map', modal: null, chatDangerOpen: false }),
}));
