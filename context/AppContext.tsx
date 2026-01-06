import React, { createContext, useContext, useState, useEffect } from 'react';
import { BankAccount, Transaction, Category, UserProfile, AppState } from '../types';
import { DEFAULT_CATEGORIES, MOCK_ACCOUNTS, MOCK_TRANSACTIONS } from '../constants';
import { auth, db, isFirebaseAvailable } from '../services/firebase';
import { 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  addDoc, 
  deleteDoc, 
  query, 
  where 
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

interface AppContextType extends AppState {
  setDemoMode: (val: boolean) => void;
  setUser: (user: UserProfile | null) => void;
  addAccount: (acc: Omit<BankAccount, 'id'>) => Promise<void>;
  updateAccount: (acc: BankAccount) => Promise<void>;
  deleteAccount: (id: string) => Promise<void>;
  addTransaction: (t: Omit<Transaction, 'id'>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDemoMode, setIsDemoMode] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [accounts, setAccounts] = useState<BankAccount[]>(MOCK_ACCOUNTS);
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [categories] = useState<Category[]>(DEFAULT_CATEGORIES);

  useEffect(() => {
    const currentAuth = auth;
    if (!isFirebaseAvailable() || !currentAuth) {
      setIsDemoMode(true);
      return;
    }

    const unsubscribeAuth = onAuthStateChanged(currentAuth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({ uid: firebaseUser.uid, email: firebaseUser.email || '' });
        setIsDemoMode(false);
      } else {
        setUser(null);
        setIsDemoMode(true);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    const currentDb = db;
    if (isDemoMode || !user || !currentDb) {
      if (isDemoMode) {
        setAccounts(MOCK_ACCOUNTS);
        setTransactions(MOCK_TRANSACTIONS);
      }
      return;
    }

    const qAccounts = query(collection(currentDb, 'accounts'), where('userId', '==', user.uid));
    const unsubscribeAcc = onSnapshot(qAccounts, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BankAccount));
      setAccounts(data);
    });

    const qTrans = query(collection(currentDb, 'transactions'), where('userId', '==', user.uid));
    const unsubscribeTrans = onSnapshot(qTrans, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Transaction));
      setTransactions(data);
    });

    return () => {
      unsubscribeAcc();
      unsubscribeTrans();
    };
  }, [isDemoMode, user]);

  const addAccount = async (acc: Omit<BankAccount, 'id'>) => {
    const currentDb = db;
    if (isDemoMode) {
      const newAcc = { ...acc, id: `demo-${Date.now()}` };
      setAccounts(prev => [...prev, newAcc]);
    } else if (user && currentDb) {
      await addDoc(collection(currentDb, 'accounts'), { ...acc, userId: user.uid });
    }
  };

  const updateAccount = async (acc: BankAccount) => {
    const currentDb = db;
    if (isDemoMode) {
      setAccounts(prev => prev.map(a => a.id === acc.id ? acc : a));
    } else if (user && currentDb) {
      const { id, ...data } = acc;
      await setDoc(doc(currentDb, 'accounts', id), { ...data, userId: user.uid });
    }
  };

  const deleteAccount = async (id: string) => {
    const currentDb = db;
    if (isDemoMode) {
      setAccounts(prev => prev.filter(a => a.id !== id));
      setTransactions(prev => prev.filter(t => t.accountId !== id));
    } else if (user && currentDb) {
      await deleteDoc(doc(currentDb, 'accounts', id));
    }
  };

  const addTransaction = async (t: Omit<Transaction, 'id'>) => {
    const currentDb = db;
    if (isDemoMode) {
      const newT = { ...t, id: `t-${Date.now()}` };
      setTransactions(prev => [...prev, newT]);
      setAccounts(prev => prev.map(a => {
        if (a.id === t.accountId) {
          const change = t.type === 'INCOME' ? t.amount : -t.amount;
          return { ...a, balance: a.balance + change };
        }
        return a;
      }));
    } else if (user && currentDb) {
      await addDoc(collection(currentDb, 'accounts'), { ...t, userId: user.uid });
    }
  };

  const deleteTransaction = async (id: string) => {
    const currentDb = db;
    if (isDemoMode) {
      const t = transactions.find(x => x.id === id);
      if (t) {
        setAccounts(prev => prev.map(a => {
          if (a.id === t.accountId) {
            const change = t.type === 'INCOME' ? -t.amount : t.amount;
            return { ...a, balance: a.balance + change };
          }
          return a;
        }));
      }
      setTransactions(prev => prev.filter(x => x.id !== id));
    } else if (user && currentDb) {
      await deleteDoc(doc(currentDb, 'transactions', id));
    }
  };

  return (
    <AppContext.Provider value={{ 
      accounts, transactions, categories, isDemoMode, user,
      setDemoMode: setIsDemoMode,
      setUser,
      addAccount, updateAccount, deleteAccount,
      addTransaction, deleteTransaction
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within AppProvider");
  return context;
};