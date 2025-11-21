
import React, { useState } from 'react';
import { UserIcon, CreditCardIcon, CogIcon, BellIcon, ShieldIcon, StarIcon, LogoutIcon, SunIcon, MoonIcon, CheckCircleIcon } from './ui/Icons';

interface Props {
  isPro: boolean;
  isDarkMode: boolean;
  toggleTheme: () => void;
  onClearData: () => void;
  onViewChange: (view: 'dashboard') => void;
}

export const Profile: React.FC<Props> = ({ isPro, isDarkMode, toggleTheme, onClearData, onViewChange }) => {
  const [activeTab, setActiveTab] = useState<'settings' | 'plan' | 'payments'>('settings');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Simulation states
  const [isProcessing, setIsProcessing] = useState(false);
  const [notificationEnabled, setNotificationEnabled] = useState(true);

  const handleClearData = () => {
    setIsProcessing(true);
    setTimeout(() => {
      onClearData();
      setIsProcessing(false);
      setShowClearConfirm(false);
      onViewChange('dashboard');
    }, 1000);
  };

  return (
    <div className="pb-24 pt-6 px-4 space-y-6 animate-fade-in min-h-full bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors">My Profile</h2>
        <button onClick={() => onViewChange('dashboard')} className="text-indigo-600 dark:text-indigo-400 font-medium">
            Done
        </button>
      </div>

      {/* User Card */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors flex items-center gap-4">
        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <UserIcon className="w-8 h-8 text-gray-400 dark:text-gray-500" />
        </div>
        <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">User Name</h3>
            <div className="flex items-center gap-2">
                <span className="text-gray-500 dark:text-gray-400 text-sm">user@example.com</span>
                {isPro && (
                    <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-0.5">
                        <StarIcon className="w-3 h-3" /> PRO
                    </span>
                )}
            </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-gray-200 dark:bg-gray-700/50 p-1 rounded-xl">
        <button 
            onClick={() => setActiveTab('settings')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'settings' ? 'bg-white dark:bg-gray-800 shadow text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}
        >
            Settings
        </button>
        <button 
            onClick={() => setActiveTab('plan')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'plan' ? 'bg-white dark:bg-gray-800 shadow text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}
        >
            Plan
        </button>
        <button 
            onClick={() => setActiveTab('payments')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'payments' ? 'bg-white dark:bg-gray-800 shadow text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}
        >
            Payments
        </button>
      </div>

      {/* Content Area */}
      <div className="animate-slide-up">
        
        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
            <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                    {/* Appearance */}
                    <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
                                {isDarkMode ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900 dark:text-white">Dark Mode</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Adjust app appearance</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={isDarkMode} onChange={toggleTheme} className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                        </label>
                    </div>

                    {/* Notifications */}
                    <div className="p-4 flex items-center justify-between">
                         <div className="flex items-center gap-3">
                            <div className="p-2 bg-pink-50 dark:bg-pink-900/30 rounded-lg text-pink-600 dark:text-pink-400">
                                <BellIcon className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900 dark:text-white">Notifications</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Bill reminders & tips</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={notificationEnabled} onChange={() => setNotificationEnabled(!notificationEnabled)} className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 dark:peer-focus:ring-pink-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-pink-500"></div>
                        </label>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3">
                        <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300">
                            <ShieldIcon className="w-5 h-5" />
                        </div>
                        <span className="font-semibold text-gray-900 dark:text-white flex-1">Privacy & Security</span>
                        <div className="w-5 h-5 text-gray-400"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg></div>
                    </div>
                     <div className="p-4 flex items-center gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300">
                            <CogIcon className="w-5 h-5" />
                        </div>
                        <span className="font-semibold text-gray-900 dark:text-white flex-1">Account Settings</span>
                         <div className="w-5 h-5 text-gray-400"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg></div>
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="bg-red-50 dark:bg-red-900/10 rounded-2xl p-4 border border-red-100 dark:border-red-900/30">
                    <h3 className="text-red-700 dark:text-red-400 font-bold mb-2">Danger Zone</h3>
                    
                    {!showClearConfirm ? (
                        <button 
                            onClick={() => setShowClearConfirm(true)}
                            className="w-full py-3 bg-white dark:bg-gray-800 text-red-600 dark:text-red-400 font-semibold rounded-xl border border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center justify-center gap-2"
                        >
                            <LogoutIcon className="w-5 h-5" />
                            Reset All App Data
                        </button>
                    ) : (
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-red-200 dark:border-red-800 animate-fade-in">
                            <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 text-center">
                                Are you sure? This will delete all transactions and subscriptions permanently.
                            </p>
                            <div className="flex gap-3">
                                <button 
                                    onClick={() => setShowClearConfirm(false)}
                                    className="flex-1 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleClearData}
                                    className="flex-1 py-2 bg-red-600 text-white font-medium rounded-lg flex items-center justify-center gap-2"
                                >
                                    {isProcessing && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
                                    Confirm Reset
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                
                <div className="text-center text-xs text-gray-400 pt-4">
                    Financée v1.0.0
                </div>
            </div>
        )}

        {/* PLAN TAB */}
        {activeTab === 'plan' && (
            <div className="space-y-6">
                <div className={`rounded-3xl p-6 text-white shadow-lg relative overflow-hidden ${isPro ? 'bg-gradient-to-br from-amber-500 to-orange-600' : 'bg-gradient-to-br from-gray-700 to-gray-900'}`}>
                     <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <span className="bg-white/20 text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm">CURRENT PLAN</span>
                            {isPro && <StarIcon className="w-6 h-6" />}
                        </div>
                        <h2 className="text-3xl font-bold mb-1">{isPro ? 'Financée Pro' : 'Free Starter'}</h2>
                        <p className="text-white/80 text-sm">{isPro ? 'Next billing: Oct 24, 2024' : 'Upgrade to unlock full potential'}</p>
                     </div>
                     <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                </div>

                {!isPro && (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Upgrade to Pro</h3>
                        <ul className="space-y-3 mb-6">
                            <li className="flex items-center gap-3 text-gray-600 dark:text-gray-300 text-sm">
                                <CheckCircleIcon className="w-5 h-5 text-green-500" />
                                Unlimited AI Advisor access
                            </li>
                            <li className="flex items-center gap-3 text-gray-600 dark:text-gray-300 text-sm">
                                <CheckCircleIcon className="w-5 h-5 text-green-500" />
                                Advanced export options
                            </li>
                             <li className="flex items-center gap-3 text-gray-600 dark:text-gray-300 text-sm">
                                <CheckCircleIcon className="w-5 h-5 text-green-500" />
                                Multi-device sync
                            </li>
                        </ul>
                        <button className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none">
                            Subscribe for $1.99/mo
                        </button>
                    </div>
                )}
            </div>
        )}

        {/* PAYMENTS TAB */}
        {activeTab === 'payments' && (
            <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 text-center py-12">
                    <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 mx-auto mb-4">
                        <CreditCardIcon className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Payment Methods</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                        Manage your credit cards and billing details securely.
                    </p>
                    <button className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                        Add New Card
                    </button>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};
