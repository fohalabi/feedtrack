import React from 'react';
import { motion } from 'framer-motion';
import type { Feedback } from '../../../types';

interface FeedbackCardProps {
  feedback: Feedback;
  onClick: () => void;
  onUpvote: (id: string) => void;
  userId: string;
}

export const FeedbackCard: React.FC<FeedbackCardProps> = ({ 
  feedback, 
  onClick, 
  onUpvote, 
  userId 
}) => {
  const hasUpvoted = feedback.upvotedBy.includes(userId);

  const handleUpvote = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpvote(feedback.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
      onClick={onClick}
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 cursor-pointer transition-all"
    >
      <div className="flex items-start gap-4">
        {/* Upvote Button */}
        <motion.button
          whileTap={{ scale: 1.2 }}
          onClick={handleUpvote}
          className={`flex flex-col items-center justify-center min-w-[50px] px-3 py-2 rounded-lg transition-colors ${
            hasUpvoted 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <span className="text-xl">⬆</span>
          <span className="text-sm font-semibold mt-1">{feedback.upvotes}</span>
        </motion.button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-slate-900 mb-2 hover:text-blue-600 transition-colors">
            {feedback.title}
          </h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {feedback.description}
          </p>
          
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="px-3 py-1 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-medium rounded-full">
              {feedback.category}
            </span>

            <div className="flex items-center gap-1 text-gray-500 text-sm">
              <span>💬</span>
              <span>{feedback.comments.length}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};