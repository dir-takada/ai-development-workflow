'use client';

import { useState } from 'react';
import { useTransactions } from './hooks/useTransactions';
import OverviewTab from './components/OverviewTab';
import HistoryTab from './components/HistoryTab';
import BreakdownTab from './components/BreakdownTab';

type Tab = 'overview' | 'history' | 'breakdown';

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(1);
  const transactionContext = useTransactions();

  if (!transactionContext.isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z" />
            </svg>
            <h1 className="text-3xl font-bold text-gray-900">家計簿アプリ</h1>
          </div>
          <p className="text-gray-600">収入と支出を記録して、家計を管理しましょう</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all ${
              activeTab === 'overview'
                ? 'bg-white shadow-md text-gray-900'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              概要
            </div>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all ${
              activeTab === 'history'
                ? 'bg-white shadow-md text-gray-900'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              取引履歴
            </div>
          </button>
          <button
            onClick={() => setActiveTab('breakdown')}
            className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all ${
              activeTab === 'breakdown'
                ? 'bg-white shadow-md text-gray-900'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
              </svg>
              カテゴリ内訳
            </div>
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-lg p-6">
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
        </div>
      </div>
    </div>
  );
}
