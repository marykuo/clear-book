import React, { useMemo } from 'react';
import { Transaction, Account } from '../types';

interface TransactionListProps {
  transactions: Transaction[];
  accounts: Account[];
}

export const TransactionList: React.FC<TransactionListProps> = ({ transactions, accounts }) => {
  // Sort transactions by date (descending)
  const sortedTransactions = useMemo(() => {
    return [...transactions].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [transactions]);

  const getMerchantDisplay = (t: Transaction) => {
    if (t.type === 'INCOME') return t.company || '-';
    if (t.type === 'EXPENSE') return t.merchant || '-';
    // For transfer, maybe show generic text or leave blank as per requirement for "merchant" column
    return '-';
  };

  return (
    <div className="animate-fade-in space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">交易明細</h2>
        <p className="text-slate-500 dark:text-slate-400">查看所有的收入與支出紀錄。</p>
      </header>

      <div className="rounded-xl bg-white shadow-sm border border-slate-100 dark:bg-slate-900 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-500 dark:text-slate-400">
            <thead className="bg-slate-50 text-xs uppercase text-slate-700 dark:bg-slate-800 dark:text-slate-400">
              <tr>
                <th scope="col" className="px-6 py-4">日期</th>
                <th scope="col" className="px-6 py-4">類別</th>
                <th scope="col" className="px-6 py-4">商家/來源</th>
                <th scope="col" className="px-6 py-4">備註</th>
                <th scope="col" className="px-6 py-4 text-right">金額</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {sortedTransactions.map((t) => (
                <tr key={t.id} className="bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900 dark:text-white">
                    {t.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${t.type === 'INCOME' 
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300' 
                        : t.type === 'EXPENSE' 
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'
                      }`}>
                      {t.category || (t.type === 'TRANSFER' ? '轉帳' : '未分類')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-700 dark:text-slate-300">
                    {getMerchantDisplay(t)}
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400 max-w-xs truncate">
                    {t.note || '-'}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-right font-bold
                    ${t.type === 'INCOME' 
                      ? 'text-emerald-600 dark:text-emerald-400' 
                      : t.type === 'EXPENSE' 
                      ? 'text-red-600 dark:text-red-400' 
                      : 'text-slate-900 dark:text-slate-200'
                    }`}>
                    {t.type === 'EXPENSE' ? '-' : ''}
                    NT$ {t.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
              {sortedTransactions.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400 dark:text-slate-500">
                    目前沒有任何交易紀錄
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