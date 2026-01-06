
import React, { useState } from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import { 
  LayoutDashboard, 
  Wallet, 
  History, 
  PieChart, 
  LogOut, 
  User, 
  Plus, 
  Settings,
  LogIn,
  Zap
} from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Accounts from './pages/Accounts';
import Transactions from './pages/Transactions';
import Reports from './pages/Reports';
import AuthPage from './pages/AuthPage';
import { auth } from './services/firebase';
import { signOut } from 'firebase/auth';

const MainApp: React.FC = () => {
  const { user, isDemoMode, setDemoMode } = useAppContext();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'accounts' | 'transactions' | 'reports'>('dashboard');

  if (!user && !isDemoMode) {
    return <AuthPage />;
  }

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
    }
    setDemoMode(true);
  };

  const navItems = [
    { id: 'dashboard', label: '總覽', icon: LayoutDashboard },
    { id: 'accounts', label: '帳戶', icon: Wallet },
    { id: 'transactions', label: '紀錄', icon: History },
    { id: 'reports', label: '報表', icon: PieChart },
  ] as const;

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-20 md:w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold">
            SF
          </div>
          <span className="hidden md:block text-xl font-bold text-slate-800">SmartFinance</span>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
                  activeTab === item.id 
                    ? 'bg-indigo-50 text-indigo-600 font-semibold' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                }`}
              >
                <Icon size={24} />
                <span className="hidden md:block">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100">
          {isDemoMode ? (
            <div className="bg-amber-50 text-amber-700 p-3 rounded-lg text-sm mb-2 flex items-center gap-2">
              <Zap size={16} />
              <span className="hidden md:block">展示模式</span>
            </div>
          ) : (
            <div className="bg-green-50 text-green-700 p-3 rounded-lg text-sm mb-2 flex items-center gap-2">
              <User size={16} />
              <span className="hidden md:block truncate">{user?.email}</span>
            </div>
          )}
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3 text-slate-500 hover:text-red-500 hover:bg-red-50 transition-all rounded-xl"
          >
            {isDemoMode ? <LogIn size={24} /> : <LogOut size={24} />}
            <span className="hidden md:block">{isDemoMode ? '正式登入' : '登出系統'}</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
              {navItems.find(n => n.id === activeTab)?.label}
            </h1>
            <p className="text-slate-500">
              {new Date().toLocaleDateString('zh-TW', { dateStyle: 'full' })}
            </p>
          </div>
          <div className="flex gap-4">
             {/* Dynamic action button could go here */}
          </div>
        </header>

        {activeTab === 'dashboard' && <Dashboard onNavigate={(tab) => setActiveTab(tab as any)} />}
        {activeTab === 'accounts' && <Accounts />}
        {activeTab === 'transactions' && <Transactions />}
        {activeTab === 'reports' && <Reports />}
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
};

export default App;
