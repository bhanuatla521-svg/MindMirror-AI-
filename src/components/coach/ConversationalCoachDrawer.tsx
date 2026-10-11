import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, Plus, ArrowRight, CornerDownLeft } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface CoachDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConversationalCoachDrawer: React.FC<CoachDrawerProps> = ({ isOpen, onClose }) => {
  const { chatMessages, sendCoachMessage, turnIntoAction, setActiveTab, setSelectedEntryId } = useApp();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const promptSuggestions = [
    "Why do I repeat defensive over-explaining?",
    "What could I have done differently in my last entry?",
    "Am I making assumptions without enough evidence?",
    "What patterns appear across my recent reflections?",
    "What specific action should I practice tomorrow?"
  ];

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendCoachMessage(inputText.trim());
    setInputText('');
  };

  const handleSuggestionClick = (prompt: string) => {
    sendCoachMessage(prompt);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-surface-1 border-l border-border shadow-soft flex flex-col animate-slide-left text-primary">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between bg-surface-1">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-surface-2 border border-border flex items-center justify-center text-primary">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold tracking-tight">Reflective AI Coach</h2>
            <p className="text-[11px] text-muted">Socratic guidance grounded in your diary</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 text-muted hover:text-primary rounded-lg transition-colors"
          aria-label="Close coach"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[92%] rounded-xl px-4 py-3 text-xs md:text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-accent text-accent-fg'
                  : 'bg-surface-2 border border-border text-primary'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.text}</div>

              {/* Referenced dates pills */}
              {msg.referencedEntryDates && msg.referencedEntryDates.length > 0 && (
                <div className="mt-3 pt-2 border-t border-border/60 flex flex-wrap items-center gap-1.5 text-[11px] text-muted">
                  <span>Referenced entries:</span>
                  {msg.referencedEntryDates.map(date => (
                    <button
                      key={date}
                      onClick={() => {
                        setActiveTab('diary');
                        onClose();
                      }}
                      className="px-1.5 py-0.5 rounded bg-canvas border border-border font-mono hover:text-primary transition-colors text-[10px]"
                    >
                      {date}
                    </button>
                  ))}
                </div>
              )}

              {/* Suggested action pill */}
              {msg.suggestedAction && (
                <div className="mt-2.5 p-2 rounded-lg bg-surface-1 border border-border flex items-center justify-between gap-2 text-xs">
                  <span className="text-primary font-medium truncate">{msg.suggestedAction}</span>
                  <button
                    onClick={() => turnIntoAction(msg.suggestedAction!)}
                    className="flex-shrink-0 flex items-center gap-1 text-[11px] px-2 py-1 rounded bg-accent text-accent-fg hover:opacity-90 transition-opacity font-medium"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Track</span>
                  </button>
                </div>
              )}
            </div>
            <span className="text-[10px] text-muted mt-1 px-1 font-mono">
              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Socratic Suggestions Chips */}
      <div className="px-4 py-2 bg-surface-2/40 border-t border-border overflow-x-auto whitespace-nowrap scrollbar-none flex gap-1.5">
        {promptSuggestions.map((suggestion, idx) => (
          <button
            key={idx}
            onClick={() => handleSuggestionClick(suggestion)}
            className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full bg-surface-1 border border-border text-secondary hover:text-primary hover:border-border-strong transition-colors"
          >
            <span>{suggestion}</span>
            <ArrowRight className="w-2.5 h-2.5 text-muted" />
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-border bg-surface-1">
        <div className="relative flex items-center">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask a reflective question about your patterns..."
            className="w-full pl-3.5 pr-10 py-2.5 text-xs bg-surface-2 border border-border rounded-xl text-primary placeholder:text-muted focus:outline-none focus:border-border-strong transition-colors"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="absolute right-2 p-1.5 text-muted hover:text-primary disabled:opacity-30 disabled:pointer-events-none transition-colors"
            aria-label="Send query"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <div className="text-[10px] text-muted text-center mt-2 flex items-center justify-center gap-1">
          <span>MindMirror AI provides reflective inquiry, not clinical treatment.</span>
        </div>
      </form>
    </div>
  );
};
