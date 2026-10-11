import React from 'react';
import { Menu, Sun, Moon, Monitor, MessageSquare, Shield, PenLine } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface HeaderProps {
  onOpenMobile: () => void;
  onOpenCoach: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobile, onOpenCoach }) => {
  const {
    activeTab,
    setActiveTab,
    setSelectedEntryId,
    preferences,
    setColorMode,
    setSafetyAlertOpen
  } = useApp();

  const getSectionTitle = () => {
    switch (activeTab) {
      case 'overview': return 'Overview Dashboard';
      case 'diary': return 'Daily Diary';
      case 'review': return 'AI Daily Review';
      case 'growth': return 'Psychological Growth';
      case 'emotions': return 'Emotional Wellness';
      case 'social': return 'Social Intelligence';
      case 'critical': return 'Critical Thinking';
      case 'habits': return 'Habits & Discipline';
      case 'goals': return 'Goals & Action Plans';
      case 'weekly': return 'Weekly Review';
      case 'reports': return 'Monthly & Yearly Reports';
      case 'insights': return 'Personal Insights';
      case 'settings': return 'Settings & Privacy';
      default: return 'MindMirror AI';
    }
  };

  const todayFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date());

  const cycleColorMode = () => {
    if (preferences.colorMode === 'light') setColorMode('dark');
    else if (preferences.colorMode === 'dark') setColorMode('system');
    else setColorMode('light');
  };

  return (
    <header className="sticky top-0 z-30 h-14 bg-canvas/80 backdrop-blur-md border-b border-border flex items-center justify-between px-4 md:px-8">
      {/* Left side: mobile toggle & section heading */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onOpenMobile}
          className="p-1.5 -ml-1 text-secondary hover:text-primary rounded-md md:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-baseline space-x-2">
          <h1 className="text-sm md:text-base font-semibold text-primary tracking-tight">
            {getSectionTitle()}
          </h1>
          <span className="hidden sm:inline-block text-xs text-muted font-mono">
            / {todayFormatted}
          </span>
        </div>
      </div>

      {/* Right side: quick controls */}
      <div className="flex items-center space-x-2 md:space-x-3">
        <button
          onClick={() => {
            setSelectedEntryId(null);
            setActiveTab('diary');
          }}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-surface-2 border border-border text-primary hover:bg-surface-hover transition-colors"
        >
          <PenLine className="w-3.5 h-3.5 text-muted" />
          <span>New Entry</span>
        </button>

        <button
          onClick={onOpenCoach}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-surface-1 border border-border text-primary hover:bg-surface-hover transition-colors shadow-subtle"
        >
          <MessageSquare className="w-3.5 h-3.5 text-accent" />
          <span className="hidden md:inline">Coach</span>
        </button>

        {/* Color mode switcher */}
        <button
          onClick={cycleColorMode}
          title={`Color mode: ${preferences.colorMode} (Click to toggle)`}
          className="p-2 text-muted hover:text-primary rounded-md hover:bg-surface-2 transition-colors"
          aria-label="Toggle color mode"
        >
          {preferences.colorMode === 'light' && <Sun className="w-4 h-4" />}
          {preferences.colorMode === 'dark' && <Moon className="w-4 h-4" />}
          {preferences.colorMode === 'system' && <Monitor className="w-4 h-4" />}
        </button>

        {/* Crisis safeguard trigger */}
        <button
          onClick={() => setSafetyAlertOpen(true)}
          title="Mental Health & Crisis Resources"
          className="p-2 text-muted hover:text-rose-600 dark:hover:text-rose-400 rounded-md hover:bg-surface-2 transition-colors"
          aria-label="Mental health support resources"
        >
          <Shield className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
