import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

export const TranslationTest: React.FC = () => {
  const { t, i18n } = useTranslation();
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Translation Test</Text>
      <Text>Current language: {i18n.language}</Text>
      <Text>Resolved language: {i18n.resolvedLanguage}</Text>
      <Text>Test translation: {t('auth.login.welcome')}</Text>
      <Text>Direct access EN: {i18n.t('auth.login.welcome', { lng: 'en' })}</Text>
      <Text>Direct access AZ: {i18n.t('auth.login.welcome', { lng: 'az' })}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 8,
    margin: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});