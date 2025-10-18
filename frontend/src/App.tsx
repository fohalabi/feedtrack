import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from './components/layout/Navbar';
import { FeedbackList } from './components/feedback/FeedbackList';
import { FeedbackForm } from './components/feedback/FeedbackForm';
import { FeedbackDetail } from './components/feedback/FeedbackDetails';
import { Toast } from './components/ui/toast';
import type { Feedback, SortOption, Page, Comment as CommentType } from '../types';
import { generateId } from './utils/helpers';
import { getUserId } from './utils/userTracking';
import { loadFeedbacks, saveFeedbacks } from './utils/storage';

export default function App() {
  
  // ========== STATE MANAGEMENT ==========
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedFeedbackId, setSelectedFeedbackId] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [toast, setToast] = useState<string | null>(null);
  const [userId] = useState(getUserId()); // Get persistent user ID

  // ========== LOAD DATA FROM LOCALSTORAGE ON MOUNT ==========
  useEffect(() => {
    const loadedFeedbacks = loadFeedbacks();
    setFeedbacks(loadedFeedbacks);
  }, []);

  // ========== PERSIST DATA TO LOCALSTORAGE ==========
  // Save whenever feedbacks array changes
  useEffect(() => {
    if (feedbacks.length > 0) {
      saveFeedbacks(feedbacks);
    }
  }, [feedbacks]);

  const sortedFeedbacks = [...feedbacks].sort((a, b) => {
    if (sortOption === 'mostUpvoted') {
      return b.upvotes - a.upvotes;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
  // ========== FEEDBACK HANDLERS ==========
  const handleAddFeedback = (data: { title: string; description: string; category: string }) => {
    const newFeedback: Feedback = {
      id: generateId(),
      ...data,
      upvotes: 0,
      comments: [],
      createdAt: new Date().toISOString(),
      upvotedBy: []
    };
    setFeedbacks([newFeedback, ...feedbacks]);
    setCurrentPage('home');
    showToast('Feedback added successfully!');
  };

  /**
   * Edit existing feedback
   * Updates feedback with matching ID
   */
  const handleEditFeedback = (data: { title: string; description: string; category: string }) => {
    setFeedbacks(feedbacks.map(f => 
      f.id === selectedFeedbackId 
        ? { ...f, ...data }
        : f
    ));
    setCurrentPage('detail');
    showToast('Feedback updated successfully!');
  };

  /**
   * Delete feedback
   * Removes feedback from array after confirmation
   */
  const handleDeleteFeedback = () => {
    if (confirm('Are you sure you want to delete this feedback?')) {
      setFeedbacks(feedbacks.filter(f => f.id !== selectedFeedbackId));
      setCurrentPage('home');
      setSelectedFeedbackId(null);
      showToast('Feedback deleted successfully!');
    }
  };

  /**
   * Toggle upvote on feedback
   * Implements optimistic update for instant UI feedback
   * Tracks user ID to prevent multiple upvotes
   */
  const handleUpvote = (feedbackId: string) => {
    setFeedbacks(feedbacks.map(f => {
      if (f.id === feedbackId) {
        const hasUpvoted = f.upvotedBy.includes(userId);
        return {
          ...f,
          upvotes: hasUpvoted ? f.upvotes - 1 : f.upvotes + 1,
          upvotedBy: hasUpvoted 
            ? f.upvotedBy.filter(id => id !== userId) // Remove upvote
            : [...f.upvotedBy, userId] // Add upvote
        };
      }
      return f;
    }));
  };

  /**
   * Add comment to feedback
   * Creates new comment and adds to feedback's comments array
   */
  const handleAddComment = (feedbackId: string, commentText: string) => {
    // Get stored author name or use default
    const storedAuthor = localStorage.getItem('feedtrack_author') || 'Anonymous';
    
    const newComment: CommentType = {
      id: generateId(),
      author: storedAuthor,
      text: commentText,
      createdAt: new Date().toISOString()
    };

    setFeedbacks(feedbacks.map(f => 
      f.id === feedbackId 
        ? { ...f, comments: [...f.comments, newComment] }
        : f
    ));
    
    showToast('Comment added!');
  };

  // ========== NAVIGATION HANDLERS ==========
  
  /**
   * Navigate to feedback detail page
   */
  const handleFeedbackClick = (id: string) => {
    setSelectedFeedbackId(id);
    setCurrentPage('detail');
  };

  /**
   * Navigate back to home page
   */
  const handleBackToHome = () => {
    setCurrentPage('home');
    setSelectedFeedbackId(null);
  };

  /**
   * Navigate to edit page
   */
  const handleEditClick = () => {
    setCurrentPage('edit');
  };

  // ========== TOAST NOTIFICATION ==========
  /**
   * Show toast message
   */
  const showToast = (message: string) => {
    setToast(message);
  };

  // ========== GET SELECTED FEEDBACK ==========
  const selectedFeedback = feedbacks.find(f => f.id === selectedFeedbackId);

  // ========== RENDER ==========
  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* ===== NAVBAR ===== */}
      <Navbar
        sortOption={sortOption}
        onSortChange={setSortOption}
        onAddClick={() => setCurrentPage('add')}
        currentPage={currentPage}
      />

      {/* ===== MAIN CONTENT AREA ===== */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          
          {/* ===== HOME PAGE - Feedback List ===== */}
          {currentPage === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <FeedbackList
                feedbacks={sortedFeedbacks}
                onFeedbackClick={handleFeedbackClick}
                onUpvote={handleUpvote}
                onAddClick={() => setCurrentPage('add')}
                userId={userId}
              />
            </motion.div>
          )}

          {/* ===== ADD FEEDBACK PAGE ===== */}
          {currentPage === 'add' && (
            <motion.div
              key="add"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <FeedbackForm
                onSubmit={handleAddFeedback}
                onCancel={handleBackToHome}
              />
            </motion.div>
          )}

          {/* ===== FEEDBACK DETAIL PAGE ===== */}
          {currentPage === 'detail' && selectedFeedback && (
            <motion.div
              key="detail"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <FeedbackDetail
                feedback={selectedFeedback}
                onBack={handleBackToHome}
                onEdit={handleEditClick}
                onUpvote={handleUpvote}
                onAddComment={handleAddComment}
                userId={userId}
              />
            </motion.div>
          )}

          {/* ===== EDIT FEEDBACK PAGE ===== */}
          {currentPage === 'edit' && selectedFeedback && (
            <motion.div
              key="edit"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <FeedbackForm
                initialData={selectedFeedback}
                onSubmit={handleEditFeedback}
                onCancel={() => setCurrentPage('detail')}
                onDelete={handleDeleteFeedback}
                isEdit={true}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ===== TOAST NOTIFICATIONS ===== */}
      <AnimatePresence>
        {toast && (
          <Toast
            message={toast}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
