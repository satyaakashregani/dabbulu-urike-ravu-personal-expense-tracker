import React from 'react';
import { Calendar, TrendingUp, AlertTriangle, PieChart } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { Expense, Budget, CategorySpend } from '../types';
import { defaultCategories } from '../data/categories';
import { getCurrentMonth, getMonthName } from '../utils/date';
import { EmptyState } from './EmptyState';

interface DashboardProps {
  expenses: Expense[];
  budgets: Budget[];
  onAddExpense: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  expenses,
  budgets,
  onAddExpense
}) => {
  const today = new Date().toISOString().split('T')[0];
  const currentMonth = getCurrentMonth();
  
  const todayExpenses = expenses.filter(e => e.date === today);
  const monthExpenses = expenses.filter(e => e.date.startsWith(currentMonth));
  
  const todayTotal = todayExpenses.reduce((sum, e) => sum + e.amount, 0);
  const monthTotal = monthExpenses.reduce((sum, e) => sum + e.amount, 0);

  // Category spending analysis
  const categorySpends: CategorySpend[] = defaultCategories.map(category => {
    const categoryExpenses = monthExpenses.filter(e => e.categoryId === category.id);
    const amount = categoryExpenses.reduce((sum, e) => sum + e.amount, 0);
    return {
      category,
      amount,
      percentage: monthTotal > 0 ? (amount / monthTotal) * 100 : 0
    };
  }).filter(cs => cs.amount > 0).sort((a, b) => b.amount - a.amount);

  // Budget alerts
  const budgetAlerts = budgets
    .map(budget => {
      const spent = categorySpends.find(cs => cs.category.id === budget.categoryId)?.amount || 0;
      const percentage = budget.monthlyLimit > 0 ? (spent / budget.monthlyLimit) * 100 : 0;
      const category = defaultCategories.find(c => c.id === budget.categoryId);
      
      return {
        budget,
        category,
        spent,
        percentage,
        isOverLimit: percentage > 100,
        isNearLimit: percentage > 80 && percentage <= 100
      };
    })
    .filter(alert => alert.isOverLimit || alert.isNearLimit);

  const recentExpenses = expenses.slice(0, 5);

  if (expenses.length === 0) {
    return <EmptyState type="dashboard" onAction={onAddExpense} />;
  }

  return (
    <div className="space-y-6">
      {/* Budget Alerts */}
      {budgetAlerts.length > 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="text-yellow-600 dark:text-yellow-400" size={20} />
            <h3 className="font-medium text-yellow-800 dark:text-yellow-200">Budget Alerts</h3>
          </div>
          <div className="space-y-2">
            {budgetAlerts.map(alert => {
              const IconComponent = alert.category ? (LucideIcons as any)[alert.category.icon] : null;
              return (
                <div key={alert.budget.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {IconComponent && <IconComponent size={16} className="text-yellow-600 dark:text-yellow-400" />}
                    <span className="text-sm text-yellow-800 dark:text-yellow-200">{alert.category?.name}</span>
                  </div>
                  <div className="text-right">
                    <span className={`text-sm font-medium ${
                      alert.isOverLimit ? 'text-red-600 dark:text-red-400' : 'text-yellow-600 dark:text-yellow-400'
                    }`}>
                      ₹{alert.spent.toLocaleString('en-IN')} / ₹{alert.budget.monthlyLimit.toLocaleString('en-IN')}
                    </span>
                    <span className={`text-xs ml-2 ${
                      alert.isOverLimit ? 'text-red-500 dark:text-red-400' : 'text-yellow-500 dark:text-yellow-400'
                    }`}>
                      ({alert.percentage.toFixed(0)}%)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100">Today's Spending</p>
              <p className="text-2xl font-bold">₹{todayTotal.toLocaleString('en-IN')}</p>
              {todayExpenses.length > 0 && (
                <p className="text-sm text-orange-200">{todayExpenses.length} transactions</p>
              )}
            </div>
            <Calendar className="text-orange-200" size={32} />
          </div>
        </div>

        <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-teal-100">{getMonthName(currentMonth)}</p>
              <p className="text-2xl font-bold">₹{monthTotal.toLocaleString('en-IN')}</p>
              {monthExpenses.length > 0 && (
                <p className="text-sm text-teal-200">{monthExpenses.length} transactions</p>
              )}
            </div>
            <TrendingUp className="text-teal-200" size={32} />
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      {categorySpends.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <PieChart className="text-gray-600 dark:text-gray-400" size={20} />
            <h3 className="font-semibold text-gray-900 dark:text-white">Category Breakdown</h3>
          </div>
          <div className="space-y-3">
            {categorySpends.slice(0, 5).map(({ category, amount, percentage }) => {
              const IconComponent = (LucideIcons as any)[category.icon];
              return (
                <div key={category.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      <IconComponent size={16} className="text-gray-600 dark:text-gray-400" />
                    </div>
                    <span className="text-gray-900 dark:text-white">{category.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-medium text-gray-900">
                    <span className="font-medium text-gray-900 dark:text-white">
                      ₹{amount.toLocaleString('en-IN')}
                    </span>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{percentage.toFixed(1)}%</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent Transactions */}
      {recentExpenses.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Recent Transactions</h3>
          <div className="space-y-3">
            {recentExpenses.map((expense) => {
              const category = defaultCategories.find(c => c.id === expense.categoryId);
              const IconComponent = category ? (LucideIcons as any)[category.icon] : null;
              
              return (
                <div key={expense.id} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    {IconComponent && (
                      <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                        <IconComponent size={16} className="text-gray-600 dark:text-gray-400" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">₹{expense.amount.toLocaleString('en-IN')}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {category?.name}
                        {expense.note && ` • ${expense.note}`}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">
                      {expense.paymentMethod}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};