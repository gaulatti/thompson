import type { StorybookConfig } from '@storybook/react-native';

const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.?(ts|tsx|js|jsx)'],
  deviceAddons: [
    '@storybook/addon-ondevice-controls',
    '@storybook/addon-ondevice-actions'
  ],
  features: {
    ondeviceBackgrounds: true
  }
};

export default config;
