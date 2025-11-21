import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Transaction, Account } from '../types';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';

interface DashboardProps {
  transactions: Transaction[];
  accounts: Account[];
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export const Dashboard: React.FC<DashboardProps> = ({ transactions, accounts }) => {
  
  const totalAssets = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  
  const totalIncome = transactions
    .filter(t => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpense = transactions
    .filter(t => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0);

  // Prepare Data for Pie Chart (Expenses by Category)
  const expenseByCategory = transactions
    .filter(t => t.type === 'EXPENSE')
    .reduce((acc, t) => {
      const cat = t.category || 'Other';
      acc[cat] = (acc[cat] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const pieData = Object.entries(expenseByCategory).map(([name, value]) => ({ name, value }));

  // Prepare Data for Bar Chart (Monthly Trend - Simplified mock logic for last 6 months)
  // In a real app, we would parse dates properly. Here we just group by the provided mock dates or use current context.
  const barData = [
    { name: '1月', income: 45000, expense: 20000 },
    { name: '2月', income: 45000, expense: 25000 },
    { name: '3月', income: 52000, expense: 18000 },
    { name: '4月', income: 45000, expense: 30000 },
    { name: '5月', income: 48000, expense: 22000 },
    { name: '6月', income: totalIncome, expense: totalExpense }, // Use actuals for current
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <header>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">總覽儀表板</h2>
        <p className="text-slate-500 dark:text-slate-400">歡迎回來，查看您的財務概況。</p>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-100 dark:bg-slate-900 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">總資產</p>
              <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                NT$ {totalAssets.toLocaleString()}
              </p>
            </div>
            <div className="rounded-full bg-blue-50 p-3 dark:bg-blue-900/30">
              <Wallet className="h-6 w-6 text-blue-500" />
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-100 dark:bg-slate-900 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">本月收入</p>
              <p className="mt-2 text-3xl font-bold text-emerald-500">
                + NT$ {totalIncome.toLocaleString()}
              </p>
            </div>
            <div className="rounded-full bg-emerald-50 p-3 dark:bg-emerald-900/30">
              <TrendingUp className="h-6 w-6 text-emerald-500" />
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-100 dark:bg-slate-900 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">本月支出</p>
              <p className="mt-2 text-3xl font-bold text-red-500">
                - NT$ {totalExpense.toLocaleString()}
              </p>
            </div>
            <div className="rounded-full bg-red-50 p-3 dark:bg-red-900/30">
              <TrendingDown className="h-6 w-6 text-red-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Bar Chart */}
        <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-100 dark:bg-slate-900 dark:border-slate-800">
          <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">收支趨勢</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-700" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value/1000}k`} />
                <Tooltip 
                  cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    borderRadius: '8px', 
                    border: 'none', 
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
                  }} 
                />
                <Legend />
                <Bar dataKey="income" name="收入" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" name="支出" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-100 dark:bg-slate-900 dark:border-slate-800">
          <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">支出類別占比</h3>
          <div className="h-72 w-full flex items-center justify-center">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                      borderRadius: '8px', 
                      border: 'none', 
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
                    }}
                  />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-slate-400 text-sm">尚無支出資料</div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Transactions List (Simplified) */}
      <div className="rounded-xl bg-white shadow-sm border border-slate-100 dark:bg-slate-900 dark:border-slate-800">
        <div className="border-b border-slate-100 px-6 py-4 dark:border-slate-800">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">近期交易</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-500 dark:text-slate-400">
            <thead className="bg-slate-50 text-xs uppercase text-slate-700 dark:bg-slate-800 dark:text-slate-400">
              <tr>
                <th scope="col" className="px-6 py-3">日期</th>
                <th scope="col" className="px-6 py-3">類別</th>
                <th scope="col" className="px-6 py-3">說明</th>
                <th scope="col" className="px-6 py-3 text-right">金額</th>
              </tr>
            </thead>
            <tbody>
              {transactions.slice(0, 5).map((t) => (
                <tr key={t.id} className="border-b bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800">
                  <td className="px-6 py-4">{t.date}</td>
                  <td className="px-6 py-4">
                    <span className={`rounded px-2.5 py-0.5 text-xs font-medium ${
                      t.type === 'INCOME' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300' :
                      t.type === 'EXPENSE' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                      'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                    }`}>
                      {t.category || (t.type === 'TRANSFER' ? '轉帳' : '一般')}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                     {t.note || (t.company || t.merchant || '無備註')}
                  </td>
                  <td className={`px-6 py-4 text-right font-bold ${
                    t.type === 'INCOME' ? 'text-emerald-500' : 'text-slate-900 dark:text-slate-200'
                  }`}>
                    {t.type === 'EXPENSE' ? '-' : ''}NT$ {t.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && (
                 <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-slate-400">
                       暫無交易紀錄
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