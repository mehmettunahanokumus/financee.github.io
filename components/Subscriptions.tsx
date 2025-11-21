
import React, { useMemo, useState } from 'react';
import { Subscription, BillingCycle, Currency } from '../types';
import { RepeatIcon, TrashIcon, PlusIcon, ExclamationCircleIcon } from './ui/Icons';
import { SubscriptionForm } from './SubscriptionForm';

interface Props {
  subscriptions: Subscription[];
  onAdd: (s: Omit<Subscription, 'id'>) => void;
  onDelete: (id: string) => void;
  currency: Currency;
}

// Map common service names to their actual domains for better logo matching
const DOMAIN_MAP: Record<string, string> = {
  'netflix': 'netflix.com',
  'spotify': 'spotify.com',
  'youtube': 'youtube.com',
  'youtube premium': 'youtube.com',
  'amazon': 'amazon.com',
  'amazon prime': 'amazon.com',
  'apple': 'apple.com',
  'apple music': 'apple.com',
  'icloud': 'apple.com',
  'icloud+': 'apple.com',
  'disney': 'disneyplus.com',
  'disney+': 'disneyplus.com',
  'hulu': 'hulu.com',
  'max': 'max.com',
  'hbo': 'hbo.com',
  'hbo max': 'max.com',
  'dropbox': 'dropbox.com',
  'chatgpt': 'openai.com',
  'chatgpt plus': 'openai.com',
  'openai': 'openai.com',
  'github': 'github.com',
  'adobe': 'adobe.com',
  'slack': 'slack.com',
  'notion': 'notion.so',
  'playstation': 'playstation.com',
  'ps plus': 'playstation.com',
  'xbox': 'xbox.com',
  'xbox game pass': 'xbox.com',
  'microsoft': 'microsoft.com',
  'office 365': 'office.com',
  'microsoft 365': 'office.com',
  'google': 'google.com',
  'google one': 'google.com',
  'prime video': 'primevideo.com',
  'audible': 'audible.com',
  'twitch': 'twitch.tv',
  'discord': 'discord.com',
  'patreon': 'patreon.com',
  'zoom': 'zoom.us',
};

