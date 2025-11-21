
export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense'
}

export enum Category {
  // Expense
  FOOD = 'Food & Dining',
  TRANSPORT = 'Transportation',
  HOUSING = 'Housing',
  UTILITIES = 'Utilities',
  ENTERTAINMENT = 'Entertainment',
  SHOPPING = 'Shopping',
  HEALTH = 'Health',
  SOFTWARE = 'Software & Apps',
  INSURANCE = 'Insurance',
  EDUCATION = 'Education',
  PERSONAL_CARE = 'Personal Care',
  TRAVEL = 'Travel',

  // Income
  SALARY = 'Salary',
  FREELANCE = 'Freelance',
  INVESTMENT = 'Investment',
  BUSINESS = 'Business',
  RENTAL = 'Rental Income',
  GIFTS = 'Gifts',
  REFUNDS = 'Refunds',
  DIVIDENDS = 'Dividends',
  INTEREST = 'Interest',
  BONUS = 'Bonus',
  GRANTS = 'Grants',
  SOLD_ITEMS = 'Sold Items',
  
  // General
  OTHER = 'Other'
}

export const INCOME_CATEGORIES = [
  Category.SALARY,
  Category.FREELANCE,
  Category.BUSINESS,
  Category.INVESTMENT,
  Category.RENTAL,
  Category.DIVIDENDS,
  Category.INTEREST,
  Category.GIFTS,
  Category.REFUNDS,
  Category.BONUS,
  Category.GRANTS,
  Category.SOLD_ITEMS,
  Category.OTHER
];

export const EXPENSE_CATEGORIES = [
  Category.FOOD,
  Category.TRANSPORT,
  Category.HOUSING,
  Category.UTILITIES,
  Category.ENTERTAINMENT,
  Category.SHOPPING,
  Category.HEALTH,
  Category.SOFTWARE,
  Category.INSURANCE,
  Category.EDUCATION,
  Category.PERSONAL_CARE,
  Category.TRAVEL,
  Category.OTHER
];

export enum BillingCycle {
  MONTHLY = 'Monthly',
  YEARLY = 'Yearly'
}

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: Category | string;
  date: string; // ISO string
  description: string;
  installmentId?: string;
  installmentTotal?: number;
  installmentCurrent?: number;
}

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  billingCycle: BillingCycle;
  category: Category | string;
  nextBillingDate: string;
  description?: string;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export type View = 'dashboard' | 'analytics' | 'add' | 'advisor' | 'subscriptions' | 'profile';

export interface Currency {
  code: string;
  symbol: string;
  name: string;
}

export const CURRENCIES: Currency[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'TRY', symbol: '₺', name: 'Turkish Lira' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
];
