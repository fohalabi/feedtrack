import type { Feedback } from '../../types';

const STORAGE_KEY = 'feedtrack_data';

export const loadFeedbacks = (): Feedback[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to load feedback data');
      return [];
    }
  }
  return [];
};

export const saveFeedbacks = (feedbacks: Feedback[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(feedbacks));
};