
import { Category, BankAccount, Transaction } from './types';

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat-1', name: '飲食', icon: '🍔', color: 'bg-orange-500' },
  { id: 'cat-2', name: '交通', icon: '🚗', color: 'bg-blue-500' },
  { id: 'cat-3', name: '薪資', icon: '💰', color: 'bg-green-500' },
  { id: 'cat-4', name: '娛樂', icon: '🎮', color: 'bg-purple-500' },
  { id: 'cat-5', name: '購物', icon: '🛍️', color: 'bg-pink-500' },
  { id: 'cat-6', name: '投資', icon: '📈', color: 'bg-emerald-500' },
  { id: 'cat-7', name: '其他', icon: '✨', color: 'bg-slate-500' },
];

export const MOCK_ACCOUNTS: BankAccount[] = [
  { id: 'acc-1', name: '玉山銀行', balance: 50000, type: '儲蓄', color: 'bg-green-600' },
  { id: 'acc-2', name: '國泰世華', balance: 12500, type: '數位帳戶', color: 'bg-emerald-600' },
  { id: 'acc-3', name: '現金', balance: 3400, type: '錢包', color: 'bg-slate-600' },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 't-1', accountId: 'acc-1', categoryId: 'cat-3', amount: 45000, type: 'INCOME', date: '2024-03-05', note: '3月份薪資' },
  { id: 't-2', accountId: 'acc-3', categoryId: 'cat-1', amount: 150, type: 'EXPENSE', date: '2024-03-06', note: '午餐便當' },
  { id: 't-3', accountId: 'acc-2', categoryId: 'cat-2', amount: 1200, type: 'EXPENSE', date: '2024-03-07', note: '加油' },
  { id: 't-4', accountId: 'acc-1', categoryId: 'cat-5', amount: 3500, type: 'EXPENSE', date: '2024-03-08', note: '生活百貨' },
];
