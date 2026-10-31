export const colors = {
  bg: '#EDF1EF',
  card: '#FFFFFF',
  cardSoft: '#F3F6F5',
  line: '#E1E7E5',
  ink: '#14201F',
  inkSoft: '#66716F',
  inkFaint: '#A7B0AE',
  white: '#FFFFFF',
  dark: '#1B1D1E',
  darkSoft: '#2C2F30',

  primary: '#0E4A50',
  primarySoft: '#D3E4E4',
  accent: '#F07A3A',

  pink: '#F2D0E7',
  pinkInk: '#A04C89',
  lilac: '#DCD8F7',
  lilacInk: '#5A4EC2',
  sky: '#CDE6EF',
  skyDeep: '#A9D6E6',
  skyInk: '#2B7A97',
  mint: '#D5ECD8',
  mintInk: '#3A7C49',
  butter: '#EEF2B8',
  butterInk: '#6F701A',
  peach: '#FADCC9',
  peachInk: '#BF642C',
};

export const tones = {
  pink: { bg: colors.pink, ink: colors.pinkInk },
  lilac: { bg: colors.lilac, ink: colors.lilacInk },
  sky: { bg: colors.sky, ink: colors.skyInk },
  mint: { bg: colors.mint, ink: colors.mintInk },
  butter: { bg: colors.butter, ink: colors.butterInk },
  peach: { bg: colors.peach, ink: colors.peachInk },
  primary: { bg: colors.primary, ink: colors.white },
  white: { bg: colors.white, ink: colors.ink },
};

export type Tone = keyof typeof tones;

export const radius = { sm: 14, md: 20, lg: 28, xl: 36, pill: 999 };

export const space = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };

export const fonts = {
  light: 'PlusJakartaSans_300Light',
  regular: 'PlusJakartaSans_400Regular',
  medium: 'PlusJakartaSans_500Medium',
  semi: 'PlusJakartaSans_600SemiBold',
  bold: 'PlusJakartaSans_700Bold',
};

export const shadow = {
  shadowColor: '#2B3B38',
  shadowOpacity: 0.06,
  shadowRadius: 18,
  shadowOffset: { width: 0, height: 6 },
  elevation: 2,
};
