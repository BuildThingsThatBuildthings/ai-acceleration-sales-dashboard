'use client';

import { useState, useEffect } from 'react';
import { Lead } from '@/lib/google';
import { validateEnrichmentForm, ValidationResult } from '@/lib/validation';
import { AlertCircle, CheckCircle, AlertTriangle, Save, SkipForward } from 'lucide-react';

interface EnrichmentFormProps {
  lead: Lead;
  onSave: (data: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    aiSubjectLine: string;
    aiOpeningHook: string;
  }) => Promise<void>;
  onSkip: () => void;
}

export default function EnrichmentForm({ lead, onSave, onSkip }: EnrichmentFormProps) {
  const [firstName, setFirstName] = useState(lead.firstName || '');
  const [lastName, setLastName] = useState(lead.lastName || '');
  const [phone, setPhone] = useState(lead.phone || '');
  const [email, setEmail] = useState(lead.email || '');
  const [aiSubjectLine, setAiSubjectLine] = useState(lead.aiSubjectLine || '');
  const [aiOpeningHook, setAiOpeningHook] = useState(lead.aiOpeningHook || '');
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [saving, setSaving] = useState(false);

  // Validate on change
  useEffect(() => {
    const result = validateEnrichmentForm({
      firstName,
      lastName,
      email,
      aiSubjectLine,
      aiOpeningHook,
    });
    setValidation(result);
  }, [firstName, lastName, email, aiSubjectLine, aiOpeningHook]);

  const handleSave = async () => {
    if (!validation?.valid) return;

    setSaving(true);
    try {
      await onSave({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        aiSubjectLine: aiSubjectLine.trim(),
        aiOpeningHook: aiOpeningHook.trim(),
      });
    } finally {
      setSaving(false);
    }
  };

  const inputClass = (hasError: boolean) =>
    `w-full bg-neutral-800 border rounded-lg px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 transition-colors ${
      hasError
        ? 'border-red-600 focus:ring-red-500'
        : 'border-neutral-700 focus:ring-blue-500'
    }`;

  return (
    <div className="space-y-6">
      {/* Lead Info Header */}
      <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">{lead.company}</h3>
            <p className="text-neutral-400 text-sm">{lead.city}, {lead.state}</p>
          </div>
          <span className="text-neutral-500 text-sm">Row {lead.rowNumber}</span>
        </div>
      </div>

      {/* Form Fields */}
      <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6 space-y-5">
        {/* Name Row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-neutral-400 text-sm mb-1.5">First Name *</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="e.g., John"
              className={inputClass(!firstName || firstName.length < 2)}
            />
          </div>
          <div>
            <label className="block text-neutral-400 text-sm mb-1.5">Last Name *</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="e.g., Smith"
              className={inputClass(!lastName || lastName.length < 2)}
            />
          </div>
        </div>

        {/* Contact Row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-neutral-400 text-sm mb-1.5">Phone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g., (502) 555-1234"
              className={inputClass(false)}
            />
          </div>
          <div>
            <label className="block text-neutral-400 text-sm mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g., john@company.com"
              className={inputClass(email.includes('info@') || email.includes('contact@'))}
            />
            {email && (email.includes('info@') || email.includes('contact@')) && (
              <p className="text-orange-400 text-xs mt-1">Generic email - find personal address</p>
            )}
          </div>
        </div>

        {/* Subject Line */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-neutral-400 text-sm">AI Subject Line *</label>
            <span className={`text-xs ${aiSubjectLine.length > 60 ? 'text-orange-400' : 'text-neutral-500'}`}>
              {aiSubjectLine.length}/60
            </span>
          </div>
          <input
            type="text"
            value={aiSubjectLine}
            onChange={(e) => setAiSubjectLine(e.target.value)}
            placeholder="e.g., Congrats on the 25-year milestone, John"
            className={inputClass(!aiSubjectLine)}
          />
          <p className="text-neutral-500 text-xs mt-1">
            Reference something specific: name, achievement, milestone, award
          </p>
        </div>

        {/* Opening Hook */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-neutral-400 text-sm">AI Opening Hook *</label>
            <span className={`text-xs ${aiOpeningHook.length > 300 ? 'text-orange-400' : 'text-neutral-500'}`}>
              {aiOpeningHook.length}/300
            </span>
          </div>
          <textarea
            value={aiOpeningHook}
            onChange={(e) => setAiOpeningHook(e.target.value)}
            placeholder="e.g., I saw that ABC Realty just hit $50M in sales volume this year—incredible growth for a team of 15 agents."
            rows={4}
            className={inputClass(!aiOpeningHook)}
          />
          <p className="text-neutral-500 text-xs mt-1">
            Include verifiable facts: sales volume, agent count, years in business, awards
          </p>
        </div>
      </div>

      {/* Validation Status */}
      {validation && (
        <div className={`rounded-xl border p-4 ${
          validation.valid
            ? 'bg-green-900/20 border-green-800/30'
            : 'bg-red-900/20 border-red-800/30'
        }`}>
          <div className="flex items-start gap-3">
            {validation.valid ? (
              <CheckCircle className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <p className={`font-medium ${validation.valid ? 'text-green-400' : 'text-red-400'}`}>
                {validation.valid ? 'Ready to save' : 'Fix issues before saving'}
              </p>
              {validation.errors.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {validation.errors.map((error, i) => (
                    <li key={i} className="text-red-400 text-sm flex items-start gap-2">
                      <span className="text-red-500">•</span>
                      {error}
                    </li>
                  ))}
                </ul>
              )}
              {validation.warnings.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {validation.warnings.map((warning, i) => (
                    <li key={i} className="text-yellow-400 text-sm flex items-start gap-2">
                      <AlertTriangle className="w-3 h-3 mt-0.5 shrink-0" />
                      {warning}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={onSkip}
          className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors"
        >
          <SkipForward className="w-4 h-4" />
          Skip
        </button>
        <button
          onClick={handleSave}
          disabled={!validation?.valid || saving}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-neutral-700 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
        >
          {saving ? (
            <>Saving...</>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save & Next
            </>
          )}
        </button>
      </div>
    </div>
  );
}
