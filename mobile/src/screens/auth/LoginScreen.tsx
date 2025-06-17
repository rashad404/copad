import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { TextInput, Button, Text, HelperText } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { TestTranslation } from '../../components/TestTranslation';
import { TranslationTest } from '../../components/TranslationTest';

type LoginScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

export const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { login } = useAuth();
  const { t, i18n, ready } = useTranslation('translation');
  const [, forceUpdate] = useState({});
  
  // Force re-render when language changes
  React.useEffect(() => {
    const handleLanguageChange = () => {
      console.log('Language changed in LoginScreen, forcing update');
      forceUpdate({});
    };
    
    i18n.on('languageChanged', handleLanguageChange);
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);
  
  console.log('Current language in LoginScreen:', i18n.language);
  console.log('i18n ready:', ready);
  console.log('Test translation:', t('auth.login.welcome'));
  console.log('Available languages:', Object.keys(i18n.store.data));
  console.log('Current translations:', i18n.store.data[i18n.language]);
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});

  const validateForm = () => {
    const newErrors: typeof errors = {};
    
    if (!username.trim()) {
      newErrors.username = t('auth.validation.username_required');
    }
    
    if (!password) {
      newErrors.password = t('auth.validation.password_required');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await login(username, password);
      // Navigation is handled by auth state change
    } catch (error: any) {
      Alert.alert(
        t('auth.login.error_title'),
        error.response?.data?.message || t('auth.login.error_invalid_credentials')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} key={i18n.language}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <TestTranslation />
          <View style={styles.form}>
            <Text variant="headlineLarge" style={styles.title}>
              {t('auth.login.welcome')}
            </Text>
            <Text variant="bodyMedium" style={styles.subtitle}>
              {t('auth.login.subtitle')}
            </Text>

            <TextInput
              label={t('auth.username')}
              value={username}
              onChangeText={(text) => {
                setUsername(text);
                if (errors.username) {
                  setErrors({ ...errors, username: undefined });
                }
              }}
              style={styles.input}
              autoCapitalize="none"
              autoCorrect={false}
              error={!!errors.username}
            />
            <HelperText type="error" visible={!!errors.username}>
              {errors.username}
            </HelperText>

            <TextInput
              label={t('auth.password')}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) {
                  setErrors({ ...errors, password: undefined });
                }
              }}
              style={styles.input}
              secureTextEntry={!showPassword}
              right={
                <TextInput.Icon
                  icon={showPassword ? 'eye-off' : 'eye'}
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
              error={!!errors.password}
            />
            <HelperText type="error" visible={!!errors.password}>
              {errors.password}
            </HelperText>

            <Button
              mode="contained"
              onPress={handleLogin}
              loading={loading}
              disabled={loading}
              style={styles.button}
            >
              {t('auth.login.signin_button')}
            </Button>

            <Button
              mode="text"
              onPress={() => navigation.navigate('Register')}
              style={styles.linkButton}
            >
              {t('auth.login.no_account')} {t('auth.sign_up')}
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  form: {
    padding: 20,
    maxWidth: 400,
    width: '100%',
    alignSelf: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
    color: '#111827',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 32,
    color: '#6b7280',
  },
  input: {
    marginBottom: 4,
  },
  button: {
    marginTop: 16,
    paddingVertical: 6,
    backgroundColor: '#4f46e5',
  },
  linkButton: {
    marginTop: 16,
  },
});