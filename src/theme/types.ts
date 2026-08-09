import type { ThemeMode } from '@gaulatti/bleecker/core';
import type { BleeckerColorScheme, BleeckerTheme } from '@gaulatti/bleecker/tokens';
import type { ReactNode } from 'react';
import type { TextStyle, ViewStyle } from 'react-native';

export interface ThemeStorage {
  getItem(key: string): Promise<string | null> | string | null;
  setItem(key: string, value: string): Promise<void> | void;
}

export interface ThompsonFonts {
  primary: string;
  secondary: string;
  regular: string;
  medium: string;
  semibold: string;
  bold: string;
  secondaryMedium: string;
}

export interface ThompsonTheme {
  colors: BleeckerTheme;
  colorScheme: BleeckerColorScheme;
  fonts: ThompsonFonts;
  shadows: {
    surface: ViewStyle;
    raised: ViewStyle;
    overlay: ViewStyle;
  };
  text: {
    body: TextStyle;
    label: TextStyle;
    heading: TextStyle;
  };
}

export interface ThompsonProviderProps {
  children: ReactNode;
  defaultTheme?: ThemeMode;
  fonts?: Partial<ThompsonFonts>;
  storage?: ThemeStorage;
  storageKey?: string;
}

export type { ThemeMode } from '@gaulatti/bleecker/core';
export interface ThemeProviderProps extends ThompsonProviderProps {}
