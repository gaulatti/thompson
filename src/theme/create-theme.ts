import { themes, type BleeckerColorScheme } from '@gaulatti/bleecker/tokens';

import type { ThompsonFonts, ThompsonTheme } from './types';

export const thompsonFonts: ThompsonFonts = {
  primary: 'EncodeSans_400Regular',
  secondary: 'LibreFranklin_400Regular',
  regular: 'EncodeSans_400Regular',
  medium: 'EncodeSans_500Medium',
  semibold: 'EncodeSans_600SemiBold',
  bold: 'EncodeSans_700Bold',
  secondaryMedium: 'LibreFranklin_500Medium'
};

export function createThompsonTheme(colorScheme: BleeckerColorScheme, fontOverrides?: Partial<ThompsonFonts>): ThompsonTheme {
  const colors = themes[colorScheme];

  return {
    colors,
    colorScheme,
    fonts: { ...thompsonFonts, ...fontOverrides },
    shadows: {
      surface: {
        shadowColor: colors.deepSea,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: colorScheme === 'dark' ? 0 : 0.035,
        shadowRadius: 24,
        elevation: colorScheme === 'dark' ? 0 : 1
      },
      raised: {
        shadowColor: colors.deepSea,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: colorScheme === 'dark' ? 0 : 0.06,
        shadowRadius: 28,
        elevation: colorScheme === 'dark' ? 0 : 3
      },
      overlay: {
        shadowColor: colors.deepSea,
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: colorScheme === 'dark' ? 0.18 : 0.2,
        shadowRadius: 24,
        elevation: 12
      }
    },
    text: {
      body: { color: colors.textPrimary, fontFamily: 'EncodeSans_400Regular', fontSize: 15, lineHeight: 22 },
      label: { color: colors.textPrimary, fontFamily: 'EncodeSans_600SemiBold', fontSize: 13, lineHeight: 18 },
      heading: { color: colorScheme === 'dark' ? colors.textPrimary : colors.deepSea, fontFamily: 'EncodeSans_600SemiBold', fontSize: 24, letterSpacing: -0.48, lineHeight: 29 }
    }
  };
}
