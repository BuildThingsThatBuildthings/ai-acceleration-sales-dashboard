'use client';

import { useState } from 'react';
import { EmailSequence } from '@/lib/emailTemplates';
import { Copy, Check, Mail, Clock } from 'lucide-react';

interface EmailPreviewProps {
  sequence: EmailSequence;
  selected: boolean;
  onToggle: () => void;
}

export default function EmailPreview({ sequence, selected, onToggle }: EmailPreviewProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState<number | null>(null);

  const emails = [
    { label: 'Email 1', sublabel: 'The Hook', email: sequence.email1 },
    { label: 'Email 2', sublabel: 'The Downsell', email: sequence.email2 },
    { label: 'Email 3', sublabel: 'The Referral', email: sequence.email3 },
  ];

  const copyToClipboard = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopied(index);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className={`bg-neutral-900 rounded-xl border transition-colors ${
      selected ? 'border-blue-600' : 'border-neutral-800'
    }`}>
      {/* Header */}
      <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={selected}
            onChange={onToggle}
            className="w-4 h-4 rounded border-neutral-600 bg-neutral-700 text-blue-600 focus:ring-blue-500"
          />
          <div>
            <h4 className="text-white font-medium">{sequence.lead.name}</h4>
            <p className="text-neutral-500 text-sm">{sequence.lead.company}</p>
          </div>
        </div>
        <span className="text-neutral-500 text-sm font-mono">{sequence.lead.email}</span>
      </div>

      {/* Email Tabs */}
      <div className="flex border-b border-neutral-800">
        {emails.map((item, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === index
                ? 'text-blue-400 border-b-2 border-blue-400 -mb-px'
                : 'text-neutral-500 hover:text-white'
            }`}
          >
            <div>{item.label}</div>
            <div className="text-xs opacity-70">{item.sublabel}</div>
          </button>
        ))}
      </div>

      {/* Email Content */}
      <div className="p-4">
        {emails[activeTab] && (
          <div>
            {/* Subject Line */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-neutral-500 text-xs">Subject:</span>
                <button
                  onClick={() => copyToClipboard(emails[activeTab].email.subject, activeTab * 2)}
                  className="text-neutral-500 hover:text-blue-400 p-1"
                >
                  {copied === activeTab * 2 ? (
                    <Check className="w-3 h-3 text-green-400" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              </div>
              <div className="bg-neutral-800 rounded px-3 py-2 text-white text-sm">
                {emails[activeTab].email.subject}
              </div>
            </div>

            {/* Delay Badge */}
            {emails[activeTab].email.delay && (
              <div className="flex items-center gap-1 text-neutral-500 text-xs mb-2">
                <Clock className="w-3 h-3" />
                <span>Send {emails[activeTab].email.delay} after previous</span>
              </div>
            )}

            {/* Body */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-neutral-500 text-xs">Body:</span>
                <button
                  onClick={() => copyToClipboard(emails[activeTab].email.body, activeTab * 2 + 1)}
                  className="text-neutral-500 hover:text-blue-400 p-1"
                >
                  {copied === activeTab * 2 + 1 ? (
                    <Check className="w-3 h-3 text-green-400" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              </div>
              <div className="bg-neutral-800 rounded px-3 py-2 text-neutral-300 text-sm whitespace-pre-wrap max-h-48 overflow-y-auto">
                {emails[activeTab].email.body}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
