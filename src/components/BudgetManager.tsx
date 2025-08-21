import React, { useState } from 'react';
import { PiggyBank, Edit2, Check, X } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { Budget, Expense } from '../types';
import { defaultCategories } from '../data/categories';
import { getCurrentMonth } from '../utils/date';
import { EmptyState } from './EmptyState';

interface BudgetManagerProps {
  budgets: Budget[];
  expenses: Expense[];
  userId: string;
  onUpdateBudget: (categoryId: string, monthlyLimit: number) => void;
}

export const BudgetManager: React.FC<BudgetManagerProps> = ({
  budgets,
  expenses,
  userId,
  onUpdateBudget
}) => {
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState('');

  const currentMonth = getCurrentMonth();
  const monthExpenses = expenses.filter(e => e.date.startsWith(currentMonth));

  const categoryBudgets = defaultCategories.map(category => {
    const budget = budgets.find(b => b.categoryId === category.id);
    const spent = monthExpenses
      .filter(e => e.categoryId === category.id)
      .reduce((sum, e) => sum + e.amount, 0);
    
    const percentage = budget?.monthlyLimit ? (spent / budget.monthlyLimit) * 100 : 0;
    
    return {
      category,
      budget,
      spent,
      percentage,
      remaining: budget ? budget.monthlyLimit - spent : 0
    };
  });

  const handleEdit = (categoryId: string, currentLimit: number = 0) => {
    setEditingCategory(categoryId);
    setEditAmount(currentLimit.toString());
  };

  const handleSave = () => {
    if (editingCategory && editAmount) {
      onUpdateBudget(editingCategory, parseFloat(editAmount));
      setEditingCategory(null);
      setEditAmount('');
    }
  };

  const handleCancel = () => {
    setEditingCategory(null);
    setEditAmount('');
  };

  const activeBudgets = categoryBudgets.filter(cb => cb.budget);

  if (activeBudgets.length === 0) {
    return <EmptyState type="budgets" onAction={() => handleEdit(defaultCategories[0].id)} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <PiggyBank className="text-teal-600" size={24} />
          <h2 className="text-xl font-semibold text-gray-900">Budget Manager</h2>
        </div>
      </div>

      <div className="grid gap-4">
        {categoryBudgets.map(({ category, budget, spent, percentage, remaining }) => {
          const IconComponent = (LucideIcons as any)[category.icon];
          const isEditing = editingCategory === category.id;
          const isOverBudget = percentage > 100;
          const isNearLimit = percentage > 80 && percentage <= 100;

          return (
            <div
              key={category.id}
              className={`bg-white border rounded-xl p-4 ${
                isOverBudget ? 'border-red-200 bg-red-50' :
                isNearLimit ? 'border-yellow-200 bg-yellow-50' :
                'border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <IconComponent size={20} className="text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{category.name}</h3>
                    <p className="text-sm text-gray-500">
                      Spent: ₹{spent.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={editAmount}
                        onChange={(e) => setEditAmount(e.target.value)}
                        className="w-24 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-teal-500"
                        placeholder="0"
                        autoFocus
                      />
                      <button
                        onClick={handleSave}
                        className="p-1 text-green-600 hover:bg-green-100 rounded"
                      >
                        <Check size={16} />
                      </button>
                      <button
                        onClick={handleCancel}
                        className="p-1 text-gray-400 hover:bg-gray-100 rounded"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="text-right">
                      {budget ? (
                        <>
                          <p className="font-medium text-gray-900">
                            ₹{budget.monthlyLimit.toLocaleString('en-IN')}
                          </p>
                          <button
                            onClick={() => handleEdit(category.id, budget.monthlyLimit)}
                            className="p-1 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded"
                          >
                            <Edit2 size={14} />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleEdit(category.id)}
                          className="text-sm text-teal-600 hover:text-teal-700 font-medium"
                        >
                          Set Budget
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {budget && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {percentage.toFixed(0)}% used
                    </span>
                    <span className={`font-medium ${
                      remaining < 0 ? 'text-red-600' : 'text-gray-900'
                    }`}>
                      {remaining < 0 ? 'Over by ' : 'Remaining: '}
                      ₹{Math.abs(remaining).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        isOverBudget ? 'bg-red-500' :
                        isNearLimit ? 'bg-yellow-500' :
                        'bg-teal-500'
                      }`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Quick Add Budget for Unset Categories */}
      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Set Budget for Other Categories</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {categoryBudgets
            .filter(cb => !cb.budget)
            .map(({ category }) => {
              const IconComponent = (LucideIcons as any)[category.icon];
              return (
                <button
                  key={category.id}
                  onClick={() => handleEdit(category.id)}
                  className="flex items-center gap-2 p-2 text-sm text-gray-600 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                >
                  <IconComponent size={16} />
                  {category.name}
                </button>
              );
            })}
        </div>
      </div>
    </div>
  );
};