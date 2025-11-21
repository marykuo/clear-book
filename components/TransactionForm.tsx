import React, { useState, useEffect } from 'react';
import { Account, Transaction, Frequency, IncomeCategory, ExpenseCategory } from '../types';
import { CheckCircle2 } from 'lucide-react';

interface TransactionFormProps {
  mode: 'INCOME' | 'EXPENSE' | 'TRANSFER';
  accounts: Account[];
  onSave: (t: Omit<Transaction, 'id'>) => void;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({ mode, accounts, onSave }) => {
  // Shared State
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [frequency, setFrequency] = useState<Frequency>(Frequency.ONE_TIME);
  const [endDate, setEndDate] = useState('');
  const [note, setNote] = useState('');
  const [accountId, setAccountId] = useState('');

  // Specific State
  const [category, setCategory] = useState('');
  const [company, setCompany] = useState(''); // Income only
  const [merchant, setMerchant] = useState(''); // Expense only
  const [toAccountId, setToAccountId] = useState(''); // Transfer only
  const [fee, setFee] = useState('0'); // Transfer only

  // Select first account by default if available
  useEffect(() => {
    if (accounts.length > 0 && !accountId) {
      setAccountId(accounts[0].id);
    }
    if (accounts.length > 1 && !toAccountId && mode === 'TRANSFER') {
      setToAccountId(accounts[1].id);
    }
  }, [accounts, accountId, toAccountId, mode]);

  // Default Category selection
  useEffect(() => {
     if (mode === 'INCOME' && !category) setCategory(IncomeCategory.SALARY);
     if (mode === 'EXPENSE' && !category) setCategory(ExpenseCategory.LIVING);
  }, [mode, category]);


  const getTitle = () => {
    switch(mode) {
      case 'INCOME': return '新增收入';
      case 'EXPENSE': return '新增支出';
      case 'TRANSFER': return '新增轉帳';
    }
  };

  const getCategoryOptions = () => {
    if (mode === 'INCOME') return Object.values(IncomeCategory);
    if (mode === 'EXPENSE') return Object.values(ExpenseCategory);
    return [];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const transactionData: Omit<Transaction, 'id'> = {
      date,
      type: mode,
      amount: Number(amount),
      accountId,
      frequency,
      endDate: frequency !== Frequency.ONE_TIME ? endDate : undefined,
      note,
    };

    if (mode === 'INCOME') {
      transactionData.category = category;
      transactionData.company = company;
    } else if (mode === 'EXPENSE') {
      transactionData.category = category;
      transactionData.merchant = merchant;
    } else if (mode === 'TRANSFER') {
      transactionData.toAccountId = toAccountId;
      transactionData.fee = Number(fee);
    }

    onSave(transactionData);

    // Soft Reset important fields
    setAmount('');
    setNote('');
    setCompany('');
    setMerchant('');
    setFee('0');
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-slate-100 dark:bg-slate-900 dark:border-slate-800 p-8 animate-fade-in">
      <header className="mb-6 border-b border-slate-100 pb-4 dark:border-slate-800">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{getTitle()}</h2>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* First Row: Date & Amount */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 text-sm font-medium text-slate-900 dark:text-white">日期</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-slate-900 dark:text-white">金額</label>
            <div className="relative">
               <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <span className="text-slate-500 dark:text-slate-400">$</span>
              </div>
              <input
                type="number"
                required
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-8 p-2.5 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                placeholder="0"
              />
            </div>
          </div>
        </div>

        {/* Second Row: Accounts & Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Source Account */}
          <div>
            <label className="block mb-2 text-sm font-medium text-slate-900 dark:text-white">
              {mode === 'INCOME' ? '存入帳戶' : '來源帳戶'}
            </label>
            <select
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
            >
              {accounts.map(acc => (
                <option key={acc.id} value={acc.id}>{acc.name} (${acc.balance})</option>
              ))}
            </select>
          </div>

          {/* Target Account (Transfer Only) */}
          {mode === 'TRANSFER' && (
            <div>
              <label className="block mb-2 text-sm font-medium text-slate-900 dark:text-white">
                目標帳戶
              </label>
              <select
                value={toAccountId}
                onChange={(e) => setToAccountId(e.target.value)}
                className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              >
                {accounts.filter(a => a.id !== accountId).map(acc => (
                  <option key={acc.id} value={acc.id}>{acc.name} (${acc.balance})</option>
                ))}
              </select>
            </div>
          )}

          {/* Category (Income/Expense Only) */}
          {mode !== 'TRANSFER' && (
            <div>
              <label className="block mb-2 text-sm font-medium text-slate-900 dark:text-white">類別</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              >
                {getCategoryOptions().map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Third Row: Entity Details & Fees */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mode === 'INCOME' && (
            <div>
              <label className="block mb-2 text-sm font-medium text-slate-900 dark:text-white">公司 / 來源</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                placeholder="例如：Google, 銀行利息"
              />
            </div>
          )}
          {mode === 'EXPENSE' && (
            <div>
              <label className="block mb-2 text-sm font-medium text-slate-900 dark:text-white">商家</label>
              <input
                type="text"
                value={merchant}
                onChange={(e) => setMerchant(e.target.value)}
                className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                placeholder="例如：7-11, 房東"
              />
            </div>
          )}
          {mode === 'TRANSFER' && (
            <div>
               <label className="block mb-2 text-sm font-medium text-slate-900 dark:text-white">手續費</label>
               <input
                type="number"
                min="0"
                value={fee}
                onChange={(e) => setFee(e.target.value)}
                className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              />
            </div>
          )}
        </div>

        {/* Fourth Row: Frequency */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-slate-50 rounded-lg dark:bg-slate-800/50">
           <div>
              <label className="block mb-2 text-sm font-medium text-slate-900 dark:text-white">週期</label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as Frequency)}
                className="bg-white border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              >
                {Object.values(Frequency).map(freq => (
                  <option key={freq} value={freq}>{freq}</option>
                ))}
              </select>
           </div>
           
           {frequency !== Frequency.ONE_TIME && (
             <div>
                <label className="block mb-2 text-sm font-medium text-slate-900 dark:text-white">結束日 (選填)</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-white border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                />
             </div>
           )}
        </div>

        {/* Note */}
        <div>
          <label className="block mb-2 text-sm font-medium text-slate-900 dark:text-white">備註</label>
          <textarea
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
            placeholder="寫點什麼..."
          />
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
        >
          <CheckCircle2 className="w-4 h-4 mr-2" />
          儲存交易
        </button>

      </form>
    </div>
  );
};