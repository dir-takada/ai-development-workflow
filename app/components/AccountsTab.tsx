'use client';

import { useState } from 'react';
import { formatCurrency } from '../utils/calculations';

interface Account {
  id: string;
  name: string;
  balance: number;
  type: 'bank' | 'cash' | 'card' | 'savings';
  icon: string;
}

export default function AccountsTab() {
  const [accounts] = useState<Account[]>([
    { id: '1', name: '現金', balance: 50000, type: 'cash', icon: '💵' },
    { id: '2', name: '三菱UFJ銀行', balance: 842567, type: 'bank', icon: '🏦' },
    { id: '3', name: 'クレジットカード', balance: 200000, type: 'card', icon: '💳' },
  ]);

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);

  return (
    <div className="space-y-6">
      {/* Total Balance */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 text-white shadow-lg">
        <div className="text-sm text-gray-300 mb-2">総資産</div>
        <div className="text-3xl font-bold mb-1">{formatCurrency(totalBalance)}</div>
        <div className="text-sm text-gray-400">
          {accounts.length}個の口座
        </div>
      </div>

      {/* Account List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">口座一覧</h3>
          <button className="text-blue-600 text-sm font-medium">
            + 口座を追加
          </button>
        </div>

        <div className="space-y-3">
          {accounts.map((account) => (
            <div
              key={account.id}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-2xl">
                    {account.icon}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{account.name}</div>
                    <div className="text-sm text-gray-500">
                      {account.type === 'bank' && '銀行'}
                      {account.type === 'cash' && '現金'}
                      {account.type === 'card' && 'クレジットカード'}
                      {account.type === 'savings' && '貯蓄'}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900">{formatCurrency(account.balance)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Account Summary */}
      <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
        <div className="flex items-start gap-3">
          <div className="text-2xl">💡</div>
          <div className="flex-1">
            <div className="font-medium text-blue-900 mb-1">資産管理のヒント</div>
            <div className="text-sm text-blue-700">
              定期的に各口座の残高を確認し、バランスの取れた資産配分を心がけましょう。
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
