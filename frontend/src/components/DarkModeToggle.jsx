import { useState, useEffect } from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

export default function DarkModeToggle() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Check if dark mode preference exists in localStorage, otherwise default to true
    const darkMode = localStorage.getItem('darkMode') !== 'false'; // Default to true if not set
    setIsDark(darkMode);
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDark;
    setIsDark(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <SunIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
      ) : (
        <MoonIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
      )}
    </button>
  );
} 