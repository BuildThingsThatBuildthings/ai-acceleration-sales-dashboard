'use client';

import { useState } from 'react';
import { X, Calendar, Clock } from 'lucide-react';
import { format, addDays } from 'date-fns';

interface FollowUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (date: string, notes: string) => void;
  leadName: string;
}

export default function FollowUpModal({ isOpen, onClose, onConfirm, leadName }: FollowUpModalProps) {
  const [selectedDate, setSelectedDate] = useState(format(addDays(new Date(), 1), 'yyyy-MM-dd'));
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const quickDates = [
    { label: 'Tomorrow', date: addDays(new Date(), 1) },
    { label: 'In 2 days', date: addDays(new Date(), 2) },
    { label: 'In 1 week', date: addDays(new Date(), 7) },
    { label: 'In 2 weeks', date: addDays(new Date(), 14) },
  ];

  const handleConfirm = () => {
    onConfirm(selectedDate, notes);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-neutral-900 border border-neutral-700 rounded-xl w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-purple-600/20 p-2 rounded-lg">
              <Calendar className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="font-bold text-white">Schedule Follow-Up</h3>
              <p className="text-sm text-neutral-400">{leadName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-white p-1 hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Quick Date Buttons */}
          <div>
            <label className="text-xs uppercase font-bold text-neutral-500 mb-2 block">Quick Select</label>
            <div className="grid grid-cols-2 gap-2">
              {quickDates.map((qd) => (
                <button
                  key={qd.label}
                  onClick={() => setSelectedDate(format(qd.date, 'yyyy-MM-dd'))}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all border ${
                    selectedDate === format(qd.date, 'yyyy-MM-dd')
                      ? 'bg-purple-600 border-purple-500 text-white'
                      : 'bg-neutral-800 border-neutral-700 text-neutral-300 hover:border-purple-500/50'
                  }`}
                >
                  {qd.label}
                </button>
              ))}
            </div>
          </div>

          {/* Date Picker */}
          <div>
            <label className="text-xs uppercase font-bold text-neutral-500 mb-2 block">Or Pick a Date</label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={format(new Date(), 'yyyy-MM-dd')}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg pl-10 pr-4 py-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs uppercase font-bold text-neutral-500 mb-2 block">Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add a reminder note for this follow-up..."
              className="w-full h-20 bg-neutral-800 border border-neutral-700 rounded-lg p-3 text-sm text-white placeholder-neutral-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-800 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg text-sm font-medium bg-neutral-800 text-neutral-300 hover:bg-neutral-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 px-4 py-2 rounded-lg text-sm font-medium bg-purple-600 text-white hover:bg-purple-500 transition-colors flex items-center justify-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            Schedule for {format(new Date(selectedDate), 'MMM d')}
          </button>
        </div>
      </div>
    </div>
  );
}
