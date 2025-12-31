import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

export function useTheme() {
  // Detect system preference atau ambil dari sessionStorage
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = sessionStorage.getItem('theme') as Theme;
    if (stored) return stored;
    
    // Default: detect dari system
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // Apply theme ke html element
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  // Save ke sessionStorage
  const toggleTheme = () => {
    const newTheme: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    sessionStorage.setItem('theme', newTheme);
  };

  return { theme, toggleTheme };
}