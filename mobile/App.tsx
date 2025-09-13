import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider, MD3LightTheme, MD3DarkTheme, Portal } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { I18nextProvider } from 'react-i18next';
import i18n from './src/i18n';
import { AuthProvider } from './src/contexts/AuthContext';
import { ChatProvider } from './src/contexts/ChatContext';
import { ThemeProvider, useTheme } from './src/contexts/ThemeContext';
import { RootNavigator } from './src/navigation/RootNavigator';
import { ActivityIndicator, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    <I18nextProvider i18n={i18n}>
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
    </I18nextProvider>
  );
}

export default function App() {
  const [isI18nInitialized, setIsI18nInitialized] = useState(false);

  useEffect(() => {
    // Load saved language preference
    const loadSavedLanguage = async () => {
      try {
        const savedLang = await AsyncStorage.getItem('i18nextLng');
        if (savedLang && savedLang !== i18n.language) {
          await i18n.changeLanguage(savedLang);
        }
      } catch (error) {
        console.error('Error loading saved language:', error);
      }
      setIsI18nInitialized(true);
    };
    
    loadSavedLanguage();
  }, []);

  if (!isI18nInitialized) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

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