import React from 'react';
import { AlertTriangle, Heart, Phone, ExternalLink, X } from 'lucide-react';

interface SafetyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SafetyModal: React.FC<SafetyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface-1 border border-border-strong rounded-xl max-w-lg w-full p-6 shadow-soft text-primary space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center space-x-2 text-rose-600 dark:text-rose-400">
            <Heart className="w-5 h-5" />
            <h3 className="font-semibold text-lg">Compassionate Support Notice</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-muted hover:text-primary rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 text-sm text-secondary leading-relaxed">
          <p>
            We noticed language in your reflection indicating intense distress. Your safety, dignity, and wellbeing are the absolute highest priority.
          </p>
          <p className="font-medium text-primary">
            MindMirror is an introspective self-reflection tool, not a crisis service or substitute for clinical medical care.
          </p>

          <div className="bg-surface-2 p-4 rounded-lg border border-border space-y-2.5">
            <div className="font-semibold text-primary flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Immediate, Free & Confidential Support (24/7):
            </div>
            <ul className="space-y-1.5 text-xs">
              <li><strong>United States & Canada:</strong> Call or text <span className="font-mono bg-canvas px-1.5 py-0.5 rounded border border-border text-primary font-bold">988</span></li>
              <li><strong>United Kingdom:</strong> Call <span className="font-mono bg-canvas px-1.5 py-0.5 rounded border border-border text-primary font-bold">111</span> (NHS) or <span className="font-mono bg-canvas px-1.5 py-0.5 rounded border border-border text-primary font-bold">116 123</span> (Samaritans)</li>
              <li><strong>Australia:</strong> Call <span className="font-mono bg-canvas px-1.5 py-0.5 rounded border border-border text-primary font-bold">13 11 14</span> (Lifeline)</li>
              <li><strong>International:</strong> Visit <a href="https://findahelpline.com" target="_blank" rel="noreferrer" className="underline inline-flex items-center gap-1 font-medium text-primary">findahelpline.com <ExternalLink className="w-3 h-3" /></a></li>
            </ul>
          </div>

          <p className="text-xs text-muted">
            Please consider stepping away from the screen to reach out to a trusted loved one, doctor, or crisis counselor right now.
          </p>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg bg-accent text-accent-fg font-medium hover:opacity-90 transition-opacity"
          >
            I understand, return to journal
          </button>
        </div>
      </div>
    </div>
  );
};
