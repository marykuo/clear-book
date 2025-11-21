export enum View {
  LOGIN = 'LOGIN',
  DASHBOARD = 'DASHBOARD',
  TRANSACTION_LIST = 'TRANSACTION_LIST',
  ADD_INCOME = 'ADD_INCOME',
  ADD_EXPENSE = 'ADD_EXPENSE',
  ADD_TRANSFER = 'ADD_TRANSFER',
  CREATE_ACCOUNT = 'CREATE_ACCOUNT',
}

export enum AccountType {
  CASH = '現金',
  CREDIT = '信用卡',
  BANK = '銀行',
}

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  initialBalance: number;
  billingDate?: number; // Day of month
  dueDate?: number; // Day of month
}

export enum Frequency {
  ONE_TIME = '一次',
  DAILY = '每天',
  WORKDAYS = '每個工作日',
  WEEKLY = '每周',
  MONTHLY = '每月',
  QUARTERLY = '每季',
  HALF_YEARLY = '每半年',
  YEARLY = '每年',
}

export enum IncomeCategory {
  SALARY = '薪資收入',
  BONUS = '獎金',
  INTEREST = '利息',
  CAPITAL_GAIN = '股票資本利得',
  DIVIDEND = '股利',
  CASHBACK = '回饋金',
  WINDFALL = '意外收入',
  OTHER = '其他收入',
}

export enum ExpenseCategory {
  LIVING = '生活費',
  RENT = '房租',
  ELECTRICITY = '電費',
  WATER = '水費',
  INSURANCE = '保險費',
  OTHER = '其他費用',
}

export interface Transaction {
  id: string;
  date: string;
  type: 'INCOME' | 'EXPENSE' | 'TRANSFER';
  amount: number;
  accountId: string; // Source for expense/transfer, Target for income
  toAccountId?: string; // Target for transfer
  category?: string;
  company?: string; // For Income
  merchant?: string; // For Expense
  fee?: number; // For Transfer
  frequency: Frequency;
  endDate?: string;
  note?: string;
}