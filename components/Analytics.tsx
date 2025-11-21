
import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { Transaction, TransactionType, Currency, Subscription, BillingCycle } from '../types';

interface Props {
  transactions: Transaction[];
  subscriptions: Subscription[];
  isDarkMode?: boolean;
  currency: Currency;
}

const COLORS = ['#6366f1', '#8b5cf6', '#d946ef', '#ec4899', '#f43f5e', '#f97316', '#eab308', '#84cc16', '#22c55e', '#10b981', '#14b8a6'];

export const Analytics: React.FC<Props> = ({ transactions, subscriptions, isDarkMode = false, currency }) => {
  
  // --- Expense Pie Chart Data ---
  const expenseData = useMemo(() => {
    const categories: Record<string, number> = {};
    transactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .forEach(t => {
        categories[t.category] = (categories[t.category] || 0) + t.amount;
      });
    
    return Object.keys(categories).map(name => ({ name, value: categories[name] }))
                 .sort((a, b) => b.value - a.value); // Sort desc
  }, [transactions]);

  // --- Monthly Income/Expense Data ---
  const monthlyData = useMemo(() => {
    const months: Record<string, { income: number; expense: number }> = {};
    
    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const monthKey = d.toLocaleString('default', { month: 'short' });
      months[monthKey] = { income: 0, expense: 0 };
    }

    transactions.forEach(t => {
      const d = new Date(t.date);
      // Simple check if within last ~6 months visually (simplification for demo)
      const monthKey = d.toLocaleString('default', { month: 'short' });
      if (months[monthKey]) {
         if (t.type === TransactionType.INCOME) months[monthKey].income += t.amount;
         else months[monthKey].expense += t.amount;
      }
    });

    return Object.keys(months).map(key => ({
      name: key,
      Income: months[key].income,
      Expense: months[key].expense
    }));
  }, [transactions]);

  // --- Subscription Projection Data ---
  const { subscriptionData, subscriptionCategories } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const monthsData: Record<string, Record<string, number>> = {};
    const uniqueCategories = new Set<string>();
    
    // Initialize next 6 months
    const monthKeys: string[] = [];
    for (let i = 0; i < 6; i++) {
      const d = new Date(today.getFullYear(), today.getMonth() + i, 1);
      const key = d.toLocaleString('default', { month: 'short' });
      monthKeys.push(key);
      monthsData[key] = { name: key } as any; // name property for XAxis
    }

    subscriptions.forEach(sub => {
      const cat = sub.category as string;
      uniqueCategories.add(cat);

      // Normalize start date: if nextBillingDate is in past, project it to future
      let currentBillDate = new Date(sub.nextBillingDate);
      while (currentBillDate < today) {
         if (sub.billingCycle === BillingCycle.MONTHLY) {
             currentBillDate.setMonth(currentBillDate.getMonth() + 1);
         } else {
             currentBillDate.setFullYear(currentBillDate.getFullYear() + 1);
         }
      }

      // Project for the next 6 months
      // We check roughly up to 6-7 iterations to cover the window
      const endWindow = new Date(today.getFullYear(), today.getMonth() + 6, 0);
      
      let tempDate = new Date(currentBillDate);

      while (tempDate <= endWindow) {
         // Calculate relative month index from today (0 to 5)
         const monthDiff = (tempDate.getFullYear() - today.getFullYear()) * 12 + (tempDate.getMonth() - today.getMonth());
         
         if (monthDiff >= 0 && monthDiff < 6) {
             const key = monthKeys[monthDiff];
             monthsData[key][cat] = (monthsData[key][cat] || 0) + sub.amount;
         }

         // Advance date
         if (sub.billingCycle === BillingCycle.MONTHLY) {
             tempDate.setMonth(tempDate.getMonth() + 1);
         } else {
             tempDate.setFullYear(tempDate.getFullYear() + 1);
         }
      }
    });

    return {
        subscriptionData: monthKeys.map(k => monthsData[k]),
        subscriptionCategories: Array.from(uniqueCategories)
    };
  }, [subscriptions]);

  return (
    <div className="pb-24 pt-6 px-4 space-y-8 animate-fade-in">
      <div className="space-y-2 pr-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors">Analytics</h2>
        <p className="text-gray-500 dark:text-gray-400">Visualize your spending habits.</p>
      </div>

      {/* Expenses Breakdown */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">Expense Breakdown</h3>
        <div className="h-64 w-full">
           {expenseData.length > 0 ? (
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie
                   data={expenseData}
                   cx="50%"
                   cy="50%"
                   innerRadius={60}
                   outerRadius={80}
                   paddingAngle={5}
                   dataKey="value"
                   stroke={isDarkMode ? '#1f2937' : '#fff'}
                 >
                   {expenseData.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                   ))}
                 </Pie>
                 <Tooltip 
                    formatter={(value: number) => `${currency.symbol}${value.toFixed(2)}`}
                    contentStyle={{ 
                        backgroundColor: isDarkMode ? '#1f2937' : '#fff', 
                        borderColor: isDarkMode ? '#374151' : '#f3f4f6',
                        color: isDarkMode ? '#f3f4f6' : '#111827',
                        borderRadius: '12px' 
                    }}
                 />
               </PieChart>
             </ResponsiveContainer>
           ) : (
             <div className="h-full flex items-center justify-center text-gray-400 dark:text-gray-500">No expense data</div>
           )}
        </div>
        <div className="mt-4 space-y-2">
           {expenseData.slice(0, 4).map((entry, index) => (
             <div key={entry.name} className="flex items-center justify-between text-sm">
               <div className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                 <span className="text-gray-600 dark:text-gray-300">{entry.name}</span>
               </div>
               <span className="font-semibold text-gray-900 dark:text-white">{currency.symbol}{entry.value.toFixed(2)}</span>
             </div>
           ))}
        </div>
      </div>

      {/* Income vs Expense */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">Monthly Trend</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={isDarkMode ? 0.1 : 0.3} />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 12, fill: isDarkMode ? '#9ca3af' : '#6b7280'}} 
                dy={10} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 12, fill: isDarkMode ? '#9ca3af' : '#6b7280'}} 
              />
              <Tooltip 
                formatter={(value: number) => `${currency.symbol}${value.toFixed(2)}`}
                cursor={{fill: isDarkMode ? '#374151' : '#f3f4f6'}}
                contentStyle={{ 
                    backgroundColor: isDarkMode ? '#1f2937' : '#fff', 
                    borderColor: isDarkMode ? '#374151' : '#e5e7eb',
                    color: isDarkMode ? '#f3f4f6' : '#111827',
                    borderRadius: '12px', 
                    border: '1px solid',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
                }}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ opacity: isDarkMode ? 0.8 : 1 }} />
              <Bar dataKey="Income" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={40} />
              <Bar dataKey="Expense" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Subscription Projected Costs */}
      {subscriptions.length > 0 && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">Projected Subscription Costs</h3>
          <p className="text-xs text-gray-400 mb-4">Estimated recurring spend for next 6 months</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subscriptionData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={isDarkMode ? 0.1 : 0.3} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fontSize: 12, fill: isDarkMode ? '#9ca3af' : '#6b7280'}} 
                  dy={10} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fontSize: 12, fill: isDarkMode ? '#9ca3af' : '#6b7280'}} 
                />
                <Tooltip 
                  formatter={(value: number) => `${currency.symbol}${value.toFixed(2)}`}
                  cursor={{fill: isDarkMode ? '#374151' : '#f3f4f6'}}
                  contentStyle={{ 
                      backgroundColor: isDarkMode ? '#1f2937' : '#fff', 
                      borderColor: isDarkMode ? '#374151' : '#e5e7eb',
                      color: isDarkMode ? '#f3f4f6' : '#111827',
                      borderRadius: '12px', 
                      border: '1px solid',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
                  }}
                />
                <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ opacity: isDarkMode ? 0.8 : 1, fontSize: '10px' }} />
                {subscriptionCategories.map((category, index) => (
                  <Bar 
                    key={category} 
                    dataKey={category} 
                    stackId="a" 
                    fill={COLORS[index % COLORS.length]} 
                    radius={[0, 0, 0, 0]} 
                    maxBarSize={40} 
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};
