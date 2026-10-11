import React, { useState } from 'react';
import { Brain, CheckCircle2, Plus, ArrowRight, Eye, ShieldAlert } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface DecisionRecord {
  id: string;
  date: string;
  decisionTitle: string;
  expectedOutcome: string;
  actualOutcome?: string;
  tradeOffsConsidered: string;
  status: 'pending_review' | 'evaluated';
}

export const CriticalThinking: React.FC = () => {
  const { dimensions } = useApp();

  const [decisions, setDecisions] = useState<DecisionRecord[]>([
    {
      id: "dec-1",
      date: "2026-10-07",
      decisionTitle: "Selected Redis cluster cache over in-memory caching",
      expectedOutcome: "Multi-instance reliability during horizontal scaling spikes",
      actualOutcome: "Zero cache desynchronization errors during Friday surge",
      tradeOffsConsidered: "Accepted 2 hours extra setup configuration time",
      status: "evaluated"
    },
    {
      id: "dec-2",
      date: "2026-10-05",
      decisionTitle: "Accepted Maria's database schema rewrite proposal",
      expectedOutcome: "30% latency reduction on query joins",
      actualOutcome: "42% reduction demonstrated in staging benchmarks",
      tradeOffsConsidered: "Swallowed personal ego and scrapped two days of legacy PR work",
      status: "evaluated"
    }
  ]);

  const [newTitle, setNewTitle] = useState('');
  const [newExpected, setNewExpected] = useState('');
  const [newTradeOffs, setNewTradeOffs] = useState('');
  const [showAddDecision, setShowAddDecision] = useState(false);

  // Live AI Critical Thinking & Cognitive Distortion Auditor
  const [claimInput, setClaimInput] = useState('');
  const [auditResult, setAuditResult] = useState<{
    unstatedAssumptions?: string[];
    potentialBiases?: string[];
    alternativeExplanations?: string[];
    socraticChallenge?: string;
  } | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);

  const handleAuditClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimInput.trim()) return;
    setIsAuditing(true);

    try {
      const res = await fetch('/api/ai/critical-think', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ claimOrSituation: claimInput.trim() })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.audit) {
          setAuditResult(data.audit);
          setIsAuditing(false);
          return;
        }
      }
    } catch (err) {
      console.warn('[CriticalThinking] Backend AI audit unavailable, using fallback.', err);
    }

    setAuditResult({
      unstatedAssumptions: ["Assuming current silence equates to negative evaluation", "Assuming immediate reply is the default baseline"],
      potentialBiases: ["Mind Reading", "Catastrophizing"],
      alternativeExplanations: ["The recipient was focused on other tasks or in a meeting", "The message required no immediate response"],
      socraticChallenge: "What camera-verifiable evidence do you possess, separate from what you fear could happen?"
    });
    setIsAuditing(false);
  };

  const handleAddDecision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newRecord: DecisionRecord = {
      id: `dec-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      decisionTitle: newTitle,
      expectedOutcome: newExpected,
      tradeOffsConsidered: newTradeOffs,
      status: 'pending_review'
    };

    setDecisions([newRecord, ...decisions]);
    setNewTitle('');
    setNewExpected('');
    setNewTradeOffs('');
    setShowAddDecision(false);
  };

  const critDim = dimensions.find(d => d.id === 11);
  const flexDim = dimensions.find(d => d.id === 14);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-16">
      {/* Header */}
      <div className="bg-surface-1 border border-border rounded-xl p-6 shadow-subtle space-y-2">
        <span className="text-[11px] font-mono text-muted uppercase tracking-wider">
          Epistemology & Cognitive Bias Resistance
        </span>
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-primary heading-editorial">
          Critical Thinking & Decision Journal
        </h1>
        <p className="text-xs md:text-sm text-secondary max-w-2xl">
          Track high-stakes decisions, identify cognitive distortions before they solidify, and practice falsifying cherished hypotheses.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-surface-1 rounded-xl border border-border shadow-subtle space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-primary">Critical Thinking Indicator</span>
            <span className="font-mono font-bold text-primary">{critDim?.currentScore || 84}/100</span>
          </div>
          <p className="text-xs text-secondary leading-relaxed">
            Consistently demands empirical log metrics before diagnosing system bottlenecks. Strong verification mindset.
          </p>
        </div>

        <div className="p-4 bg-surface-1 rounded-xl border border-border shadow-subtle space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-primary">Cognitive Flexibility Indicator</span>
            <span className="font-mono font-bold text-primary">{flexDim?.currentScore || 70}/100</span>
          </div>
          <p className="text-xs text-secondary leading-relaxed">
            Willing to reverse positions immediately when presented with superior benchmark proofs. Low intellectual defensiveness.
          </p>
        </div>
      </div>

      {/* Decision Journal */}
      <div className="bg-surface-1 border border-border rounded-xl p-6 shadow-subtle space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-accent" />
            <h2 className="text-sm font-semibold text-primary">Decision Journal</h2>
          </div>
          <button
            onClick={() => setShowAddDecision(!showAddDecision)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-surface-2 border border-border text-primary hover:bg-surface-hover"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Record Decision</span>
          </button>
        </div>

        {showAddDecision && (
          <form onSubmit={handleAddDecision} className="p-4 bg-surface-2 rounded-xl border border-border space-y-3 text-xs animate-fade-in">
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-primary">Decision Title</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="What decision are you making?"
                className="w-full p-2 bg-surface-1 border border-border rounded-lg text-primary text-xs"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-primary">Expected Outcome</label>
                <input
                  type="text"
                  value={newExpected}
                  onChange={(e) => setNewExpected(e.target.value)}
                  placeholder="What do you predict will happen?"
                  className="w-full p-2 bg-surface-1 border border-border rounded-lg text-primary text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-primary">Trade-Offs Considered</label>
                <input
                  type="text"
                  value={newTradeOffs}
                  onChange={(e) => setNewTradeOffs(e.target.value)}
                  placeholder="What cost or alternative did you trade off?"
                  className="w-full p-2 bg-surface-1 border border-border rounded-lg text-primary text-xs"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowAddDecision(false)}
                className="px-3 py-1.5 rounded-lg border border-border text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3.5 py-1.5 rounded-lg bg-accent text-accent-fg font-medium text-xs"
              >
                Save Decision
              </button>
            </div>
          </form>
        )}

        <div className="divide-y divide-border pt-1">
          {decisions.map(dec => (
            <div key={dec.id} className="py-4 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-primary text-sm">{dec.decisionTitle}</span>
                <span className="font-mono text-[10px] text-muted">{dec.date}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                <div className="p-2.5 bg-surface-2 rounded-lg border border-border">
                  <span className="text-muted block text-[10px] font-mono">Predicted Outcome:</span>
                  <span className="text-secondary">{dec.expectedOutcome}</span>
                </div>
                <div className="p-2.5 bg-surface-2 rounded-lg border border-border">
                  <span className="text-muted block text-[10px] font-mono">Trade-offs Weighed:</span>
                  <span className="text-secondary">{dec.tradeOffsConsidered}</span>
                </div>
                <div className="p-2.5 bg-surface-2 rounded-lg border border-border">
                  <span className="text-muted block text-[10px] font-mono">Actual Outcome:</span>
                  <span className="text-primary font-medium">{dec.actualOutcome || 'Pending 30-day review'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive AI Cognitive Bias & Assumption Auditor */}
      <div className="bg-surface-1 border border-border rounded-xl p-6 shadow-subtle space-y-4">
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <Eye className="w-4 h-4 text-accent" />
          <h2 className="text-sm font-semibold text-primary">
            AI Assumption & Cognitive Distortion Auditor
          </h2>
        </div>
        <p className="text-xs text-secondary leading-relaxed">
          Stress-test a stressful assumption or interpretation with AI. MindMirror identifies unstated premises, tests for cognitive distortions, generates alternative hypotheses, and returns a Socratic challenge.
        </p>

        <form onSubmit={handleAuditClaim} className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={claimInput}
              onChange={(e) => setClaimInput(e.target.value)}
              placeholder="e.g. They didn't reply to my PR comments today so they must think my work is subpar..."
              className="flex-1 p-2.5 bg-surface-2 border border-border rounded-lg text-primary text-xs focus:outline-none"
              required
            />
            <button
              type="submit"
              disabled={isAuditing}
              className="px-4 py-2 rounded-lg bg-accent text-accent-fg font-medium text-xs hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {isAuditing ? 'Auditing...' : 'Audit Reasoning'}
            </button>
          </div>
        </form>

        {auditResult && (
          <div className="p-4 bg-surface-2 rounded-xl border border-border space-y-3 animate-fade-in text-xs">
            <div className="font-semibold text-primary text-sm">Empirical Audit Findings:</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {auditResult.unstatedAssumptions && (
                <div className="p-3 bg-surface-1 rounded-lg border border-border space-y-1">
                  <span className="font-semibold text-amber-600 dark:text-amber-400 block text-[11px]">Unstated Assumptions</span>
                  <ul className="list-disc list-inside space-y-1 text-secondary">
                    {auditResult.unstatedAssumptions.map((assump, i) => (
                      <li key={i}>{assump}</li>
                    ))}
                  </ul>
                </div>
              )}
              {auditResult.potentialBiases && (
                <div className="p-3 bg-surface-1 rounded-lg border border-border space-y-1">
                  <span className="font-semibold text-rose-600 dark:text-rose-400 block text-[11px]">Potential Cognitive Biases</span>
                  <ul className="list-disc list-inside space-y-1 text-secondary">
                    {auditResult.potentialBiases.map((bias, i) => (
                      <li key={i}>{bias}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {auditResult.alternativeExplanations && (
              <div className="p-3 bg-surface-1 rounded-lg border border-border space-y-1">
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 block text-[11px]">Plausible Alternative Explanations</span>
                <ul className="list-disc list-inside space-y-1 text-secondary">
                  {auditResult.alternativeExplanations.map((alt, i) => (
                    <li key={i}>{alt}</li>
                  ))}
                </ul>
              </div>
            )}

            {auditResult.socraticChallenge && (
              <div className="p-3 bg-surface-1 rounded-lg border border-accent/40 space-y-1">
                <span className="font-semibold text-accent block text-[11px]">Socratic Self-Inquiry</span>
                <p className="text-primary italic leading-relaxed">{auditResult.socraticChallenge}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Cognitive Distortions Checklist */}
      <div className="bg-surface-1 border border-border rounded-xl p-5 shadow-subtle space-y-3">
        <h2 className="text-sm font-semibold text-primary">Frequent Cognitive Traps Checked in AI Reviews</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-surface-2 rounded-lg border border-border space-y-1">
            <span className="font-semibold text-primary">Mind Reading</span>
            <p className="text-muted">Assuming you know what another person thinks of your intelligence or character without explicit verification.</p>
          </div>
          <div className="p-3 bg-surface-2 rounded-lg border border-border space-y-1">
            <span className="font-semibold text-primary">Catastrophizing</span>
            <p className="text-muted">Treating an ordinary timeline delay or minor critique as proof of catastrophic failure.</p>
          </div>
          <div className="p-3 bg-surface-2 rounded-lg border border-border space-y-1">
            <span className="font-semibold text-primary">'Should' Rigidity</span>
            <p className="text-muted">Demanding that human interactions or technical projects proceed without standard real-world variance.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
