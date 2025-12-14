'use client';

import { useState } from 'react';
import { X, DollarSign, Clock, HelpCircle, Users, Target, MoreHorizontal } from 'lucide-react';
import { OBJECTION_TYPES, INTEREST_LEVELS, LOST_REASONS } from '@/lib/constants';

interface OutcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (details: {
    objectionType: string;
    objectionDetails: string;
    competitorMention: string;
    interestLevel: string;
    lostReason: string;
  }) => void;
  leadName: string;
  outcome: 'No Interest' | 'Follow Up';
}

const OBJECTION_ICONS: Record<string, React.ReactNode> = {
  'Budget': <DollarSign className="w-4 h-4" />,
  'Time': <Clock className="w-4 h-4" />,
  'Skepticism': <HelpCircle className="w-4 h-4" />,
  'Authority': <Users className="w-4 h-4" />,
  'Competition': <Target className="w-4 h-4" />,
  'Other': <MoreHorizontal className="w-4 h-4" />,
};

export default function OutcomeModal({
  isOpen,
  onClose,
  onConfirm,
  leadName,
  outcome
}: OutcomeModalProps) {
  const [objectionType, setObjectionType] = useState('');
  const [objectionDetails, setObjectionDetails] = useState('');
  const [competitorMention, setCompetitorMention] = useState('');
  const [interestLevel, setInterestLevel] = useState('');
  const [lostReason, setLostReason] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    setIsSaving(true);
    await onConfirm({
      objectionType,
      objectionDetails,
      competitorMention,
      interestLevel,
      lostReason
    });
  };

  const isNotInterested = outcome === 'No Interest';
  const title = isNotInterested ? 'Not Interested' : 'Schedule Follow Up';
  const subtitle = isNotInterested
    ? `Why did ${leadName} say no?`
    : `What's the plan with ${leadName}?`;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-end md:items-center justify-center z-50 p-0 md:p-4">
      <div className="bg-neutral-900 rounded-t-2xl md:rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-800 sticky top-0 bg-neutral-900">
          <div>
            <h2 className="text-lg font-bold text-white">{title}</h2>
            <p className="text-sm text-neutral-400">{subtitle}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-neutral-400" />
          </button>
        </div>

        <div className="p-4 space-y-6">
          {/* Objection Type - Quick Tap */}
          <div>
            <label className="text-xs uppercase text-neutral-500 font-bold mb-3 block">
              {isNotInterested ? 'Why? (tap one)' : 'Objection? (optional)'}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {OBJECTION_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setObjectionType(type)}
                  className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1 min-h-[70px] ${
                    objectionType === type
                      ? 'bg-red-600/20 border-red-500 text-red-400'
                      : 'bg-neutral-800 border-neutral-700 text-neutral-300 hover:border-neutral-600'
                  }`}
                >
                  {OBJECTION_ICONS[type]}
                  <span className="text-xs font-medium">{type}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Their Exact Words */}
          <div>
            <label className="text-xs uppercase text-neutral-500 font-bold mb-2 block">
              Their exact words (optional)
            </label>
            <textarea
              value={objectionDetails}
              onChange={(e) => setObjectionDetails(e.target.value)}
              placeholder="e.g., 'We're already working with Tom Ferry...'"
              className="w-full h-20 bg-neutral-800 border border-neutral-700 rounded-xl p-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none"
            />
          </div>

          {/* Competitor Mention */}
          {objectionType === 'Competition' && (
            <div>
              <label className="text-xs uppercase text-neutral-500 font-bold mb-2 block">
                Competitor Name
              </label>
              <input
                type="text"
                value={competitorMention}
                onChange={(e) => setCompetitorMention(e.target.value)}
                placeholder="e.g., Tom Ferry, KW Command..."
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl p-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>
          )}

          {/* Interest Level - For Follow Ups */}
          {!isNotInterested && (
            <div>
              <label className="text-xs uppercase text-neutral-500 font-bold mb-3 block">
                Interest Level
              </label>
              <div className="flex gap-2">
                {INTEREST_LEVELS.map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setInterestLevel(level)}
                    className={`flex-1 p-3 rounded-xl border-2 transition-all font-medium ${
                      interestLevel === level
                        ? level === 'Hot'
                          ? 'bg-orange-600/20 border-orange-500 text-orange-400'
                          : level === 'Warm'
                          ? 'bg-yellow-600/20 border-yellow-500 text-yellow-400'
                          : 'bg-blue-600/20 border-blue-500 text-blue-400'
                        : 'bg-neutral-800 border-neutral-700 text-neutral-300 hover:border-neutral-600'
                    }`}
                  >
                    {level === 'Hot' && '🔥'} {level === 'Warm' && '🌤️'} {level === 'Cold' && '❄️'} {level}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Lost Reason - For Not Interested */}
          {isNotInterested && (
            <div>
              <label className="text-xs uppercase text-neutral-500 font-bold mb-3 block">
                Primary reason lost
              </label>
              <div className="flex flex-wrap gap-2">
                {LOST_REASONS.map((reason) => (
                  <button
                    key={reason}
                    type="button"
                    onClick={() => setLostReason(reason)}
                    className={`px-4 py-2 rounded-full border transition-all text-sm font-medium ${
                      lostReason === reason
                        ? 'bg-red-600/20 border-red-500 text-red-400'
                        : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:border-neutral-600'
                    }`}
                  >
                    {reason}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-800 sticky bottom-0 bg-neutral-900">
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className={`w-full py-4 rounded-xl font-bold text-white transition-all disabled:opacity-50 ${
              isNotInterested
                ? 'bg-red-600 hover:bg-red-500'
                : 'bg-purple-600 hover:bg-purple-500'
            }`}
          >
            {isSaving ? 'Saving...' : 'Save & Next Lead'}
          </button>
        </div>
      </div>
    </div>
  );
}
