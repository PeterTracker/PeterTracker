// API simulada em memória — 100% offline, sem dependência de servidor externo.
export type MoodKey = 'bem' | 'correndo' | 'balancando' | 'focado' | 'cansado' | 'tenso';
export type Coords = { latitude: number; longitude: number };
export type PeterStatus = {
  mood: MoodKey;
  moodSince: string;
  coords: Coords;
  address: string;
  updatedAt: string;
  online: boolean;
  trail: Coords[];
};
export type Message = {
  id: string;
  from: 'peter' | 'me';
  text: string;
  at: string;
  read?: boolean;
};
export type EmergencyTarget = '911' | 'delegacia';

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const ago = (min: number) => new Date(Date.now() - min * 60000).toISOString();

// Pontos reais de Forest Hills, Queens (próximos à casa da Tia May em 20 Ingram St)
const LANDMARKS: { coords: Coords; address: string }[] = [
  { coords: { latitude: 40.7181, longitude: -73.8448 }, address: '20 Ingram St, Forest Hills, Queens' },
  { coords: { latitude: 40.7204, longitude: -73.8465 }, address: '71st Ave & Austin St, Forest Hills, Queens' },
  { coords: { latitude: 40.7219, longitude: -73.8432 }, address: 'Queens Blvd & Continental Ave, Forest Hills, Queens' },
  { coords: { latitude: 40.7195, longitude: -73.8398 }, address: 'Yellowstone Blvd & Burns St, Forest Hills, Queens' },
  { coords: { latitude: 40.7164, longitude: -73.8415 }, address: 'Metropolitan Ave & Ascan Ave, Forest Hills, Queens' },
  { coords: { latitude: 40.7156, longitude: -73.8469 }, address: 'Forest Park Dr & Union Tpke, Forest Hills, Queens' },
  { coords: { latitude: 40.7178, longitude: -73.8492 }, address: 'Selfridge St & Harrow St, Forest Hills, Queens' },
];

function resolveAddress(coords: Coords): string {
  let best = LANDMARKS[0];
  let bestDist = Infinity;
  for (const lm of LANDMARKS) {
    const dLat = coords.latitude - lm.coords.latitude;
    const dLng = coords.longitude - lm.coords.longitude;
    const dist = dLat * dLat + dLng * dLng;
    if (dist < bestDist) {
      bestDist = dist;
      best = lm;
    }
  }
  return best.address;
}

const BASE_COORDS = { latitude: 40.7181, longitude: -73.8448 };

let status: PeterStatus = {
  mood: 'balancando',
  moodSince: ago(42),
  coords: { ...BASE_COORDS },
  address: '20 Ingram St, Forest Hills, Queens',
  updatedAt: ago(1),
  online: true,
  trail: [
    { latitude: 40.7168, longitude: -73.8466 },
    { latitude: 40.7174, longitude: -73.8458 },
    { ...BASE_COORDS },
  ],
};

let frozenInactive = false;

export async function login(user: string, pass: string) {
  await wait(450);
  if (user.trim().toLowerCase() === 'mj' && pass === 'peter123') {
    return { token: 'mock-token' };
  }
  throw new Error('Usuário ou senha incorretos.');
}

export async function getPeterStatus(): Promise<PeterStatus> {
  await wait(250);
  return { ...status, coords: { ...status.coords }, trail: [...status.trail] };
}

export function setSimulatedMood(mood: MoodKey): PeterStatus {
  status = {
    ...status,
    mood,
    moodSince: new Date().toISOString(),
  };
  return { ...status, coords: { ...status.coords }, trail: [...status.trail] };
}

export function setSimulatedInactivity(inactive: boolean): PeterStatus {
  frozenInactive = inactive;
  status = {
    ...status,
    online: !inactive,
    updatedAt: inactive ? ago(8) : new Date().toISOString(),
  };
  return { ...status, coords: { ...status.coords }, trail: [...status.trail] };
}

// Simula Peter se movendo a cada 15s dentro da região de Forest Hills.
export function subscribeLocation(cb: (s: PeterStatus) => void) {
  const id = window.setInterval(() => {
    if (frozenInactive) return;

    const nextLat = Math.max(
      40.7142,
      Math.min(40.7232, status.coords.latitude + (Math.random() - 0.48) * 0.0018),
    );
    const nextLng = Math.max(
      -73.8515,
      Math.min(-73.8375, status.coords.longitude + (Math.random() - 0.5) * 0.002),
    );
    const nextCoords = { latitude: nextLat, longitude: nextLng };

    status = {
      ...status,
      coords: nextCoords,
      address: resolveAddress(nextCoords),
      updatedAt: new Date().toISOString(),
      online: true,
      trail: [...status.trail.slice(-11), nextCoords],
    };
    cb({ ...status, coords: { ...status.coords }, trail: [...status.trail] });
  }, 15000);
  return () => window.clearInterval(id);
}

const REPLIES = [
  'Tô bem, MJ! Só resolvendo uma coisinha aqui 🕷️',
  'Já já te ligo, tô no meio de um balanço.',
  'Relaxa, chego antes do jantar.',
  'Sinal ruim por aqui, mas tá tudo sob controle.',
];

export async function sendMessage(text: string): Promise<Message> {
  await wait(250);
  return { id: String(Date.now()), from: 'me', text, at: new Date().toISOString(), read: false };
}

export async function fakeReply(): Promise<Message> {
  await wait(2200);
  return {
    id: String(Date.now() + 1),
    from: 'peter',
    text: REPLIES[Math.floor(Math.random() * REPLIES.length)],
    at: new Date().toISOString(),
  };
}

export async function triggerEmergency(_: { target: EmergencyTarget; coords: Coords }) {
  await wait(700);
  return {
    protocol: `NYPD-${Math.floor(100000 + Math.random() * 900000)}`,
    sentAt: new Date().toISOString(),
    status: 'Unidade a caminho',
  };
}
