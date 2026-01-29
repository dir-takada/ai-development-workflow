'use client';

import { useState } from 'react';
import { Transaction } from '../types';
import { getMonthlyTransactions, calculateCategoryBreakdown, formatCurrency } from '../utils/calculations';
import PieChart from './PieChart';

interface BreakdownTabProps {
  transactions: Transaction[];
  currentYear: number;
  currentMonth: number;
  setCurrentYear: (year: number) => void;
  setCurrentMonth: (month: number) => void;
}

export default function BreakdownTab({
  transactions,
  currentYear,
  currentMonth,
  setCurrentYear,
  setCurrentMonth,
}: BreakdownTabProps) {
  const [viewType, setViewType] = useState<'expense' | 'income'>('expense');

  const monthlyTransactions = getMonthlyTransactions(transactions, currentYear, currentMonth);
  const breakdown = calculateCategoryBreakdown(monthlyTransactions, viewType);

  return (
    <div className="space-y-4">
      {/* Month Navigation */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => {
            if (currentMonth === 1) {
              setCurrentYear(currentYear - 1);
              setCurrentMonth(12);
            } else {
              setCurrentMonth(currentMonth - 1);
            }
          }}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="text-lg font-bold text-gray-900 min-w-[120px] text-center">
          {currentYear}年{currentMonth}月
        </span>
        <button
          onClick={() => {
            if (currentMonth === 12) {
              setCurrentYear(currentYear + 1);
              setCurrentMonth(1);
            } else {
              setCurrentMonth(currentMonth + 1);
            }
          }}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Type Selector */}
      <div className="flex gap-2">
        <button
          onClick={() => setViewType('expense')}
          className={`flex-1 py-3 rounded-xl font-medium transition-all ${
            viewType === 'expense'
              ? 'bg-red-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          支出
        </button>
        <button
          onClick={() => setViewType('income')}
          className={`flex-1 py-3 rounded-xl font-medium transition-all ${
            viewType === 'income'
              ? 'bg-green-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          収入
        </button>
      </div>

      {breakdown.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <div className="text-4xl mb-2">📊</div>
          <p className="text-sm">この月の{viewType === 'expense' ? '支出' : '収入'}データはありません</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Pie Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex justify-center mb-2">
              <div className="w-64 h-64">
                <PieChart data={breakdown} type={viewType} />
              </div>
            </div>
          </div>

          {/* Category Table */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">カテゴリ別詳細</h3>
            <div className="space-y-3">
              {breakdown.map((item, index) => (
                <div key={item.category} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3 flex-1">
                    <div
                      className="w-4 h-4 rounded-full flex-shrink-0"
                      style={{ backgroundColor: getColor(index, viewType) }}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-900">{item.category}</span>
                        <span className="text-xs text-gray-500">{item.percentage.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all"
                          style={{
                            width: `${item.percentage}%`,
                            backgroundColor: getColor(index, viewType),
                          }}
                        />
                      </div>
                    </div>
                    <div className="text-sm font-bold text-gray-900 ml-3">
                      {formatCurrency(item.amount)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="border-t-2 border-gray-300 mt-4 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-base font-bold text-gray-900">合計</span>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">100.0%</span>
                  <span className="text-base font-bold text-gray-900">
                    {formatCurrency(breakdown.reduce((sum, item) => sum + item.amount, 0))}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function getColor(index: number, type: 'income' | 'expense'): string {
  const expenseColors = [
    '#ef4444', // red-500
    '#f97316', // orange-500
    '#f59e0b', // amber-500
    '#eab308', // yellow-500
    '#84cc16', // lime-500
    '#22c55e', // green-500
    '#10b981', // emerald-500
    '#14b8a6', // teal-500
  ];

  const incomeColors = [
    '#22c55e', // green-500
    '#10b981', // emerald-500
    '#14b8a6', // teal-500
    '#06b6d4', // cyan-500
  ];

  const colors = type === 'expense' ? expenseColors : incomeColors;
  return colors[index % colors.length];
}
