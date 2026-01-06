
export type TransactionType = 'INCOME' | 'EXPENSE';

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface BankAccount {
  id: string;
  name: string;
  balance: number;
  type: string;
  color: string;
}

export interface Transaction {
  id: string;
  accountId: string;
  categoryId: string;
  amount: number;
  type: TransactionType;
  date: string;
  note: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
}

export interface AppState {
  accounts: BankAccount[];
  transactions: Transaction[];
  categories: Category[];
  isDemoMode: boolean;
  user: UserProfile | null;
}
