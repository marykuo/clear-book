import React from 'react';
import { 
  LayoutDashboard, 
  TrendingUp, 
  TrendingDown, 
  ArrowRightLeft, 
  Wallet, 
  LogOut,
  Moon,
  Sun,
  List
} from 'lucide-react';
import { View } from '../types';

interface SidebarProps {
  currentView: View;
  onChangeView: (view: View) => void;
  onLogout: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentView, 
  onChangeView, 
  onLogout,
  isDarkMode,
  toggleDarkMode
}) => {
  
  const navItems = [
    { view: View.DASHBOARD, icon: LayoutDashboard, label: '總覽儀表板' },
    { view: View.TRANSACTION_LIST, icon: List, label: '交易明細' },
    { view: View.ADD_INCOME, icon: TrendingUp, label: '新增收入' },
    { view: View.ADD_EXPENSE, icon: TrendingDown, label: '新增支出' },
    { view: View.ADD_TRANSFER, icon: ArrowRightLeft, label: '新增轉帳' },
    { view: View.CREATE_ACCOUNT, icon: Wallet, label: '建立帳戶' },
  ];

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 transition-colors duration-200">
      <div className="flex h-full flex-col px-3 py-4">
        <div className="mb-6 flex items-center pl-2.5">
          <span className="self-center whitespace-nowrap text-xl font-semibold text-primary-600 dark:text-primary-400">
            ClearBook
          </span>
        </div>
        
        <ul className="space-y-2 font-medium flex-1">
          {navItems.map((item) => (
            <li key={item.view}>
              <button
                onClick={() => onChangeView(item.view)}
                className={`group flex w-full items-center rounded-lg p-2 text-slate-900 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-800 transition-colors ${
                  currentView === item.view 
                    ? 'bg-primary-50 text-primary-600 dark:bg-slate-800 dark:text-primary-400' 
                    : ''
                }`}
              >
                <item.icon className={`h-5 w-5 transition duration-75 ${
                  currentView === item.view 
                    ? 'text-primary-600 dark:text-primary-400' 
                    : 'text-slate-500 group-hover:text-slate-900 dark:text-slate-400 dark:group-hover:text-white'
                }`} />
                <span className="ml-3">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-auto border-t border-slate-200 pt-4 dark:border-slate-800 space-y-2">
           <button
            onClick={toggleDarkMode}
            className="group flex w-full items-center rounded-lg p-2 text-slate-900 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-800"
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5 text-slate-500 dark:text-slate-400" />
            ) : (
              <Moon className="h-5 w-5 text-slate-500 dark:text-slate-400" />
            )}
            <span className="ml-3">{isDarkMode ? '切換亮色模式' : '切換深色模式'}</span>
          </button>

          <button
            onClick={onLogout}
            className="group flex w-full items-center rounded-lg p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-slate-800"
          >
            <LogOut className="h-5 w-5" />
            <span className="ml-3">登出</span>
          </button>
        </div>
      </div>
    </aside>
  );
};