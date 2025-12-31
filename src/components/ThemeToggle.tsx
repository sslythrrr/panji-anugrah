import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../hooks/usetheme';

interface ThemeToggleProps {
  isMobile?: boolean;
}

const ThemeToggle = ({ isMobile = false }: ThemeToggleProps) => {
  const { theme, toggleTheme } = useTheme();

if (isMobile) {
  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-between w-full text-left text-lg font-medium py-3 transition-colors text-foreground"
    >
      {/* Toggle Switch */}
      <div className="relative inline-flex items-center">
        <div className={`
          w-14 h-7 rounded-full transition-colors duration-300 ease-in-out
          ${theme === 'dark' ? 'bg-slate-500' : 'bg-slate-500'}
        `}>
          <div className={`
            absolute top-0.5 left-0.5 w-6 h-6 rounded-full
            transition-all duration-300 ease-in-out transform
            flex items-center justify-center
            ${theme === 'dark' 
              ? 'translate-x-7 bg-slate-900' 
              : 'translate-x-0 bg-white'}
          `}>
            {theme === 'dark' 
              ? <Moon className="w-3.5 h-3.5 text-slate-300" /> 
              : <Sun className="w-3.5 h-3.5 text-slate-900" />
            }
          </div>
        </div>
      </div>
    </button>
  );
}

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg transition-all duration-300 hoverable hover:bg-secondary/50"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Current: ${theme === 'dark' ? 'Dark' : 'Light'} mode`}
    >
      {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
    </button>
  );
};

export default ThemeToggle;