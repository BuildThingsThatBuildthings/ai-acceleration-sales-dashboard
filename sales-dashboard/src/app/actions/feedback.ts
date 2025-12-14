'use server';

import { revalidatePath } from 'next/cache';

// Feedback now stored in memory (or could be added to Google Sheet later)
const feedbackStore: Array<{ type: string; content: string; timestamp: Date }> = [];

export async function submitFeedback(type: string, content: string, sourceLeadId?: number) {
  feedbackStore.push({
    type,
    content,
    timestamp: new Date()
  });
  console.log('Feedback submitted:', { type, content, sourceLeadId });
  revalidatePath('/');
}

export async function getFeedback() {
  return feedbackStore;
}
