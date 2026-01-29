'use client';

import { useState } from 'react';
import { useTransactions } from './hooks/useTransactions';
import OverviewTab from './components/OverviewTab';
import HistoryTab from './components/HistoryTab';
import BreakdownTab from './components/BreakdownTab';
import AccountsTab from './components/AccountsTab';
import AddTransactionModal from './components/AddTransactionModal';

type Tab = 'overview' | 'history' | 'breakdown' | 'accounts';

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const transactionContext = useTransactions();

  if (!transactionContext.isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-600">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24 relative">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-900">家計簿</h1>
          <div className="text-sm text-gray-500">
            {currentYear}年{currentMonth}月
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-4 py-4 max-w-md mx-auto">
        {activeTab === 'overview' && (
          <OverviewTab
            currentYear={currentYear}
            currentMonth={currentMonth}
            setCurrentYear={setCurrentYear}
            setCurrentMonth={setCurrentMonth}
            {...transactionContext}
          />
        )}
        {activeTab === 'history' && (
          <HistoryTab
            currentYear={currentYear}
            currentMonth={currentMonth}
            setCurrentYear={setCurrentYear}
            setCurrentMonth={setCurrentMonth}
            {...transactionContext}
          />
        )}
        {activeTab === 'breakdown' && (
          <BreakdownTab
            currentYear={currentYear}
            currentMonth={currentMonth}
            setCurrentYear={setCurrentYear}
            setCurrentMonth={setCurrentMonth}
            {...transactionContext}
          />
        )}
        {activeTab === 'accounts' && (
          <AccountsTab />
        )}
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => setIsAddModalOpen(true)}
        className="fixed bottom-20 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gray-900 text-white rounded-full shadow-2xl hover:bg-gray-800 transition-all flex items-center justify-center z-20"
        style={{ boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)' }}
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
        </svg>
      </button>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
        <div className="max-w-md mx-auto flex items-center justify-around py-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex flex-col items-center justify-center py-2 px-4 transition-colors ${
              activeTab === 'overview' ? 'text-gray-900' : 'text-gray-400'
            }`}
          >
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-xs">概要</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex flex-col items-center justify-center py-2 px-4 transition-colors ${
              activeTab === 'history' ? 'text-gray-900' : 'text-gray-400'
            }`}
          >
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            <span className="text-xs">履歴</span>
          </button>
          <div className="w-16"></div>
          <button
            onClick={() => setActiveTab('breakdown')}
            className={`flex flex-col items-center justify-center py-2 px-4 transition-colors ${
              activeTab === 'breakdown' ? 'text-gray-900' : 'text-gray-400'
            }`}
          >
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
            </svg>
            <span className="text-xs">内訳</span>
          </button>
          <button
            onClick={() => setActiveTab('accounts')}
            className={`flex flex-col items-center justify-center py-2 px-4 transition-colors ${
              activeTab === 'accounts' ? 'text-gray-900' : 'text-gray-400'
            }`}
          >
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            <span className="text-xs">口座</span>
          </button>
        </div>
      </div>

      {/* Add Transaction Modal */}
      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        currentYear={currentYear}
        currentMonth={currentMonth}
        addTransaction={transactionContext.addTransaction}
      />
    </div>
  );
}
