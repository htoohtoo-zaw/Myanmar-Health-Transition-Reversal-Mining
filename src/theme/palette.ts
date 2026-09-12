/**
 * JS mirror of the CSS theme tokens in src/index.css.
 *
 * Recharts writes colours as SVG presentation attributes, which cannot resolve
 * `var(--…)`, so chart code reads concrete values from here via useTheme().
 * Any change to a token must be made in both files.
 */
export type ThemeName = 'light' | 'dark';

export interface Palette {
  app: string;
  surface: string;
  surface2: string;
  subtle: string;
  subtle2: string;
  ink: string;
  muted: string;
  faint: string;
  onAccent: string;
  border: string;
  borderStrong: string;
  primary: string;
  primaryStrong: string;
  success: string;
  successBg: string;
  warning: string;
  warningBg: string;
  danger: string;
  dangerBg: string;
  /** Categorical series colours, ordered for chart use. */
  series: string[];
  /** Low / Mid / High burden ramp for the disease heatmap. */
  ramp: [string, string, string];
}

export const LIGHT_PALETTE: Palette = {
  app: '#EDF1FA',
  surface: '#FFFFFF',
  surface2: '#F6F8FC',
  subtle: '#EDF1FA',
  subtle2: '#DDE4F5',
  ink: '#0B0F19',
  muted: '#60636A',
  faint: '#919398',
  onAccent: '#FFFFFF',
  border: '#E4E9F2',
  borderStrong: '#CAD3E6',
  primary: '#1C4BBC',
  primaryStrong: '#17398B',
  success: '#2F9E68',
  successBg: '#EBF7F0',
  warning: '#C68A1E',
  warningBg: '#FCF5E8',
  danger: '#C4453F',
  dangerBg: '#FDF0EF',
  series: ['#1C4BBC', '#2F9E68', '#C68A1E', '#C4453F', '#17398B', '#60636A'],
  ramp: ['#2F9E68', '#C68A1E', '#C4453F'],
};

export const DARK_PALETTE: Palette = {
  app: '#0E1219',
  surface: '#161B25',
  surface2: '#1B2130',
  subtle: '#1F2635',
  subtle2: '#22304F',
  ink: '#E9EDF5',
  muted: '#A0A8B6',
  faint: '#737B8A',
  onAccent: '#FFFFFF',
  border: '#262E3D',
  borderStrong: '#344054',
  primary: '#7BA0EE',
  primaryStrong: '#9BB8F4',
  success: '#55C48D',
  successBg: '#12291F',
  warning: '#E3AE45',
  warningBg: '#2A2214',
  danger: '#ED7A73',
  dangerBg: '#2C1918',
  series: ['#7BA0EE', '#55C48D', '#E3AE45', '#ED7A73', '#9BB8F4', '#A0A8B6'],
  ramp: ['#55C48D', '#E3AE45', '#ED7A73'],
};

export const PALETTES: Record<ThemeName, Palette> = {
  light: LIGHT_PALETTE,
  dark: DARK_PALETTE,
};
