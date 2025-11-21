
import React, { useMemo, useState } from 'react';
import { Transaction, TransactionType, Currency, CURRENCIES } from '../types';
import { ArrowDownIcon, ArrowUpIcon, TrashIcon, FunnelIcon, ArrowsUpDownIcon, GlobeIcon, LogoIcon, UserIcon, PencilSquareIcon } from './ui/Icons';

interface Props {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  currency: Currency;
  onCurrencyChange: (currency: Currency) => void;
  onProfileClick: () => void;
}

type SortOption = 'date' | 'amount' | 'category';
type FilterType = 'ALL' | 'INCOME' | 'EXPENSE';

export const Dashboard: React.FC<Props> = ({ 
  transactions, 
  onDelete, 
  currency, 
  onCurrencyChange,
  onProfileClick
}) => {
  // --- State for Filtering & Sorting ---
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  
  const [sortOption, setSortOption] = useState<SortOption>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  const [filterType, setFilterType] = useState<FilterType>('ALL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [expandedId, setExpandedId] = useState<string | null>(null);

  // --- Derived Data ---
  const summary = useMemo(() => {
    return transactions.reduce(
      (acc, curr) => {
        if (curr.type === TransactionType.INCOME) {
          acc.income += curr.amount;
        } else {
          acc.expense += curr.amount;
        }
        return acc;
      },
      { income: 0, expense: 0 }
    );
  }, [transactions]);

  const balance = summary.income - summary.expense;

  // Filter and Sort Logic
  const processedTransactions = useMemo(() => {
    let result = [...transactions];

    // 1. Filter by Type
    if (filterType !== 'ALL') {
      const typeEnum = filterType === 'INCOME' ? TransactionType.INCOME : TransactionType.EXPENSE;
      result = result.filter(t => t.type === typeEnum);
    }

    // 2. Filter by Date Range
    if (startDate) {
      result = result.filter(t => t.date >= startDate);
    }
    if (endDate) {
      // Add one day to include the end date fully if comparing by day, or simple string compare works if ISO YYYY-MM-DD
      result = result.filter(t => t.date <= endDate);
    }

    // 3. Sort
    result.sort((a, b) => {
      let comparison = 0;
      
      switch (sortOption) {
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case 'amount':
          comparison = a.amount - b.amount;
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [transactions, filterType, startDate, endDate, sortOption, sortDirection]);

  const toggleSortDirection = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const clearFilters = () => {
    setFilterType('ALL');
    setStartDate('');
    setEndDate('');
    setSortOption('date');
    setSortDirection('desc');
  };

  return (
    <div className="pb-24 pt-6 px-4 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-600 dark:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none">
              <LogoIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white transition-colors">Financée</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Hello, User</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Currency Selector */}
          <div className="relative">
              <button 
                  onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                  className="flex items-center gap-1 bg-white dark:bg-gray-800 p-2 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-200 text-xs font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                  <GlobeIcon className="w-4 h-4 text-indigo-500" />
                  <span>{currency.code}</span>
              </button>
              {isCurrencyOpen && (
                  <div className="absolute right-0 top-full mt-2 w-40 max-h-60 overflow-y-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 z-50 py-1 animate-fade-in">
                      {CURRENCIES.map(c => (
                          <button
                              key={c.code}
                              onClick={() => {
                                  onCurrencyChange(c);
                                  setIsCurrencyOpen(false);
                              }}
                              className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors ${currency.code === c.code ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' : 'text-gray-700 dark:text-gray-200'}`}
                          >
                              <span>{c.code}</span>
                              <span className="text-gray-400">{c.symbol}</span>
                          </button>
                      ))}
                  </div>
              )}
          </div>

          {/* Profile Button */}
          <button
              onClick={onProfileClick}
              className="p-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              aria-label="Go to Profile"
          >
             <UserIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Balance Card */}
      <div className="bg-indigo-600 dark:bg-indigo-700 rounded-3xl p-6 text-white shadow-xl shadow-indigo-200 dark:shadow-none relative overflow-hidden transition-colors">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-10 rounded-full -mr-10 -mt-10 blur-2xl pointer-events-none"></div>
        <div className="relative z-10">
          <p className="text-indigo-200 text-sm font-medium mb-1">Total Balance</p>
          <h2 className="text-4xl font-bold mb-6">{currency.symbol}{balance.toFixed(2)}</h2>
          
          <div className="flex gap-4">
            <div className="flex-1 bg-indigo-700/50 dark:bg-indigo-900/50 rounded-2xl p-3 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-indigo-200 text-xs mb-1">
                <div className="p-1 bg-indigo-500/30 rounded-full"><ArrowDownIcon className="w-3 h-3" /></div>
                Income
              </div>
              <p className="font-semibold text-lg">{currency.symbol}{summary.income.toFixed(2)}</p>
            </div>
            <div className="flex-1 bg-indigo-700/50 dark:bg-indigo-900/50 rounded-2xl p-3 backdrop-blur-sm">
               <div className="flex items-center gap-2 text-indigo-200 text-xs mb-1">
                <div className="p-1 bg-indigo-500/30 rounded-full"><ArrowUpIcon className="w-3 h-3" /></div>
                Expenses
              </div>
              <p className="font-semibold text-lg">{currency.symbol}{summary.expense.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white transition-colors">Transactions</h3>
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${isFilterOpen ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
          >
            <FunnelIcon className="w-4 h-4" />
            Filters
          </button>
        </div>

        {/* Collapsible Filter Panel */}
        {isFilterOpen && (
          <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mb-4 animate-slide-up transition-colors">
            <div className="space-y-4">
              
              {/* Filter Type */}
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Type</label>
                <div className="flex gap-2">
                  {(['ALL', 'INCOME', 'EXPENSE'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setFilterType(type)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex-1 ${
                        filterType === type
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-none'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {type.charAt(0) + type.slice(1).toLowerCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">From</label>
                  <input 
                    type="date" 
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-2 bg-gray-50 dark:bg-gray-700 rounded-lg text-sm border-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">To</label>
                  <input 
                    type="date" 
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full p-2 bg-gray-50 dark:bg-gray-700 rounded-lg text-sm border-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                  />
                </div>
              </div>

              {/* Sorting */}
              <div>
                 <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Sort By</label>
                 <div className="flex gap-2">
                    <select 
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value as SortOption)}
                      className="flex-1 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg text-sm border-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                    >
                      <option value="date">Date</option>
                      <option value="amount">Amount</option>
                      <option value="category">Category</option>
                    </select>
                    <button 
                      onClick={toggleSortDirection}
                      className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    >
                      <ArrowsUpDownIcon className={`w-5 h-5 transition-transform ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                    </button>
                 </div>
              </div>

              {/* Clear Button */}
              <div className="pt-2 border-t border-gray-100 dark:border-gray-700 flex justify-end">
                <button 
                  onClick={clearFilters}
                  className="text-sm text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium"
                >
                  Reset Filters
                </button>
              </div>

            </div>
          </div>
        )}

        {processedTransactions.length === 0 ? (
          <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 transition-colors">
            <p className="text-gray-400 dark:text-gray-500">No transactions found.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {processedTransactions.map((t) => (
              <div 
                key={t.id} 
                onClick={() => setExpandedId(expandedId === t.id ? null : t.id)}
                className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm border transition-all overflow-hidden cursor-pointer ${
                  expandedId === t.id 
                    ? 'border-indigo-500 ring-1 ring-indigo-500 dark:border-indigo-500 dark:ring-indigo-500' 
                    : 'border-gray-50 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-gray-600'
                }`}
              >
                {/* Main Row */}
                <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${t.type === TransactionType.INCOME ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'}`}>
                            {t.type === TransactionType.INCOME ? <ArrowDownIcon className="w-6 h-6" /> : <ArrowUpIcon className="w-6 h-6" />}
                        </div>
                        <div>
                            <p className="font-bold text-gray-900 dark:text-white transition-colors">{t.category}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                            {t.description ? t.description : new Date(t.date).toLocaleDateString()}
                            {t.description && <span className="block text-[10px] mt-0.5 opacity-75">{new Date(t.date).toLocaleDateString()}</span>}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="text-right">
                            <p className={`font-bold ${t.type === TransactionType.INCOME ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-white'}`}>
                            {t.type === TransactionType.INCOME ? '+' : '-'}{currency.symbol}{t.amount.toFixed(2)}
                            </p>
                        </div>
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(t.id);
                            }}
                            className="text-gray-300 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 transition-colors p-2"
                        >
                            <TrashIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Expanded Details */}
                {expandedId === t.id && (
                    <div className="px-4 pb-4 pt-0 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 animate-fade-in">
                        <div className="pt-4 space-y-4">
                            
                            {/* Installment Info */}
                            {t.installmentTotal && t.installmentCurrent && (
                                <div className="bg-white dark:bg-gray-700 p-3 rounded-xl border border-gray-200 dark:border-gray-600">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs font-bold text-indigo-600 dark:text-indigo-300 uppercase">Installment Plan</span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">{t.installmentCurrent} / {t.installmentTotal}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                                        <div 
                                            className="bg-indigo-600 h-2 rounded-full transition-all duration-500" 
                                            style={{width: `${(t.installmentCurrent / t.installmentTotal) * 100}%`}}
                                        ></div>
                                    </div>
                                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex justify-between">
                                        <span>Total: {currency.symbol}{(t.amount * t.installmentTotal).toFixed(2)}</span>
                                        <span>Remaining: {currency.symbol}{(t.amount * (t.installmentTotal - t.installmentCurrent)).toFixed(2)}</span>
                                    </div>
                                </div>
                            )}

                            {/* Details Grid */}
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-xs font-medium text-gray-400 uppercase block mb-1">Date</span>
                                    <p className="text-gray-700 dark:text-gray-200">
                                        {new Date(t.date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' })}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-xs font-medium text-gray-400 uppercase block mb-1">Category</span>
                                    <p className="text-gray-700 dark:text-gray-200">{t.category}</p>
                                </div>
                                <div className="col-span-2">
                                    <span className="text-xs font-medium text-gray-400 uppercase block mb-1">Description</span>
                                    <p className="text-gray-700 dark:text-gray-200">{t.description || 'No description provided.'}</p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-2">
                                <button 
                                    onClick={(e) => { e.stopPropagation(); /* Placeholder for edit */ }}
                                    className="flex-1 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
                                >
                                    <PencilSquareIcon className="w-4 h-4" />
                                    Edit
                                </button>
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete(t.id);
                                    }}
                                    className="flex-1 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-medium rounded-lg border border-red-100 dark:border-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors flex items-center justify-center gap-2"
                                >
                                    <TrashIcon className="w-4 h-4" />
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
