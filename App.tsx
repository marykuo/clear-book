import React, { useState, useEffect } from 'react';
import { View, Account, Transaction, AccountType, Frequency, IncomeCategory, ExpenseCategory } from './types';
import { Login } from './components/Login';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { AccountForm } from './components/AccountForm';
import { TransactionForm } from './components/TransactionForm';
import { TransactionList } from './components/TransactionList';
import { AccountList } from './components/AccountList';

// Mock Initial Data
const INITIAL_ACCOUNTS: Account[] = [
  { id: '1', name: '現金', type: AccountType.CASH, balance: 5000, initialBalance: 5000, note: '錢包' },
  { id: '2', name: '臺灣銀行', type: AccountType.BANK, balance: 120000, initialBalance: 80000, note: '定存' },
  { id: '3', name: '現金回饋信用卡', type: AccountType.CREDIT, balance: -5000, initialBalance: 0, billingDate: 20, dueDate: 5, note: '回饋較高' },
];

const INITIAL_TRANSACTIONS: Transaction[] = [
  { 
    id: '101', 
    date: '2023-06-05', 
    type: 'INCOME', 
    amount: 60000, 
    accountId: '2', 
    category: IncomeCategory.SALARY, 
    company: 'Tech Corp', 
    frequency: Frequency.MONTHLY 
  },
  { 
    id: '102', 
    date: '2023-06-10', 
    type: 'EXPENSE', 
    amount: 1500, 
    accountId: '1', 
    category: ExpenseCategory.LIVING, 
    merchant: '超市', 
    frequency: Frequency.ONE_TIME 
  },
];

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [view, setView] = useState<View>(View.DASHBOARD);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Data State
  const [accounts, setAccounts] = useState<Account[]>(INITIAL_ACCOUNTS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);

  // Handle Dark Mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Handlers
  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => {
    setIsLoggedIn(false);
    setView(View.DASHBOARD);
  };

  const handleAddAccount = (newAccount: Omit<Account, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setAccounts([...accounts, { ...newAccount, id }]);
    alert('帳戶已建立！');
    setView(View.ACCOUNT_LIST); // Redirect to list instead of dashboard
  };

  const handleAddTransaction = (newTransaction: Omit<Transaction, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const transaction = { ...newTransaction, id };
    
    setTransactions([transaction, ...transactions]);

    // Update Balances
    const updatedAccounts = accounts.map(acc => {
      if (acc.id === transaction.accountId) {
        // Source logic
        if (transaction.type === 'EXPENSE') return { ...acc, balance: acc.balance - transaction.amount };
        if (transaction.type === 'INCOME') return { ...acc, balance: acc.balance + transaction.amount };
        if (transaction.type === 'TRANSFER') return { ...acc, balance: acc.balance - transaction.amount - (transaction.fee || 0) };
      }
      if (transaction.type === 'TRANSFER' && acc.id === transaction.toAccountId) {
        // Target logic
        return { ...acc, balance: acc.balance + transaction.amount };
      }
      return acc;
    });

    setAccounts(updatedAccounts);
    alert('交易已儲存！');
    setView(View.TRANSACTION_LIST); // Redirect to list
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="absolute right-4 top-4">
            <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-lg bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 shadow-sm border border-slate-200 dark:border-slate-700"
          >
            {isDarkMode ? '🌞' : '🌙'}
          </button>
        </div>
        <Login onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar 
        currentView={view} 
        onChangeView={setView} 
        onLogout={handleLogout}
        isDarkMode={isDarkMode}
        toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
      />
      
      <main className="ml-64 flex-1 p-8">
        {view === View.DASHBOARD && (
          <Dashboard transactions={transactions} accounts={accounts} />
        )}
        
        {view === View.TRANSACTION_LIST && (
          <TransactionList transactions={transactions} accounts={accounts} />
        )}

        {view === View.ADD_INCOME && (
          <TransactionForm mode="INCOME" accounts={accounts} onSave={handleAddTransaction} />
        )}
        
        {view === View.ADD_EXPENSE && (
          <TransactionForm mode="EXPENSE" accounts={accounts} onSave={handleAddTransaction} />
        )}
        
        {view === View.ADD_TRANSFER && (
          <TransactionForm mode="TRANSFER" accounts={accounts} onSave={handleAddTransaction} />
        )}
        
        {view === View.ACCOUNT_LIST && (
          <AccountList accounts={accounts} />
        )}

        {view === View.CREATE_ACCOUNT && (
          <AccountForm onSave={handleAddAccount} />
        )}
      </main>
    </div>
  );
};

export default App;