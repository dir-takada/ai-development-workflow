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
    <div>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">カテゴリ内訳</h2>
        <div className="flex gap-2 justify-center mb-4">
          <button
            onClick={() => {
              if (currentMonth === 1) {
                setCurrentYear(currentYear - 1);
                setCurrentMonth(12);
              } else {
                setCurrentMonth(currentMonth - 1);
              }
            }}
            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
          >
            ← 前月
          </button>
          <span className="px-4 py-1 bg-gray-100 rounded font-medium">
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
            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
          >
            次月 →
          </button>
        </div>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => setViewType('expense')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              viewType === 'expense'
                ? 'bg-red-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            支出
          </button>
          <button
            onClick={() => setViewType('income')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              viewType === 'income'
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            収入
          </button>
        </div>
      </div>

      {breakdown.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
          </svg>
          <p>この月の{viewType === 'expense' ? '支出' : '収入'}データはまだありません</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          <div className="flex items-center justify-center">
            <PieChart data={breakdown} type={viewType} />
          </div>
          <div>
            <div className="bg-gray-50 rounded-lg p-4">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-2 text-sm font-medium text-gray-700">カテゴリ</th>
                    <th className="text-right py-2 px-2 text-sm font-medium text-gray-700">金額</th>
                    <th className="text-right py-2 px-2 text-sm font-medium text-gray-700">割合</th>
                  </tr>
                </thead>
                <tbody>
                  {breakdown.map((item, index) => (
                    <tr key={item.category} className="border-b border-gray-100">
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: getColor(index, viewType) }}
                          />
                          <span className="text-sm font-medium text-gray-900">{item.category}</span>
                        </div>
                      </td>
                      <td className="text-right py-3 px-2">
                        <span className="text-sm font-semibold text-gray-900">
                          {formatCurrency(item.amount)}
                        </span>
                      </td>
                      <td className="text-right py-3 px-2">
                        <span className="text-sm text-gray-600">
                          {item.percentage.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-gray-300 font-bold">
                    <td className="py-3 px-2 text-sm text-gray-900">合計</td>
                    <td className="text-right py-3 px-2 text-sm text-gray-900">
                      {formatCurrency(breakdown.reduce((sum, item) => sum + item.amount, 0))}
                    </td>
                    <td className="text-right py-3 px-2 text-sm text-gray-900">100.0%</td>
                  </tr>
                </tfoot>
              </table>
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
