'use client';

import { useState } from 'react';
import { Transaction, INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../types';
import { getMonthlyTransactions, calculateMonthlyStats, formatCurrency } from '../utils/calculations';

interface HistoryTabProps {
  transactions: Transaction[];
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
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
  '給与': '💰',
};

export default function HistoryTab({
  transactions,
  updateTransaction,
  deleteTransaction,
  currentYear,
  currentMonth,
  setCurrentYear,
  setCurrentMonth,
}: HistoryTabProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Transaction>>({});

  const [filterCategory, setFilterCategory] = useState<string>('すべて');

  const monthlyTransactions = getMonthlyTransactions(transactions, currentYear, currentMonth);
  const stats = calculateMonthlyStats(monthlyTransactions);

  const filteredTransactions = filterCategory === 'すべて'
    ? monthlyTransactions
    : monthlyTransactions.filter(t => t.category === filterCategory);

  const sortedTransactions = [...filteredTransactions].sort((a, b) => b.date.localeCompare(a.date));

  const startEdit = (transaction: Transaction) => {
    setEditingId(transaction.id);
    setEditForm(transaction);
  };

  const saveEdit = () => {
    if (editingId && editForm) {
      updateTransaction(editingId, editForm);
      setEditingId(null);
      setEditForm({});
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const categories = editForm.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

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

      {/* Income and Expense Summary */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-600">収入</div>
            <div className="text-lg font-bold text-green-600">{formatCurrency(stats.income)}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">支出</div>
            <div className="text-lg font-bold text-red-600">{formatCurrency(stats.expense)}</div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="overflow-x-auto">
        <div className="flex gap-2 pb-2">
          <button
            onClick={() => setFilterCategory('すべて')}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              filterCategory === 'すべて'
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            すべて
          </button>
          {Array.from(new Set(monthlyTransactions.map(t => t.category))).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                filterCategory === cat
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Transaction List */}
      {sortedTransactions.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <div className="text-4xl mb-2">📝</div>
          <p className="text-sm">取引がありません</p>
        </div>
      ) : (
        <div className="space-y-2">
          {/* Group transactions by date */}
          {sortedTransactions.reduce((acc: { date: string; transactions: Transaction[] }[], transaction) => {
            const dateStr = transaction.date.split('-')[1] + '月' + transaction.date.split('-')[2] + '日';
            const existingGroup = acc.find(g => g.date === dateStr);
            if (existingGroup) {
              existingGroup.transactions.push(transaction);
            } else {
              acc.push({ date: dateStr, transactions: [transaction] });
            }
            return acc;
          }, []).map((group) => (
            <div key={group.date}>
              <div className="text-xs text-gray-500 font-medium mb-2 px-1">
                {group.date}
              </div>
              <div className="space-y-2">
                {group.transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="bg-white rounded-xl p-4 shadow-sm border border-gray-200"
                  >
                    {editingId === transaction.id ? (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">金額</label>
                            <input
                              type="number"
                              value={editForm.amount || ''}
                              onChange={(e) => setEditForm({ ...editForm, amount: parseFloat(e.target.value) })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">日付</label>
                            <input
                              type="date"
                              value={editForm.date || ''}
                              onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">カテゴリ</label>
                          <select
                            value={editForm.category || ''}
                            onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            {categories.map((cat) => (
                              <option key={cat} value={cat}>
                                {cat}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">説明</label>
                          <input
                            type="text"
                            value={editForm.description || ''}
                            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={saveEdit}
                            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                          >
                            保存
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                          >
                            キャンセル
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-xl">
                            {CATEGORY_ICONS[transaction.category] || '💰'}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 text-sm">
                              {transaction.description || transaction.category}
                            </div>
                            <div className="text-xs text-gray-500">
                              {transaction.category} • 楽天カード
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className={`font-bold text-sm ${
                            transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => startEdit(transaction)}
                              className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => {
                                if (confirm('この取引を削除しますか?')) {
                                  deleteTransaction(transaction.id);
                                }
                              }}
                              className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
