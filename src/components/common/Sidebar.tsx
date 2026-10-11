import {
  LayoutDashboard,
  BookOpen,
  Sparkles,
  TrendingUp,
  Heart,
  Users,
  Brain,
  CheckSquare,
  Target,
  CalendarCheck,
  FileText,
  Lightbulb,
  Settings,
  PenLine,
  MessageSquare,
  ShieldCheck,
  Mic,
  Compass,
  Activity,
  Award,
  Layers
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface SidebarProps {
  onOpenCoach: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenCoach, mobileOpen, onCloseMobile }) => {
  const { activeTab, setActiveTab, setSelectedEntryId } = useApp();

  const speechNavItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'studio', label: 'Voice Practice Studio', icon: Mic, highlight: true },
    { id: 'speech_report', label: 'Coaching Report', icon: Award },
    { id: 'thinking', label: 'The Thinking Gym', icon: Brain, highlight: true },
    { id: 'program', label: 'Practice Programme', icon: Compass },
    { id: 'speech_progress', label: 'Speech & Thinking Stats', icon: Activity },
  ];

  const reflectionNavItems = [
    { id: 'diary', label: 'Daily Diary', icon: BookOpen },
    { id: 'review', label: 'AI Daily Review', icon: Sparkles },
    { id: 'growth', label: 'Psychological Growth', icon: TrendingUp },
    { id: 'emotions', label: 'Emotional Wellness', icon: Heart },
    { id: 'social', label: 'Social Intelligence', icon: Users },
    { id: 'critical', label: 'Critical Thinking', icon: Brain },
    { id: 'habits', label: 'Habits & Discipline', icon: CheckSquare },
    { id: 'goals', label: 'Goals & Action Plans', icon: Target },
    { id: 'weekly', label: 'Weekly Review', icon: CalendarCheck },
    { id: 'reports', label: 'Reports & Export', icon: FileText },
    { id: 'insights', label: 'Personal Insights', icon: Lightbulb },
    { id: 'visual_guide', label: 'Visual Guide & Docs', icon: Layers },
    { id: 'settings', label: 'Settings & Privacy', icon: Settings },
  ];


  const handleNavClick = (id: string) => {
    setActiveTab(id);
    onCloseMobile();
  };

  const handleQuickWrite = () => {
    setSelectedEntryId(null);
    setActiveTab('diary');
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-surface-1 border-r border-border flex flex-col transition-transform duration-200 ease-in-out md:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand header */}
        <div className="p-5 border-b border-border flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary text-canvas flex items-center justify-center font-serif font-bold text-lg shadow-subtle">
              M
            </div>
            <div>
              <span className="font-semibold text-sm tracking-tight text-primary block">MindMirror AI</span>
              <span className="text-[10px] text-muted tracking-wider uppercase font-mono">Self-Reflection</span>
            </div>
          </div>
        </div>

        {/* Quick action button */}
        <div className="p-3">
          <button
            onClick={handleQuickWrite}
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 text-xs font-medium rounded-lg bg-accent text-accent-fg hover:opacity-90 transition-opacity shadow-subtle"
          >
            <PenLine className="w-3.5 h-3.5" />
            <span>Write Today's Reflection</span>
          </button>
        </div>

        {/* Nav list */}
        <nav className="flex-1 px-2.5 py-1.5 space-y-4 overflow-y-auto">
          {/* Section 1: Speech & Thinking Training */}
          <div className="space-y-0.5">
            <span className="px-3 text-[10px] uppercase font-mono text-accent font-semibold tracking-wider block mb-1">
              Speech & Thinking
            </span>
            {speechNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-accent/15 text-accent font-semibold'
                      : 'text-secondary hover:text-primary hover:bg-surface-hover'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-accent' : 'text-muted'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.highlight && !isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Section 2: Daily Journal & Personal Growth */}
          <div className="space-y-0.5 pt-1 border-t border-border/60">
            <span className="px-3 text-[10px] uppercase font-mono text-secondary font-semibold tracking-wider block mb-1">
              Journal & Reflection
            </span>
            {reflectionNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-surface-2 text-primary font-semibold'
                      : 'text-secondary hover:text-primary hover:bg-surface-hover'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-primary' : 'text-muted'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* User profile badge matching reference images */}
        <div className="p-3 border-t border-border space-y-2.5">
          <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg bg-surface-2 border border-border">
            <div className="w-7 h-7 rounded-full bg-primary text-canvas flex items-center justify-center font-bold text-xs">
              A
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-xs font-semibold text-primary block truncate">Alex</span>
              <span className="text-[10px] text-muted font-mono block">Free Plan</span>
            </div>
          </div>

          <button
            onClick={onOpenCoach}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-surface-1 border border-border text-xs text-primary font-medium hover:bg-surface-hover transition-colors shadow-subtle"
          >
            <div className="flex items-center gap-2">
              <MessageSquare className="w-3.5 h-3.5 text-accent" />
              <span>Ask AI Coach</span>
            </div>
            <span className="text-[10px] font-mono text-muted bg-surface-2 px-1.5 py-0.5 rounded border border-border">Reflect</span>
          </button>

          <div className="flex items-center justify-between px-2 pt-0.5 text-[11px] text-muted">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              Private & Local-first
            </span>
            <span className="font-mono text-[10px]">v1.0</span>
          </div>
        </div>
      </aside>
    </>
  );
};
