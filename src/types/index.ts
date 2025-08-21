export interface User {
  id: string;
  email: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface Expense {
  id: string;
  userId: string;
  date: string;
  amount: number;
  paymentMethod: 'UPI' | 'Wallet' | 'Cash' | 'Card';
  categoryId: string;
  note?: string;
  createdAt: string;
}

export interface Budget {
  id: string;
  userId: string;
  categoryId: string;
  monthlyLimit: number;
}

export interface CategorySpend {
  category: Category;
  amount: number;
  percentage: number;
}