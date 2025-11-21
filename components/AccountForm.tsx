import React, { useState } from 'react';
import { Account, AccountType } from '../types';
import { Save } from 'lucide-react';

interface AccountFormProps {
  onSave: (account: Omit<Account, 'id'>) => void;
}

export const AccountForm: React.FC<AccountFormProps> = ({ onSave }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<AccountType>(AccountType.CASH);
  const [initialBalance, setInitialBalance] = useState<string>('');
  const [billingDate, setBillingDate] = useState<string>('');
  const [dueDate, setDueDate] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      type,
      balance: Number(initialBalance) || 0,
      initialBalance: Number(initialBalance) || 0,
      billingDate: billingDate ? Number(billingDate) : undefined,
      dueDate: dueDate ? Number(dueDate) : undefined,
    });
    // Reset
    setName('');
    setType(AccountType.CASH);
    setInitialBalance('');
    setBillingDate('');
    setDueDate('');
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-slate-100 dark:bg-slate-900 dark:border-slate-800 p-8 animate-fade-in">
       <header className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">建立新帳戶</h2>
        <p className="text-slate-500 dark:text-slate-400">新增您的銀行、現金或信用卡帳戶。</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Account Name */}
          <div className="col-span-2 md:col-span-1">
            <label className="block mb-2 text-sm font-medium text-slate-900 dark:text-white">帳戶名稱</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例如：台新薪轉戶"
              className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-slate-800 dark:border-slate-700 dark:placeholder-slate-400 dark:text-white"
            />
          </div>

          {/* Account Type */}
          <div className="col-span-2 md:col-span-1">
            <label className="block mb-2 text-sm font-medium text-slate-900 dark:text-white">類型</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as AccountType)}
              className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-slate-800 dark:border-slate-700 dark:placeholder-slate-400 dark:text-white"
            >
              {Object.entries(AccountType).map(([key, value]) => (
                <option key={key} value={value}>{value}</option>
              ))}
            </select>
          </div>

          {/* Initial Balance */}
          <div className="col-span-2">
            <label className="block mb-2 text-sm font-medium text-slate-900 dark:text-white">初始金額</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <span className="text-slate-500 dark:text-slate-400">$</span>
              </div>
              <input
                type="number"
                required
                value={initialBalance}
                onChange={(e) => setInitialBalance(e.target.value)}
                className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-8 p-2.5 dark:bg-slate-800 dark:border-slate-700 dark:placeholder-slate-400 dark:text-white"
                placeholder="0"
              />
            </div>
          </div>

          {/* Credit Card Specifics */}
          {type === AccountType.CREDIT && (
            <>
               <div className="col-span-1">
                <label className="block mb-2 text-sm font-medium text-slate-900 dark:text-white">結帳日 (每月)</label>
                <input
                  type="number"
                  min="1"
                  max="31"
                  value={billingDate}
                  onChange={(e) => setBillingDate(e.target.value)}
                  placeholder="例如：15"
                  className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-slate-800 dark:border-slate-700 dark:placeholder-slate-400 dark:text-white"
                />
              </div>
               <div className="col-span-1">
                <label className="block mb-2 text-sm font-medium text-slate-900 dark:text-white">繳款截止日 (每月)</label>
                <input
                  type="number"
                  min="1"
                  max="31"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  placeholder="例如：25"
                  className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-slate-800 dark:border-slate-700 dark:placeholder-slate-400 dark:text-white"
                />
              </div>
            </>
          )}
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
        >
          <Save className="w-4 h-4 mr-2" />
          建立帳戶
        </button>
      </form>
    </div>
  );
};