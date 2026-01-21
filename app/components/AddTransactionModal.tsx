'use client';

import { useState } from 'react';
import { Transaction, INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../types';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentYear: number;
  currentMonth: number;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
}

export default function AddTransactionModal({
  isOpen,
  onClose,
  currentYear,
  currentMonth,
  addTransaction,
}: AddTransactionModalProps) {
  const [formType, setFormType] = useState<'income' | 'expense'>('expense');
  const [formAmount, setFormAmount] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formDate, setFormDate] = useState(
    `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formAmount || !formCategory || !formDate) return;

    addTransaction({
      type: formType,
      amount: parseFloat(formAmount),
      category: formCategory,
      description: formDescription,
      date: formDate,
    });

    setFormAmount('');
    setFormCategory('');
    setFormDescription('');
    onClose();
  };

  const categories = formType === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-center">
      <div className="bg-white rounded-t-3xl w-full max-w-md p-6 animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">取引を追加</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">取引種類</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setFormType('income');
                  setFormCategory('');
                }}
                className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                  formType === 'income'
                    ? 'bg-green-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                収入
              </button>
              <button
                type="button"
                onClick={() => {
                  setFormType('expense');
                  setFormCategory('');
                }}
                className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                  formType === 'expense'
                    ? 'bg-red-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                支出
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">金額</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg">¥</span>
              <input
                type="number"
                value={formAmount}
                onChange={(e) => setFormAmount(e.target.value)}
                placeholder="0"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">日付</label>
            <input
              type="date"
              value={formDate}
              onChange={(e) => setFormDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">カテゴリ</label>
            <select
              value={formCategory}
              onChange={(e) => setFormCategory(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
              required
            >
              <option value="">選択してください</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">説明（任意）</label>
            <input
              type="text"
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              placeholder="詳細を入力"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-medium text-lg mt-6"
          >
            追加
          </button>
        </form>
      </div>
    </div>
  );
}
