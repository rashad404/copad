export const colors = {
  light: {
    // Background colors
    background: '#ffffff',
    backgroundSecondary: '#f9fafb',
    backgroundTertiary: '#f3f4f6',
    
    // Text colors
    text: '#111827',
    textSecondary: '#6b7280',
    textTertiary: '#9ca3af',
    
    // Border colors
    border: '#e5e7eb',
    borderSecondary: '#d1d5db',
    
    // Primary colors
    primary: '#4f46e5',
    primaryHover: '#4338ca',
    primaryLight: '#e0e7ff',
    
    // UI colors
    cardBackground: '#ffffff',
    inputBackground: '#ffffff',
    hover: '#f3f4f6',
    active: '#e5e7eb',
    
    // Message colors
    userMessage: '#e5e7eb',
    userMessageText: '#1f2937',
    assistantMessage: 'transparent',
    assistantMessageText: '#1f2937',
  },
  dark: {
    // Background colors
    background: '#111827',
    backgroundSecondary: '#1f2937',
    backgroundTertiary: '#374151',
    
    // Text colors
    text: '#f9fafb',
    textSecondary: '#d1d5db',
    textTertiary: '#9ca3af',
    
    // Border colors
    border: '#374151',
    borderSecondary: '#4b5563',
    
    // Primary colors
    primary: '#6366f1',
    primaryHover: '#818cf8',
    primaryLight: '#312e81',
    
    // UI colors
    cardBackground: '#1f2937',
    inputBackground: '#374151',
    hover: '#374151',
    active: '#4b5563',
    
    // Message colors
    userMessage: '#374151',
    userMessageText: '#f9fafb',
    assistantMessage: 'transparent',
    assistantMessageText: '#f9fafb',
  },
};

export const getThemeColors = (theme: 'light' | 'dark') => colors[theme];