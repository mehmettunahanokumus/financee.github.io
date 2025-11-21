
import React, { useState, useEffect } from 'react';
import { Category, Transaction, TransactionType, Currency, INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../types';
import { ArrowDownIcon, ArrowUpIcon } from './ui/Icons';

interface Props {
  onAdd: (transactions: Omit<Transaction, 'id'>[]) => void;
  onCancel: () => void;
  currency: Currency;
}

export const TransactionForm: React.FC<Props> = ({ onAdd, onCancel, currency }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [category, setCategory] = useState<Category | string>(EXPENSE_CATEGORIES[0]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Installment State
  const [isInstallment, setIsInstallment] = useState(false);
  const [installments, setInstallments] = useState(3);

  // Reset category when type changes
  useEffect(() => {
    if (type === TransactionType.INCOME) {
      setCategory(INCOME_CATEGORIES[0]);
    } else {
      setCategory(EXPENSE_CATEGORIES[0]);
    }
  }, [type]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = Number(amount);
    if (!amount || isNaN(numAmount)) return;

    const transactionsToAdd: Omit<Transaction, 'id'>[] = [];
    const baseDescription = description.trim() || category;

    if (type === TransactionType.EXPENSE && isInstallment && installments > 1) {
      const installmentId = crypto.randomUUID();
      
      // Calculate exact amounts to handle rounding
      const monthlyBase = Math.floor((numAmount / installments) * 100) / 100;
      const remainder = Number((numAmount - (monthlyBase * installments)).toFixed(2));

      const startDate = new Date(date);

      for (let i = 0; i < installments; i++) {
        const currentAmount = i === 0 ? monthlyBase + remainder : monthlyBase;
        
        // Calculate date for this installment
        const installmentDate = new Date(startDate);
        installmentDate.setMonth(startDate.getMonth() + i);

        transactionsToAdd.push({
          amount: currentAmount,
          description: `${baseDescription} (Installment ${i + 1}/${installments})`,
          type,
          category,
          date: installmentDate.toISOString(),
          installmentId,
          installmentTotal: installments,
          installmentCurrent: i + 1
        });
      }
    } else {
      // Single transaction
      transactionsToAdd.push({
        amount: numAmount,
        description,
        type,
        category,
        date: new Date(date).toISOString(),
      });
    }

    onAdd(transactionsToAdd);
  };

  const activeCategories = type === TransactionType.INCOME ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-t-3xl shadow-2xl animate-slide-up p-6 overflow-y-auto transition-colors">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Add Transaction</h2>
        <button onClick={onCancel} className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white">Close</button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col space-y-5 pb-10">
        {/* Type Switcher */}
        <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-xl transition-colors">
          <button
            type="button"
            className={`flex-1 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${type === TransactionType.EXPENSE ? 'bg-white dark:bg-gray-800 shadow text-red-500 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}`}
            onClick={() => setType(TransactionType.EXPENSE)}
          >
            <ArrowDownIcon className="w-5 h-5" /> Expense
          </button>
          <button
            type="button"
            className={`flex-1 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${type === TransactionType.INCOME ? 'bg-white dark:bg-gray-800 shadow text-green-500 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}
            onClick={() => {
                setType(TransactionType.INCOME);
                setIsInstallment(false); // Disable installments for income
            }}
          >
            <ArrowUpIcon className="w-5 h-5" /> Income
          </button>
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {isInstallment ? 'Total Amount' : 'Amount'}
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-xl">{currency.symbol}</span>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full pl-10 pr-4 py-4 bg-gray-50 dark:bg-gray-700 rounded-xl text-3xl font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder-gray-300 dark:placeholder-gray-500"
              autoFocus
            />
          </div>
          {isInstallment && amount && !isNaN(Number(amount)) && (
             <p className="text-right text-xs text-gray-500 dark:text-gray-400 mt-1">
               ~{currency.symbol}{(Number(amount) / installments).toFixed(2)} / month
             </p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-4 bg-gray-50 dark:bg-gray-700 rounded-xl text-lg text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none transition-colors"
          >
            {activeCategories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
             {isInstallment ? 'First Payment Date' : 'Date'}
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-4 bg-gray-50 dark:bg-gray-700 rounded-xl text-lg text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
          />
        </div>

        {/* Installment Toggle (Expense Only) */}
        {type === TransactionType.EXPENSE && (
          <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl space-y-3 border border-indigo-100 dark:border-indigo-800 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                 <span className="text-indigo-900 dark:text-indigo-200 font-medium">Pay in Installments</span>
                 <span className="text-indigo-400 text-xs">Split cost over months</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={isInstallment} 
                  onChange={(e) => setIsInstallment(e.target.checked)} 
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-gray-300 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-200 dark:peer-focus:ring-indigo-900 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 dark:after:border-gray-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            {isInstallment && (
              <div className="animate-fade-in pt-2">
                <label className="block text-sm font-medium text-indigo-800 dark:text-indigo-300 mb-1">Number of Months: {installments}</label>
                <input 
                  type="range" 
                  min="2" 
                  max="24" 
                  value={installments} 
                  onChange={(e) => setInstallments(Number(e.target.value))}
                  className="w-full h-2 bg-indigo-200 dark:bg-indigo-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-xs text-indigo-400 mt-1">
                  <span>2 months</span>
                  <span>24 months</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description (Optional)</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., New Laptop, Furniture..."
            className="w-full p-4 bg-gray-50 dark:bg-gray-700 rounded-xl text-lg text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors placeholder-gray-400 dark:placeholder-gray-500"
          />
        </div>

        <button
          type="submit"
          disabled={!amount}
          className="w-full py-4 bg-indigo-600 text-white text-xl font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 dark:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4"
        >
          {isInstallment && type === TransactionType.EXPENSE 
            ? `Save ${installments} Transactions` 
            : 'Save Transaction'}
        </button>
      </form>
    </div>
  );
};
