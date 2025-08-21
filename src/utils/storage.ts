import { User, Expense, Budget } from '../types';

const STORAGE_KEYS = {
  USER: 'dabbulu_user',
  EXPENSES: 'dabbulu_expenses',
  BUDGETS: 'dabbulu_budgets'
};

export const storage = {
  getUser: (): User | null => {
    const user = localStorage.getItem(STORAGE_KEYS.USER);
    return user ? JSON.parse(user) : null;
  },

  setUser: (user: User) => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },

  getExpenses: (): Expense[] => {
    const expenses = localStorage.getItem(STORAGE_KEYS.EXPENSES);
    return expenses ? JSON.parse(expenses) : [];
  },

  setExpenses: (expenses: Expense[]) => {
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
  },

  addExpense: (expense: Expense) => {
    const expenses = storage.getExpenses();
    expenses.unshift(expense);
    storage.setExpenses(expenses);
  },

  updateExpense: (id: string, updates: Partial<Expense>) => {
    const expenses = storage.getExpenses();
    const index = expenses.findIndex(e => e.id === id);
    if (index !== -1) {
      expenses[index] = { ...expenses[index], ...updates };
      storage.setExpenses(expenses);
    }
  },

  deleteExpense: (id: string) => {
    const expenses = storage.getExpenses();
    const filtered = expenses.filter(e => e.id !== id);
    storage.setExpenses(filtered);
  },

  getBudgets: (): Budget[] => {
    const budgets = localStorage.getItem(STORAGE_KEYS.BUDGETS);
    return budgets ? JSON.parse(budgets) : [];
  },

  setBudgets: (budgets: Budget[]) => {
    localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(budgets));
  },

  updateBudget: (categoryId: string, userId: string, monthlyLimit: number) => {
    const budgets = storage.getBudgets();
    const existingIndex = budgets.findIndex(b => b.categoryId === categoryId && b.userId === userId);
    
    if (existingIndex !== -1) {
      budgets[existingIndex].monthlyLimit = monthlyLimit;
    } else {
      budgets.push({
        id: Date.now().toString(),
        userId,
        categoryId,
        monthlyLimit
      });
    }
    
    storage.setBudgets(budgets);
  }
};