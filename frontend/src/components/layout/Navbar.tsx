import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import type { SortOption, Page } from '../../../types';

interface NavbarProps {
  sortOption: SortOption;
  onSortChange: (option: SortOption) => void;
  onAddClick: () => void;
  currentPage: Page;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  sortOption, 
  onSortChange, 
  onAddClick, 
  currentPage 
}) => {
  return (
    <>
      {/* Desktop Navbar */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <motion.h1 
                className="text-2xl font-bold text-slate-900 cursor-pointer"
                whileHover={{ scale: 1.02 }}
                onClick={() => window.location.reload()}
              >
                📋 FeedTrack
              </motion.h1>
            </div>

            {/* Right side: Sort + Add Button */}
            {currentPage === 'home' && (
              <div className="hidden md:flex items-center gap-4">
                <select
                  value={sortOption}
                  onChange={(e) => onSortChange(e.target.value as SortOption)}
                  className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="newest">Newest</option>
                  <option value="mostUpvoted">Most Upvoted</option>
                </select>

                <Button onClick={onAddClick} variant="primary">
                  + Add Feedback
                </Button>
              </div>
            )}
          </div>
        </div>
      </motion.nav>

      {/* Mobile Floating Action Button */}
      {currentPage === 'home' && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onAddClick}
          className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center text-2xl z-50"
        >
          +
        </motion.button>
      )}
    </>
  );
};