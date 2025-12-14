'use client';

import { useState } from 'react';
import { Calculator, Clock, TrendingUp, Copy, Check } from 'lucide-react';
import { calculateROI, calculateHoursLost, TIME_SAVINGS, CREDIBILITY_ANCHORS } from '@/lib/callScriptData';

export default function DataCards() {
  const [agents, setAgents] = useState(10);
  const [hoursPerWeek, setHoursPerWeek] = useState(5);
  const [copied, setCopied] = useState<string | null>(null);

  const roi = calculateROI(hoursPerWeek, agents);
  const hoursLost = calculateHoursLost(hoursPerWeek, agents);

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const roiStatement = `${agents} agents × ${hoursPerWeek} hours × $50/hour × 52 weeks = $${roi.annualValue.toLocaleString()} in recovered time. The workshop is ${Math.round((5000 / roi.annualValue) * 100)}% of that.`;

  return (
    <div className="space-y-4">
      {/* ROI Calculator */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-4">
          <Calculator className="w-5 h-5 text-green-400" />
          <h3 className="text-white font-bold">ROI Calculator</h3>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-xs text-neutral-500 block mb-1">Agents</label>
            <input
              type="number"
              value={agents}
              onChange={(e) => setAgents(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white text-sm focus:border-green-500 outline-none"
            />
          </div>
          <div>
            <label className="text-xs text-neutral-500 block mb-1">Hours/Week Saved</label>
            <input
              type="number"
              value={hoursPerWeek}
              onChange={(e) => setHoursPerWeek(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white text-sm focus:border-green-500 outline-none"
            />
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-green-900/20 border border-green-800/30 rounded-lg p-3">
            <div className="text-2xl font-bold text-green-400">${roi.annualValue.toLocaleString()}</div>
            <div className="text-xs text-neutral-500">Annual Value</div>
          </div>
          <div className="bg-green-900/20 border border-green-800/30 rounded-lg p-3">
            <div className="text-2xl font-bold text-green-400">{roi.roi}:1</div>
            <div className="text-xs text-neutral-500">ROI (Year 1)</div>
          </div>
          <div className="bg-neutral-800 rounded-lg p-3">
            <div className="text-xl font-bold text-white">${roi.monthlyValue.toLocaleString()}</div>
            <div className="text-xs text-neutral-500">Monthly Value</div>
          </div>
          <div className="bg-neutral-800 rounded-lg p-3">
            <div className="text-xl font-bold text-white">{roi.paybackMonths} mo</div>
            <div className="text-xs text-neutral-500">Payback Period</div>
          </div>
        </div>

        {/* Copy Button */}
        <button
          onClick={() => copyToClipboard(roiStatement, 'roi')}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg text-sm transition-colors"
        >
          {copied === 'roi' ? (
            <>
              <Check className="w-4 h-4 text-green-400" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copy ROI Statement</span>
            </>
          )}
        </button>
      </div>

      {/* Hours Lost */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-5 h-5 text-orange-400" />
          <h3 className="text-white font-bold">Hours Lost to Admin</h3>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="text-center p-2 bg-neutral-800 rounded-lg">
            <div className="text-lg font-bold text-orange-400">{hoursLost.weekly}</div>
            <div className="text-xs text-neutral-500">Weekly</div>
          </div>
          <div className="text-center p-2 bg-neutral-800 rounded-lg">
            <div className="text-lg font-bold text-orange-400">{hoursLost.monthly}</div>
            <div className="text-xs text-neutral-500">Monthly</div>
          </div>
          <div className="text-center p-2 bg-orange-900/20 border border-orange-800/30 rounded-lg">
            <div className="text-lg font-bold text-orange-400">{hoursLost.annual.toLocaleString()}</div>
            <div className="text-xs text-neutral-500">Annual</div>
          </div>
        </div>

        <p className="text-xs text-neutral-400 italic">
          "That's {hoursLost.annual.toLocaleString()} hours a year going to admin instead of deals."
        </p>
      </div>

      {/* Time Savings Examples */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-5 h-5 text-blue-400" />
          <h3 className="text-white font-bold">Time Savings</h3>
        </div>

        <div className="space-y-2">
          {TIME_SAVINGS.slice(0, 4).map((item, i) => (
            <button
              key={i}
              onClick={() => copyToClipboard(`${item.task}: ${item.before} → ${item.after}`, `time-${i}`)}
              className="w-full flex items-center justify-between p-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-sm transition-colors group"
            >
              <span className="text-neutral-300">{item.task}</span>
              <span className="text-blue-400 font-mono">
                {item.before} → {item.after}
              </span>
              {copied === `time-${i}` && (
                <Check className="w-3 h-3 text-green-400 ml-2" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Credibility Anchors */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
        <h3 className="text-white font-bold mb-3">Quick Stats</h3>
        <div className="space-y-2">
          {CREDIBILITY_ANCHORS.map((anchor, i) => (
            <button
              key={i}
              onClick={() => copyToClipboard(anchor, `anchor-${i}`)}
              className="w-full text-left p-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-sm text-neutral-300 transition-colors flex items-center justify-between"
            >
              <span>{anchor}</span>
              {copied === `anchor-${i}` ? (
                <Check className="w-3 h-3 text-green-400 flex-shrink-0" />
              ) : (
                <Copy className="w-3 h-3 text-neutral-600 group-hover:text-neutral-400 flex-shrink-0" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
