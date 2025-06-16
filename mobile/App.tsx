import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider, MD3LightTheme, MD3DarkTheme, Portal } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from './src/contexts/AuthContext';
import { ChatProvider } from './src/contexts/ChatContext';
import { ThemeProvider, useTheme } from './src/contexts/ThemeContext';
import { RootNavigator } from './src/navigation/RootNavigator';

const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#4f46e5',
    secondary: '#6366f1',
  },
};

const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#6366f1',
    secondary: '#818cf8',
  },
};

function ThemedApp() {
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === 'dark' ? darkTheme : lightTheme;
  
  return (
    <PaperProvider theme={theme}>
      <AuthProvider>
        <ChatProvider>
          <NavigationContainer>
            <Portal.Host>
              <RootNavigator />
            </Portal.Host>
            <StatusBar style={resolvedTheme === 'dark' ? 'light' : 'dark'} />
          </NavigationContainer>
        </ChatProvider>
      </AuthProvider>
    </PaperProvider>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <ThemedApp />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}