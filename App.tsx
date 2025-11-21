
import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { Analytics } from './components/Analytics';
import { Advisor } from './components/Advisor';
import { TransactionForm } from './components/TransactionForm';
import { Subscriptions } from './components/Subscriptions';
import { Profile } from './components/Profile';
import { HomeIcon, ChartPieIcon, PlusCircleIcon, SparklesIcon, RepeatIcon } from './components/ui/Icons';
import { Transaction, TransactionType, View, Category, Subscription, BillingCycle, CURRENCIES, Currency } from './types';

const App: React.FC = () => {
  // --- State ---
  const [view, setView] = useState<View>('dashboard');
  const [showAddModal, setShowAddModal] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  
  // Advisor & Pro State
  const [advisorUsage, setAdvisorUsage] = useState(() => {
    if (typeof window !== 'undefined') {
        return Number(localStorage.getItem('advisorUsage') || 0);
    }
    return 0;
  });
  
  const [isProUser, setIsProUser] = useState(() => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('isProUser') === 'true';
    }
    return false;
  });

  // Currency State
  const [currency, setCurrency] = useState<Currency>(() => {
    const saved = localStorage.getItem('currency');
    return saved ? JSON.parse(saved) : CURRENCIES[0];
  });

  // Dark Mode State
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  // --- Effects ---
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('currency', JSON.stringify(currency));
  }, [currency]);

  useEffect(() => {
    localStorage.setItem('advisorUsage', advisorUsage.toString());
  }, [advisorUsage]);

  useEffect(() => {
    localStorage.setItem('isProUser', String(isProUser));
  }, [isProUser]);

  // Load data from local storage or seed data
  useEffect(() => {
    const savedTrans = localStorage.getItem('transactions');
    const savedSubs = localStorage.getItem('subscriptions');

    if (savedTrans) {
      setTransactions(JSON.parse(savedTrans));
    } else {
      // Seed transaction data for demo
      const seedTrans: Transaction[] = [
        { id: '1', type: TransactionType.INCOME, amount: 5000, category: Category.SALARY, date: new Date().toISOString(), description: 'Monthly Salary' },
        { id: '2', type: TransactionType.EXPENSE, amount: 1200, category: Category.HOUSING, date: new Date().toISOString(), description: 'Rent' },
        { id: '3', type: TransactionType.EXPENSE, amount: 300, category: Category.FOOD, date: new Date(Date.now() - 86400000).toISOString(), description: 'Groceries' },
        { id: '4', type: TransactionType.EXPENSE, amount: 50, category: Category.TRANSPORT, date: new Date(Date.now() - 172800000).toISOString(), description: 'Gas' },
        { id: '5', type: TransactionType.EXPENSE, amount: 150, category: Category.ENTERTAINMENT, date: new Date(Date.now() - 259200000).toISOString(), description: 'Concert Tickets' },
      ];
      setTransactions(seedTrans);
      localStorage.setItem('transactions', JSON.stringify(seedTrans));
    }

    if (savedSubs) {
      setSubscriptions(JSON.parse(savedSubs));
    } else {
      // Seed subscription data
      const seedSubs: Subscription[] = [
        { id: '1', name: 'Netflix', amount: 15.99, billingCycle: BillingCycle.MONTHLY, category: Category.ENTERTAINMENT, nextBillingDate: new Date(Date.now() + 86400000 * 5).toISOString() },
        { id: '2', name: 'Spotify', amount: 9.99, billingCycle: BillingCycle.MONTHLY, category: Category.ENTERTAINMENT, nextBillingDate: new Date(Date.now() + 86400000 * 12).toISOString() },
        { id: '3', name: 'Amazon Prime', amount: 139, billingCycle: BillingCycle.YEARLY, category: Category.SHOPPING, nextBillingDate: new Date(Date.now() + 86400000 * 200).toISOString() },
      ];
      setSubscriptions(seedSubs);
      localStorage.setItem('subscriptions', JSON.stringify(seedSubs));
    }
  }, []);

  // Save whenever data changes
  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('subscriptions', JSON.stringify(subscriptions));
  }, [subscriptions]);

  // --- Handlers ---
  const handleAddTransaction = (newTransactions: Omit<Transaction, 'id'>[]) => {
    const transactionsWithIds = newTransactions.map(t => ({
        ...t,
        id: crypto.randomUUID()
    }));
    setTransactions([...transactions, ...transactionsWithIds]);
    setShowAddModal(false);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const handleAddSubscription = (newSub: Omit<Subscription, 'id'>) => {
    setSubscriptions([...subscriptions, { ...newSub, id: crypto.randomUUID() }]);
  };

  const handleDeleteSubscription = (id: string) => {
    setSubscriptions(subscriptions.filter(s => s.id !== id));
  };

  const handleAdvisorUsage = () => {
    setAdvisorUsage(prev => prev + 1);
  };

  const handleUpgradeToPro = () => {
    setIsProUser(true);
  };

  const handleClearData = () => {
    localStorage.removeItem('transactions');
    localStorage.removeItem('subscriptions');
    setTransactions([]);
    setSubscriptions([]);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans transition-colors overflow-hidden">
      
      {/* Content Area */}
      <main className="flex-1 overflow-y-auto no-scrollbar relative">
        
        {view === 'dashboard' && (
          <Dashboard 
            transactions={transactions} 
            onDelete={handleDeleteTransaction} 
            currency={currency}
            onCurrencyChange={setCurrency}
            onProfileClick={() => setView('profile')}
          />
        )}
        {view === 'analytics' && (
          <Analytics 
            transactions={transactions}
            subscriptions={subscriptions}
            isDarkMode={isDarkMode}
            currency={currency}
          />
        )}
        {view === 'advisor' && (
          <Advisor 
            transactions={transactions} 
            subscriptions={subscriptions}
            currency={currency}
            usageCount={advisorUsage}
            isPro={isProUser}
            onUse={handleAdvisorUsage}
            onUpgrade={handleUpgradeToPro}
          />
        )}
        {view === 'subscriptions' && (
          <Subscriptions 
            subscriptions={subscriptions} 
            onAdd={handleAddSubscription} 
            onDelete={handleDeleteSubscription}
            currency={currency}
          />
        )}
        {view === 'profile' && (
           <Profile 
              isPro={isProUser}
              isDarkMode={isDarkMode}
              toggleTheme={() => setIsDarkMode(!isDarkMode)}
              onClearData={handleClearData}
              onViewChange={setView}
           />
        )}
      </main>

      {/* Bottom Navigation */}
      {view !== 'profile' && (
        <nav className="bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 pb-safe pt-2 px-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] dark:shadow-none transition-colors z-40 animate-fade-in">
          <div className="flex justify-between items-center max-w-md mx-auto h-16">
            <button
              onClick={() => setView('dashboard')}
              className={`flex flex-col items-center gap-1 transition-colors ${view === 'dashboard' ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}`}
            >
              <HomeIcon className="w-6 h-6" />
              <span className="text-[10px] font-medium">Home</span>
            </button>

            <button
              onClick={() => setView('analytics')}
              className={`flex flex-col items-center gap-1 transition-colors ${view === 'analytics' ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}`}
            >
              <ChartPieIcon className="w-6 h-6" />
              <span className="text-[10px] font-medium">Analytics</span>
            </button>

            <div className="relative -top-6">
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-indigo-600 text-white p-4 rounded-full shadow-lg shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 hover:scale-105 transition-all"
              >
                <PlusCircleIcon className="w-7 h-7" />
              </button>
            </div>

            <button
              onClick={() => setView('subscriptions')}
              className={`flex flex-col items-center gap-1 transition-colors ${view === 'subscriptions' ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}`}
            >
              <RepeatIcon className="w-6 h-6" />
              <span className="text-[10px] font-medium">Subs</span>
            </button>

            <button
              onClick={() => setView('advisor')}
              className={`flex flex-col items-center gap-1 transition-colors ${view === 'advisor' ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}`}
            >
              <SparklesIcon className="w-6 h-6" />
              <span className="text-[10px] font-medium">Advisor</span>
            </button>
          </div>
        </nav>
      )}

      {/* Add Transaction Modal */}
      {showAddModal && (
        <div className="absolute inset-0 z-50 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-end animate-fade-in">
          <div className="w-full h-auto max-h-[90vh] overflow-y-auto">
             <TransactionForm 
                onAdd={handleAddTransaction} 
                onCancel={() => setShowAddModal(false)} 
                currency={currency}
             />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
