import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import { Sidebar } from './components/common/Sidebar';
import { Header } from './components/common/Header';
import { SafetyModal } from './components/common/SafetyModal';
import { ConversationalCoachDrawer } from './components/coach/ConversationalCoachDrawer';

import { OverviewDashboard } from './components/dashboard/OverviewDashboard';
import { DailyDiary } from './components/diary/DailyDiary';
import { AIDailyReviewView } from './components/review/AIDailyReviewView';
import { PsychologicalGrowth } from './components/growth/PsychologicalGrowth';
import { EmotionalWellness } from './components/emotions/EmotionalWellness';
import { SocialIntelligence } from './components/social/SocialIntelligence';
import { CriticalThinking } from './components/critical/CriticalThinking';
import { HabitsAndDiscipline } from './components/habits/HabitsAndDiscipline';
import { GoalsAndActionPlans } from './components/goals/GoalsAndActionPlans';
import { WeeklyReviewView } from './components/weekly/WeeklyReviewView';
import { MonthlyYearlyReports } from './components/reports/MonthlyYearlyReports';
import { PersonalInsightsView } from './components/insights/PersonalInsightsView';
import { SettingsAndPrivacy } from './components/settings/SettingsAndPrivacy';

// Speech & Thinking Gym Views
import { VoiceStudio } from './components/studio/VoiceStudio';
import { SpeechCoachingReportView } from './components/studio/SpeechCoachingReportView';
import { ThinkingGymView } from './components/thinking/ThinkingGymView';
import { IntrovertProgramView } from './components/program/IntrovertProgramView';
import { SpeechProgressView } from './components/progress/SpeechProgressView';

import {
  LayoutDashboard,
  BookOpen,
  Sparkles,
  TrendingUp,
  Settings as SettingsIcon,
  MessageSquare
} from 'lucide-react';

export const App: React.FC = () => {
  const { activeTab, setActiveTab, safetyAlertOpen, setSafetyAlertOpen, isCoachOpen, setIsCoachOpen } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'overview': return <OverviewDashboard />;
      case 'studio': return <VoiceStudio />;
      case 'speech_report': return <SpeechCoachingReportView />;
      case 'thinking': return <ThinkingGymView />;
      case 'program': return <IntrovertProgramView />;
      case 'speech_progress': return <SpeechProgressView />;
      case 'diary': return <DailyDiary />;
      case 'review': return <AIDailyReviewView />;
      case 'growth': return <PsychologicalGrowth />;
      case 'emotions': return <EmotionalWellness />;
      case 'social': return <SocialIntelligence />;
      case 'critical': return <CriticalThinking />;
      case 'habits': return <HabitsAndDiscipline />;
      case 'goals': return <GoalsAndActionPlans />;
      case 'weekly': return <WeeklyReviewView />;
      case 'reports': return <MonthlyYearlyReports />;
      case 'insights': return <PersonalInsightsView />;
      case 'settings': return <SettingsAndPrivacy />;
      default: return <OverviewDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-canvas text-primary flex flex-col md:flex-row font-sans selection:bg-accent selection:text-accent-fg">
      {/* Persistent Left Sidebar */}
      <Sidebar
        onOpenCoach={() => setIsCoachOpen(true)}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 md:pl-64 flex flex-col min-w-0 min-h-screen">
        <Header
          onOpenMobile={() => setMobileMenuOpen(true)}
          onOpenCoach={() => setIsCoachOpen(true)}
        />

        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {renderActiveTab()}
        </main>

        {/* Mobile Bottom Navigation Bar */}
        <div className="md:hidden sticky bottom-0 z-30 bg-surface-1/95 backdrop-blur-md border-t border-border flex items-center justify-around py-2 px-1 text-[10px]">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex flex-col items-center gap-1 py-1 px-2 rounded ${activeTab === 'overview' ? 'text-primary font-bold' : 'text-muted'}`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Home</span>
          </button>
          <button
            onClick={() => setActiveTab('diary')}
            className={`flex flex-col items-center gap-1 py-1 px-2 rounded ${activeTab === 'diary' ? 'text-primary font-bold' : 'text-muted'}`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Diary</span>
          </button>
          <button
            onClick={() => setActiveTab('review')}
            className={`flex flex-col items-center gap-1 py-1 px-2 rounded ${activeTab === 'review' ? 'text-primary font-bold' : 'text-muted'}`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Review</span>
          </button>
          <button
            onClick={() => setActiveTab('growth')}
            className={`flex flex-col items-center gap-1 py-1 px-2 rounded ${activeTab === 'growth' ? 'text-primary font-bold' : 'text-muted'}`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Growth</span>
          </button>
          <button
            onClick={() => setIsCoachOpen(true)}
            className="flex flex-col items-center gap-1 py-1 px-2 rounded text-accent"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Coach</span>
          </button>
        </div>
      </div>

      {/* Floating Conversational AI Coach Drawer */}
      <ConversationalCoachDrawer
        isOpen={isCoachOpen}
        onClose={() => setIsCoachOpen(false)}
      />

      {/* Safety Notice Modal */}
      <SafetyModal
        isOpen={safetyAlertOpen}
        onClose={() => setSafetyAlertOpen(false)}
      />
    </div>
  );
};

export default App;
