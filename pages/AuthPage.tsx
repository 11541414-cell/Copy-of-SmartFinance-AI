
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { auth } from '../services/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from 'firebase/auth';
import { Lock, Mail, UserPlus, LogIn, Zap } from 'lucide-react';

const AuthPage: React.FC = () => {
  const { setDemoMode } = useAppContext();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) {
      setError("Firebase 尚未正確設定，請使用展示模式。");
      return;
    }
    setLoading(true);
    setError('');
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      // AppContext handles state via onAuthStateChanged
    } catch (err: any) {
      setError(err.message || "認證發生錯誤，請檢查帳號密碼。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        <div className="p-8 text-center bg-indigo-600 text-white">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
            <span className="text-3xl font-bold">SF</span>
          </div>
          <h1 className="text-2xl font-bold">SmartFinance AI</h1>
          <p className="text-indigo-100 mt-2">您的個人智能理財助手</p>
        </div>

        <div className="p-8">
          <div className="flex gap-4 mb-8 bg-slate-100 p-1 rounded-xl">
            <button 
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${isLogin ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}
            >
              登入
            </button>
            <button 
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${!isLogin ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}
            >
              註冊
            </button>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            {error && (
              <div className="p-3 bg-rose-50 text-rose-600 text-sm rounded-lg border border-rose-100">
                {error}
              </div>
            )}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">電子郵件</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">密碼</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : isLogin ? (
                <><LogIn size={20} /> 登入系統</>
              ) : (
                <><UserPlus size={20} /> 建立帳號</>
              )}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
            <div className="relative flex justify-center text-xs uppercase font-bold text-slate-400"><span className="bg-white px-2">或是</span></div>
          </div>

          <button 
            onClick={() => setDemoMode(true)}
            className="w-full bg-slate-100 text-slate-600 py-3 rounded-xl font-bold hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
          >
            <Zap size={20} className="text-amber-500" /> 使用展示模式
          </button>
          <p className="text-center text-xs text-slate-400 mt-6 px-4">
            展示模式不需登入，資料儲存於本地瀏覽器。正式模式資料將與 Firebase 雲端同步。
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
