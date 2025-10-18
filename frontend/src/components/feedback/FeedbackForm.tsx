import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import type { Feedback } from '../../../types';

interface FeedbackFormProps {
  initialData?: Feedback;
  onSubmit: (data: { title: string; description: string; category: string }) => void;
  onCancel: () => void;
  onDelete?: () => void;
  isEdit?: boolean;
}

export const FeedbackForm: React.FC<FeedbackFormProps> = ({ 
  initialData, 
  onSubmit, 
  onCancel, 
  onDelete,
  isEdit = false 
}) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [category, setCategory] = useState(initialData?.category || 'Feature');
  const [errors, setErrors] = useState<{ title?: string; description?: string }>({});

  const categories = ['Feature', 'Bug', 'Enhancement', 'UI/UX', 'Other'];

  const validate = () => {
    const newErrors: { title?: string; description?: string } = {};
    
    if (title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    } else if (title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }
    
    if (description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    } else if (description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({ title, description, category });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          {isEdit ? 'Edit Feedback' : 'Add New Feedback'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Brief title for your feedback"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">{title.length}/100</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide detailed information about your feedback..."
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">{description.length}/500</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button type="submit" variant="primary" className="flex-1">
              {isEdit ? 'Save Changes' : 'Add Feedback'}
            </Button>
            <Button onClick={onCancel} variant="secondary" className="flex-1">
              Cancel
            </Button>
          </div>

          {isEdit && onDelete && (
            <div className="pt-4 border-t border-gray-200">
              <Button onClick={onDelete} variant="danger" className="w-full">
                Delete Feedback
              </Button>
            </div>
          )}
        </form>
      </div>
    </motion.div>
  );
};