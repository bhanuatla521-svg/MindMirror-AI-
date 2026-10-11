import React, { useState } from 'react';
import { Users, MessageSquare, Shield, Sparkles, Send, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SocialIntelligence: React.FC = () => {
  const { dimensions } = useApp();

  // Difficult Conversation Simulator State
  const [partnerName, setPartnerName] = useState('');
  const [coreTopic, setCoreTopic] = useState('');
  const [underlyingFear, setUnderlyingFear] = useState('');
  const [otherPersonPressure, setOtherPersonPressure] = useState('');
  const [generatedScript, setGeneratedScript] = useState<string | null>(null);
  const [coachingResult, setCoachingResult] = useState<{ strengths?: string; frictionPoints?: string; microDrill?: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const commDim = dimensions.find(d => d.id === 8);
  const empathyDim = dimensions.find(d => d.id === 9);
  const boundaryDim = dimensions.find(d => d.id === 26);

  const handleGenerateScript = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coreTopic.trim()) return;

    setIsLoading(true);
    const scenario = `Topic: ${coreTopic.trim()}. Person: ${partnerName.trim() || 'Colleague'}. Context/Pressure: ${otherPersonPressure.trim() || 'Unspecified'}`;
    const userResponse = `Underlying fear/hesitation: ${underlyingFear.trim() || 'Worried about friction'}`;

    try {
      const res = await fetch('/api/ai/social-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario, userResponse })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.coaching) {
          setGeneratedScript(data.coaching.suggestedPhrasing || '');
          setCoachingResult({
            strengths: data.coaching.strengths,
            frictionPoints: data.coaching.frictionPoints,
            microDrill: data.coaching.microDrill
          });
          setIsLoading(false);
          return;
        }
      }
    } catch (err) {
      console.warn('[SocialCoach] Backend AI unavailable, using template.', err);
    }

    const script = `Hi ${partnerName.trim() || 'there'}, do you have 10 minutes to talk about ${coreTopic.trim()}?

I wanted to check in because I noticed [mention objective fact], and my primary goal is ensuring we both have clarity and alignment.

I recognize you're likely navigating [their context: ${otherPersonPressure.trim() || 'multiple competing priorities'}], and I want to support that while also being transparent about [your limit].

What is your perspective on how this is currently working?`;

    setGeneratedScript(script);
    setCoachingResult({
      strengths: "Recognizing your underlying emotional resistance without acting out defensively.",
      frictionPoints: "Delaying transparent boundaries risks compounding resentment.",
      microDrill: "Practice delivering the first opening sentence aloud once before the meeting."
    });
    setIsLoading(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-16">
      {/* Header */}
      <div className="bg-surface-1 border border-border rounded-xl p-6 shadow-subtle space-y-2">
        <span className="text-[11px] font-mono text-muted uppercase tracking-wider">
          Interpersonal Dynamics & Boundary Architecture
        </span>
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-primary heading-editorial">
          Social Intelligence & Communication
        </h1>
        <p className="text-xs md:text-sm text-secondary max-w-2xl">
          Cultivate assertiveness without aggression, active perspective-taking, and kind, unambiguous personal boundaries.
        </p>
      </div>

      {/* Social Indicator Triad */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-surface-1 border border-border rounded-xl p-4 shadow-subtle space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-primary">Communication Clarity</span>
            <span className="font-mono font-bold text-primary">{commDim?.currentScore || 76}/100</span>
          </div>
          <p className="text-xs text-secondary leading-relaxed">
            Sending structured 3-bullet written recaps has dramatically reduced asynchronous team ambiguity.
          </p>
        </div>

        <div className="bg-surface-1 border border-border rounded-xl p-4 shadow-subtle space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-primary">Perspective-Taking</span>
            <span className="font-mono font-bold text-primary">{empathyDim?.currentScore || 71}/100</span>
          </div>
          <p className="text-xs text-secondary leading-relaxed">
            Consistently distinguishing colleagues' systemic workload constraints from perceived personal malice.
          </p>
        </div>

        <div className="bg-surface-1 border border-border rounded-xl p-4 shadow-subtle space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-primary">Boundary Setting</span>
            <span className="font-mono font-bold text-primary">{boundaryDim?.currentScore || 71}/100</span>
          </div>
          <p className="text-xs text-secondary leading-relaxed">
            Cleanly declining weekend hackathons and overtime requests without fabricated apologies or guilt.
          </p>
        </div>
      </div>

      {/* Interactive Difficult Conversation Preparation Tool */}
      <div className="bg-surface-1 border border-border rounded-xl p-6 shadow-subtle space-y-5">
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <MessageSquare className="w-4 h-4 text-accent" />
          <h2 className="text-sm font-semibold text-primary">
            Difficult-Conversation Preparation Lab
          </h2>
        </div>

        <p className="text-xs text-secondary leading-relaxed">
          Prepare for an upcoming tense conversation by separating camera-verifiable facts from emotional stories, predicting the other person's constraints, and drafting a non-defensive opening script.
        </p>

        <form onSubmit={handleGenerateScript} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-primary">Person / Stakeholder Name</label>
              <input
                type="text"
                value={partnerName}
                onChange={(e) => setPartnerName(e.target.value)}
                placeholder="e.g. David (Tech Lead) or Sarah (Product)"
                className="w-full p-2.5 bg-surface-2 border border-border rounded-lg text-primary text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-medium text-primary">Core Topic / Disagreement</label>
              <input
                type="text"
                value={coreTopic}
                onChange={(e) => setCoreTopic(e.target.value)}
                placeholder="e.g. Timeline acceleration or code review scope"
                className="w-full p-2.5 bg-surface-2 border border-border rounded-lg text-primary text-xs"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-primary">What is your underlying worst-case fear?</label>
              <input
                type="text"
                value={underlyingFear}
                onChange={(e) => setUnderlyingFear(e.target.value)}
                placeholder="e.g. Fear of looking uncooperative or defensive"
                className="w-full p-2.5 bg-surface-2 border border-border rounded-lg text-primary text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-medium text-primary">What pressure might they be dealing with?</label>
              <input
                type="text"
                value={otherPersonPressure}
                onChange={(e) => setOtherPersonPressure(e.target.value)}
                placeholder="e.g. Executive launch deadlines or junior onboarding stress"
                className="w-full p-2.5 bg-surface-2 border border-border rounded-lg text-primary text-xs"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-lg bg-accent text-accent-fg hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isLoading ? 'Synthesizing with AI Coach...' : 'Generate Non-Defensive Opening Script'}</span>
            </button>
          </div>
        </form>

        {generatedScript && (
          <div className="p-4 bg-surface-2 rounded-xl border border-border space-y-4 animate-fade-in text-xs">
            <div className="flex items-center justify-between font-semibold text-primary">
              <span>Prepared Assertive Script:</span>
              <button
                onClick={() => navigator.clipboard.writeText(generatedScript)}
                className="text-[11px] text-muted hover:text-primary font-mono"
              >
                Copy to Clipboard
              </button>
            </div>
            <pre className="whitespace-pre-wrap font-sans text-secondary leading-relaxed bg-canvas p-3 rounded-lg border border-border">
              {generatedScript}
            </pre>

            {coachingResult && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs border-t border-border">
                {coachingResult.strengths && (
                  <div className="p-2.5 rounded-lg bg-surface-1 border border-border space-y-1">
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400 block text-[11px]">Strengths Noted</span>
                    <p className="text-secondary leading-relaxed">{coachingResult.strengths}</p>
                  </div>
                )}
                {coachingResult.frictionPoints && (
                  <div className="p-2.5 rounded-lg bg-surface-1 border border-border space-y-1">
                    <span className="font-semibold text-amber-600 dark:text-amber-400 block text-[11px]">Friction Risks</span>
                    <p className="text-secondary leading-relaxed">{coachingResult.frictionPoints}</p>
                  </div>
                )}
                {coachingResult.microDrill && (
                  <div className="p-2.5 rounded-lg bg-surface-1 border border-border space-y-1">
                    <span className="font-semibold text-accent block text-[11px]">2-Minute Micro-Drill</span>
                    <p className="text-secondary leading-relaxed">{coachingResult.microDrill}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
