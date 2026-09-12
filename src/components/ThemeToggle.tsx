import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../theme/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const nextIsDark = theme === 'light';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="p-1.5 rounded-[6px] border border-[var(--c-border-strong)] text-[var(--c-ink)] hover:bg-[var(--c-subtle)] cursor-pointer shrink-0 transition-colors"
      aria-label={nextIsDark ? 'Switch to dark theme' : 'Switch to light theme'}
      title={nextIsDark ? 'Switch to dark theme' : 'Switch to light theme'}
    >
      {nextIsDark ? <Moon size={16} /> : <Sun size={16} />}
    </button>
  );
};
