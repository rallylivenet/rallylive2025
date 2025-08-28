import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider, MD3LightTheme } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

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

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: '#1E3A8A',
            },
            headerTintColor: '#FFFFFF',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen 
            name="index" 
            options={{ 
              title: 'RallyLive Net',
              headerShown: true
            }} 
          />
          <Stack.Screen 
            name="rally/[rid]/[stage_no]" 
            options={{ 
              title: 'Rally Results',
              headerShown: true
            }} 
          />
          <Stack.Screen 
            name="calendar" 
            options={{ 
              title: 'Rally Calendar',
              headerShown: true
            }} 
          />
        </Stack>
        <StatusBar style="light" backgroundColor="#1E3A8A" />
      </PaperProvider>
    </SafeAreaProvider>
  );
}