'use client';

import { useState } from 'react';
import { PIPELINE_STAGES } from '@/lib/constants';
import { changePipelineStage } from '@/app/actions';

interface PipelineSelectorProps {
  rowNumber: number;
  currentStage: string;
}

const STAGE_COLORS: Record<string, string> = {
  'First Contact': 'bg-neutral-600 border-neutral-500',
  'Interested': 'bg-blue-600 border-blue-500',
  'Demo Scheduled': 'bg-purple-600 border-purple-500',
  'Negotiating': 'bg-orange-600 border-orange-500',
  'Closed Won': 'bg-green-600 border-green-500',
  'Closed Lost': 'bg-red-600 border-red-500',
};

const STAGE_COLORS_INACTIVE: Record<string, string> = {
  'First Contact': 'hover:bg-neutral-800 hover:border-neutral-600',
  'Interested': 'hover:bg-blue-900/30 hover:border-blue-700',
  'Demo Scheduled': 'hover:bg-purple-900/30 hover:border-purple-700',
  'Negotiating': 'hover:bg-orange-900/30 hover:border-orange-700',
  'Closed Won': 'hover:bg-green-900/30 hover:border-green-700',
  'Closed Lost': 'hover:bg-red-900/30 hover:border-red-700',
};

export default function PipelineSelector({ rowNumber, currentStage }: PipelineSelectorProps) {
  const [activeStage, setActiveStage] = useState(currentStage || 'First Contact');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStageChange = async (stage: string) => {
    if (stage === activeStage || isUpdating) return;

    setIsUpdating(true);
    setActiveStage(stage);

    try {
      await changePipelineStage(rowNumber, stage);
    } catch (error) {
      console.error('Failed to update pipeline stage:', error);
      setActiveStage(currentStage);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-xs uppercase text-neutral-500 font-bold block">
        Pipeline Stage
      </label>
      <div className="flex flex-wrap gap-2">
        {PIPELINE_STAGES.map((stage) => {
          const isActive = activeStage === stage;
          const colorClass = isActive
            ? STAGE_COLORS[stage]
            : STAGE_COLORS_INACTIVE[stage];

          return (
            <button
              key={stage}
              onClick={() => handleStageChange(stage)}
              disabled={isUpdating}
              className={`px-3 py-1.5 rounded-full text-xs font-bold border-2 transition-all disabled:opacity-50 ${
                isActive
                  ? `${colorClass} text-white`
                  : `bg-neutral-900 border-neutral-700 text-neutral-400 ${colorClass}`
              }`}
            >
              {stage}
            </button>
          );
        })}
      </div>
    </div>
  );
}
