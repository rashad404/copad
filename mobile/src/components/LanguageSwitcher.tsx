import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Language {
  code: string;
  name: string;
  flag: string;
  shortName: string;
}

const languages: Language[] = [
  {
    code: 'az',
    name: 'AZ',
    flag: '🇦🇿',
    shortName: 'AZ'
  },
  {
    code: 'en',
    name: 'EN',
    flag: '🇬🇧',
    shortName: 'EN'
  },
  {
    code: 'ru',
    name: 'RU',
    flag: '🇷🇺',
    shortName: 'RU'
  },
  {
    code: 'tr',
    name: 'TR',
    flag: '🇹🇷',
    shortName: 'TR'
  },
  {
    code: 'es',
    name: 'ES',
    flag: '🇪🇸',
    shortName: 'ES'
  },
  {
    code: 'pt',
    name: 'PT',
    flag: '🇵🇹',
    shortName: 'PT'
  },
  {
    code: 'ar',
    name: 'العربية',
    flag: '🇸🇦',
    shortName: 'العربية'
  },
  {
    code: 'zh',
    name: '中文',
    flag: '🇨🇳',
    shortName: '中文'
  },
  {
    code: 'hi',
    name: 'हिंदी',
    flag: '🇮🇳',
    shortName: 'हिंदी'
  }
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [selected, setSelected] = useState<Language>(
    languages.find(lang => lang.code === i18n.language) || languages[0]
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [, forceUpdate] = useState({});

  useEffect(() => {
    const currentLang = languages.find(lang => lang.code === i18n.language);
    if (currentLang) {
      setSelected(currentLang);
    }
  }, [i18n.language]);

  // Force re-render on language change
  useEffect(() => {
    const handleLanguageChanged = () => {
      forceUpdate({});
    };
    
    i18n.on('languageChanged', handleLanguageChanged);
    
    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, [i18n]);

  const handleLanguageChange = async (language: Language) => {
    console.log('=== Language Change Started ===');
    console.log('Changing from:', i18n.language, 'to:', language.code);
    
    setSelected(language);
    setModalVisible(false);
    
    // Change language first
    try {
      await i18n.changeLanguage(language.code);
      console.log('Language changed successfully to:', i18n.language);
      
      // Then save to AsyncStorage
      await AsyncStorage.setItem('i18nextLng', language.code);
      console.log('Language preference saved to AsyncStorage');
    } catch (error) {
      console.error('Error changing language:', error);
    }
    
    console.log('Current language after change:', i18n.language);
    console.log('=== Language Change Completed ===');
  };

  return (
    <>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.flag}>{selected.flag}</Text>
        <Text style={styles.shortName}>{selected.shortName}</Text>
        <Ionicons name="chevron-down" size={16} color="#666" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Language</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            <ScrollView>
              {languages.map((language) => (
                <TouchableOpacity
                  key={language.code}
                  style={[
                    styles.languageItem,
                    selected.code === language.code && styles.selectedLanguage
                  ]}
                  onPress={() => handleLanguageChange(language)}
                >
                  <Text style={styles.languageFlag}>{language.flag}</Text>
                  <Text style={[
                    styles.languageName,
                    selected.code === language.code && styles.selectedLanguageText
                  ]}>
                    {language.name}
                  </Text>
                  {selected.code === language.code && (
                    <Ionicons name="checkmark" size={20} color="#007AFF" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  flag: {
    fontSize: 18,
  },
  shortName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedLanguage: {
    backgroundColor: '#f0f8ff',
  },
  languageFlag: {
    fontSize: 24,
    marginRight: 16,
  },
  languageName: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  selectedLanguageText: {
    fontWeight: '600',
    color: '#007AFF',
  },
});