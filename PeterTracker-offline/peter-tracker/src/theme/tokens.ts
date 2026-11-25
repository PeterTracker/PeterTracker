export const colors = {
  bg: '#0b1120',
  surface: '#141c2e',
  surface2: '#1c2640',
  mapBg: '#0f1a2e',
  border: 'rgba(255,255,255,0.08)',
  text: '#eef1f6',
  textMuted: '#9aa5bb',
  textSoft: '#c9d1e0',
  red: '#e3263a',
  redSoft: '#ff5a6a',
  redBg: 'rgba(227,38,58,0.15)',
  blue: '#3d8bff',
  green: '#3ddc84',
} as const;

export const radius = { sm: 12, md: 14, lg: 18, xl: 20, sheet: 28 } as const;
export const space = (n: number) => n * 4;

export function haptic(pattern: number | number[] = 12) {
  try {
    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
      navigator.vibrate(pattern);
    }
  } catch {
    // Dispositivo sem suporte a vibração
  }
}
