import React, { useState } from 'react';
import {
  Palette,
  Sun,
  Moon,
  Monitor,
  Shield,
  Download,
  Trash2,
  RotateCcw,
  Key,
  CheckCircle2,
  Lock,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ThemeType, ColorMode } from '../../types';

export const SettingsAndPrivacy: React.FC = () => {
  const {
    preferences,
    setTheme,
    setColorMode,
    updatePreferences,
    exportData,
    wipeAllData,
    resetToSampleData,
    setSafetyAlertOpen
  } = useApp();

  const [apiKeyInput, setApiKeyInput] = useState(preferences.geminiApiKey || '');
  const [apiKeySaved, setApiKeySaved] = useState(false);
  const [wipeConfirm, setWipeConfirm] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);

  const handleSaveApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    updatePreferences({ geminiApiKey: apiKeyInput.trim() });
    setApiKeySaved(true);
    setTimeout(() => setApiKeySaved(false), 2500);
  };

  const themes: Array<{ id: ThemeType; name: string; subtitle: string; description: string }> = [
    {
      id: 'theme-warm-editorial',
      name: 'MindMirror Warm Editorial',
      subtitle: 'Parchment surfaces, terracotta accents, serene literary typography',
      description: 'A bespoke warm sanctuary designed specifically for reflective journaling with soft parchment (#fcfaf7), warm sand cards, and terracotta bronze accents.'
    },
    {
      id: 'theme-ultra-minimal',
      name: 'Ultra-Minimal Light',
      subtitle: 'Crisp whitespace, light gray borders, clean sans typography',
      description: 'Distraction-free digital notebook aesthetics with minimal borders, subtle separators, and quiet understated controls.'
    },
    {
      id: 'theme-pure-bw',
      name: 'Pure Black & White',
      subtitle: 'Strict monochrome, high contrast editorial borders',
      description: 'Zero extraneous colors. High contrast dark and light modes, crisp outlines, and maximum graphic clarity.'
    },
    {
      id: 'theme-dark-minimal',
      name: 'Dark Minimal',
      subtitle: 'Deep obsidian surfaces, muted slate accents, low eye strain',
      description: 'Calm night-focused interface with muted dark gray borders (#1e222b) and soft legible text designed for reflective evening journaling.'
    }
  ];

  const colorModes: Array<{ id: ColorMode; label: string; icon: React.FC<{ className?: string }> }> = [
    { id: 'light', label: 'Light', icon: Sun },
    { id: 'dark', label: 'Dark', icon: Moon },
    { id: 'system', label: 'System', icon: Monitor }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-16">
      {/* Header */}
      <div className="bg-surface-1 border border-border rounded-xl p-6 shadow-subtle space-y-2">
        <span className="text-[11px] font-mono text-muted uppercase tracking-wider">
          Preferences & Data Sovereignty
        </span>
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-primary heading-editorial">
          Settings, Themes & Privacy Safeguards
        </h1>
        <p className="text-xs md:text-sm text-secondary max-w-2xl">
          Customize your visual atmosphere, export your private journal records, configure AI analysis parameters, and review mental health safeguards.
        </p>
      </div>

      {/* Visual Themes Selector (Core Master UX Feature) */}
      <div className="bg-surface-1 border border-border rounded-xl p-6 shadow-subtle space-y-4">
        <div className="flex items-center gap-2 text-primary font-semibold text-sm">
          <Palette className="w-4 h-4 text-accent" />
          <h2>1. Visual Theme Selection</h2>
        </div>
        <p className="text-xs text-secondary leading-relaxed">
          Switch between four distinct visual philosophies. Changes update the entire application, typography, borders, and charts instantly.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          {themes.map(t => {
            const isSelected = preferences.theme === t.id;
            return (
              <div
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
                  isSelected
                    ? 'bg-surface-2 border-border-strong ring-1 ring-border-strong shadow-subtle'
                    : 'bg-surface-1 hover:bg-surface-2 border-border text-secondary'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-primary">{t.name}</span>
                    {isSelected && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-accent" />
                    )}
                  </div>
                  <div className="text-[11px] font-medium text-secondary">{t.subtitle}</div>
                  <p className="text-[10px] text-muted leading-relaxed">{t.description}</p>
                </div>

                <div className="pt-2 text-[10px] font-mono text-muted border-t border-border/50">
                  {isSelected ? '● Currently Active' : '○ Click to apply'}
                </div>
              </div>
            );
          })}
        </div>

        {/* Color Mode Toggle (Light / Dark / System) */}
        <div className="pt-4 border-t border-border flex flex-wrap items-center justify-between gap-3 text-xs">
          <div>
            <span className="font-semibold text-primary block">Color Mode</span>
            <span className="text-muted text-[11px]">Follow system appearance or force light/dark mode</span>
          </div>

          <div className="flex items-center gap-1.5 bg-surface-2 p-1 rounded-lg border border-border">
            {colorModes.map(cm => {
              const Icon = cm.icon;
              const isSelected = preferences.colorMode === cm.id;
              return (
                <button
                  key={cm.id}
                  onClick={() => setColorMode(cm.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    isSelected
                      ? 'bg-surface-1 text-primary shadow-subtle border border-border font-semibold'
                      : 'text-muted hover:text-primary'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cm.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* AI Engine & API Key Configuration */}
      <div className="bg-surface-1 border border-border rounded-xl p-6 shadow-subtle space-y-4">
        <div className="flex items-center gap-2 text-primary font-semibold text-sm">
          <Key className="w-4 h-4 text-accent" />
          <h2>2. AI Reflection Engine & Privacy</h2>
        </div>
        <p className="text-xs text-secondary leading-relaxed">
          MindMirror features a comprehensive built-in psychological heuristics engine that operates 100% locally and privately in your browser with zero server data transfer.
        </p>

        <form onSubmit={handleSaveApiKey} className="space-y-3 pt-1 text-xs">
          <div className="space-y-1">
            <label className="text-[11px] font-medium text-primary">
              Optional Google Gemini API Key (For Live Advanced LLM Integration)
            </label>
            <div className="flex gap-2">
              <input
                type="password"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder="AIzaSy... (Leave empty to use built-in private heuristic engine)"
                className="flex-1 p-2 bg-surface-2 border border-border rounded-lg text-primary text-xs font-mono focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-surface-2 hover:bg-surface-hover text-primary border border-border font-medium"
              >
                Save
              </button>
            </div>
            {apiKeySaved && (
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono">
                ✓ Preferences updated successfully
              </span>
            )}
          </div>
        </form>
      </div>

      {/* Data Export & Sovereignty */}
      <div className="bg-surface-1 border border-border rounded-xl p-6 shadow-subtle space-y-4">
        <div className="flex items-center gap-2 text-primary font-semibold text-sm">
          <Download className="w-4 h-4 text-accent" />
          <h2>3. Data Export & Data Ownership</h2>
        </div>
        <p className="text-xs text-secondary leading-relaxed">
          Your entries belong exclusively to you. You can export complete machine-readable archives anytime.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            onClick={() => exportData('json')}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg bg-surface-2 hover:bg-surface-hover text-primary border border-border transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Complete Archive (JSON)</span>
          </button>
          <button
            onClick={() => exportData('csv')}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg bg-surface-2 hover:bg-surface-hover text-primary border border-border transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Diary Entries (CSV)</span>
          </button>
        </div>
      </div>

      {/* Mental Health Safeguards & Crisis Protocols */}
      <div className="bg-surface-1 border border-border rounded-xl p-6 shadow-subtle space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary font-semibold text-sm">
            <Shield className="w-4 h-4 text-rose-500" />
            <h2>4. Mental Health Boundaries & Safeguards</h2>
          </div>
          <button
            onClick={() => setSafetyAlertOpen(true)}
            className="text-xs text-accent font-medium hover:underline"
          >
            Open Crisis Directory
          </button>
        </div>
        <div className="space-y-2 text-xs text-secondary leading-relaxed bg-surface-2 p-4 rounded-lg border border-border">
          <p>
            • <strong>Non-Clinical Scope:</strong> MindMirror AI is an educational self-reflection companion. It is strictly prohibited from diagnosing psychiatric disorders or providing medical therapy.
          </p>
          <p>
            • <strong>Provisional Rubrics:</strong> The 0–100 indicators are internal evidence tracking indices based on self-reported entries, not validated psychological tests.
          </p>
          <p>
            • <strong>Crisis Support:</strong> If you or someone you know is in immediate crisis, free 24/7 human counseling is available by calling <strong>988</strong> (US/Canada), <strong>111</strong> (UK), or <strong>13 11 14</strong> (Australia).
          </p>
        </div>
      </div>

      {/* Danger Zone: Wipe / Reset Data */}
      <div className="bg-surface-1 border border-rose-300 dark:border-rose-950/60 rounded-xl p-6 shadow-subtle space-y-4">
        <h2 className="text-sm font-semibold text-rose-600 dark:text-rose-400">5. Storage Reset & Data Erasure</h2>
        <p className="text-xs text-secondary leading-relaxed">
          Reset to realistic sample entries for testing, or permanently wipe all diary entries and analytics from this browser.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            onClick={() => {
              if (window.confirm("Reset to sample seed diary entries? Your current changes will be replaced.")) {
                resetToSampleData();
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-surface-2 hover:bg-surface-hover text-primary border border-border"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Sample Data</span>
          </button>

          <button
            onClick={() => {
              if (window.confirm("Are you sure? This will permanently delete ALL diary entries, reviews, and goals from this device.")) {
                wipeAllData();
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-medium shadow-subtle"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Permanently Wipe All Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
