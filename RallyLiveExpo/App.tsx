import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider, MD3LightTheme } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './screens/HomeScreen';

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#1E3A8A',
    secondary: '#DC2626',
    surface: '#F5F5F5',
    background: '#FFFFFF',
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <HomeScreen />
        <StatusBar style="light" backgroundColor="#1E3A8A" />
      </PaperProvider>
    </SafeAreaProvider>
  );
}