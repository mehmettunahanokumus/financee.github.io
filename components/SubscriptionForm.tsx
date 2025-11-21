
import React, { useState } from 'react';
import { Category, Subscription, BillingCycle, Currency } from '../types';
import { RepeatIcon, MagnifyingGlassIcon, CheckCircleIcon } from './ui/Icons';

interface Props {
  onAdd: (s: Omit<Subscription, 'id'>) => void;
  onCancel: () => void;
  currency: Currency;
}

interface PopularSub {
  id: string;
  name: string;
  category: Category;
  defaultAmount?: number;
  color: string;
}

const POPULAR_SUBS: PopularSub[] = [
  { id: 'netflix', name: 'Netflix', category: Category.ENTERTAINMENT, defaultAmount: 15.49, color: 'bg-red-600' },
  { id: 'spotify', name: 'Spotify', category: Category.ENTERTAINMENT, defaultAmount: 10.99, color: 'bg-green-500' },
  { id: 'youtube', name: 'YouTube Premium', category: Category.ENTERTAINMENT, defaultAmount: 13.99, color: 'bg-red-500' },
  { id: 'amazon', name: 'Amazon Prime', category: Category.SHOPPING, defaultAmount: 14.99, color: 'bg-blue-400' },
  { id: 'apple', name: 'Apple Music', category: Category.ENTERTAINMENT, defaultAmount: 10.99, color: 'bg-pink-500' },
  { id: 'disney', name: 'Disney+', category: Category.ENTERTAINMENT, defaultAmount: 13.99, color: 'bg-blue-900' },
  { id: 'hulu', name: 'Hulu', category: Category.ENTERTAINMENT, defaultAmount: 7.99, color: 'bg-green-400' },
  { id: 'max', name: 'Max', category: Category.ENTERTAINMENT, defaultAmount: 15.99, color: 'bg-purple-600' },
  { id: 'icloud', name: 'iCloud+', category: Category.SOFTWARE, defaultAmount: 2.99, color: 'bg-blue-500' },
  { id: 'dropbox', name: 'Dropbox', category: Category.SOFTWARE, defaultAmount: 11.99, color: 'bg-indigo-500' },
  { id: 'chatgpt', name: 'ChatGPT Plus', category: Category.SOFTWARE, defaultAmount: 20.00, color: 'bg-emerald-600' },
  { id: 'gym', name: 'Gym', category: Category.HEALTH, defaultAmount: 50.00, color: 'bg-orange-500' },
];

export const SubscriptionForm: React.FC<Props> = ({ onAdd, onCancel, currency }) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [cycle, setCycle] = useState<BillingCycle>(BillingCycle.MONTHLY);
  const [category, setCategory] = useState<Category | string>(Category.ENTERTAINMENT);
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [nextDate, setNextDate] = useState(new Date().toISOString().split('T')[0]);

  const filteredSubs = POPULAR_SUBS.filter(sub => 
    sub.name.toLowerCase().includes(name.toLowerCase())
  );

  const handleSelectSub = (sub: PopularSub) => {
    setName(sub.name);
    setCategory(sub.category);
    setIsCustomCategory(false);
    if (sub.defaultAmount && !amount) {
      setAmount(sub.defaultAmount.toString());
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount)) || !name || !category) return;

    onAdd({
      name,
      amount: Number(amount),
      billingCycle: cycle,
      category,
      nextBillingDate: new Date(nextDate).toISOString(),
    });
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-t-3xl shadow-2xl animate-slide-up p-6 overflow-y-auto transition-colors">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400 transition-colors">
            <RepeatIcon className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white transition-colors">New Subscription</h2>
        </div>
        <button onClick={onCancel} className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors">Close</button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col space-y-6 pb-10">
        
        {/* Name Selection Section */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Service Name</label>
          
          {/* Search/Custom Input */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <MagnifyingGlassIcon className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Search or enter custom name..."
              className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-lg text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>

          {/* Popular Grid */}
          {filteredSubs.length > 0 && (
            <div className="mt-2">
              <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Popular Services</p>
              <div className="grid grid-cols-2 gap-3">
                {filteredSubs.slice(0, 8).map((sub) => (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => handleSelectSub(sub)}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left group
                      ${name === sub.name 
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 ring-1 ring-indigo-500' 
                        : 'border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-750 hover:border-indigo-200 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-sm ${sub.color}`}>
                      {sub.name.charAt(0)}
                    </div>
                    <span className={`text-sm font-medium flex-1 ${name === sub.name ? 'text-indigo-900 dark:text-indigo-200' : 'text-gray-700 dark:text-gray-200'}`}>
                      {sub.name}
                    </span>
                    {name === sub.name && <CheckCircleIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cost</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-xl">{currency.symbol}</span>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full pl-10 pr-4 py-4 bg-gray-50 dark:bg-gray-700 rounded-xl text-3xl font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder-gray-300 dark:placeholder-gray-500"
            />
          </div>
        </div>

        {/* Billing Cycle Switcher */}
        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Billing Cycle</label>
            <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-xl transition-colors">
            <button
                type="button"
                className={`flex-1 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${cycle === BillingCycle.MONTHLY ? 'bg-white dark:bg-gray-800 shadow text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400'}`}
                onClick={() => setCycle(BillingCycle.MONTHLY)}
            >
                Monthly
            </button>
            <button
                type="button"
                className={`flex-1 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${cycle === BillingCycle.YEARLY ? 'bg-white dark:bg-gray-800 shadow text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400'}`}
                onClick={() => setCycle(BillingCycle.YEARLY)}
            >
                Yearly
            </button>
            </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
          {isCustomCategory ? (
            <div className="flex gap-2 animate-fade-in">
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Enter category name"
                className="flex-1 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl text-lg text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors placeholder-gray-400 dark:placeholder-gray-500"
                autoFocus
              />
              <button
                type="button"
                onClick={() => {
                  setIsCustomCategory(false);
                  setCategory(Category.ENTERTAINMENT);
                }}
                className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-4 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          ) : (
            <select
              value={category}
              onChange={(e) => {
                if (e.target.value === 'CUSTOM') {
                  setIsCustomCategory(true);
                  setCategory('');
                } else {
                  setCategory(e.target.value);
                }
              }}
              className="w-full p-4 bg-gray-50 dark:bg-gray-700 rounded-xl text-lg text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none transition-colors"
            >
              {Object.values(Category).map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
              <option value="CUSTOM" className="text-indigo-600 dark:text-indigo-400 font-medium">+ Custom Category...</option>
            </select>
          )}
        </div>

        {/* Next Billing Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Next Billing Date</label>
          <input
            type="date"
            value={nextDate}
            onChange={(e) => setNextDate(e.target.value)}
            className="w-full p-4 bg-gray-50 dark:bg-gray-700 rounded-xl text-lg text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={!amount || !name || !category}
          className="w-full py-4 bg-indigo-600 text-white text-xl font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 dark:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4"
        >
          Add Subscription
        </button>
      </form>
    </div>
  );
};
