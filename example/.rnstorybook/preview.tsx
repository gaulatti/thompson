import type { Preview } from '@storybook/react-native';
import React from 'react';
import { ScrollView, View } from 'react-native';

import { useThompsonTheme } from '../../src';

function ThemedCanvas({ children, fullscreen = false }: { children: React.ReactNode; fullscreen?: boolean }) {
  const { theme } = useThompsonTheme();
  if (fullscreen) return <View style={{ backgroundColor: theme.colors.background, flex: 1 }}>{children}</View>;
  return <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 20 }} keyboardShouldPersistTaps='handled' style={{ backgroundColor: theme.colors.background, flex: 1 }}>{children}</ScrollView>;
}

const preview: Preview = {
  decorators: [
    (Story, context) => {
      return <ThemedCanvas fullscreen={context.parameters.layout === 'fullscreen'}><Story /></ThemedCanvas>;
    }
  ],
  parameters: {
    layout: 'padded',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    }
  }
};

export default preview;
