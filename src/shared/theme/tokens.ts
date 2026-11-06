export const colors = {
  background: '#F7F7F4',
  surface: '#FFFFFF',
  surfaceMuted: '#EEEEE9',
  border: '#DEDED7',
  text: '#1C1F1D',
  textMuted: '#646A66',
  primary: '#1F5C4A',
  primaryPressed: '#17473A',
  onPrimary: '#FFFFFF',
  danger: '#B3372F',
  rating: '#A86A00',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  sm: 6,
  md: 10,
  lg: 16,
  pill: 999,
} as const;

export const typography = {
  title: { fontSize: 24, lineHeight: 30, fontWeight: '700' },
  heading: { fontSize: 18, lineHeight: 24, fontWeight: '600' },
  body: { fontSize: 15, lineHeight: 21, fontWeight: '400' },
  label: { fontSize: 14, lineHeight: 18, fontWeight: '600' },
  caption: { fontSize: 12, lineHeight: 16, fontWeight: '400' },
} as const;
