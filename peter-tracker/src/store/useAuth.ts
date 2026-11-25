import { create } from 'zustand';
import * as api from '../services/api';

const KEY = 'peter-tracker-creds';
const MAX_ATTEMPTS = 5;

function safeStorageGet(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeStorageSet(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Storage indisponível (ex: modo privado restrito)
  }
}

function safeStorageRemove(key: string) {
  try {
    window.localStorage.removeItem(key);
  } catch {
    // Storage indisponível
  }
}

type Auth = {
  token: string | null;
  error: string | null;
  attemptsLeft: number;
  loading: boolean;
  login: (user: string, pass: string, remember: boolean) => Promise<boolean>;
  logout: () => void;
  resetLock: () => void;
};

export const useAuth = create<Auth>((set, get) => ({
  token: null,
  error: null,
  attemptsLeft: MAX_ATTEMPTS,
  loading: false,
  async login(user, pass, remember) {
    if (get().attemptsLeft <= 0) return false;
    set({ loading: true });
    try {
      const { token } = await api.login(user, pass);
      if (remember) safeStorageSet(KEY, JSON.stringify({ user, pass }));
      else safeStorageRemove(KEY);
      set({ token, error: null, attemptsLeft: MAX_ATTEMPTS, loading: false });
      return true;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Usuário ou senha incorretos.';
      const left = get().attemptsLeft - 1;
      set({
        error: left > 0 ? msg : 'Conta bloqueada. Tente novamente mais tarde.',
        attemptsLeft: left,
        loading: false,
      });
      return false;
    }
  },
  logout: () => set({ token: null, error: null, attemptsLeft: MAX_ATTEMPTS }),
  resetLock: () => set({ error: null, attemptsLeft: MAX_ATTEMPTS }),
}));

export function loadSavedCreds(): { user: string; pass: string } | null {
  try {
    const raw = safeStorageGet(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
