import 'react-native-gesture-handler';
import 'react-native-reanimated';

import { registerRootComponent } from 'expo';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { view } from './storybook.requires';
import { ThompsonStorybookUI } from './thompson-ui';

const StorybookUIRoot = view.getStorybookUI({
  CustomUIComponent: ThompsonStorybookUI,
  initialSelection: 'foundations-typography--scale',
  onDeviceUI: true,
  shouldPersistSelection: false
});

function ThompsonStorybook() {
  return React.createElement(
    GestureHandlerRootView,
    { style: { flex: 1 } },
    React.createElement(StorybookUIRoot)
  );
}

registerRootComponent(ThompsonStorybook);

export default ThompsonStorybook;
