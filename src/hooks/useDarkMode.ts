import { useTheme } from '@/components/ThemeProvider';

const useDarkMode = () => {
  const { theme, toggleTheme } = useTheme();
  
  return {
    isDarkMode: theme === 'dark',
    toggleDarkMode: toggleTheme,
  };
};

export default useDarkMode;