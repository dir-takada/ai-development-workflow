export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  description: string;
  date: string; // YYYY-MM-DD format
}

export interface MonthlyStats {
  income: number;
  expense: number;
  balance: number;
}

export interface CategoryBreakdown {
  category: string;
  amount: number;
  percentage: number;
}

export const EXPENSE_CATEGORIES = [
  '食費',
  '交通費',
  '住居費',
  '光熱費',
  '通信費',
  '娯楽費',
  '医療費',
  'その他',
];

export const INCOME_CATEGORIES = [
  '給与',
  'ボーナス',
  '副業',
  'その他',
];
