
import React from 'react';
import { useAppContext } from '../context/AppContext';
import { TrendingUp, TrendingDown, DollarSign, ArrowRight } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';

const Dashboard: React.FC<{ onNavigate: (tab: string) => void }> = ({ onNavigate }) => {
  const { accounts, transactions, categories } = useAppContext();

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  
  const currentMonth = new Date().getMonth();
  const currentMonthTransactions = transactions.filter(t => new Date(t.date).getMonth() === currentMonth);
  
  const monthIncome = currentMonthTransactions
    .filter(t => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const monthExpense = currentMonthTransactions
    .filter(t => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0);

  // Chart data: Daily spending this month
  const chartData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dayStr = d.toISOString().split('T')[0];
    const dayTotal = transactions
      .filter(t => t.date === dayStr && t.type === 'EXPENSE')
      .reduce((sum, t) => sum + t.amount, 0);
    return {
      name: d.toLocaleDateString('zh-TW', { weekday: 'short' }),
      amount: dayTotal
    };
  });

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
              <DollarSign size={24} />
            </div>
            <span className="text-xs font-medium text-slate-400">總資產淨值</span>
          </div>
          <h2 className="text-3xl font-bold text-slate-800">NT$ {totalBalance.toLocaleString()}</h2>
          <p className="text-sm text-slate-500 mt-2">跨 {accounts.length} 個帳戶</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-green-100 text-green-600 rounded-lg">
              <TrendingUp size={24} />
            </div>
            <span className="text-xs font-medium text-slate-400">本月收入</span>
          </div>
          <h2 className="text-3xl font-bold text-green-600">NT$ {monthIncome.toLocaleString()}</h2>
          <div className="flex items-center gap-1 text-xs text-green-500 mt-2">
            <TrendingUp size={14} />
            <span>穩定增長中</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-rose-100 text-rose-600 rounded-lg">
              <TrendingDown size={24} />
            </div>
            <span className="text-xs font-medium text-slate-400">本月支出</span>
          </div>
          <h2 className="text-3xl font-bold text-rose-600">NT$ {monthExpense.toLocaleString()}</h2>
          <div className="flex items-center gap-1 text-xs text-rose-500 mt-2">
            <TrendingDown size={14} />
            <span>注意非必要支出</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">近七日支出趨勢</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis hide />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                />
                <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                  {chartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={index === 6 ? '#4f46e5' : '#cbd5e1'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800">最近交易</h3>
            <button 
              onClick={() => onNavigate('transactions')}
              className="text-indigo-600 text-sm font-medium flex items-center gap-1 hover:underline"
            >
              查看全部 <ArrowRight size={14} />
            </button>
          </div>
          <div className="space-y-4">
            {transactions.slice(0, 5).reverse().map((t) => {
              const cat = categories.find(c => c.id === t.categoryId);
              return (
                <div key={t.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${cat?.color || 'bg-slate-200'} rounded-full flex items-center justify-center text-xl`}>
                      {cat?.icon || '❓'}
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">{cat?.name}</p>
                      <p className="text-xs text-slate-400">{t.note || '無備註'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${t.type === 'INCOME' ? 'text-green-600' : 'text-slate-800'}`}>
                      {t.type === 'INCOME' ? '+' : '-'} {t.amount.toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-400">{t.date}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
