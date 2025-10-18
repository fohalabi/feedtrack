import React from 'react';
import { motion } from 'framer-motion';
import { FeedbackCard } from './FeedbackCard';
import { Button } from '../ui/button';
import type { Feedback } from '../../../types';

interface FeedbackListProps {
  feedbacks: Feedback[];
  onFeedbackClick: (id: string) => void;
  onUpvote: (id: string) => void;
  onAddClick: () => void;
  userId: string;
}

export const FeedbackList: React.FC<FeedbackListProps> = ({ 
  feedbacks, 
  onFeedbackClick, 
  onUpvote, 
  onAddClick,
  userId 
}) => {
  if (feedbacks.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-20 px-4"
      >
        <div className="text-6xl mb-4">🗒</div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">No feedback yet</h2>
        <p className="text-gray-600 mb-6">Be the first to suggest an improvement!</p>
        <Button onClick={onAddClick} variant="primary">
          + Add Feedback
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      {feedbacks.map((feedback, index) => (
        <motion.div
          key={feedback.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <FeedbackCard
            feedback={feedback}
            onClick={() => onFeedbackClick(feedback.id)}
            onUpvote={onUpvote}
            userId={userId}
          />
        </motion.div>
      ))}
    </div>
  );
};