import 'react-native-gesture-handler';
import 'react-native-reanimated';

import { registerRootComponent } from 'expo';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import App from './App';

function ThompsonExample() {
  return <GestureHandlerRootView style={{ flex: 1 }}><App /></GestureHandlerRootView>;
}

registerRootComponent(ThompsonExample);
