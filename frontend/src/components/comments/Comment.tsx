import React from 'react';
import { motion } from 'framer-motion';
import type { Comment as CommentType } from '../../../types';
import { formatDate } from '../../utils/helpers';

interface CommentProps {
  comment: CommentType;
  index: number;
}

export const Comment: React.FC<CommentProps> = ({ comment, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-gray-50 rounded-lg p-4 border border-gray-200"
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
          {comment.author.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-slate-900 text-sm">{comment.author}</span>
            <span className="text-xs text-gray-500">{formatDate(comment.createdAt)}</span>
          </div>
          <p className="text-gray-700 text-sm">{comment.text}</p>
        </div>
      </div>
    </motion.div>
  );
};