'use client';

import { Transaction } from '../types';
import { getMonthlyTransactions, calculateMonthlyStats, calculateCategoryBreakdown, formatCurrency } from '../utils/calculations';
import PieChart from './PieChart';

interface OverviewTabProps {
  transactions: Transaction[];
  currentYear: number;
  currentMonth: number;
  setCurrentYear: (year: number) => void;
  setCurrentMonth: (month: number) => void;
}

const CATEGORY_ICONS: Record<string, string> = {
  '住居': '🏠',
  '交通費': '🚗',
  '光熱費': '💡',
  '食費': '🍽️',
  '娯楽': '🎮',
  '外食': '🍔',
};

export default function OverviewTab({
  transactions,
  currentYear,
  currentMonth,
}: OverviewTabProps) {
  const monthlyTransactions = getMonthlyTransactions(transactions, currentYear, currentMonth);
  const stats = calculateMonthlyStats(monthlyTransactions);
  const expenseBreakdown = calculateCategoryBreakdown(monthlyTransactions, 'expense');

  // Calculate total balance (mock data for demonstration)
  const totalBalance = 1092567;

  // Get recent transactions
  const recentTransactions = [...monthlyTransactions]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Total Balance Card */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 text-white shadow-lg">
        <div className="text-sm text-gray-300 mb-2">総資産</div>
        <div className="text-4xl font-bold mb-1">{formatCurrency(totalBalance)}</div>
      </div>

      {/* Income and Expense Summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <div className="text-green-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <span className="text-sm text-gray-600">今月の収入</span>
          </div>
          <div className="text-xl font-bold text-green-600">{formatCurrency(stats.income)}</div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <div className="text-red-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
              </svg>
            </div>
            <span className="text-sm text-gray-600">今月の支出</span>
          </div>
          <div className="text-xl font-bold text-red-600">{formatCurrency(stats.expense)}</div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">カテゴリ別支出</h3>

        {expenseBreakdown.length > 0 ? (
          <>
            <div className="flex justify-center mb-6">
              <div className="w-48 h-48">
                <PieChart data={expenseBreakdown} type="expense" />
              </div>
            </div>

            <div className="space-y-3">
              {expenseBreakdown.slice(0, 6).map((item, index) => (
                <div key={item.category} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="text-2xl">
                      {CATEGORY_ICONS[item.category] || '📊'}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900">{item.category}</span>
                        <span className="text-xs text-gray-500">{item.percentage.toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                        <div
                          className="bg-purple-500 h-1.5 rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="text-sm font-bold text-gray-900 ml-3">
                    {formatCurrency(item.amount)}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <div className="text-4xl mb-2">📊</div>
            <p className="text-sm">支出データがありません</p>
          </div>
        )}
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">最近の取引</h3>
          <button className="text-blue-600 text-sm font-medium">
            すべて見る &gt;
          </button>
        </div>

        {recentTransactions.length > 0 ? (
          <div className="space-y-3">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-xl">
                    {CATEGORY_ICONS[transaction.category] || '💰'}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 text-sm">
                      {transaction.description || transaction.category}
                    </div>
                    <div className="text-xs text-gray-500">
                      {transaction.category} • {transaction.date.split('-')[1]}月{transaction.date.split('-')[2]}日
                    </div>
                  </div>
                </div>
                <div className={`font-bold text-sm ${
                  transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <div className="text-4xl mb-2">📝</div>
            <p className="text-sm">取引がありません</p>
          </div>
        )}
      </div>
    </div>
  );
}