// Helper component for Service Logo
const ServiceLogo: React.FC<{ name: string }> = ({ name }) => {
  const [error, setError] = useState(false);
  
  const getDomain = (serviceName: string) => {
    const normalized = serviceName.toLowerCase().trim();
    if (DOMAIN_MAP[normalized]) return DOMAIN_MAP[normalized];
    // Fallback: remove non-alphanumeric characters and append .com
    return normalized.replace(/[^a-z0-9-]/g, '') + '.com';
  };

  const domain = getDomain(name);
  const logoUrl = `https://logo.clearbit.com/${domain}`;

  // Fallback colors based on name hash to be deterministic
  const getColor = (str: string) => {
    const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-orange-500', 'bg-teal-500', 'bg-gray-600'];
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  if (error) {
    return (
      <div className={`w-12 h-12 rounded-2xl ${getColor(name)} flex items-center justify-center text-white text-xl font-bold shadow-sm ring-2 ring-white dark:ring-gray-800 shrink-0`}>
        {name.charAt(0).toUpperCase()}
      </div>
    );
  }

  return (
    // Always use white background for logo container to ensure dark logos (like GitHub/Notion) are visible in dark mode
    <div className="w-12 h-12 rounded-2xl bg-white p-1.5 shadow-sm flex items-center justify-center overflow-hidden border border-gray-100 dark:border-gray-600 shrink-0 ring-2 ring-transparent">
      <img 
        src={logoUrl} 
        alt={name} 
        className="w-full h-full object-contain"
        onError={() => setError(true)}
        loading="lazy"
      />
    </div>
  );
};

export const Subscriptions: React.FC<Props> = ({ subscriptions, onAdd, onDelete, currency }) => {
  const [isAdding, setIsAdding] = useState(false);

  const monthlyTotal = useMemo(() => {
    return subscriptions.reduce((acc, sub) => {
      if (sub.billingCycle === BillingCycle.MONTHLY) {
        return acc + sub.amount;
      } else {
        return acc + (sub.amount / 12);
      }
    }, 0);
  }, [subscriptions]);

  const getDaysDiff = (dateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const billDate = new Date(dateStr);
    billDate.setHours(0, 0, 0, 0);
    const diffTime = billDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getDueDateText = (days: number) => {
      if (days < 0) return `Overdue by ${Math.abs(days)} days`;
      if (days === 0) return 'Due Today';
      if (days === 1) return 'Due Tomorrow';
      return `Due in ${days} days`;
  };

  // Grouping Logic
  const groupedSubscriptions = useMemo(() => {
    const groups: Record<string, Subscription[]> = {
      'Overdue': [],
      'This Week': [],
      'Next Week': [],
      'This Month': [],
      'Later': []
    };

    const sorted = [...subscriptions].sort((a, b) => new Date(a.nextBillingDate).getTime() - new Date(b.nextBillingDate).getTime());

    sorted.forEach(sub => {
      const diff = getDaysDiff(sub.nextBillingDate);
      if (diff < 0) groups['Overdue'].push(sub);
      else if (diff <= 7) groups['This Week'].push(sub);
      else if (diff <= 14) groups['Next Week'].push(sub);
      else if (diff <= 30) groups['This Month'].push(sub);
      else groups['Later'].push(sub);
    });

    return groups;
  }, [subscriptions]);

  // Calculate totals per group for headers
  const groupTotals = useMemo(() => {
    const totals: Record<string, number> = {};
    Object.keys(groupedSubscriptions).forEach(key => {
      totals[key] = groupedSubscriptions[key].reduce((acc, sub) => acc + sub.amount, 0);
    });
    return totals;
  }, [groupedSubscriptions]);

  const groupOrder = ['Overdue', 'This Week', 'Next Week', 'This Month', 'Later'];

  if (isAdding) {
    return (
      <div className="h-full pt-20 bg-black/50 dark:bg-black/70 absolute inset-0 z-50 backdrop-blur-sm flex items-end">
         <div className="w-full h-auto max-h-[90vh] overflow-y-auto rounded-t-3xl bg-white dark:bg-gray-800 transition-colors">
            <SubscriptionForm currency={currency} onAdd={(s) => { onAdd(s); setIsAdding(false); }} onCancel={() => setIsAdding(false)} />
         </div>
      </div>
    );
  }

  return (
    <div className="pb-24 pt-6 px-4 space-y-6 animate-fade-in relative min-h-full">
      <div className="flex justify-between items-center pr-12">
        <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors">Subscriptions</h2>
            <p className="text-gray-500 dark:text-gray-400">Track your recurring payments.</p>
        </div>
        <button 
            onClick={() => setIsAdding(true)}
            className="p-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
        >
            <PlusIcon className="w-6 h-6" />
        </button>
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-6 text-white shadow-xl shadow-indigo-200 dark:shadow-none transition-colors relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2 opacity-80">
              <RepeatIcon className="w-5 h-5" />
              <span className="text-sm font-medium">Monthly Recurring Cost</span>
          </div>
          <h2 className="text-4xl font-bold">{currency.symbol}{monthlyTotal.toFixed(2)}</h2>
          <p className="text-indigo-100 text-sm mt-2">~{currency.symbol}{(monthlyTotal * 12).toFixed(0)} per year</p>
        </div>
        <div className="absolute -right-6 -top-10 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
      </div>

      {/* List */}
      <div className="space-y-6">
        {subscriptions.length === 0 ? (
             <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 transition-colors">
                <p className="text-gray-400 dark:text-gray-500">No subscriptions tracked yet.</p>
                <button onClick={() => setIsAdding(true)} className="mt-2 text-indigo-600 dark:text-indigo-400 font-medium">Add your first one</button>
             </div>
        ) : (
          groupOrder.map(group => {
            const subs = groupedSubscriptions[group];
            const total = groupTotals[group];
            if (subs.length === 0) return null;
            
            return (
              <div key={group} className="animate-fade-in">
                <div className="flex items-center justify-between mb-3 px-1">
                  <h3 className={`text-xs font-bold uppercase tracking-wider ${group === 'Overdue' ? 'text-red-500' : 'text-gray-400 dark:text-gray-500'}`}>
                    {group}
                  </h3>
                  <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                    {currency.symbol}{total.toFixed(2)}
                  </span>
                </div>

                <div className="space-y-3">
                  {subs.map((sub) => {
                    const daysDiff = getDaysDiff(sub.nextBillingDate);
                    const isOverdue = daysDiff < 0;
                    const isDueToday = daysDiff === 0;
                    
                    return (
                      <div 
                        key={sub.id} 
                        className={`flex items-center justify-between p-4 rounded-2xl shadow-sm border transition-colors relative overflow-hidden group
                          ${isOverdue 
                            ? 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-900 ring-1 ring-red-100 dark:ring-red-900/30' 
                            : isDueToday
                                ? 'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-900'
                                : 'bg-white dark:bg-gray-800 border-gray-50 dark:border-gray-700 hover:border-indigo-100 dark:hover:border-gray-600'
                          }`}
                      >
                        {/* Overdue Indicator Strip */}
                        {isOverdue && <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500"></div>}
                        
                        <div className="flex items-center gap-4 z-10">
                            <ServiceLogo name={sub.name} />
                            <div>
                                <p className="font-bold text-gray-900 dark:text-white transition-colors flex items-center gap-2">
                                  {sub.name}
                                  {isOverdue && <ExclamationCircleIcon className="w-4 h-4 text-red-500 animate-pulse" />}
                                </p>
                                <p className={`text-xs ${isOverdue ? 'text-red-600 dark:text-red-400 font-semibold' : isDueToday ? 'text-amber-600 dark:text-amber-500 font-semibold' : 'text-gray-500 dark:text-gray-400'}`}>
                                    {getDueDateText(daysDiff)} • {sub.billingCycle}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 z-10">
                            <p className={`font-bold text-base ${isOverdue ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'} transition-colors`}>
                              {currency.symbol}{sub.amount.toFixed(2)}
                            </p>
                            <button 
                                onClick={() => onDelete(sub.id)}
                                className="text-gray-300 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 transition-colors p-2 opacity-0 group-hover:opacity-100"
                            >
                                <TrashIcon className="w-5 h-5" />
                            </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
