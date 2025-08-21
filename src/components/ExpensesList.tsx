import React, { useState } from 'react';
import { Edit2, Trash2, Search, Filter } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { Expense, Category } from '../types';
import { defaultCategories } from '../data/categories';
import { formatDate } from '../utils/date';
import { EditExpenseForm } from './EditExpenseForm';

interface ExpensesListProps {
  expenses: Expense[];
  onUpdate: (id: string, updates: Partial<Expense>) => void;
  onDelete: (id: string) => void;
}

export const ExpensesList: React.FC<ExpensesListProps> = ({
  expenses,
  onUpdate,
  onDelete
}) => {
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const getCategoryById = (id: string): Category | undefined => {
    return defaultCategories.find(cat => cat.id === id);
  };

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = !searchTerm || 
      expense.note?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.amount.toString().includes(searchTerm);
    
    const matchesCategory = !selectedCategory || expense.categoryId === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const groupedExpenses = filteredExpenses.reduce((groups, expense) => {
    const date = expense.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(expense);
    return groups;
  }, {} as Record<string, Expense[]>);

  return (
    <div className="space-y-4">
      <div className="flex gap-4 flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search expenses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="min-w-[160px]">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="">All Categories</option>
              {defaultCategories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {Object.entries(groupedExpenses).length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No expenses found</p>
          </div>
        ) : (
          Object.entries(groupedExpenses)
            .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
            .map(([date, dayExpenses]) => (
              <div key={date} className="space-y-2">
                <h3 className="text-sm font-medium text-gray-500 px-1">
                  {formatDate(date)}
                </h3>
                <div className="space-y-1">
                  {dayExpenses.map((expense) => {
                    const category = getCategoryById(expense.categoryId);
                    const IconComponent = category ? (LucideIcons as any)[category.icon] : null;
                    
                    return (
                      <div
                        key={expense.id}
                        className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1">
                            {IconComponent && (
                              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                <IconComponent size={18} className="text-gray-600" />
                              </div>
                            )}
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-900">
                                  ₹{expense.amount.toLocaleString('en-IN')}
                                </span>
                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                  {expense.paymentMethod}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600">
                                {category?.name}
                                {expense.note && (
                                  <span className="text-gray-500"> • {expense.note}</span>
                                )}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => setEditingExpense(expense)}
                              className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => onDelete(expense.id)}
                              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
        )}
      </div>

      {editingExpense && (
        <EditExpenseForm
          expense={editingExpense}
          isOpen={!!editingExpense}
          onClose={() => setEditingExpense(null)}
          onUpdate={(updates) => {
            onUpdate(editingExpense.id, updates);
            setEditingExpense(null);
          }}
        />
      )}
    </div>
  );
};