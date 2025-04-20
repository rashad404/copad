package com.drcopad.copad.service;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class LanguageMappingService {
    private final Map<String, String> languageMap;

    public LanguageMappingService() {
        languageMap = new HashMap<>();
        languageMap.put("az", "Azerbaijani");
        languageMap.put("en", "English");
        languageMap.put("ru", "Russian");
        languageMap.put("tr", "Turkish");
        languageMap.put("es", "Spanish");
        // Add more language mappings as needed
    }

    public String getFullLanguageName(String languageCode) {
        if (languageCode == null) {
            return null;
        }
        return languageMap.getOrDefault(languageCode.toLowerCase(), languageCode);
    }
} 