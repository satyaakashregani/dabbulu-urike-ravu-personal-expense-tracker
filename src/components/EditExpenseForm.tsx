import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { Expense } from '../types';
import { defaultCategories } from '../data/categories';
import { suggestCategory } from '../utils/categorization';

interface EditExpenseFormProps {
  expense: Expense;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updates: Partial<Expense>) => void;
}

export const EditExpenseForm: React.FC<EditExpenseFormProps> = ({
  expense,
  isOpen,
  onClose,
  onUpdate
}) => {
  const [formData, setFormData] = useState({
    amount: expense.amount.toString(),
    paymentMethod: expense.paymentMethod,
    categoryId: expense.categoryId,
    note: expense.note || '',
    date: expense.date
  });

  const [suggestedCategoryId, setSuggestedCategoryId] = useState<string | null>(null);

  useEffect(() => {
    if (formData.note) {
      const suggested = suggestCategory(formData.note);
      setSuggestedCategoryId(suggested);
    } else {
      setSuggestedCategoryId(null);
    }
  }, [formData.note]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.amount && formData.categoryId) {
      onUpdate({
        amount: parseFloat(formData.amount),
        paymentMethod: formData.paymentMethod,
        categoryId: formData.categoryId,
        note: formData.note || undefined,
        date: formData.date
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-70 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Edit Expense</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Amount (₹)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Payment Method
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['UPI', 'Wallet', 'Cash', 'Card'] as const).map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, paymentMethod: method }))}
                  className={`px-3 py-2 text-sm rounded-lg font-medium transition-colors ${
                    formData.paymentMethod === method
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Note (Optional)
            </label>
            <input
              type="text"
              value={formData.note}
              onChange={(e) => setFormData(prev => ({ ...prev, note: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Merchant, description..."
            />
            {suggestedCategoryId && suggestedCategoryId !== formData.categoryId && (
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                Suggestion: Switch to {defaultCategories.find(c => c.id === suggestedCategoryId)?.name}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
              {defaultCategories.map((category) => {
                const IconComponent = (LucideIcons as any)[category.icon];
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, categoryId: category.id }))}
                    className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                      formData.categoryId === category.id
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    } ${suggestedCategoryId === category.id ? 'ring-2 ring-blue-400' : ''}`}
                  >
                    <IconComponent size={16} />
                    <span className="truncate">{category.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!formData.amount || !formData.categoryId}
              className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white px-4 py-3 rounded-lg transition-colors font-medium"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};