import { resolveTheme, themeModes, type ThemeMode } from '@gaulatti/bleecker/core';
import React from 'react';
import { useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { createThompsonTheme } from './create-theme';
import type { ThompsonProviderProps, ThompsonTheme } from './types';

interface ThompsonThemeContextValue {
  theme: ThompsonTheme;
  themeMode: ThemeMode;
  setThemeMode(theme: ThemeMode): void;
  cycleTheme(): void;
}

const ThompsonThemeContext = React.createContext<ThompsonThemeContextValue | null>(null);

function isThemeMode(value: string | null): value is ThemeMode {
  return value !== null && (themeModes as readonly string[]).includes(value);
}

function nextThemeMode(theme: ThemeMode): ThemeMode {
  if (theme === 'light') return 'dark';
  if (theme === 'dark') return 'system';
  return 'light';
}

export function ThompsonProvider({ children, defaultTheme = 'system', fonts, storage, storageKey = 'thompson-theme' }: ThompsonProviderProps) {
  const systemScheme = useColorScheme();
  const [themeMode, setThemeModeState] = React.useState<ThemeMode>(defaultTheme);

  React.useEffect(() => {
    if (!storage) return;
    let active = true;
    void Promise.resolve(storage.getItem(storageKey)).then((stored) => {
      if (active && isThemeMode(stored)) setThemeModeState(stored);
    });
    return () => {
      active = false;
    };
  }, [storage, storageKey]);

  const setThemeMode = React.useCallback(
    (value: ThemeMode) => {
      setThemeModeState(value);
      if (storage) void Promise.resolve(storage.setItem(storageKey, value));
    },
    [storage, storageKey]
  );

  const cycleTheme = React.useCallback(() => setThemeMode(nextThemeMode(themeMode)), [setThemeMode, themeMode]);
  const colorScheme = resolveTheme(themeMode, systemScheme === 'dark');
  const theme = React.useMemo(() => createThompsonTheme(colorScheme, fonts), [colorScheme, fonts]);
  const value = React.useMemo(() => ({ cycleTheme, setThemeMode, theme, themeMode }), [cycleTheme, setThemeMode, theme, themeMode]);

  return <SafeAreaProvider><ThompsonThemeContext.Provider value={value}>{children}</ThompsonThemeContext.Provider></SafeAreaProvider>;
}

export function useThompsonTheme() {
  const context = React.useContext(ThompsonThemeContext);
  if (!context) throw new Error('useThompsonTheme must be used inside ThompsonProvider');
  return context;
}
