export const CATEGORIES = [
  'Food',
  'Transport',
  'Groceries',
  'Utilities',
  'Health',
  'Entertainment',
  'Shopping',
  'Education',
  'Other',
  'Savings',
  'Investment',
  'Loan',
  'Debt',
  'Insurance',
  'Fee',
] as const;

export const METHODS = ['Cash', 'BCA Debit'] as const;

export const SOURCES = ['Suami', 'Istri', 'Together'] as const;

export type Category = (typeof CATEGORIES)[number];
export type Method = (typeof METHODS)[number];
export type Source = (typeof SOURCES)[number];
