'use client';

import { useState } from 'react';
import { Palmtree, Copy, Check, Sparkles } from 'lucide-react';
import { VACATION_STATEMENTS, CONVICTION_STATEMENTS, TONALITY_RED_FLAGS } from '@/lib/callScriptData';

export default function VacationStatements() {
  const [copied, setCopied] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<'vacation' | 'conviction' | 'redflags'>('vacation');

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
      {/* Section Tabs */}
      <div className="flex border-b border-neutral-800">
        <button
          onClick={() => setActiveSection('vacation')}
          className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
            activeSection === 'vacation'
              ? 'bg-purple-600/20 text-purple-400 border-b-2 border-purple-500'
              : 'text-neutral-500 hover:text-white'
          }`}
        >
          <Palmtree className="w-3 h-3 inline mr-1" />
          Vacations
        </button>
        <button
          onClick={() => setActiveSection('conviction')}
          className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
            activeSection === 'conviction'
              ? 'bg-blue-600/20 text-blue-400 border-b-2 border-blue-500'
              : 'text-neutral-500 hover:text-white'
          }`}
        >
          <Sparkles className="w-3 h-3 inline mr-1" />
          Conviction
        </button>
        <button
          onClick={() => setActiveSection('redflags')}
          className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
            activeSection === 'redflags'
              ? 'bg-red-600/20 text-red-400 border-b-2 border-red-500'
              : 'text-neutral-500 hover:text-white'
          }`}
        >
          Red Flags
        </button>
      </div>

      <div className="p-4">
        {/* Vacation Statements */}
        {activeSection === 'vacation' && (
          <div className="space-y-2">
            <p className="text-xs text-purple-400 mb-3 italic">
              "Sell the vacation, not the plane ride"
            </p>
            {VACATION_STATEMENTS.map((item, i) => (
              <button
                key={i}
                onClick={() => copyToClipboard(item.vacation, `vacation-${i}`)}
                className="w-full text-left p-3 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors group"
              >
                <div className="text-xs text-neutral-500 mb-1">{item.pain}</div>
                <div className="flex items-center justify-between">
                  <span className="text-purple-300 text-sm font-medium">
                    "{item.vacation}"
                  </span>
                  {copied === `vacation-${i}` ? (
                    <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                  ) : (
                    <Copy className="w-4 h-4 text-neutral-600 group-hover:text-neutral-400 flex-shrink-0" />
                  )}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Conviction Statements */}
        {activeSection === 'conviction' && (
          <div className="space-y-2">
            <p className="text-xs text-blue-400 mb-3 italic">
              "10% words, 90% tonality"
            </p>
            {CONVICTION_STATEMENTS.map((statement, i) => (
              <button
                key={i}
                onClick={() => copyToClipboard(statement, `conviction-${i}`)}
                className="w-full text-left p-3 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-blue-300 text-sm transition-colors group flex items-center justify-between"
              >
                <span>"{statement}"</span>
                {copied === `conviction-${i}` ? (
                  <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                ) : (
                  <Copy className="w-4 h-4 text-neutral-600 group-hover:text-neutral-400 flex-shrink-0" />
                )}
              </button>
            ))}
          </div>
        )}

        {/* Red Flags */}
        {activeSection === 'redflags' && (
          <div className="space-y-2">
            <p className="text-xs text-red-400 mb-3 italic">
              Watch for these signs you're pitching too hard
            </p>
            {TONALITY_RED_FLAGS.map((flag, i) => (
              <div
                key={i}
                className="flex items-center gap-2 p-2 bg-red-900/10 border border-red-900/20 rounded-lg text-sm text-red-300"
              >
                <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0" />
                {flag}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
