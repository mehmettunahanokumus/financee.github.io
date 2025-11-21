
import React, { useState } from 'react';
import { Transaction, Subscription, Currency } from '../types';
import { getFinancialAdvice } from '../services/geminiService';
import { SparklesIcon, LockIcon, StarIcon, CheckCircleIcon } from './ui/Icons';

interface Props {
  transactions: Transaction[];
  subscriptions: Subscription[];
  currency: Currency;
  usageCount: number;
  isPro: boolean;
  onUse: () => void;
  onUpgrade: () => void;
}

export const Advisor: React.FC<Props> = ({ 
  transactions, 
  subscriptions, 
  currency,
  usageCount,
  isPro,
  onUse,
  onUpgrade
}) => {
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);

  const handleGetAdvice = async () => {
    // Check for usage limit
    if (!isPro && usageCount >= 1) {
      setShowPaywall(true);
      return;
    }

    setLoading(true);
    const result = await getFinancialAdvice(transactions, subscriptions, currency);
    setAdvice(result);
    onUse(); // Increment usage
    setLoading(false);
  };

  const handleSimulateUpgrade = () => {
    setIsUpgrading(true);
    // Simulate network delay
    setTimeout(() => {
      onUpgrade();
      setIsUpgrading(false);
      setShowPaywall(false);
    }, 2000);
  };

  if (showPaywall) {
    return (
      <div className="pb-24 pt-6 px-4 flex flex-col h-full animate-fade-in items-center justify-center">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-2xl border border-indigo-100 dark:border-gray-700 max-w-sm w-full text-center relative overflow-hidden">
          {/* Decorative Gradient */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-indigo-600 to-purple-600 opacity-10 dark:opacity-20"></div>
          
          <div className="relative z-10">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-200 dark:shadow-none">
              <LockIcon className="w-10 h-10 text-white" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Unlock Pro Advisor</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
              You've used your free advice session. Upgrade to Financée Pro for unlimited AI-powered financial insights.
            </p>

            <div className="space-y-4 mb-8 text-left bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
              <div className="flex items-center gap-3">
                 <div className="bg-green-100 dark:bg-green-900/30 p-1 rounded-full">
                    <CheckCircleIcon className="w-4 h-4 text-green-600 dark:text-green-400" />
                 </div>
                 <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Unlimited AI Analysis</span>
              </div>
              <div className="flex items-center gap-3">
                 <div className="bg-green-100 dark:bg-green-900/30 p-1 rounded-full">
                    <CheckCircleIcon className="w-4 h-4 text-green-600 dark:text-green-400" />
                 </div>
                 <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Advanced Savings Tips</span>
              </div>
              <div className="flex items-center gap-3">
                 <div className="bg-green-100 dark:bg-green-900/30 p-1 rounded-full">
                    <CheckCircleIcon className="w-4 h-4 text-green-600 dark:text-green-400" />
                 </div>
                 <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Subscription Forecasts</span>
              </div>
            </div>

            <button 
              onClick={handleSimulateUpgrade}
              disabled={isUpgrading}
              className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none hover:shadow-xl hover:scale-105 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isUpgrading ? (
                <>
                   <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                   Processing...
                </>
              ) : (
                <>
                   <StarIcon className="w-5 h-5" />
                   Subscribe for $1.99/mo
                </>
              )}
            </button>
            
            <button 
               onClick={() => setShowPaywall(false)}
               className="mt-4 text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
               Maybe later
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24 pt-6 px-4 flex flex-col h-full animate-fade-in">
      <div className="space-y-2 mb-6 pr-12 flex justify-between items-end">
        <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors">AI Advisor</h2>
            <p className="text-gray-500 dark:text-gray-400">Smart insights to help you save better.</p>
        </div>
        {isPro && (
            <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                <StarIcon className="w-3 h-3" /> PRO
            </div>
        )}
      </div>

      <div className="flex-1">
        {!advice && !loading && (
          <div className="flex flex-col items-center justify-center h-64 text-center space-y-4 bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-indigo-50 dark:border-gray-700 transition-colors">
            <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <SparklesIcon className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors">Unlock Your Financial Potential</h3>
              <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">Let our Gemini-powered AI analyze your spending and provide actionable tips.</p>
              
              {!isPro && (
                  <p className="text-xs text-indigo-500 dark:text-indigo-400 mt-3 font-medium bg-indigo-50 dark:bg-indigo-900/20 py-1 px-3 rounded-lg inline-block">
                      {usageCount === 0 ? '1 Free Analysis Available' : 'Free limit reached'}
                  </p>
              )}
            </div>
            <button
              onClick={handleGetAdvice}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              {(!isPro && usageCount >= 1) && <LockIcon className="w-4 h-4" />}
              Analyze My Finances
            </button>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
            <p className="text-indigo-600 dark:text-indigo-400 font-medium animate-pulse">Thinking...</p>
          </div>
        )}

        {advice && !loading && (
          <div className="bg-gradient-to-br from-indigo-50 to-white dark:from-gray-800 dark:to-gray-900 p-6 rounded-3xl shadow-lg border border-indigo-100 dark:border-gray-700 animate-slide-up transition-colors">
            <div className="flex items-center gap-3 mb-4">
               <div className="p-2 bg-indigo-600 rounded-lg">
                  <SparklesIcon className="w-5 h-5 text-white" />
               </div>
               <h3 className="text-xl font-bold text-gray-900 dark:text-white transition-colors">Recommendations</h3>
            </div>
            
            <div 
              className="prose prose-indigo dark:prose-invert text-gray-700 dark:text-gray-300 text-sm leading-relaxed [&_li]:mb-3 [&_li]:bg-white dark:[&_li]:bg-gray-800 [&_li]:p-3 [&_li]:rounded-xl [&_li]:shadow-sm [&_li]:border [&_li]:border-gray-100 dark:[&_li]:border-gray-700 transition-colors"
              dangerouslySetInnerHTML={{ __html: advice }}
            />
            
            <button 
              onClick={() => setAdvice(null)}
              className="mt-6 w-full py-3 text-indigo-600 dark:text-indigo-400 font-medium hover:bg-indigo-50 dark:hover:bg-gray-800 rounded-xl transition-colors"
            >
              Clear Advice
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
