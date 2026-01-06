
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { getFinancialAdvice } from '../services/gemini';
import { Sparkles, Loader2, PieChart as PieChartIcon } from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Legend, 
  Tooltip 
} from 'recharts';

const Reports: React.FC = () => {
  const { accounts, transactions, categories } = useAppContext();
  const [advice, setAdvice] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const expenseTransactions = transactions.filter(t => t.type === 'EXPENSE');
  
  const dataByCat = categories.map(cat => {
    const total = expenseTransactions
      .filter(t => t.categoryId === cat.id)
      .reduce((sum, t) => sum + t.amount, 0);
    return { name: cat.name, value: total, color: cat.color.replace('bg-', '#') };
  }).filter(d => d.value > 0);

  const fetchAdvice = async () => {
    setLoading(true);
    try {
      const res = await getFinancialAdvice(accounts, transactions, categories);
      setAdvice(res);
    } catch (e) {
      setAdvice("取得 AI 建議時發生錯誤，請稍後再試。");
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#64748b'];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expenditure Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <PieChartIcon className="text-indigo-600" size={20} />
            支出分類佔比
          </h3>
          <div className="h-80">
            {dataByCat.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dataByCat}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {dataByCat.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <PieChartIcon size={48} className="mb-2 opacity-20" />
                <p>尚無支出紀錄可供分析</p>
              </div>
            )}
          </div>
        </div>

        {/* AI Insight Section */}
        <div className="bg-indigo-600 p-6 rounded-2xl text-white shadow-lg shadow-indigo-100 flex flex-col min-h-[400px]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Sparkles size={20} /> AI 財務分析建議
            </h3>
            <button 
              onClick={fetchAdvice}
              disabled={loading}
              className="bg-white/20 hover:bg-white/30 transition-colors px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
              {advice ? '重新生成' : '立即諮詢'}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="h-full flex items-center justify-center space-y-4 flex-col">
                <Loader2 size={48} className="animate-spin opacity-50" />
                <p className="text-indigo-100">正在分析您的財務數據...</p>
              </div>
            ) : advice ? (
              <div className="prose prose-invert max-w-none prose-sm leading-relaxed whitespace-pre-line">
                {advice}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <div className="bg-white/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <Sparkles size={32} />
                </div>
                <h4 className="text-xl font-bold mb-2">需要理財方向嗎？</h4>
                <p className="text-indigo-100">點擊上方按鈕，由 Gemini AI 為您的消費習慣與儲蓄計劃提供專業分析與建議。</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
