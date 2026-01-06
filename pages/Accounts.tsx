
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Plus, Trash2, Edit2, Wallet } from 'lucide-react';

const Accounts: React.FC = () => {
  const { accounts, addAccount, deleteAccount, updateAccount } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: '',
    type: '儲蓄',
    balance: 0,
    color: 'bg-indigo-600'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAccount) {
      await updateAccount({ ...formData, id: editingAccount.id });
    } else {
      await addAccount(formData);
    }
    setIsModalOpen(false);
    setEditingAccount(null);
    setFormData({ name: '', type: '儲蓄', balance: 0, color: 'bg-indigo-600' });
  };

  const colors = [
    'bg-indigo-600', 'bg-emerald-600', 'bg-rose-600', 'bg-amber-600', 
    'bg-purple-600', 'bg-slate-600', 'bg-blue-600', 'bg-pink-600'
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-slate-500">管理您的銀行帳戶、數位錢包與信用卡</p>
        <button 
          onClick={() => {
            setEditingAccount(null);
            setFormData({ name: '', type: '儲蓄', balance: 0, color: 'bg-indigo-600' });
            setIsModalOpen(true);
          }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <Plus size={20} /> 新增帳戶
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map((acc) => (
          <div key={acc.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className={`absolute top-0 left-0 w-1 h-full ${acc.color}`}></div>
            <div className="flex justify-between items-start mb-6">
              <div className={`p-3 rounded-xl ${acc.color} text-white`}>
                <Wallet size={24} />
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => {
                    setEditingAccount(acc);
                    setFormData({ name: acc.name, type: acc.type, balance: acc.balance, color: acc.color });
                    setIsModalOpen(true);
                  }}
                  className="p-2 text-slate-400 hover:text-indigo-600"
                >
                  <Edit2 size={18} />
                </button>
                <button 
                  onClick={() => deleteAccount(acc.id)}
                  className="p-2 text-slate-400 hover:text-rose-600"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            <h3 className="text-lg font-bold text-slate-800">{acc.name}</h3>
            <p className="text-sm text-slate-400 mb-4">{acc.type}</p>
            <div className="flex items-baseline gap-1">
              <span className="text-xs text-slate-400 font-medium">NT$</span>
              <span className="text-2xl font-bold text-slate-800">{acc.balance.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-6">{editingAccount ? '編輯帳戶' : '新增帳戶'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">帳戶名稱</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="例如：台新 Richart"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">帳戶類型</label>
                <select 
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option>儲蓄</option>
                  <option>數位帳戶</option>
                  <option>信用卡</option>
                  <option>錢包/現金</option>
                  <option>投資帳戶</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">初始金額 / 當前餘額</label>
                <input 
                  type="number" 
                  value={formData.balance}
                  onChange={(e) => setFormData({...formData, balance: Number(e.target.value)})}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">主題顏色</label>
                <div className="flex flex-wrap gap-2">
                  {colors.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setFormData({...formData, color: c})}
                      className={`w-8 h-8 rounded-full ${c} ${formData.color === c ? 'ring-2 ring-offset-2 ring-slate-800' : ''}`}
                    />
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  取消
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  確認
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Accounts;
