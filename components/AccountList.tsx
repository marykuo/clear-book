import React from 'react';
import { Account, AccountType } from '../types';

interface AccountListProps {
  accounts: Account[];
}

export const AccountList: React.FC<AccountListProps> = ({ accounts }) => {
  const getEmoji = (type: AccountType) => {
    switch (type) {
      case AccountType.CASH: return '💵';
      case AccountType.CREDIT: return '💳';
      case AccountType.BANK: return '🏦';
      default: return '💰';
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
       <header>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">帳戶列表</h2>
        <p className="text-slate-500 dark:text-slate-400">管理您的所有資產帳戶。</p>
      </header>

      <div className="rounded-xl bg-white shadow-sm border border-slate-100 dark:bg-slate-900 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-500 dark:text-slate-400">
            <thead className="bg-slate-50 text-xs uppercase text-slate-700 dark:bg-slate-800 dark:text-slate-400">
              <tr>
                <th scope="col" className="px-6 py-4 text-center w-16">類型</th>
                <th scope="col" className="px-6 py-4">帳戶名稱</th>
                <th scope="col" className="px-6 py-4">備註</th>
                <th scope="col" className="px-6 py-4 text-right">當前金額</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {accounts.map((acc) => (
                <tr key={acc.id} className="bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 transition-colors">
                  <td className="px-6 py-4 text-center text-2xl">
                    {getEmoji(acc.type)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900 dark:text-white">{acc.name}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{acc.type}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                    {acc.note || '-'}
                  </td>
                  <td className={`px-6 py-4 text-right font-bold ${
                    acc.balance < 0 ? 'text-red-500' : 'text-emerald-600 dark:text-emerald-400'
                  }`}>
                    NT$ {acc.balance.toLocaleString()}
                  </td>
                </tr>
              ))}
              {accounts.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-400 dark:text-slate-500">
                    目前沒有任何帳戶
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};