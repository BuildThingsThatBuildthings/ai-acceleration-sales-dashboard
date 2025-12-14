'use client';

import { useState } from 'react';
import { MessageSquarePlus, X, Send } from 'lucide-react';
import { submitFeedback } from '@/app/actions/feedback';

export default function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState('Objection');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    await submitFeedback(type, content);
    setIsSubmitting(false);
    setContent('');
    setIsOpen(false);
    // Could add toast here
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-500 text-white rounded-full p-4 shadow-xl shadow-blue-900/30 transition-all hover:scale-110 z-50 flex items-center gap-2 font-bold"
      >
        <MessageSquarePlus className="w-5 h-5" />
        Record Feedback
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 w-full max-w-md rounded-2xl shadow-2xl p-6 relative animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-neutral-500 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold mb-1">Capture Market Signal</h3>
            <p className="text-neutral-400 text-sm mb-6">What are you hearing from the field?</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-bold text-neutral-500 mb-2">Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Objection', 'Pain Point', 'Feature'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setType(t)}
                      className={`py-2 px-3 rounded-lg text-sm font-medium border transition-all ${
                        type === t 
                        ? 'bg-blue-600/20 border-blue-500 text-blue-400' 
                        : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:border-neutral-600'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase font-bold text-neutral-500 mb-2">Details</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="e.g., They said $500/mo is fine but they need an enterprise plan for 50 agents..."
                  className="w-full h-32 bg-neutral-950 border border-neutral-800 rounded-xl p-4 text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !content.trim()}
                className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : (
                  <>
                    <Send className="w-4 h-4" /> Save Insight
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
