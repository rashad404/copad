import React from 'react';
import { View, Text, Button } from 'react-native';
import { useTranslation } from 'react-i18next';

export const TestTranslation = () => {
  const { t, i18n } = useTranslation();

  return (
    <View style={{ padding: 20, backgroundColor: '#f0f0f0' }}>
      <Text>Current language: {i18n.language}</Text>
      <Text>Test: {t('auth.login.welcome')}</Text>
      <Text>Direct EN: {i18n.t('auth.login.welcome', { lng: 'en' })}</Text>
      <Text>Direct AZ: {i18n.t('auth.login.welcome', { lng: 'az' })}</Text>
      <Button title="EN" onPress={() => i18n.changeLanguage('en')} />
      <Button title="AZ" onPress={() => i18n.changeLanguage('az')} />
    </View>
  );
};