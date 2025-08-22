import React from 'react';
import { Plus, PiggyBank, TrendingUp } from 'lucide-react';

interface EmptyStateProps {
  type: 'expenses' | 'budgets' | 'dashboard';
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ type, onAction }) => {
  const configs = {
    expenses: {
      icon: Plus,
      title: "No expenses yet",
      description: "Start tracking your expenses by adding your first entry. It takes less than 10 seconds!",
      actionText: "Add First Expense",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-500"
    },
    budgets: {
      icon: PiggyBank,
      title: "Set your budgets",
      description: "Create monthly budgets for your categories to stay on track with your spending goals.",
      actionText: "Set Budget",
      bgColor: "bg-teal-50", 
      iconColor: "text-teal-500"
    },
    dashboard: {
      icon: TrendingUp,
      title: "Welcome to Dabbulu Urike Ravu!",
      description: "Your personal expense tracker. Start by adding your first expense.",
      actionText: "Add Expense",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-500"
    }
  };

  const config = configs[type];
  const Icon = config.icon;

  return (
    <div className={`${config.bgColor} rounded-xl p-8 text-center`}>
      <div className={`inline-flex items-center justify-center w-16 h-16 ${config.iconColor} bg-white rounded-full shadow-sm mb-4`}>
        <Icon size={32} />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{config.title}</h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">{config.description}</p>
      {onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          <Plus size={20} />
          {config.actionText}
        </button>
      )}
    </div>
  );
};