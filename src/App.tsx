import React, { useState, useEffect } from 'react';
import { Plus, Home, Receipt, PiggyBank, User, LogOut } from 'lucide-react';
import { User as UserType, Expense } from './types';
import { storage } from './utils/storage';
import { LoginForm } from './components/LoginForm';
import { AddExpenseForm } from './components/AddExpenseForm';
import { Dashboard } from './components/Dashboard';
import { ExpensesList } from './components/ExpensesList';
import { BudgetManager } from './components/BudgetManager';
import { Toast } from './components/Toast';

type Tab = 'dashboard' | 'expenses' | 'budgets';

function App() {
  const [user, setUser] = useState<UserType | null>(null);
  const [currentTab, setCurrentTab] = useState<Tab>('dashboard');
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budgets, setBudgets] = useState(storage.getBudgets());
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [toast, setToast] = useState({ message: '', isVisible: false });

  useEffect(() => {
    const savedUser = storage.getUser();
    if (savedUser) {
      setUser(savedUser);
      setExpenses(storage.getExpenses().filter(e => e.userId === savedUser.id));
    }
  }, []);

  const handleLogin = (userData: UserType) => {
    setUser(userData);
    storage.setUser(userData);
    setExpenses(storage.getExpenses().filter(e => e.userId === userData.id));
  };

  const handleLogout = () => {
    setUser(null);
    setExpenses([]);
    setBudgets([]);
    setCurrentTab('dashboard');
  };

  const showToast = (message: string) => {
    setToast({ message, isVisible: true });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  const handleAddExpense = (expense: Expense) => {
    storage.addExpense(expense);
    setExpenses(prev => [expense, ...prev]);
    setIsAddFormOpen(false);
    showToast('Expense added successfully!');
  };

  const handleUpdateExpense = (id: string, updates: Partial<Expense>) => {
    storage.updateExpense(id, updates);
    setExpenses(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
    showToast('Expense updated successfully!');
  };

  const handleDeleteExpense = (id: string) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      storage.deleteExpense(id);
      setExpenses(prev => prev.filter(e => e.id !== id));
      showToast('Expense deleted successfully!');
    }
  };

  const handleUpdateBudget = (categoryId: string, monthlyLimit: number) => {
    if (user) {
      storage.updateBudget(categoryId, user.id, monthlyLimit);
      setBudgets(storage.getBudgets());
      showToast('Budget updated successfully!');
    }
  };

  if (!user) {
    return <LoginForm onLogin={handleLogin} />;
  }

  const tabs = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: Home },
    { id: 'expenses' as const, label: 'Expenses', icon: Receipt },
    { id: 'budgets' as const, label: 'Budgets', icon: PiggyBank }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Dabbulu Urike Ravu</h1>
            <p className="text-sm text-gray-500">Personal Expense Tracker</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User size={16} />
              {user.email}
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setCurrentTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      currentTab === tab.id
                        ? 'bg-orange-500 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon size={20} />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {currentTab === 'dashboard' && (
              <Dashboard
                expenses={expenses}
                budgets={budgets.filter(b => b.userId === user.id)}
                onAddExpense={() => setIsAddFormOpen(true)}
              />
            )}
            
            {currentTab === 'expenses' && (
              <ExpensesList
                expenses={expenses}
                onUpdate={handleUpdateExpense}
                onDelete={handleDeleteExpense}
              />
            )}
            
            {currentTab === 'budgets' && (
              <BudgetManager
                budgets={budgets.filter(b => b.userId === user.id)}
                expenses={expenses}
                userId={user.id}
                onUpdateBudget={handleUpdateBudget}
              />
            )}
          </div>
        </div>
      </div>

      {/* Floating Add Button */}
      <button
        onClick={() => setIsAddFormOpen(true)}
        className="fixed bottom-6 left-1/2 transform -translate-x-1/2 w-14 h-14 bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-lg flex items-center justify-center transition-colors z-40"
      >
        <Plus size={24} />
      </button>

      {/* Add Expense Form */}
      <AddExpenseForm
        user={user}
        isOpen={isAddFormOpen}
        onClose={() => setIsAddFormOpen(false)}
        onAdd={handleAddExpense}
      />

      {/* Toast Notifications */}
      <Toast
        message={toast.message}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
}

export default App;