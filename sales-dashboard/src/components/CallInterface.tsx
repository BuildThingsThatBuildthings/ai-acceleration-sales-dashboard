'use client';

import { useState } from 'react';
import { Check, X, Clock, HelpCircle, Phone, Voicemail, Calendar, AlertTriangle, ChevronLeft, ChevronRight, Lightbulb, Target, Copy } from 'lucide-react';
import { logCall, setFollowUp, logDetailedOutcome } from '@/app/actions';
import { Lead } from '@/lib/google';
import FollowUpModal from './FollowUpModal';
import OutcomeModal from './OutcomeModal';
import PipelineSelector from './PipelineSelector';
import DataCards from './call/DataCards';
import VacationStatements from './call/VacationStatements';

interface Script {
  id: number;
  title: string;
  display_order: number;
  content: string;
  stage?: string;
  duration?: string;
  goal?: string;
  prompts?: string[];
}

interface Objection {
  id: number;
  objection: string;
  response: string;
  preFrame?: string;
}

export default function CallInterface({ lead, scripts, objections }: {
  lead: Lead;
  scripts: Script[];
  objections: Objection[];
}) {
  const [activeTab, setActiveTab] = useState<'script' | 'objections' | 'tools'>('script');
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [notes, setNotes] = useState(lead.callNotes || '');
  const [isLogging, setIsLogging] = useState(false);
  const [showFollowUpModal, setShowFollowUpModal] = useState(false);
  const [showOutcomeModal, setShowOutcomeModal] = useState(false);
  const [outcomeType, setOutcomeType] = useState<'No Interest' | 'Follow Up'>('No Interest');
  const [copiedPrompt, setCopiedPrompt] = useState<number | null>(null);

  // CLOSER stage letters for the progress indicator
  const CLOSER_LETTERS = ['C', 'L', 'O', 'S', 'E', 'R'];
  const currentScript = scripts[currentStageIndex];

  const goToNextStage = () => {
    if (currentStageIndex < scripts.length - 1) {
      setCurrentStageIndex(currentStageIndex + 1);
    }
  };

  const goToPrevStage = () => {
    if (currentStageIndex > 0) {
      setCurrentStageIndex(currentStageIndex - 1);
    }
  };

  const copyPrompt = async (prompt: string, index: number) => {
    await navigator.clipboard.writeText(prompt);
    setCopiedPrompt(index);
    setTimeout(() => setCopiedPrompt(null), 2000);
  };

  // Replace lead-specific placeholders in script (keep generic ones visible)
  const processScript = (content: string) => {
    return content
      .replace(/\[First Name\]/g, lead.firstName || lead.name)
      .replace(/\[Company\]/g, lead.company)
      .replace(/\[reference AI Subject Line\]/g, lead.aiSubjectLine || '[No subject line]');
  };

  const handleOutcome = async (outcome: string) => {
    setIsLogging(true);
    try {
      await logCall(lead.rowNumber, outcome, notes);
      window.location.href = '/';
    } catch (error) {
      console.error('Error logging call:', error);
      setIsLogging(false);
    }
  };

  const handleFollowUp = async (date: string, followUpNotes: string) => {
    setIsLogging(true);
    try {
      const combinedNotes = followUpNotes
        ? `${notes}\n\nFollow-up: ${followUpNotes}`
        : notes;

      const results = await Promise.allSettled([
        setFollowUp(lead.rowNumber, date, combinedNotes),
        logCall(lead.rowNumber, 'Follow Up', combinedNotes)
      ]);

      results.forEach((result, i) => {
        if (result.status === 'rejected') {
          console.error(`Follow-up operation ${i} failed:`, result.reason);
        }
      });

      window.location.href = '/';
    } catch (error) {
      console.error('Error setting follow-up:', error);
      setIsLogging(false);
    }
  };

  const handleDetailedOutcome = async (details: {
    objectionType: string;
    objectionDetails: string;
    competitorMention: string;
    interestLevel: string;
    lostReason: string;
  }) => {
    setIsLogging(true);
    try {
      await logDetailedOutcome(lead.rowNumber, outcomeType, {
        notes,
        pipelineStage: outcomeType === 'No Interest' ? 'Closed Lost' : lead.pipelineStage,
        objectionType: details.objectionType,
        objectionDetails: details.objectionDetails,
        competitorMention: details.competitorMention,
        interestLevel: details.interestLevel,
        lostReason: details.lostReason,
      });
      window.location.href = '/';
    } catch (error) {
      console.error('Error logging detailed outcome:', error);
      setIsLogging(false);
    }
  };

  const openOutcomeModal = (type: 'No Interest' | 'Follow Up') => {
    setOutcomeType(type);
    setShowOutcomeModal(true);
  };

  return (
    <div className="flex flex-col h-full">
      {/* AI Personalization Banner */}
      <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border-b border-yellow-700/30 p-3 md:p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-start gap-3 md:gap-6">
            <div className="flex-1">
              <div className="text-xs uppercase font-bold text-yellow-500 mb-1">AI Subject Line</div>
              <p className="text-yellow-100 font-medium text-sm md:text-base">
                {lead.aiSubjectLine || 'No subject line available'}
              </p>
            </div>
            <div className="flex-1">
              <div className="text-xs uppercase font-bold text-yellow-500 mb-1">AI Opening Hook</div>
              <p className="text-yellow-100 italic text-sm md:text-base">
                "{lead.aiOpeningHook || 'No hook available'}"
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="h-12 md:h-14 border-b border-neutral-800 flex items-center px-4 md:px-6 gap-2 md:gap-4 bg-neutral-900/50">
        <button
          onClick={() => setActiveTab('script')}
          className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-bold transition-all ${
            activeTab === 'script'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
          }`}
        >
          CLOSER
        </button>
        <button
          onClick={() => setActiveTab('objections')}
          className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-bold transition-all ${
            activeTab === 'objections'
              ? 'bg-red-600 text-white shadow-lg shadow-red-900/20'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
          }`}
        >
          Objections
        </button>
        <button
          onClick={() => setActiveTab('tools')}
          className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-bold transition-all ${
            activeTab === 'tools'
              ? 'bg-green-600 text-white shadow-lg shadow-green-900/20'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
          }`}
        >
          Tools
        </button>

        {/* CLOSER Progress Indicator */}
        {activeTab === 'script' && (
          <div className="hidden md:flex items-center gap-1 ml-4">
            {CLOSER_LETTERS.map((letter, i) => (
              <button
                key={letter}
                onClick={() => setCurrentStageIndex(i)}
                className={`w-7 h-7 rounded-full text-xs font-bold transition-all ${
                  i === currentStageIndex
                    ? 'bg-blue-600 text-white scale-110'
                    : i < currentStageIndex
                    ? 'bg-green-600/50 text-green-200'
                    : 'bg-neutral-800 text-neutral-500 hover:bg-neutral-700'
                }`}
              >
                {letter}
              </button>
            ))}
          </div>
        )}

        {/* Quick Info */}
        <div className="ml-auto flex items-center gap-2 md:gap-4 text-xs md:text-sm text-neutral-500">
          {lead.phone && (
            <a
              href={`tel:${lead.phone}`}
              className="flex items-center gap-1 hover:text-white transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span className="hidden md:inline">{lead.phone}</span>
            </a>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        {activeTab === 'script' && currentScript && (
          <div className="max-w-4xl mx-auto">
            {/* Stage Header with Navigation */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={goToPrevStage}
                disabled={currentStageIndex === 0}
                className="flex items-center gap-1 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden md:inline">Prev</span>
              </button>

              <div className="text-center">
                <h2 className="text-xl md:text-2xl font-bold text-white">{currentScript.title}</h2>
                <div className="flex items-center justify-center gap-3 mt-1">
                  {currentScript.duration && (
                    <span className="text-xs text-neutral-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {currentScript.duration}
                    </span>
                  )}
                  {currentScript.goal && (
                    <span className="text-xs text-blue-400 flex items-center gap-1">
                      <Target className="w-3 h-3" />
                      {currentScript.goal}
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={goToNextStage}
                disabled={currentStageIndex === scripts.length - 1}
                className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                <span className="hidden md:inline">Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile CLOSER Progress */}
            <div className="flex md:hidden items-center justify-center gap-1 mb-4">
              {CLOSER_LETTERS.map((letter, i) => (
                <button
                  key={letter}
                  onClick={() => setCurrentStageIndex(i)}
                  className={`w-8 h-8 rounded-full text-xs font-bold transition-all ${
                    i === currentStageIndex
                      ? 'bg-blue-600 text-white scale-110'
                      : i < currentStageIndex
                      ? 'bg-green-600/50 text-green-200'
                      : 'bg-neutral-800 text-neutral-500'
                  }`}
                >
                  {letter}
                </button>
              ))}
            </div>

            {/* Main Script Content */}
            <div className="bg-neutral-900/50 p-4 md:p-6 rounded-xl border border-neutral-800 mb-4">
              <div className="text-base md:text-lg leading-relaxed text-neutral-200">
                {processScript(currentScript.content).split('\n').map((line, i) => (
                  <p key={i} className={line === '' ? 'h-3 md:h-4' : ''}>
                    {line}
                  </p>
                ))}
              </div>
            </div>

            {/* Prompts/Tips for this Stage */}
            {currentScript.prompts && currentScript.prompts.length > 0 && (
              <div className="bg-yellow-900/10 border border-yellow-800/30 rounded-xl p-4">
                <h4 className="text-yellow-400 text-sm font-bold mb-3 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" />
                  Prompts & Tips
                </h4>
                <div className="space-y-2">
                  {currentScript.prompts.map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => copyPrompt(prompt, i)}
                      className="w-full text-left flex items-center justify-between p-2 bg-neutral-800/50 hover:bg-neutral-800 rounded-lg text-sm text-neutral-300 transition-colors group"
                    >
                      <span>{prompt}</span>
                      {copiedPrompt === i ? (
                        <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                      ) : (
                        <Copy className="w-4 h-4 text-neutral-600 group-hover:text-neutral-400 flex-shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'objections' && (
          <div className="max-w-4xl mx-auto">
            <div className="mb-4 p-3 bg-red-900/10 border border-red-800/20 rounded-lg">
              <p className="text-red-400 text-sm italic">
                Pre-frame these concerns BEFORE they become objections
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
              {objections.map((obj) => (
                <div
                  key={obj.id}
                  className="bg-neutral-900 border border-neutral-800 p-4 md:p-5 rounded-xl hover:border-red-500/50 transition-colors"
                >
                  <h3 className="text-red-400 font-bold mb-2 flex items-center gap-2 text-sm md:text-base">
                    <HelpCircle className="w-4 h-4 flex-shrink-0" />
                    "{obj.objection}"
                  </h3>
                  {obj.preFrame && (
                    <p className="text-yellow-400 text-xs mb-2 italic">
                      Pre-frame: "{obj.preFrame}"
                    </p>
                  )}
                  <p className="text-neutral-300 text-xs md:text-sm whitespace-pre-wrap">
                    {obj.response}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'tools' && (
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column: Data Cards */}
              <div>
                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-green-400" />
                  Data Cards
                </h3>
                <DataCards />
              </div>

              {/* Right Column: Vacation Statements */}
              <div>
                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-purple-400" />
                  Quick Reference
                </h3>
                <VacationStatements />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Notes + Pipeline Section */}
      <div className="border-t border-neutral-800 p-3 md:p-4 bg-neutral-900/50 space-y-4">
        <div className="max-w-4xl mx-auto">
          <label className="text-xs uppercase text-neutral-500 font-bold mb-2 block">Call Notes</label>
          <textarea
            className="w-full h-20 md:h-24 bg-neutral-950 border border-neutral-700 rounded-lg p-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none"
            placeholder="Type notes from the call here..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        {/* Pipeline Selector */}
        <div className="max-w-4xl mx-auto">
          <PipelineSelector
            rowNumber={lead.rowNumber}
            currentStage={lead.pipelineStage}
          />
        </div>
      </div>

      {/* Action Bar - Mobile Responsive Grid */}
      <div className="border-t border-neutral-800 bg-neutral-900 p-3 md:p-4">
        <div className="max-w-4xl mx-auto">
          {/* Mobile: 2x3 grid, Desktop: flex row */}
          <div className="grid grid-cols-2 md:flex md:flex-row gap-2 md:gap-2 md:justify-end">
            <button
              onClick={() => handleOutcome('Booked')}
              disabled={isLogging}
              className="bg-green-600 hover:bg-green-500 text-white px-4 py-3 md:py-2 rounded-xl md:rounded-lg font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 min-h-[48px] md:min-h-0"
            >
              <Check className="w-5 h-5 md:w-4 md:h-4" />
              <span>Booked</span>
            </button>
            <button
              onClick={() => setShowFollowUpModal(true)}
              disabled={isLogging}
              className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-3 md:py-2 rounded-xl md:rounded-lg font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 min-h-[48px] md:min-h-0"
            >
              <Calendar className="w-5 h-5 md:w-4 md:h-4" />
              <span>Follow Up</span>
            </button>
            <button
              onClick={() => handleOutcome('Voicemail')}
              disabled={isLogging}
              className="bg-neutral-700 hover:bg-neutral-600 text-white px-4 py-3 md:py-2 rounded-xl md:rounded-lg font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 min-h-[48px] md:min-h-0"
            >
              <Voicemail className="w-5 h-5 md:w-4 md:h-4" />
              <span>Voicemail</span>
            </button>
            <button
              onClick={() => openOutcomeModal('No Interest')}
              disabled={isLogging}
              className="bg-neutral-700 hover:bg-neutral-600 text-white px-4 py-3 md:py-2 rounded-xl md:rounded-lg font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 min-h-[48px] md:min-h-0"
            >
              <X className="w-5 h-5 md:w-4 md:h-4" />
              <span>Not Int.</span>
            </button>
            <button
              onClick={() => handleOutcome('Bad Data')}
              disabled={isLogging}
              className="col-span-2 md:col-span-1 bg-red-900/50 hover:bg-red-900 text-red-200 px-4 py-3 md:py-2 rounded-xl md:rounded-lg font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 border border-red-800 min-h-[48px] md:min-h-0"
            >
              <AlertTriangle className="w-5 h-5 md:w-4 md:h-4" />
              <span>Bad Data</span>
            </button>
          </div>
        </div>
      </div>

      {/* Follow-Up Modal */}
      <FollowUpModal
        isOpen={showFollowUpModal}
        onClose={() => setShowFollowUpModal(false)}
        onConfirm={handleFollowUp}
        leadName={lead.name}
      />

      {/* Outcome Modal (for Not Interested) */}
      <OutcomeModal
        isOpen={showOutcomeModal}
        onClose={() => setShowOutcomeModal(false)}
        onConfirm={handleDetailedOutcome}
        leadName={lead.name}
        outcome={outcomeType}
      />
    </div>
  );
}
