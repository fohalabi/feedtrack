import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { Comment } from '../comments/Comment';
import type { Feedback } from '../../../types';
import { formatDate } from '../../utils/helpers';

interface FeedbackDetailProps {
  feedback: Feedback;
  onBack: () => void;
  onEdit: () => void;
  onUpvote: (id: string) => void;
  onAddComment: (feedbackId: string, commentText: string) => void;
  userId: string;
}

export const FeedbackDetail: React.FC<FeedbackDetailProps> = ({ 
  feedback, 
  onBack, 
  onEdit, 
  onUpvote,
  onAddComment,
  userId 
}) => {
  const [commentText, setCommentText] = useState('');
  const [author, setAuthor] = useState('');
  const hasUpvoted = feedback.upvotedBy.includes(userId);

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim() && author.trim()) {
      // Store author name for future use
      localStorage.setItem('feedtrack_author', author);
      onAddComment(feedback.id, commentText);
      setCommentText('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto"
    >
      <button
        onClick={onBack}
        className="mb-6 text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
      >
        ← Back to Feedback
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="flex sm:flex-col items-center sm:items-start gap-3">
            <motion.button
              whileTap={{ scale: 1.2 }}
              onClick={() => onUpvote(feedback.id)}
              className={`flex flex-col items-center justify-center px-4 py-3 rounded-lg transition-colors ${
                hasUpvoted 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span className="text-2xl">⬆</span>
              <span className="text-sm font-semibold mt-1">{feedback.upvotes}</span>
            </motion.button>
            <span className="text-xs text-gray-500 sm:mt-2">upvotes</span>
          </div>

          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-3xl font-bold text-slate-900">{feedback.title}</h1>
              <Button onClick={onEdit} variant="secondary" className="ml-4">
                Edit
              </Button>
            </div>
            
            <span className="inline-block px-3 py-1 bg-blue-50 border border-blue-200 text-blue-700 text-sm font-medium rounded-full mb-4">
              {feedback.category}
            </span>
            
            <p className="text-gray-700 leading-relaxed mb-4">
              {feedback.description}
            </p>

            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>💬 {feedback.comments.length} comments</span>
              <span>•</span>
              <span>{formatDate(feedback.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h2 className="text-xl font-bold text-slate-900 mb-6">
          💬 Comments ({feedback.comments.length})
        </h2>

        <div className="space-y-4 mb-8">
          {feedback.comments.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No comments yet. Be the first to comment!
            </p>
          ) : (
            feedback.comments.map((comment, index) => (
              <Comment key={comment.id} comment={comment} index={index} />
            ))
          )}
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">💭 Add a Comment</h3>
          <form onSubmit={handleSubmitComment} className="space-y-4">
            <div>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Your name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Type your comment here..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                required
              />
            </div>
            <Button 
              type="submit" 
              variant="primary"
              disabled={!commentText.trim() || !author.trim()}
            >
              Post Comment
            </Button>
          </form>
        </div>
      </div>
    </motion.div>
  );
};